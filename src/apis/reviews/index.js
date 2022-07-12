import express from "express"
import createHttpError from "http-errors"
import uniqid from "uniqid"
import { getReviews, writeRewiews } from "../../libs/index.js"

const reviewsRouter = express.Router()

reviewsRouter.get("/:productId", async (req, res, next) => {
  try {
    const reviews = await getReviews()
    const filterReviews = reviews.filter(
      (rev) => rev.productId === req.params.productId
    )

    res.send(filterReviews)
  } catch (error) {
    next(error)
  }
})
reviewsRouter.post("/:productId", async (req, res, next) => {
  try {
    const reviews = await getReviews()
    const { comment, rate } = req.body
    const { productId } = req.params
    const newReview = {
      _id: uniqid(),
      productId,
      comment,
      rate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    reviews.push(newReview)
    await writeRewiews(reviews)
    res.send(newReview)
  } catch (error) {
    next(error)
  }
})
reviewsRouter.get("/:productId/review/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews()
    const { productId, reviewId } = req.params
    const foundReview = reviews.find(
      (rev) => rev._id === reviewId && rev.productId === productId
    )
    res.send(foundReview)
  } catch (error) {
    next(error)
  }
})
reviewsRouter.put("/:productId/review/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews()
    const { comment, rate } = req.body
    const { productId, reviewId } = req.params
    const remainingReview = reviews.filter(
      (prod) => prod.productId !== productId
    )
    const filterReviews = reviews.filter((prod) => prod.productId === productId)
    const reviewIndex = filterReviews.findIndex((rev) => rev._id === reviewId)
    const foundReview = filterReviews[reviewIndex]
    const updatedReview = {
      ...foundReview,
      comment,
      rate,
      updatedAt: new Date(),
    }
    filterReviews[reviewIndex] = updatedReview

    await writeRewiews([...filterReviews, ...remainingReview])
    res.send(updatedReview)
  } catch (error) {
    next(error)
  }
})
reviewsRouter.delete("/:productId/review/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews()
    const { productId, reviewId } = req.params
    const remainingReview = reviews.filter((prod) => prod._id !== reviewId)
    writeRewiews(remainingReview)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default reviewsRouter
