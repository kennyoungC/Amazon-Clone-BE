import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import productRouter from "./apis/products/index.js"
import {
  badRequestHandlers,
  unaunthorizedErrorHandler,
} from "./errorHandlers.js"

const server = express()
const port = 3003

server.use(express.json())
server.use(cors())

// ******ENDPOINTS ********
server.use("/products", productRouter)

// *********** Middleware Error Handlers ***********
server.use(badRequestHandlers)
server.use(unaunthorizedErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is listening on port ${port}!`)
})
