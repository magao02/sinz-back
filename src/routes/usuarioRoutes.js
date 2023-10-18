const router = require('express').Router();
const UserController = require('../controller/userController');
const auth = require('../middlewares/Auth');
const { allowPendingSignup } = require('../middlewares/PendingUser');
const upload = require('../middlewares/Multer');

//USER
router.get('/getUser/:urlUser', allowPendingSignup, auth.authorizeUser, UserController.userPage);

// router.get('/getPDF/:urlUser/:ano', auth.authorizeUser, UserController.getPDF);

// router.get('/getUserYears/:urlUser', auth.authorizeUser, UserController.getUserYears);

router.get('/getUsers', auth.authorizeUser, UserController.getUsers);

router.put('/setPerfil/:urlUser', auth.authorizeUser, UserController.updatePerfil);

router.put('/setUser/:urlUser', auth.authorizeUser, UserController.updateUser);

router.delete('/deleteUser/:urlUser', auth.authorizeUser, UserController.deleteUser);

router.post('/setPhoto/:urlUser', auth.authorizeUser, upload.single('photo'), UserController.setPhoto);

router.post('/createIncompleteUser', auth.authorizeUser, UserController.createIncompleteUser);
router.put('/finishIncomplete/:urlUser', allowPendingSignup, auth.authorizeUser, UserController.finishIncompleteUser);


module.exports = router;
