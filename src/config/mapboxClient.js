const geocodingClient = require('@mapbox/mapbox-sdk/services/geocoding')

const MAPBOX_API_KEY = process.env.MAPBOX_API_KEY

const mapboxClient = geocodingClient({
  accessToken: MAPBOX_API_KEY,
})

module.exports = mapboxClient
