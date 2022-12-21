const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config()

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to amgw api application." });
});

require("./routes/shopifyApi.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
