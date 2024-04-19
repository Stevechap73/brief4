const express = require("express");
const {
  createListing,
  getMyListing,
  getAllListing,
  deleteListing,
  updateListing,
} = require("../ListingController");
const { verifyToken } = require("../../Utils/extractToken");

const router = express.Router();

router.route("/createListing").post(createListing);
router.route("/myListing", verifyToken).post(getMyListing);
router.route("/all").get(getAllListing);
router.route("/delete").delete(deleteListing);
router.route("/update").patch(updateListing);

module.exports = router;
