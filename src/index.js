const { ApolloServer, gql } = require('apollo-server')
const { PrismaClient } = require('@prisma/client')
const { Query, Mutation, User } = require('./resolvers/index')
const fs = require('fs')
const path = require('path')
const { getUserId } = require('./utils')
require('dotenv').config()

const typeDefs = gql(
  fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
)

const prisma = new PrismaClient({
  errorFormat: 'minimal',
})

const resolvers = {
  Query,
  Mutation,
  User,
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }
  },
})

server.listen({port: process.env.PORT,}).then(({ url }) => console.log(`Server is running on ${url}`))
