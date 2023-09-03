const router = require("express").Router();
const upload = require('../middlewares/Multer');
const {
  createRecreationArea,
  getAllRecreationAreas,
  getRecreationArea,
  updateRecreationArea,
  setRecreationAreaPhotos,
  reserveRecreationArea,
  getReservations,
  uploadPayment,
  deletePayment,
  updatePayment,
} = require("../controller/recreationAreaController");
const { authorizeUser } = require("../middlewares/Auth");

router
  .post("/createRecreationArea", authorizeUser, createRecreationArea)
  .get("/getAllRecreationAreas", authorizeUser, getAllRecreationAreas)
  .get(
    "/getRecreationArea/:urlRecreationArea",
    authorizeUser,
    getRecreationArea
  )
  .put(
    "/updateRecreationArea/:urlRecreationArea",
    authorizeUser,
    updateRecreationArea
  )
  .put("/setRecreationAreaPhotos/:urlRec", authorizeUser, upload.array("photos", 7), setRecreationAreaPhotos)
  .post("/reserveRecreationArea/:urlRec/:urlUser", authorizeUser, reserveRecreationArea)
  .get("/getReservations/:urlRec", authorizeUser, getReservations)
  .put("/uploadPayment/:urlRec/:reservaId", authorizeUser, upload.single('file'), uploadPayment)
  .delete("/deletePayment/:urlRec/:reservaId", authorizeUser, deletePayment)
  .put("/updatePayment/:urlRec/:reservaId", authorizeUser, updatePayment)
;

module.exports = router;
