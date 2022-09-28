const db = require("../config/db.config")
const CustomAPIError = require("../errors/custom_error")
const remove_undefined_attributes = require("../utils/remove_undefined")
const User = require("../utils/user")

const getUsers = async (req, res, next) => {
    const sql_query = `
        SELECT id_user, username, workplace, profile_pic_link FROM Users 
    `
    try {
        const [users, _] = await db.execute(sql_query)
        return res.status(200).json(users)
    } catch (error) {
        return next(error)
    }
}

const getSingleUser = async (req, res, next) => {
    const { id_user } = req.params
    const followed_by = req.user.id_user 
    const sql_query = `
        SELECT * FROM Users WHERE id_user = ?
    `
    const sql_query_2 = `
        SELECT COUNT(1) exist FROM Followings WHERE id_user = ? AND followed_by = ?
    `
    try {
        const [user, _] = await db.execute(sql_query, [id_user])
        if (user.length == 0) return next(CustomAPIError.notFound('user not found'))
        const [exist , ] = await db.execute(sql_query_2, [id_user, followed_by])
        const user_info = user[0]
        delete user_info.password
        user_info.followed_by_me = exist[0].exist
        return res.status(200).json(user_info)
    } catch (error) {
        return next(error)
    }
}

const getProfile = async (req, res, next) => {
    const { id_user } = req.user
    const sql_query = `
        SELECT * FROM Users WHERE id_user = ?
    `
    try {
        const [user, ] = await db.execute(sql_query, [id_user])
        if(user.length === 0) return next(CustomAPIError.notFound('user'))
        return res.status(200).json(user[0])
    } catch (error) {
        return next(error)
    }
}

const editProfile = async (req, res, next) => {

    const { id_user } = req.user

    const object_query = remove_undefined_attributes(new User(req.body))
    if(!object_query) return next(CustomAPIError.badRequest('empty body'))
    const columns = Object.keys(object_query).map(c => c + ' = ?').join(',')
    const values = Object.values(object_query)
    const sql_query = `
        UPDATE Users 
        SET ${columns}
        WHERE id_user = ${Number(id_user)}
    `

    try {
        await db.execute(sql_query, values)
        const updated_user = new User(req.body)
        updated_user.id_user = id_user
        return res.status(200).json(updated_user)
    } catch (error) {
        return next(error)
    }
}

const isFollowed = async (req, res, next) => {
    const followed_by = req.user.id_user 
    const { id_user } = req.params
    const sql_query = `
        SELECT COUNT(1) exist FROM Followings WHERE id_user = ? AND followed_by = ?
    `
    try {
        const [exist, _] = await db.execute(sql_query, [id_user, followed_by]) 
        return res.status(200).json(exist[0])
    } catch (error) {
        return next(error)
    }
}

const follow = async (req, res, next) => {
    const { id_user } = req.params
    const followed_by = req.user.id_user
    const sql_query = `
        INSERT INTO Followings (id_user, followed_by) VALUES (?, ?)
    `
    try {
        await db.execute(sql_query, [id_user, followed_by])
        return res.status(200).json("followed succesfully")
    } catch (error) {
        return next(error)
    }
}

const unfollow = async (req, res, next) => {
    const { id_user } = req.params
    const followed_by = req.user.id_user
    const sql_query = `
        DELETE FROM Followings WHERE id_user = ? AND followed_by = ?
    `
    try {
        await db.execute(sql_query, [id_user, followed_by])
        return res.status(200).json("unfollowed succesfully")
    } catch (error) {
        return next(error)
    }
}

const changeProfilePic = async (req, res, next) => {

    const { file } = req

    if (!file) return next(CustomAPIError.badRequest("No image were provided"))
    const { filename } = file

    const { id_user } = req.user
    const sql_query = `
        UPDATE Users 
        SET profile_pic_link = ?
        WHERE id_user = ?
    `
    try {
        await db.execute(sql_query, [filename, id_user])
        return res.status(200).json(filename)
    } catch (error) {
        return next(error)
    }
}

const changeCoverPic = async (req, res, next) => {

    const { file } = req

    if (!file) return next(CustomAPIError.badRequest("No image were provided"))
    const { filename } = file

    const { cover_pic_link } = req.body

    console.log(cover_pic_link)

    const { id_user } = req.user
    const sql_query = `
        UPDATE Users 
        SET cover_pic_link = ?
        WHERE id_user = ?
    `
    try {
        await db.execute(sql_query, [filename, id_user])
        return res.status(200).json(filename)
    } catch (error) {
        return next(error)
    }
}

const closeAccount = async (req, res, next) => {
    const { id_user } = req.user
    const sql_query = `
        DELETE FROM Users WHERE id_user = ?
    `
    try {
        await db.execute(sql_query, [id_user])
        return res.status(200).json("deleted successfully")
    } catch (error) {
        return next(error)
    }
}


module.exports = {
    getUsers,
    getSingleUser,
    getProfile,
    editProfile,
    isFollowed,
    follow,
    unfollow,
    changeProfilePic,
    changeCoverPic,
    closeAccount
}