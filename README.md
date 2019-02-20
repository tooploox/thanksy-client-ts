# Thanksy

[Thanksy client](https://github.com/tooploox/thanksy-client-ts) is written using `Typescript` (version 3.3.3) and `React` (16.8).
Both technologies fit perfectly. React gives simplicity and allows to write purely functional code while
Typescript supports it with static type checking and type inference.
We also use `Redux` and `Redux-loop` to manage application state and side effects respectively.
Thanks to that there is only one determined way to handle interactions
and manage state. It also provides a good foundation for modularity, code reuse and testing by default.

`Jest` was used for unit testing and combined with enzyme was used for components testing (not so unit anymore).
Moreover, `Cypress` was used for high-level acceptance testing (e2e).

Since [Redux](https://redux.js.org/introduction/prior-art#elm) and [Redux loop](https://redux-loop.js.org/) have been highly-inspired by The Elm Architecture we also decide to rewrite thanksy
[client in Elm](https://github.com/tooploox/thanksy-client-elm). The experiment was successful and now we have both clients with the same functionalities.

## Setup

to install dependencies

```sh
npm install
```

## Running

to run application with hot reloading

```sh
npm start
```

then visit `http://localhost:4004/`

## Testing

to run unit tests

```sh
npm run test:unit
```

to run acceptance tests (e2e)

```sh
npm run test:e2e
```

to run all tests

```sh
npm test
```
