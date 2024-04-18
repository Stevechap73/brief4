const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./Services/Connexion");
const registerRoute = require("./Controller/Routes/member");
const listingRoute = require("./Controller/Routes/listing");
const PORT = 3023;
require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/", registerRoute);
app.use("/", listingRoute);

connect(process.env.DB_URL, (error) => {
  if (error) {
    console.log("Failed to connect");
    process.exit(-1);
  } else {
    console.log("successfully connected");
    app.listen(PORT);
  }
});

app.listen(PORT, () => {
  console.log("Serveur is runing :", PORT);
});
