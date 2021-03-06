const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

// write a middleware called uppercase, that takes the name from the body and makes it Uppercase before it make it to to the request handler/router. Only apply that middleware to routes that begin with /api/hubs and only on POST and PUT
function uppercaser(req, res, next) {
  if (typeof req.body.name == 'string') {
    req.body.name = req.body.name.toUpperCase();
    next();
  } else {
    res.status(400).json({ errorMessage: 'the name should be a string' });
  }
  next();
}

// this only runs if the url has /api/hubs in it
router.get('/', (req, res) => {
  Hubs.find(req.query)
    .then(hubs => {
      res.status(200).json(hubs);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the hubs'
      });
    });
});

// /api/hubs/:id

router.get('/:id', (req, res) => {
  Hubs.findById(req.params.id)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: 'Hub not found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error retrieving the hub'
      });
    });
});

router.post('/', uppercaser, (req, res) => {
  Hubs.add(req.body)
    .then(hub => {
      res.status(201).json(hub);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error adding the hub'
      });
    });
});

router.delete('/:id', (req, res) => {
  Hubs.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The hub has been nuked' });
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error removing the hub'
      });
    });
});

router.put('/:id', (req, res) => {
  Hubs.update(req.params.id, req.body)
    .then(hub => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: 'The hub could not be found' });
      }
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error updating the hub'
      });
    });
});

// add an endpoint that returns all the messages for a hub
// this is a sub-route or sub-resource
router.get('/:id/messages', (req, res) => {
  Hubs.findHubMessages(req.params.id)
    .then(messages => {
      res.status(200).json(messages);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub'
      });
    });
});

// add an endpoint for adding new message to a hub
router.post('/:id/messages', (req, res) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error getting the messages for the hub'
      });
    });
});

// middleware

// write a middleware called checkFor that takes the name of a property and checks that the body has that property. if the property is not there, respond with a status code 400 and object like this { errorMessage: `required ${property}`} where property is what we're validating. If we use it like this: checkFor('age) the message will read "required age". use it on the POST and PUT to check that the body has the "name" property

function checkFor(prop) {
  // checkFor('name')
  return function(req, res, next) {
    if (req.body[prop]) {
      //prop key that return value. key:value
      next();
    } else {
      res.status(400).json({ errorMessage: `required ${prop}` });
    }
  };
}

module.exports = router;
