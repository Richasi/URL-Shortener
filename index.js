const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const { connection } = require("./Config/Connection");
const { UserRouter } = require("./Routes/User.routes");
const { URLRouter } = require("./Routes/UrlShortener.routes");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("URL Shortener");
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Welcome to URL Shortener ",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5070/",
      },
      {
        url: "https://url-shortener-jxrw.onrender.com",
      },
    ],
  },
  apis: ["./Routes/*.js"],
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/apidocs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.use("/user", UserRouter);
app.use("/url", URLRouter);

app.listen(process.env.PORT || 8080, async () => {
  try {
    await connection;
    console.log("Connected to Database");
  } catch (error) {
    console.log(error);
  }
  console.log(`Running on PORT ${process.env.PORT}`);
});
