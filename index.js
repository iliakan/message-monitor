#!/usr/local/bin/node

const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');

const homedir = require('os').homedir();
const dbPath = path.join(homedir, 'Library/Messages/chat.db');

const spawn = require('child_process').spawn;
const { askForFullDiskAccess } = require('node-mac-permissions')


let prevRowId = -1;

let db;

async function run() {

  // askForFullDiskAccess()

  // let f = fs.readFileSync(dbPath);
  // console.log(f);

  db = await open({
    filename: dbPath,
    driver: sqlite3.cached.Database,
    mode: sqlite3.OPEN_READONLY
  });

  let rowId = await db.get('SELECT ROWID FROM message ORDER BY ROWID DESC LIMIT 1');
  prevRowId = rowId.ROWID;

  setInterval(poll, 200);
}

async function poll() {
  let rowId = await db.get('SELECT ROWID FROM message ORDER BY ROWID DESC LIMIT 1');
  rowId = rowId.ROWID;

  if (rowId != prevRowId) {
    processMessages();
  }
  prevRowId = rowId;
}

async function processMessages() {
  let messages = await db.all(`
      SELECT
          M.text, M.is_from_me,
          C.guid, C.chat_identifier, C.display_name
      FROM message M
      INNER JOIN
          chat_message_join CM
          ON CM.message_id = M.ROWID
      INNER JOIN
          chat C
          ON  CM.chat_id = C.ROWID
      ORDER BY M.ROWID
      DESC LIMIT 1
  `)

  for(let message of messages) {
    processMessage(message);
  }
}

function processMessage(message) {
  let {text, chat_identifier} = message;

  console.log("[text]", text);
  console.log("[chat id]", chat_identifier);

  let codes = [...text.matchAll(/(?<=\s)[-\d]{4,}/g)];

  console.log(codes);

  if (!codes.length) return;
  // let code = text.match(/(?<=SMS-код |Никому не говорите код |Код для входа |Никому не сообщайте код )\d+/)?.[0];

  let code = codes[0][0];

  code = code.replace(/-/g, '');

  console.log(code);
  const proc = spawn('pbcopy');
  proc.stdin.write(code);
  proc.stdin.end();
}

run();