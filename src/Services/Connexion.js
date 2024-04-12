const { MongoClient, Db } = require("mongodb");
let client = null;

function connect(url, callback) {
  if (client === null) {
    client = new MongoClient(url);
    client.connect((error) => {
      if (error) {
        client = null;
        callback(error);
      } else {
        callback();
      }
    });
  } else {
    callback();
  }
}

function db() {
  return new Db(client, "Sorties-2000's");
}
function closeConnect() {
  if (client) {
    client.close();
    client = null;
  }
}

module.exports = { connect, db, closeConnect };
