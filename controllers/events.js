const getAllEvents = async (req, res, next) => {
    try {
        return res.json("getAllEvents")
    } catch (error) {
        return next(error)
    }
}

const getSingleEvent = async (req, res, next) => {
    try {
        return res.json("getSingleEvent")
    } catch (error) {
        return next(error)
    }
}

const createEvent = async (req, res, next) => {
    try {
        return res.json("createEvent")
    } catch (error) {
        return next(error)
    }
}

const removeEvent = async (req, res, next) => {
    try {
        return res.json("removeEvent")
    } catch (error) {
        return next(error)
    }
}

const addToInterest = async (req, res, next) => {
    try {
        return res.json("addToInterest")
    } catch (error) {
        return next(error)
    }
}

const removeFromInterest = async (req, res, next) => {
    try {
        return res.json("removeFromInterest")
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllEvents,
    getSingleEvent,
    createEvent,
    removeEvent,
    addToInterest,
    removeFromInterest
}