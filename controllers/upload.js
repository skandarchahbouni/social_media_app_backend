const CustomAPIError = require('../errors/custom_error')
const db = require('../config/db.config')

const multiple_save_in_db = async (req, res, next) => {

    const { files } = req

    if (!files) return next(CustomAPIError.badRequest("No image were provided"))

    const { id_post } = req.params
    const values = []
    files.forEach(file => {
        const { filename } = file
        values.push(id_post, filename)
    });

    const arr = new Array(files.length).fill('(?, ?)')
    const query = `
        INSERT INTO Media_posts (id_post, media_link) VALUES ${arr}
    `

    try {
        await db.execute(query, values)
        return res.status(200).json("uploaded succesfully")
    } catch (error) {
        return next(error)
    }
}

const single_save_in_db = async (req, res, next) => {

    const { file } = req

    if (!file) return next(CustomAPIError.badRequest("No image were provided"))

    const { id_post } = req.params
    const { filename } = file

    const query = `
        INSERT INTO Media_posts (id_post, media_link) VALUES (? , ?)
    `

    try {
        await db.execute(query, [id_post, filename])
        return res.status(200).json({ filename })
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    multiple_save_in_db,
    single_save_in_db
}