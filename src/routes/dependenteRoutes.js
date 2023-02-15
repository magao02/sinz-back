const router = require('express').Router();
const dependenteController = require('../controller/dependenteController');
const auth = require('../middlewares/Auth');

//Dependentes

router.post('/signUpDep/:urlUser', auth.authorizeUser, dependenteController.signUpDep);

router.get('/getDependents/:urlUser', auth.authorizeUser, dependenteController.getDependents);

router.delete('/deleteDep/:urlDep', auth.authorizeUser, dependenteController.deleteDep);

module.exports = router;
