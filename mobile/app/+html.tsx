import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

const WC_NAVY = '#00205B';
const WC_CREAM = '#FFF9ED';

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content={WC_NAVY} />
        <meta
          name="description"
          content="ЧМ-2026: угадывайте точные счета матчей и следите за таблицей лидеров в реальном времени."
        />
        <title>World Cup Fantasy — ЧМ 2026</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const globalCss = `
body {
  background-color: ${WC_CREAM};
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #0A1628;
  }
}
#root {
  display: flex;
  min-height: 100vh;
}
`;
