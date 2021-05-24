export default (req, res, next) => {
  function success (statusCode, data) {
    // data = JSON.parse(JSON.stringify(data))
    return res.status(statusCode).json({
      data: data,
      status: 'success'
    })
  }
  function failure (statusCode, message) {
    return res.status(statusCode).json({
      message: message,
      status: 'error'
    })
  }

  res.list = ({ data, offset, limit, total }) => {
    return res.status(200).json({
      data,
      status: 'success',
      offset,
      limit,
    total})
  }

  res.ok = data => {
    success(200, data)
  }

  res.created = data => {
    success(201, data)
  }

  res.noContent = () => {
    success(204, '')
  }

  res.badRequest = message => {
    failure(400, message)
  }

  res.unauthorized = message => {
    failure(401, message)
  }

  res.forbidden = message => {
    failure(403, message)
  }

  res.notFound = message => {
    failure(404, message)
  }

  res.internalServerError = message => {
    failure(500, message)
  }

  next()
}
