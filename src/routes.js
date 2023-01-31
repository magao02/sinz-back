const router = require('express').Router();
const UserController = require('@controller/userController');
const ImpostoController = require('@controller/impostoController');
const dependenteController = require('@controller/dependenteController');
const auth = require('./middlewares/Auth')

//USER
router.post('/signUp', UserController.store);

router.post('/signIn', UserController.login);

router.get('/signOut', auth.authorizeUser, UserController.logout);

router.get('/user/:urlUser', auth.authorizeUser, UserController.userPage);

router.get('/getPDF/:urlUser/:ano', auth.authorizeUser, UserController.getPDF);

router.get('/getUserYears/:urlUser', auth.authorizeUser, UserController.getUserYears);

router.get('/getUsers', auth.authorizeUser, UserController.getUsers);

router.put('/setPassword', auth.authorizeUser, UserController.setPassword);

router.put('/user/:urlUser/setPerfil', auth.authorizeUser, UserController.setPerfil);

router.put('/user/:urlUser/setUser', auth.authorizeUser, UserController.setUser);

router.put('/user/:urlUser/setNewAdmin', auth.authorizeUser, UserController.setNewAdmin);

router.delete('/user/:urlUser/deleteUser', auth.authorizeUser, UserController.deleteUser);

//Dependentes

router.post('/user/:urlUser/signUpDep', auth.authorizeUser, dependenteController.signUpDep);

router.get('/getDependents/:urlUser', auth.authorizeUser, dependenteController.getDependents);

router.delete('/deleteDep/:urlDep', auth.authorizeUser, dependenteController.deleteDep);

//Impostos

router.put('/user/:urlUser/:ano/setImpostoDeRenda', auth.authorizeUser, ImpostoController.setImpostoDeRenda);

router.put('/user/:urlUser/setImpostoDeRendaDep/:urlDep/:ano', auth.authorizeUser, ImpostoController.setImpostoDeRendaDep);

router.post('/user/:urlUser/createNewImpostoByYearUser/:ano', auth.authorizeUser, ImpostoController.createNewImpostoByYearUser);

router.post('/user/:urlUser/createNewImpostoByYearDep/:urlDep/:ano', auth.authorizeUser, ImpostoController.createNewImpostoByYearDep);


module.exports = router;
