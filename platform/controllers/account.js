module.exports.accountStatus = (result) => {
  if(!result) return false
  return result.beta || false
}
