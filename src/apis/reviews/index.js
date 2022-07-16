import express from "express"
import createHttpError from "http-errors"
import uniqid from "uniqid"
import { getProducts, getReviews, writeRewiews } from "../../libs/index.js"
import { checkReviewSchema, checkValidationResult } from "./validation.js"

const reviewsRouter = express.Router()

reviewsRouter.get("/:productId", async (req, res, next) => {
  try {
    const reviews = await getReviews()
    const idIsValid = reviews.find(
      (rev) => rev.productId === req.params.productId
    )
    if (idIsValid) {
      const filterReviews = reviews.filter(
        (rev) => rev.productId === req.params.productId
      )

      res.send(filterReviews)
    }
    if (!idIsValid) {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found`
        )
      )
    }
  } catch (error) {
    next(error)
  }
})
reviewsRouter.post(
  "/:productId",
  checkReviewSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const products = await getProducts()
      const reviews = await getReviews()
      console.log(products)
      const { comment, rate } = req.body
      const { productId } = req.params
      console.log(productId)
      const productIdIsValid = products.find((prod) => prod._id === productId)
      console.log(productIdIsValid)
      if (productIdIsValid) {
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
      }
      if (!productIdIsValid) {
        next(createHttpError(404, `Product with id ${productId} not found`))
      }
    } catch (error) {
      next(error)
    }
  }
)
reviewsRouter.get("/:productId/review/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews()
    const { productId, reviewId } = req.params
    const foundReview = reviews.find(
      (rev) => rev._id === reviewId && rev.productId === productId
    )
    if (foundReview) {
      res.send(foundReview)
    } else {
      next(createHttpError(404))
    }
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

    const foundReview = reviews.find(
      (rev) => rev._id === reviewId && rev.productId === productId
    )
    if (foundReview) {
      const updatedReview = {
        ...foundReview,
        comment,
        rate,
        updatedAt: new Date(),
      }
      filterReviews[reviewIndex] = updatedReview

      await writeRewiews([...filterReviews, ...remainingReview])
      res.send(updatedReview)
    } else {
      next(createHttpError(404))
    }
  } catch (error) {
    next(error)
  }
})
reviewsRouter.delete("/:productId/review/:reviewId", async (req, res, next) => {
  try {
    const reviews = await getReviews()
    const { productId, reviewId } = req.params
    const remainingReview = reviews.filter((rev) => rev._id !== reviewId)
    writeRewiews(remainingReview)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default reviewsRouter
