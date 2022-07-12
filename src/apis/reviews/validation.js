import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const reviewSchema = {
  comment: {
    in: ["body"],
    inString: {
      errorMessage: "Comment is a mandatory field and needs to be a string!",
    },
  },
  rate: {
    in: ["body"],
    isInt: {
      errorMessage: "Rate is a mandatory field and needs to be a Number",
    },
  },
}

export const checkReviewSchema = checkSchema(reviewSchema)

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    next(
      createHttpError(400, "Validation error!", { errorsList: errors.array() })
    )
  } else {
    next()
  }
}
