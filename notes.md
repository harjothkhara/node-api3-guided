Types (how we got it)

- built in: no need to install it, it's part of express.
- third party: need to `npm install`
  - helmet
  - morgan
  - express-validator
    - npm i helmet (secure headers), morgan (logger)
- custom middleware: we build this one

Type (how we use it)

- global: applies to all requests
- local: applies to a set of routes (URLS)

- middleware is a function that can modify the response and request object
- order of your middleware matters. As soon as middleware produces a response or send then no other middleware gets executed and that response gets sent to the server. The goal of a server is to send a response. middleware is an assembly line. similar to reducers when action.types are checked and executed based
