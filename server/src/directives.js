const _get = require('lodash.get')

const userLocationOnContext = 'request.user'

const isLoggedIn = (ctx) => {
  const user = ctxUser(ctx, userLocationOnContext)
  if (!user) throw new Error(`Not logged in`)
  return user
}
const ctxUser = (ctx) => _get(ctx, userLocationOnContext)

const isRequestingUserAlsoOwner = ({ ctx, userId, type, typeId }) => ctx.db.exists[type]({ id: typeId, user: {id: userId}})

const directiveResolvers = {
  isAuthenticated: (next, source, args, ctx) => {
    isLoggedIn(ctx)
    return next()
  },
  hasRole: (next, source, { roles }, ctx) => {
    const { role } = isLoggedIn(ctx)
    if (roles.includes(role)) {
      return next()
    }
    throw new Error(`Unauthorized, incorrect role`)
  },
  isOwner: async (next, source, { type }, ctx) => {
      const { id: typeId } = ctx.request.body.variables
      const {id: userId } = isLoggedIn(ctx)
      const isOwner = await isRequestingUserAlsoOwner({ ctx, userId, type, typeId } )
      if (isOwner) {
        return next()
      }
      throw new Error(`Unauthorized, must be owner`)
  },
  isOwnerOrHasRole: async (next, source, { roles, type }, ctx, ...p) => {
    const { id: userId, role } = isLoggedIn(ctx)
    if (roles.includes(role)) {
      return next()
    }

    const { id: typeId } = ctx.request.body.variables
    const isOwner = await isRequestingUserAlsoOwner({ ctx, userId, type, typeId } )

    if (isOwner) {
      return next()
    }
    throw new Error(`Unauthorized, not owner or incorrect role`)
  }
}

module.exports = { directiveResolvers }
