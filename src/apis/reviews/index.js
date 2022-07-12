import express from "express"
import createHttpError from "http-errors"
import uniqid from "uniqid"
import { getReviews } from "../../libs/index.js"

const reviewsRouter = express.Router()

reviewsRouter.get("/", async (req, res, next) => {
  const reviews = await getReviews()
  res.send(reviews)
})

export default reviewsRouter
