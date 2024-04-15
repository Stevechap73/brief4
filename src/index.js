const express = require("express");
const app = express();
const { connect } = require("./Services/Connexion");
const registerRoute = require("./Controller/Routes/member");
const listingRoute = require("./Controller/Routes/listing");
const PORT = 3023;

app.use(express.json());
app.use("/", registerRoute);
app.use("/", listingRoute);

connect("mongodb://127.0.0.1:27017/", (error) => {
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
