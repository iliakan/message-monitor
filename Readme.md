MacOs only.

Monitors SMS for codes, adds them to the clipboard.

Monitors Messages SQLite file `~/Library/Messages/chat.db` for new messages, uses regexp to find and copy SMS code to clipboard.

## Installing

Build into app, then grant full disk access (drag'n'drop executable to System Preference > Full Disk Access on the first run)

```
npm run package
```

Install as a service

```
chmod +x message-monitor
cp /opt/message-monitor/com.ilyakantor.message-monitor.plist ~/Library/LaunchAgents

chmod 644 ~/Library/LaunchAgents/com.ilyakantor.message-monitor.plist
launchctl unload ~/Library/LaunchAgents/com.ilyakantor.message-monitor.plist
rm /tmp/message-monitor.log
launchctl load -w ~/Library/LaunchAgents/com.ilyakantor.message-monitor.plist
```

Uncomment logs in `plist` if needed.