const router = require('express').Router();
const UserController = require('@controller/userController');
const auth = require('../middlewares/Auth');

//USER
router.post('/signUp', UserController.store);

router.post('/signIn', UserController.login);

router.put('/setNewPassword/:urlUser/:token', auth.authorizeUser, UserController.setNewPassword);

router.get('/passwordResetLink', auth.authorizeUser, UserController.passwordResetLink);

router.get('/signOut', auth.authorizeUser, UserController.logout);

module.exports = router;
