const router = require("express").Router();
const {
  createRecreationArea,
  getAllRecreationAreas,
  getRecreationArea,
  updateRecreationArea,
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
  );

module.exports = router;
