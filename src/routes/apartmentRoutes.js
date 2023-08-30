const router = require("express").Router();
const upload = require('../middlewares/Multer');
const {
  createApartment,
  getAllApartments,
  getApartment,
  updateApartment,
  setPhotoApartament,
} = require("../controller/apartmentController");
const { authorizeUser } = require("../middlewares/Auth");

router
  .post("/createApartment", authorizeUser, createApartment)
  .get("/getAllApartments", authorizeUser, getAllApartments)
  .get("/getApartment/:urlApt", authorizeUser, getApartment)
  .put("/updateApartment/:urlApt", authorizeUser, updateApartment)
  .put("/setPhotoApartament/:urlApt", authorizeUser, upload.array('photo', 7), setPhotoApartament);

module.exports = router;
