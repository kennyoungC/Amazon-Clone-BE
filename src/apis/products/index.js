import express from "express"
import createHttpError from "http-errors"
import uniqid from "uniqid"
import { checkProductSchema, checkValidationResult } from "./validation.js"

import {
  cloudinaryUploader,
  getProducts,
  saveUsersProductImg,
  writeProducts,
} from "../../libs/index.js"

const productRouter = express.Router()

productRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts()
    if (req.query && req.query.category) {
      const filteredProd = products.filter((prod) =>
        prod.category.toLowerCase().includes(req.query.category.toLowerCase())
      )
      res.send(filteredProd)
    } else {
      res.send(products)
    }
  } catch (error) {
    next(error)
  }
})
productRouter.post(
  "/",
  checkProductSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const { description, brand, name, category, price, imageUrl } = req.body
      const products = await getProducts()
      const newProduct = {
        _id: uniqid(),
        description,
        imageUrl,
        name,
        price,
        brand,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      products.push(newProduct)
      await writeProducts(products)

      res.status(201).send({ newProduct: newProduct._id })
    } catch (error) {
      next(error)
    }
  }
)
productRouter.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params
    const products = await getProducts()
    const foundProduct = products.find((prod) => prod._id === productId)
    if (foundProduct) {
      res.send(foundProduct)
    } else {
      next(createHttpError(404, `Product with id ${productId} not found`))
    }
  } catch (error) {
    console.log(error)
  }
})
productRouter.put(
  "/:productId",
  checkProductSchema,
  checkValidationResult,
  async (req, res, next) => {
    try {
      const { description, brand, name, category, price, imageUrl } = req.body
      const { productId } = req.params
      const products = await getProducts()
      const foundProductIndex = products.findIndex(
        (prod) => prod._id === productId
      )
      if (foundProductIndex !== -1) {
        const oldProduct = products[foundProductIndex]

        const updatedProduct = {
          ...oldProduct,
          description,
          imageUrl,
          name,
          price,
          brand,
          category,
          updatedAt: new Date(),
        }
        products[foundProductIndex] = updatedProduct
        await writeProducts(products)
        res.send(updatedProduct)
      } else {
        next(createHttpError(404, `Product with id ${productId} not found`))
      }
    } catch (error) {
      next(error)
    }
  }
)
productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const products = await getProducts()
    const remainingProducts = products.filter(
      (prod) => prod._id !== req.params.productId
    )

    await writeProducts(remainingProducts)

    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

productRouter.post(
  "/:productId/upload",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const { productId } = req.params
      const products = await getProducts()
      const foundProductIndex = products.findIndex(
        (prod) => prod._id === productId
      )
      console.log("FILE", req.file)
      // if (foundProductIndex !== -1) {
      //   const foundProduct = products[foundProductIndex]

      //   const updatedProduct = {
      //     ...foundProduct,
      //     imageUrl: link,
      //   }
      //   console.log(updatedProduct)
      //   products[foundProductIndex] = updatedProduct
      //   await writeProducts(products)
      //   res.send()
      // } else {
      //   next(createHttpError(404, `Product with id ${productId} not found`))
      // }
      res.send(req.file)
    } catch (error) {
      next(error)
    }
  }
)
export default productRouter
