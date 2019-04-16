const Validator = require("validator");
const isEmpty = require("./is-empty");

/**
 * Check whether the input is valid or not.
 *
 */
module.exports = function validateInput(data, option) {
  let errors = option === "register" ? {} : "";

  data.name = !isEmpty(data.name) ? data.name : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.name)) {
    // Name field is empty.
    if (option === "register") errors.name = "Name field is required";
    else
      errors =
        "The email and password you entered did not match our records. Please double-check and try again.";
  }

  if (!Validator.isLength(data.name, { min: 1, max: 15 })) {
    // Name field has less than 1 or more than 15 characters.
    if (option === "register")
      errors.name = "Username should contain atmost 15 characters.";
    else
      errors =
        "The email and password you entered did not match our records. Please double-check and try again.";
  }

  if (!/^\w+$/.test(data.name)) {
    // Name field contains any other character than alphabets (a-z, A-Z), numbers (0-9) or underscore.
    if (option === "register")
      errors.name = "Only use letters, numbers and underscore.";
    else
      errors =
        "The email and password you entered did not match our records. Please double-check and try again.";
  }

  if (!Validator.isLength(data.password, { min: 6 })) {
    // Password field has less than 6 characters.
    if (option === "register")
      errors.password = "Password must be at least 6 characters.";
    else
      errors =
        "The email and password you entered did not match our records. Please double-check and try again.";
  }

  if (Validator.isEmpty(data.password)) {
    // Password field is empty.
    if (option === "register") errors.password = "Password field is required.";
    else
      errors =
        "The email and password you entered did not match our records. Please double-check and try again.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
