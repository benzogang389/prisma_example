const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const signup = async (parent, args, context, info) => {
  const password = await argon2.hash(args.password)

  const user = await context.prisma.user.create({ data: { ...args, password } })

  const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET)

  return {
    token,
    user,
  }
}

const login = async (parent, args, context, info) => {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  })

  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await argon2.verify(user.password, args.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET)

  return {
    token,
    user,
  }
}

module.exports = {
  signup,
  login,
}
