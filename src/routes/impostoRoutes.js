const router = require('express').Router();
const ImpostoController = require('../controller/impostoController');
const auth = require('../middlewares/Auth');
//Impostos

router.put('/setImpostoDeRenda/:urlUser/:ano', auth.authorizeUser, ImpostoController.setImpostoDeRenda);

router.put('/setImpostoDeRendaDep/:urlUser/:urlDep/:ano', auth.authorizeUser, ImpostoController.setImpostoDeRendaDep);

router.post('/createNewImpostoByYearUser/:urlUser/:ano', auth.authorizeUser, ImpostoController.createNewImpostoByYearUser);

router.post('/createNewImpostoByYearDep/:urlUser/:urlDep/:ano', auth.authorizeUser, ImpostoController.createNewImpostoByYearDep);

module.exports = router;
