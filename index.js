const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const swaggerUI = require("swagger-ui-express");
const bodyParser = require("body-parser");

const swaggerFile = require("./swagger_output.json");

dotenv.config();

const { MONGODB_URL, PORT } = process.env;

const appRoutes = require("./routes/appRoutes");

const app = express();

mongoose.connect(MONGODB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB Connection Error"));

app.use(bodyParser.json({ extended: true }));
app.use("/doc", swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use("/", appRoutes);

app.listen(PORT, () => {
  console.log(`Listening On ${PORT}`);
});
