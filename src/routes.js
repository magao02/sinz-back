const router = require('express').Router();
const UserController = require('@controller/userController');
const auth = require('./middlewares/Auth')

router.post('/signUp', UserController.store);

router.post('/signIn', UserController.login);

router.get('/signOut', auth.authorizeUser, UserController.logout);

router.get('/user/:urlUser', auth.authorizeUser, UserController.userPage);

//recuperar a senha
router.put('/setPassword', auth.authorizeUser, UserController.setPassword);

router.put('/user/:urlUser/setPerfil', auth.authorizeUser, UserController.setPerfil);

router.put('/user/:urlUser/setUser', auth.authorizeUser, UserController.setUser);

router.put('/user/:urlUser/setNewAdmin', auth.authorizeUser, UserController.setNewAdmin);

router.delete('/user/:urlUser/deleteUser', auth.authorizeUser, UserController.deleteUser);

router.post('/user/:urlUser/signUpDep', auth.authorizeUser, UserController.signUpDep);

router.delete('/deleteDep/:urlDep', auth.authorizeUser, UserController.deleteDep);

router.get('/getUsers', auth.authorizeUser, UserController.getUsers);

router.get('/getDependents/:urlUser', auth.authorizeUser, UserController.getDependents);

router.put('/user/:urlUser/:ano/setImpostoDeRenda', auth.authorizeUser, UserController.setImpostoDeRenda);

router.put('/user/:urlUser/setImpostoDeRendaDep/:urlDep/:ano', auth.authorizeUser, UserController.setImpostoDeRendaDep);

router.get('/getPDF/:urlUser', auth.authorizeUser, UserController.getPDF);

router.get('/getUserYears/:urlUser', auth.authorizeUser, UserController.getUserYears);

module.exports = router;
