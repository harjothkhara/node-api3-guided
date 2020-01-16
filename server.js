const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();
// global middleware (Care about all requests)

server.use(express.json()); // built it
// order of middleware matters
// server.use(logger); // custom middleware

// server.use(greeter); // custom middleware

// server.use(echo); // custom middleware

// server.use(gatekeeper); // custom middleware

// ROUTES

// care only about requests beginning with /api/hubs
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : '';

  res.send(`
  <h2>Lambda Hubs API</h2>
  <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

// three amigos
function greeter(req, res, next) {
  res.status(200).json({ hi: 'there' });
}

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`${method} to ${originalUrl}`);
  next();
}

// build the echo mw, that will simply console.log the information in the body
function echo(req, res, next) {
  console.log(req.body);
  next();
}

// write a gatekeeper, that reads a password from the headers, if the password is 'mellon', let the request continue. if the password is wrong, then return status code 401 and an object

function gatekeeper(req, res, next) {
  console.log(req.headers.password);
  if (req.headers.password === 'melon') {
    next();
  } else {
    res.status(401).json({
      message: 'you shall not pass'
    });
  }
}

module.exports = server;
