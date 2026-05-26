import { parseHTML } from "linkedom";

export function runWithDom<T extends () => any>(
    fn: T,
): ReturnType<T> {
    const { window, document } = parseHTML(`
    <!doctype html>
    <html>
      <body></body>
    </html>
  `);

    Object.defineProperty(window, "location", {
        value: new URL("http://localhost"),
        configurable: true,
    });

    const previousWindow = global.window;
    const previousDocument = global.document;
    const previousNavigatorDescriptor =
        Object.getOwnPropertyDescriptor(global, "navigator");

    try {
        global.window = window as any;
        global.document = document as any;

        Object.defineProperty(global, "navigator", {
            value: {
                userAgent: "node.js",
            },
            configurable: true,
        });

        return fn();
    } finally {
        global.window = previousWindow;
        global.document = previousDocument;

        if (previousNavigatorDescriptor) {
            Object.defineProperty(
                global,
                "navigator",
                previousNavigatorDescriptor,
            );
        }
    }
}