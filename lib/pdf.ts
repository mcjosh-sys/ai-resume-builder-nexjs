export function renderReactToHtml(css: string, content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>${css}</style>
        <meta charset="utf-8" />
      </head>
      <body>
        ${content}
      </body>
    </html>
  `;
}
