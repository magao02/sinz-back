const router = require("express").Router();
const {
  createApartment,
  getAllApartments,
  getApartment,
  updateApartment,
  reserveApartment,
  getReservations,
} = require("../controller/apartmentController");
const { authorizeUser } = require("../middlewares/Auth");

router
  .post("/createApartment", authorizeUser, createApartment)
  .get("/getAllApartments", authorizeUser, getAllApartments)
  .get("/getApartment/:urlApt", authorizeUser, getApartment)
  .put("/updateApartment/:urlApt", authorizeUser, updateApartment)
  .post("/reserveApartment/:urlApt/:urlUser", authorizeUser, reserveApartment)
  .get("/getReservations/:urlApt", authorizeUser, getReservations)
;

module.exports = router;
