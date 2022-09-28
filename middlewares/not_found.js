const notFound = (_, res) => res.status(404).json('Route does not exist')

module.exports = notFound