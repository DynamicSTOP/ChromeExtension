chrome webstore extension [link](https://chrome.google.com/webstore/detail/cjkcfamcldbmimahkmcgmcjhjlbgfded/publish-delayed)  
[travis](https://travis-ci.org/DynamicSTOP/ChromeExtension)

**This extension WILL SNIFF NETWORK TRAFFIC! ALL! INCLUDING HTTPS! AVOID USING IT!**

Once you open devtools you will see new *IS* tab. By opening it you will launch automatic socket connection to localhost.
Once connection is established socket will start sending and receiving commands through websocket commands.
There is **eval** command in this extension. You should know how unsecure is eval otherwise by all means **stop** and **remove extension**.

I do hope i warned you enough times everywhere where i could. Extension will be removed from chrome store once travis tests are done.