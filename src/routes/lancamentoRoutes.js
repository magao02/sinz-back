const router = require("express").Router();
const upload = require('../middlewares/Multer');
const { authorizeUser } = require("../middlewares/Auth");
const {
  createLancamento,
  getLancamentos,
  deleteLancamento
} = require("../controller/lancamentoController");

router
  .post("/createLancamento", authorizeUser,upload.single('file'), createLancamento)
  .get("/getLancamentos", authorizeUser, getLancamentos)
  .delete("/deleteLancamento/:id", authorizeUser, deleteLancamento)

module.exports = router;