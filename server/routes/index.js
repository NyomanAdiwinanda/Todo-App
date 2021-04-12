const router = require('express').Router();
const todos = require('./todos.js');
const users = require('./users.js');
const randomquote = require('./randomquote.js');

router.use('/todos', todos);

router.use('/users', users);

router.use('/randomquote', randomquote);

module.exports = router;
