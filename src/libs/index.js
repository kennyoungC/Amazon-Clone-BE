import fs from "fs-extra"
import { dirname, join } from "path"
import { fileURLToPath } from "url"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const productJSONPath = join(dataFolderPath, "product.json")
const reviewJSONPath = join(dataFolderPath, "reviews.json")

const usersPublicFolderPath = join(process.cwd(), "./public/img/products")

export const getProducts = () => readJSON(productJSONPath)
export const writeProducts = (prod) => writeJSON(productJSONPath, prod)

export const getReviews = () => readJSON(reviewJSONPath)
export const writeRewiews = (rewiew) => writeJSON(reviewJSONPath, rewiew)

export const saveUsersProductImg = (fileName, contentAsBuffer) =>
  writeFile(join(usersPublicFolderPath, fileName), contentAsBuffer)

export const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "kenzon/products",
    },
  }),
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype.startsWith("image/")) {
      multerNext(null, true)
    } else {
      multerNext(createHttpError(400, "Only images are allowed!"))
    }
  },
}).single("product")
