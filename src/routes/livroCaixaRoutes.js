const router = require("express").Router();
const upload = require("../middlewares/Multer");
const { authorizeUser } = require("../middlewares/Auth");
const {
  createLivroCaixa,
  getLivroCaixa,
  deleteLivroCaixa,
} = require("../controller/livroCaixaController");

router
  .post("/createLivroCaixa", authorizeUser, upload.single("file"), createLivroCaixa)
  .get("/getLivroCaixa", authorizeUser, getLivroCaixa)
  .delete("/deleteLivroCaixa/:id", authorizeUser, deleteLivroCaixa);

module.exports = router;
