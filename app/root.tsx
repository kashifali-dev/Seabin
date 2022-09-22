import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import styles from "~/styles/app.css";

// React grid layout styles
import reactGridLayoutStyles from 'react-grid-layout/css/styles.css';
import reactSizableStyles from 'react-resizable/css/styles.css';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: reactGridLayoutStyles },
  { rel: "stylesheet", href: reactSizableStyles },
];

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Ocean Health Platform",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
