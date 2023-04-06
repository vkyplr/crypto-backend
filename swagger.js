const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "ICoin Wallet API Documentation",
    description: "",
  },
  host: "localhost:8000",
  schemes: ["http"],
  definitions: {
    User: {
      $first_name: "Vikas",
      $last_name: "Purohit",
      $phone: "9999999999",
      $email: "vikas@gmail.com",
      $password: "Strong@Password",
    },
    updateUser: {
      $first_name: "Vikas",
      $last_name: "Purohit",
      $phone: "9999999999",
      $email: "vikas@gmail.com",
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
