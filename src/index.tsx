import { Elysia, t } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { html } from '@elysiajs/html'
import * as elements from 'typed-html'
import { twind } from './twind'

const app = new Elysia()
  .use(staticPlugin())
  .use(html())
  .use(twind)
  .get('/', ({ html }) =>
    html(
      <BaseHtml>
        <body
          class={'flex w-full h-screen justify-center items-center'}
          hx-get='/todos'
          hx-trigger='load'
          hx-swap='outerHTML'
        />
      </BaseHtml>
    )
  )
  .post('/clicked', () => <div class={'text-blue-600'}>I'm from the server!</div>)
  .get('/todos', () => <TodoList todos={db} />)
  .post(
    '/todos/toggle/:id',
    ({ params }) => {
      const todo = db.find((todo) => todo.id === params.id)
      if (todo) {
        todo.completed = !todo.completed
        return <TodoItem {...todo} />
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .delete(
    '/todos/:id',
    ({ params }) => {
      const todo = db.find((todo) => todo.id === params.id)
      if (todo) {
        db.splice(db.indexOf(todo), 1)
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
    }
  )
  .post(
    '/todos',
    ({ body }) => {
      if (body.content.length === 0) {
        throw new Error('Content cannot be empty')
      }
      const newTodo = {
        id: lastID++,
        content: body.content,
        completed: false,
      }
      db.push(newTodo)
      return <TodoItem {...newTodo} />
    },
    {
      body: t.Object({
        content: t.String(),
      }),
    }
  )

  .listen(8080)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)

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
`

type Todo = {
  id: number
  content: string
  completed: boolean
}

let lastID = 4;

const db: Todo[] = [
  { id: 1, content: 'learn the beth stack', completed: true },
  { id: 2, content: 'exit vim', completed: false },
  { id: 3, content: 'get good kid', completed: false },
]

function TodoItem({ id, content, completed }: Todo) {
  return (
    <div class={'flex flex-row space-x-3'}>
      <p>{content}</p>
      <input
        type='checkbox'
        checked={completed}
        hx-post={`/todos/toggle/${id}`}
        hx-target='closest div'
        hx-swap='outerHTML'
      />
      <button
        class={'text-red-500'}
        hx-delete={`/todos/${id}`}
        hx-swap='outerHTML'
        hx-target='closest div'
      >
        X
      </button>
    </div>
  )
}

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <div>
      {todos.map((todo) => (
        <TodoItem {...todo} />
      ))}
      <TodoForm />
    </div>
  )
}

function TodoForm() {
  return (
    <form 
      class='flex flex-row space-x-3' 
      hx-post='/todos' 
      hx-swap='beforebegin'
    >
      <input 
        type='text' 
        name='content' 
        class='border border-black' 
      />
      <button type='submit'>Add</button>
    </form>
  )
}
