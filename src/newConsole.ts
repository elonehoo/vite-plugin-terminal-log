export function gen() {
  return `
    function guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    window.clientID = guid()

    const { log } = console;
    function TerminalLog(...data: any[]) {
      if (import.meta.hot) {
        import.meta.hot.send("my:from-client", {
          client: window.clientID,
          msg: data,
        });
      }
      log(...data);
    }
    console.log = TerminalLog;

    window.onerror = function (message, source, lineno, colno, error) {
      console.log("\u6355\u83B7\u5230\u5F02\u5E38\uFF1A", { message, source, lineno, colno, error });
    };

    window.addEventListener(
      "error",
      (error) => {
        console.log("\u6355\u83B7\u5230\u7F51\u7EDC\u8D44\u6E90\u52A0\u8F7D\u5F02\u5E38\uFF1A", error);
      },
      true
    );

    window.addEventListener("unhandledrejection", function (e) {
      console.log("\u6355\u83B7\u5230promise\u5F02\u5E38\uFF1A", e);
    });

  `
}
