const { request, response } = require("express");
const { Listing } = require("../Model/Listing");
const client = require("../Services/Connexion");

const createListing = async (request, response) => {
  if (
    !request.body.title ||
    !request.body.orgnizer ||
    !request.body.releaseDate ||
    !request.body.startTime ||
    !request.body.descriptionTrip ||
    !request.body.nbPlaces ||
    !request.body.appointmentAddress ||
    !request.body.memberId
  ) {
    response.status(400).json({ error: "Des champs sont manquants" });
  }
  try {
    let listing = new Listing(
      request.body.title,
      request.body.orgnizer,
      request.body.releaseDate,
      request.body.startTime,
      request.body.descriptionTrip,
      request.body.nbPlaces,
      request.body.appointmentAddress,
      request.body.memberId,
      new Date(),
      "published"
    );
    let result = await client
      .db("Sorties-2000's")
      .collection("listing")
      .insertOne(listing);
    response.status(200).json(result);
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

module.exports = { createListing };
