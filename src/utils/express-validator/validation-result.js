import { validationResult as expressValidatorValidationResult } from "express-validator";

// only print msg property from express-validator validationResult error object
const validationResult = expressValidatorValidationResult.withDefaults({
  formatter: (error) => error.msg,
});

export default validationResult;
