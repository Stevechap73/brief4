const { request, response } = require("express");
const { Listing } = require("../Model/Listing");
const client = require("../Services/Connexion");
const { ObjectId } = require("bson");
const { extractToken } = require("../Utils/extractToken");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createListing = async (request, response) => {
  const token = await extractToken(request);

  jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      console.log(err);
      response
        .status(401)
        .json({ err: "Requête non autorisée le Token n'est pas bon" });
      return;
    } else {
      if (
        !request.body.title ||
        !request.body.orgnizer ||
        !request.body.releaseDate ||
        !request.body.startTime ||
        !request.body.descriptionTrip ||
        !request.body.nbPlaces ||
        !request.body.appointmentAddress
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
          authData.id,
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
    }
  });
};

const getMyListing = async (request, response) => {
  const token = await extractToken(request);

  jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      console.log(err);
      response
        .status(401)
        .json({ err: "Requête non autorisée le Token n'est pas bon" });
      return;
    } else {
      let listing = await client
        .db("Sorties-2000's")
        .collection("listing")
        .find({ memberId: authData.id });
      let apiResponse = await listing.toArray();
      response.status(200).json(apiResponse);
    }
  });
};

const getAllListing = async (request, response) => {
  const token = await extractToken(request);

  jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
    if (err) {
      console.log(err);
      response
        .status(401)
        .json({ err: "Requête non autorisée le Token n'est pas bon" });
      return;
    } else {
      let listing = await client
        .db("Sorties-2000's")
        .collection("listing")
        .find();
      let apiResponse = await listing.toArray();
      response.status(200).json(apiResponse);
    }
  });
};

// const deleteListing = async (request, response) => {
//   const token = await extractToken(request);
//   jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
//     if (err) {
//       console.log(err);
//       response
//         .status(401)
//         .json({ err: "Requête non autorisée le Token n'est pas bon" });
//       return;
//     } else {
//       let listing = await client
//         .db("Sorties-2000's")
//         .collection("listing")
//         .deleteOne({_id: listingId});
//       let apiResponse = await listing.toArray();
//       response.status(200).json(apiResponse);
//     }
//   });
// };

const deleteListing = async (request, response) => {
  if (!request.body.memberId || request.body.listingId) {
    response.status(400).json({ error: "Des champs sont manquants" });
    return;
  }
  let listingId = new ObjectId(request.body.listingId);
  let memberId = new ObjectId(request.body.memberId);

  let member = await client
    .db("Sorties-2000's")
    .collection("listing")
    .find({ _id: memberId });
  let listing = await client
    .db("Sorties-2000's")
    .collection("listing")
    .find({ _id: listingId });
  if (!member || !listing) {
    response.status(401).json({ error: "Requête non autorisée" });
    return;
  }
  if (listing.memberId !== member._id || member.role !== "admin") {
    response.status(401).json({ error: "Requête non autorisée" });
    return;
  }
  try {
    await client
      .db("Sorties-2000's")
      .collection("listing")
      .deleteOne({ _id: listingId });
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const updateListing = async (request, response) => {
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
    response.status(400).json({ erro: "Des champs sont manquants" });
  }
  let member = await client
    .db("Sorties-2000's")
    .collection("member")
    .find({ _id: request.body.memberId });
  let listing = await client
    .db("Sorties-2000's")
    .collection("listing")
    .find({ _id: request.body.listingId });

  if (!member || !listing) {
    response.status(401).json({ error: "Requête non autorisée" });
    return;
  }

  if (listing.memberId !== member._id || member.role !== "admin") {
    response.status(401).json({ error: "Requête non autorisée" });
    return;
  }

  try {
    await client
      .db("Sorties-2000's")
      .collection("listing")
      .updateOne(
        { _id: listing._id },
        {
          $set: {
            title: request.body.title,
            orgnizer: request.body.orgnizer,
            releaseDate: request.body.releaseDate,
            descriptionTrip: request.body.descriptionTrip,
            nbPlaces: request.body.nbPlaces,
            appointmentAddress: request.body.appointmentAddress,
            status: request.body.status,
          },
        }
      );
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

module.exports = {
  createListing,
  getMyListing,
  getAllListing,
  deleteListing,
  updateListing,
};
