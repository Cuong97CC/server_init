const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signUp', userController.signUp);
router.post('/logIn', userController.logIn);
router.get('/logOut', userController.logOut);

module.exports = router;
