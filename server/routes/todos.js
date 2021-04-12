const router = require('express').Router();
const ToDoController = require('../controllers/ToDoController.js');
const authenticate = require('../middlewares/authenticate.js');
const authorize = require('../middlewares/authorize.js');

router.use(authenticate);

router.post('/', ToDoController.createToDo);

router.get('/', ToDoController.getAll);

router.use('/:id', authorize);

router.put('/:id', ToDoController.editAllFieldById);

router.patch('/:id', ToDoController.editSpecificFieldById);

router.delete('/:id', ToDoController.deleteById);

module.exports = router;
