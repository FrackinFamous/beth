import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";
import * as elements from "typed-html";
import { twind } from "./twind";

const app = new Elysia()
  .use(staticPlugin())
  .use(html())
  .use(twind)
  .get("/", ({ html }) =>
    html(
      <BaseHtml>
        <body class={"flex w-full h-screen justify-center items-center"}>
          <button hx-post="/clicked" hx-swap="outerHTML">
            Click Me
          </button>
        </body>
      </BaseHtml>
    )
  )
  .post("/clicked", () => (
    <div class={"text-blue-600"}>I'm from the server!</div>
  ))
  .listen(8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const BaseHtml = ({ children }: JSX.ElementChildrenAttribute) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script type="module" src="public/htmx.min.js"></script>
  <link rel="stylesheet" type="text/css" href="public/main.css" />
  <title>Elysia Beth Stack</title>
</head>

${children}
`;

type Todo = {
  id: number;
  content: string;
  completed: boolean;
};
