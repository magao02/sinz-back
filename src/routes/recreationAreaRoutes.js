const router = require("express").Router();
const upload = require('../middlewares/Multer');
const {
  createRecreationArea,
  getAllRecreationAreas,
  getRecreationArea,
  updateRecreationArea,
  setRecreationAreaPhotos,
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
;

module.exports = router;
