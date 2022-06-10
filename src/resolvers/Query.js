const mapboxClient = require('../config/mapboxClient')

const isOk = async (parent, args, context, info) => {
  return true
}

const getUserById = async (parent, args, context, info) => {
  if (!context.userId) return null

  return await context.prisma.user.findUnique({ where: { id: args.id } })
}

const forwardGeocode = async (parent, args, context, info) => {
    if (!context.userId) return null

  const searchStr = args.search
  const autocomplete = args.autocomplete

  if (!searchStr || searchStr === '') {
    throw new Error('Failed! Search string is not provided')
  }

  try {
    const mapboxResponse = await mapboxClient
      .forwardGeocode({
        query: searchStr,
        autocomplete: false,
      })
      .send()
      .then((response) => {
        const features = response.body.features
        return features.map((f) => {
          return {
            id: f.id,
            center: f.center,
            placeName: f.place_name,
            placeText: f.text,
          }
        })
      })
      .catch((err) => {
        console.log(err)
        throw new Error('Failed! Search query failed!')
      })

    return mapboxResponse
  } catch (err) {
    throw new Error('Failed! ' + err.message)
  }
}

const reverseGeocode = async (parent, args, context, info) => {
    if (!context.userId) return null

  const mapboxResponse = await mapboxClient
    .reverseGeocode({
      query: [args.latFloat, args.longFloat],
    })
    .send()
    .then((response) => {
      const features = response.body.features
      return features.map((f) => {
        return {
          id: f.id,
          center: f.center,
          placeName: f.place_name,
          placeText: f.text,
        }
      })
    })
    .catch((err) => {
      console.log(err)
      throw new Error('Failed! Search query failed!')
    })

  return mapboxResponse
}

module.exports = { isOk, getUserById, forwardGeocode, reverseGeocode }
