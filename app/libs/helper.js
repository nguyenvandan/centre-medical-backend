
module.exports = {
    removeFalsy: (obj) => {
      let newObj = {}
      Object.keys(obj).forEach((prop) => {
        if (obj[prop]) { newObj[prop] = obj[prop]; }
      })
      return newObj
    }
}