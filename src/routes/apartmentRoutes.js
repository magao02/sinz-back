const router = require("express").Router();
const upload = require('../middlewares/Multer');
const {
  createApartment,
  getAllApartments,
  getApartment,
  updateApartment,
  reserveApartment,
  getReservations,
  setApartmentPhotos,
  uploadPayment,
} = require("../controller/apartmentController");
const { authorizeUser } = require("../middlewares/Auth");

router
  .post("/createApartment", authorizeUser, createApartment)
  .get("/getAllApartments", authorizeUser, getAllApartments)
  .get("/getApartment/:urlApt", authorizeUser, getApartment)
  .put("/updateApartment/:urlApt", authorizeUser, updateApartment)
  .put("/setApartmentPhotos/:urlApt", authorizeUser, upload.array("photos", 7), setApartmentPhotos)
  .post("/reserveApartment/:urlApt/:urlUser", authorizeUser, reserveApartment)
  .get("/getReservations/:urlApt", authorizeUser, getReservations)
  .put("/uploadPayment/:urlApt/:reservaId", authorizeUser, upload.single('file'), uploadPayment)
;

module.exports = router;
