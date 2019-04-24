// Handle success here
exports.handleSuccessResponse = async function (res, data = null, message = null){
  return res.send({
    code: 1,
    message: message,
    data: data
  })
}

// Handle error here
exports.handleErrorResponse = async function (res, message = null){
  return res.send({
    code: 2,
    message: message
  })
}
