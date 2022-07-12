import fs from "fs-extra"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const productJSONPath = join(dataFolderPath, "product.json")

export const getProducts = () => readJSON(productJSONPath)
export const writeProducts = (prod) => writeJSON(productJSONPath, prod)
