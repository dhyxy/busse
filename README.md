# bussé

this is the main repository for group 25's SENG 401 project - bussé.

## Description

_update here as we go_

## Getting Started

i'm recommending to use VS code to work on the project, it has support for essentially every technology (typescript, prisma, js formatting / linting) we're planning on using.

install the vscode extensions for [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) 😁

as a summary of the technologies:

### git

let's use the [feature branch workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) to properly review and collaborate on the code

in summary: everyone works on pieces on different branches, and then creates PR's into the main branch.

### javascript, more specifically typescript

there's a bunch of js tutorials online, some common ones being [learn-js](https://www.learn-js.org) and [the modern javascript tutorial](https://javascript.info)

ts has an [official tutorial](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), [go here](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html) if you already know js

### node.js

this is just an environment designed to allow javascript to run outside of the browser so that we can use it for the backend - you probably won't need to dive too deep into it to work on the project. there is [official documentation](https://nodejs.dev/en/learn/) if you're curious tho

### express.js

this is the backend framework we're going to be running through node, it's super simple and minimalistic so there isn't _too_ much to learn - [official docs](https://expressjs.com/en/starter/hello-world.html)

### prisma

this is the [ORM](https://stackoverflow.com/a/1279678) we'll use in the backend. [official documentation](https://www.prisma.io/docs/getting-started/quickstart) but most of it's functionality we can probably learn as we go.

### Dependencies

-   node.js & npm (install the LTS version)
    -   [install](https://nodejs.org/en/download/)

### Installing

-   in the `busse` folder from the terminal, run the following commands:
    ```bash
    # this installs all the js/ts dependencies in the package.json
    # and migrates the database (https://www.prisma.io/docs/concepts/components/prisma-migrate)
    npm install
    ```

### Executing program

```
npm run dev
```

## License

This project is licensed under the MIT License.
