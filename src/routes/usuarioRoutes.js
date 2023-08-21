const router = require('express').Router();
const UserController = require('../controller/userController');
const auth = require('../middlewares/Auth');

//USER
router.get('/getUser/:urlUser', auth.authorizeUser, UserController.userPage);

router.get('/getPDF/:urlUser/:ano', auth.authorizeUser, UserController.getPDF);

router.get('/getUserYears/:urlUser', auth.authorizeUser, UserController.getUserYears);

router.get('/getUsers', auth.authorizeUser, UserController.getUsers);

router.put('/setPerfil/:urlUser', auth.authorizeUser, UserController.updatePerfil);

router.put('/setUser/:urlUser', auth.authorizeUser, UserController.updateUser);

router.put('/setNewAdmin/:urlUser', auth.authorizeUser, UserController.setNewAdmin);

router.delete('/deleteUser/:urlUser', auth.authorizeUser, UserController.deleteUser);

module.exports = router;
