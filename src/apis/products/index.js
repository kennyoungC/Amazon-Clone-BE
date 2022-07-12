import express from "express"
import createHttpError from "http-errors"
import uniqid from "uniqid"

import { getProducts, writeProducts } from "../../libs/index.js"

const productRouter = express.Router()

productRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProducts()
    res.send(products)
  } catch (error) {
    next(error)
  }
})
productRouter.post("/", async (req, res, next) => {
  try {
    const products = await getProducts()
    const newProduct = {
      _id: uniqid(),
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    products.push(newProduct)
    await writeProducts(products)

    res.status(201).send({ newProduct: newProduct._id })
  } catch (error) {
    next(error)
  }
})
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
productRouter.put("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params
    const products = await getProducts()
    const foundProductIndex = products.findIndex(
      (prod) => prod._id === productId
    )
    if (foundProductIndex !== -1) {
      const oldProduct = products[foundProductIndex]

      const updatedProduct = {
        ...oldProduct,
        ...req.body,
        updatedAt: new Date(),
      }
      products[foundProductIndex] = updatedProduct
      res.send(updatedProduct)
    } else {
      next(createHttpError(404, `Product with id ${productId} not found`))
    }
  } catch (error) {
    next(error)
  }
})
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
export default productRouter
