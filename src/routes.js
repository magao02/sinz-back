const router = require('express').Router();
const UserController = require('@controller/userController');
const auth = require('./middlewares/Auth')

router.post('/signUp', UserController.store);

router.post('/signIn', UserController.login);

router.get('/signOut', auth.authorizeUser, UserController.logout);

router.get('/user/:urlUser', auth.authorizeUser, UserController.userPage);

router.put('/setPassword', auth.authorizeUser, UserController.setPassword);

router.put('/user/:urlUser/setPerfil', auth.authorizeUser, UserController.setPerfil);

router.put('/user/:urlUser/setUser', auth.authorizeUser, UserController.setUser);

router.put('/user/:urlUser/setNewAdmin', auth.authorizeUser, UserController.setNewAdmin);

router.delete('/user/:urlUser/deleteUser', auth.authorizeUser, UserController.deleteUser);

module.exports = router;
