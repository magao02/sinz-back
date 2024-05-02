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
  deletePayment,
  updatePayment,
  deleteApartment,
} = require("../controller/apartmentController");
const { authorizeUser } = require("../middlewares/Auth");

router
  .post("/createApartment", authorizeUser, createApartment)
  .get("/getAllApartments", authorizeUser, getAllApartments)
  .get("/getApartment/:urlApt", authorizeUser, getApartment)
  .put("/updateApartment/:urlApt", authorizeUser, updateApartment)
  .delete("/deleteApartment/:urlApt", authorizeUser, deleteApartment)
  .put("/setApartmentPhotos/:urlApt", authorizeUser, upload.array("photos", 7), setApartmentPhotos)
  .post("/reserveApartment/:urlApt/:urlUser", authorizeUser, reserveApartment)
  .get("/getReservations/:urlApt", authorizeUser, getReservations)
  .put("/uploadPayment/:urlApt/:reservaId", authorizeUser, upload.single('file'), uploadPayment)
  .delete("/deletePayment/:urlApt/:reservaId", authorizeUser, deletePayment)
  .put("/updatePayment/:urlApt/:reservaId", authorizeUser, updatePayment)
;

module.exports = router;
