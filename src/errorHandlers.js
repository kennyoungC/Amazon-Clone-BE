export const badRequestHandlers = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send({
      status: "error",
      message: err.message,
      errorList: err.errorsList,
    })
  } else {
    next(err)
  }
}
export const unaunthorizedErrorHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({ status: "error", message: err.message })
  } else {
    next(err)
  }
}
