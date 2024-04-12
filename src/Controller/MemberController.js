const { request, response } = require("express");
const { Member } = require("../Model/Member");
const client = require("../Services/Connexion");
const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (request, response) => {
  if (
    !request.body.firstName ||
    !request.body.lastName ||
    !request.body.age ||
    !request.body.ville ||
    !request.body.gender ||
    !request.body.email ||
    !request.body.password
  ) {
    response.status(400).json({ error: "Some fields are missing" });
  }
  const hashedPassword = await bcrypt.hash(request.body.password, 10);
  try {
    let member = new Member(
      request.body.firstName,
      request.body.lastName,
      request.body.age,
      request.body.ville,
      request.body.gender,
      "member",
      request.body.email,
      hashedPassword,
      new Date(),
      new Date(),
      true
    );
    let result = await client
      .db("Sorties-2000's")
      .collection("member")
      .insertOne(member);
    response.status(200).json(result);
  } catch (e) {
    console.log(e);
    response.status(500).json(e);
  }
};

const login = async (request, response) => {
  if (!request.body.email || !request.body.password) {
    response.status(400).json({ erro: "Des champs sont manquants" });
    return;
  }
  let member = await client
    .db("Sorties-2000's")
    .collection("member")
    .findOne({ email: request.body.email });
  if (!menber) {
    response
      .status(401)
      .json({ error: "Mauvaises informations d'identification" });
    return;
  }
  const isValidPassword = bcrypt.compare(
    request.body.password,
    member.password
  );
  if (!isValidPassword) {
    response
      .status(401)
      .json({ error: "Mauvaises informations d'identification" });
  } else {
    const token = jwt.sign(
      {
        email: member.email,
        id: member._id,
        role: menber.role,
        firstName: member.firstName,
        lastName: member.lastName,
        gdpr: new Date(member.gdpr).toLocaleDateString("fr"),
      },
      process.env.MY_SUPER_SECRET_KEY,
      { expiresIn: "20d" }
    );
    response.status(200).json({ jwt: token });
  }
};

module.exports = { register, login };
