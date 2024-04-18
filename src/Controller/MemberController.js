const { request, response } = require("express");
const { Member } = require("../Model/Member");
const client = require("../Services/Connexion");
const bcrypt = require("bcrypt");
const { ObjectId } = require("bson");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const register = async (request, response) => {
  console.log("mybody sent", request.body);
  if (
    !request.body.firstName ||
    !request.body.lastName ||
    !request.body.age ||
    !request.body.ville ||
    !request.body.gender ||
    !request.body.email ||
    !request.body.password
  ) {
    console.log("je suis dans lerreur 400 ");
    response.status(400).json({ message: "Des champs sont manquants" });
    return;
  }

  try {
    const existingMember = await client
      .db("Sorties-2000's")
      .collection("member")
      .findOne({ email: request.body.email });
    if (existingMember) {
      return response.status(400).json({ msg: "Cet email est déjà utilisé" });
    }
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
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

    // const token = jwt.sign(
    //   {
    //     memberId: result.insertedId,
    //     email: member.email,
    //   },
    //   process.env.SECRET_KEY,
    //   { expiresIn: "1h" }
    // );
    response.status(200).json({ message: "ok" });
  } catch (e) {
    console.log(e);
    response.status(500).json(e.stack);
  }
};

const login = async (request, response) => {
  console.log(request.body.email);
  console.log(request.body.password);
  if (!request.body.email || !request.body.password) {
    response
      .status(400)
      .json({ erro: "Utilisateur non trouvé ou mot de passe érroné" });
    return;
  }
  let member = await client
    .db("Sorties-2000's")
    .collection("member")
    .findOne({ email: request.body.email });
  if (!member) {
    response
      .status(401)
      .json({ error: "Mauvaises informations d'identification" });
    return;
  } else {
    const isValidPassword = await bcrypt.compare(
      request.body.password,
      member.password
    );
    if (!isValidPassword) {
      response
        .status(401)
        .json({ erro: "Mauvaises informations d'identification" });
      return;
    }
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
        role: member.role,
        firstName: member.firstName,
        lastName: member.lastName,
        gdpr: new Date(member.gdpr).toLocaleDateString("fr"),
      },
      process.env.SECRET_KEY,
      { expiresIn: "20d" }
    );
    response.status(200).json({ jwt: token });
  }
};

// const login = async (request, response) => {
//     try {
//         const { email, password } = request.body;
//
//         const member = await client
//             .db("Sorties-2000's")
//             .collection('member')
//             .findOne({ email });
//         if (!member) {
//             return response.status(404).json({ msg: "Utilisateur non trouvé" });
//         }
//
//         const passwordMatch = await bcrypt.compare(password, member.password);
//
//         if (!passwordMatch) {
//             return response.status(401).json({ msg: "Mot de passe incorrect" });
//         }
//         const token = jwt.sign(
//             {
//                 memberId: member._id, // ID de l'utilisateur dans la base de données
//                 email: member.email,
//             },
//             process.env.SECRET_KEY,
//             { expiresIn: '1h' }
//         );

//         // Envoyer la réponse avec le token JWT dans le corps de la réponse
//         response.status(200).json({ token });
//     } catch (error) {
//         console.log(error);
//         response.status(500).json({ msg: "Erreur lors de la connexion" });
//     }
// };

module.exports = { register, login };
