const router = require('express').Router();
const UserController = require('../controller/userController');
const auth = require('../middlewares/Auth');

//USER
router.post('/signUp', UserController.createUser);

router.post('/signIn', UserController.login);

router.put('/setNewPassword/:userEmail/:token', UserController.updatePassword);

router.get('/passwordToken/:userEmail', UserController.passwordToken);

router.get('/signOut', auth.authorizeUser, UserController.logout);

module.exports = router;
