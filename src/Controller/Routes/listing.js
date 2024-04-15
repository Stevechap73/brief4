const express = require("express");
const { createListing } = require("../ListingController");

const router = express.Router();

router.route("/createListing").post(createListing);

module.exports = router;
