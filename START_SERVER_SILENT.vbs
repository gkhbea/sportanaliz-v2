Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\user\Desktop\yapay zeka\sportanaliz-pro"
WshShell.Run "node scripts\server_daemon.js", 0, False

