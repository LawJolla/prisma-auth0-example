const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const { checkJwt } = require('./middleware/jwt')
const { getUser } = require('./middleware/getUser')
const validateAndParseIdToken = require('./helpers/validateAndParseIdToken')


async function createPrismaUser(ctx, idToken) {
  const user = await ctx.db.mutation.createUser({
    data: {
      identity: idToken.sub.split(`|`)[0],
      auth0id: idToken.sub.split(`|`)[1],
      name: idToken.name,
      email: idToken.email,
      avatar: idToken.picture
    },
  })
  return user
}

const isLoggedIn = (ctx) => {
  if (!ctx.request.user) throw new Error(`Not logged in`)
  return ctxUser(ctx)
}

const ctxUser = (ctx) => ctx.request.user

const requestingUserIsAuthor = (ctx, id) => ctx.db.exists.Post({ id, user: {id: isLoggedIn(ctx).id}})

const resolvers = {
  Query: {
    feed(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: true } }, info)
    },
    drafts(parent, args, ctx, info) {
      const { id } = isLoggedIn(ctx)
      return ctx.db.query.posts({ where: { isPublished: false, user: { id }} }, info)
    },
    async post(parent, { id }, ctx, info) {
      const isUserAuthor = await requestingUserIsAuthor(ctx, id)
      if (isUserAuthor) return ctx.db.query.post({ where: { id } }, info)
      return new Error('Invalid permission, must be author of post')
    },
    me(parent, args, ctx, info ) {
      const { auth0id } = isLoggedIn(ctx)
      return ctx.db.query.user({ where: { auth0id }}, info)
    }
  },
  Mutation: {
    async authenticate(parent, { idToken }, ctx, info) {
      let userToken = null
      try {
        userToken = await validateAndParseIdToken(idToken)
      }
      catch (err) {
        throw new Error(err.message)
      }
      const auth0id = userToken.sub.split('|')[1]
      let user = await ctx.db.query.user({where: { auth0id }}, info)
      if (!user) {
        user = createPrismaUser(ctx, userToken)
      }
      return user
    },
    createDraft(parent, { title, text }, ctx, info) {
      const { id } = isLoggedIn(ctx)
      return ctx.db.mutation.createPost(
        { data: { title, text, isPublished: false, user: { connect: { id }} } },
        info,
      )
    },
    async deletePost(parent, { id }, ctx, info) {
      const isUserAuthor = await requestingUserIsAuthor(ctx, id)
      if (isUserAuthor) {
        return ctx.db.mutation.deletePost({where: { id } }, info)
      }
      throw new Error('Invalid permission, must author post to delete post')
    },
    async publish(parent, { id }, ctx, info) {
      const isUserAuthor = await requestingUserIsAuthor(ctx, id)
      if (isUserAuthor) {
        return ctx.db.mutation.updatePost(
            {
              where: {id},
              data: {isPublished: true},
            },
            info,
        )
      }
      throw new Error('Invalid permission, must author post to publish post')
    },
  },
}

const db = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: true,
})

console.log(process.env.PRISMA_ENDPOINT)

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db
  }),
})

server.express.post(server.options.endpoint, checkJwt,  (err, req, res, next) => {
  if (err) return res.status(401).send(err.message)
  next()
})
server.express.post(server.options.endpoint, (req, res, next) => getUser(req, res, next, db))
server.start(() => console.log('Server is running on http://localhost:4000'))
