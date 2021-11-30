const router = require('express').Router();
const UserController = require('@controller/userController');
const auth = require('./middlewares/Auth')

router.post('/signUp', UserController.store);

router.post('/signIn', UserController.login);

router.get('/signOut', auth.authorizeUser, UserController.logout);

module.exports = router;
