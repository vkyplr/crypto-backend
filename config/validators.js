const yup = require("yup");

const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

const userValidator = yup
  .object({
    first_name: yup.string().trim().required(),
    last_name: yup.string().trim().required(),
    phone: yup.string().trim().required(),
    email: yup.string().required().email(),
    password: yup
      .string()
      .matches(
        PASSWORD_REGEX,
        "Password must be atleast 8 characters long and contain at least one number and one uppercase and lowercase letter and a special character"
      )
      .required(),
  })
  .required();

const updateUserValidator = yup
  .object({
    first_name: yup.string().trim().required(),
    last_name: yup.string().trim().required(),
    phone: yup.string().trim().required(),
    email: yup.string().required().email(),
  })
  .required();

const loginValidator = yup
  .object({
    email: yup.string().required().email(),
    password: yup.string().required(),
  })
  .required();

module.exports = { userValidator, loginValidator, updateUserValidator };
