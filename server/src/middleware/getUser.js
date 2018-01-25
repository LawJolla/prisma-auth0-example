const getUser = async (req, res, next, db) => {
  if (!req.user) return next()
  const user = await db.query.user({ where: { auth0id: req.user.sub.split(`|`)[1] } })
  req.user = { token: req.user, ...user }
  next()
}

module.exports = { getUser }