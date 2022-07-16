import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import productRouter from "./apis/products/index.js"
import { join } from "path"
import reviewsRouter from "./apis/reviews/index.js"
import {
  badRequestErrorHandler,
  genericErrorHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js"
import createHttpError from "http-errors"

const server = express()
const port = process.env.PORT
const publicFolderPath = join(process.cwd(), "./public")

const whitelist = [process.env.FE_DEV_URL, process.FE_PROD_URL]

const corsOptions = {
  origin: (origin, next) => {
    console.log("CURRENT ORIGIN", origin)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true)
    } else {
      next(
        createHttpError(
          400,
          `Cors Error! your origin ${origin} is not in the list`
        )
      )
    }
  },
}

server.use(cors(corsOptions))
server.use(express.json())
server.use(express.static(publicFolderPath))

// ******ENDPOINTS ********
server.use("/products", productRouter)
server.use("/reviews", reviewsRouter)

// *********** Middleware Error Handlers ***********
server.use(badRequestErrorHandler) // 400
server.use(unauthorizedErrorHandler) // 401
server.use(notFoundErrorHandler) // 404
server.use(genericErrorHandler) // 500

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is listening on port ${port}!`)
})
