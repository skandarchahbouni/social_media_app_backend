const db = require('../config/db.config')
const CustomAPIError = require('../errors/custom_error')

// ATTENTION : IMAGE NAME MUST NOT HAVE COMMA 
const getAllPosts = async (req, res, next) => {
    const { id_user } = req.query

    const sql_query = Number(id_user) ? `
        SELECT p.*, u.username, u.profile_pic_link, GROUP_CONCAT(m.media_link) media_links FROM Posts p
        INNER JOIN Users u 
        ON u.id_user = p.id_user 
        LEFT JOIN Shared s
        ON p.id_post = s.id_post
        LEFT JOIN Media_posts m
        ON m.id_post = p.id_post
        WHERE p.id_user = ${Number(id_user)} OR s.id_user = ${Number(id_user)}
        GROUP BY p.id_post
        ORDER BY p.id_post DESC
    ` : `
        SELECT p.*, u.username, u.profile_pic_link, GROUP_CONCAT(m.media_link) media_links FROM Posts p
        INNER JOIN Users u 
        ON u.id_user = p.id_user 
        LEFT JOIN Media_posts m
        ON m.id_post = p.id_post
        GROUP BY p.id_post
        ORDER BY p.id_post DESC
    `

    try {
        const [posts, _] = await db.execute(sql_query)
        return res.status(200).json(posts)
    } catch (error) {
        return next(error)
    }
}

const getSinglePost = async (req, res, next) => {
    const { id_post } = req.params
    const sql_query = `
        SELECT p.*, u.username, u.profile_pic_link, GROUP_CONCAT(m.media_link) media_links FROM Posts p
        INNER JOIN Users u 
        ON u.id_user = p.id_user 
        LEFT JOIN Media_posts m
        ON m.id_post = p.id_post
        WHERE p.id_post = ?
        GROUP BY p.id_post
    `
    try {
        const [post, _] = await db.execute(sql_query, [id_post])
        if (post.length === 0) return next(CustomAPIError.notFound("post not found"))
        return res.status(200).json(post[0])
    } catch (error) {
        return next(error)
    }
}

const createPost = async (req, res, next) => {
    const { id_user } = req.user
    const { quote } = req.body
    if (!quote) return next(CustomAPIError.badRequest("Missing required attribute: quote"))

    const sql_query = `
        INSERT INTO Posts (quote, id_user) Values (?, ?)
    `
    try {
        const [{ insertId }] = await db.execute(sql_query, [quote, id_user])
        return res.status(200).json({ id_post: insertId })
    } catch (error) {
        return next(error)
    }
}

const deletePost = async (req, res, next) => {
    try {
        return res.json('deletePost')
    } catch (error) {
        return next(error)
    }
}

const addLike = async (req, res, next) => {
    const { id_user } = req.user
    const { id_post } = req.params
    const { allow_likes_notifications } = req.notifications
    const sql_query = `
        INSERT INTO Likes(id_user, id_post) VALUES (?, ?)
    `
    const sql_query_2 = `
        INSERT INTO Notifications (id_post, triggered_by, message) VALUES(?,?,?)
    `
    try {
        await db.execute(sql_query, [id_user, id_post])
        if (allow_likes_notifications) {
            await db.execute(sql_query_2, [id_post, id_user, "liked your post"])
        }
        return res.status(200).json('Like added succesfully')
    } catch (error) {
        return next(error)
    }
}

const removeLike = async (req, res, next) => {
    const { id_user } = req.user
    const { id_post } = req.params
    const sql_query = `
        DELETE FROM Likes WHERE id_user = ? AND id_post = ?
    `
    try {
        await db.execute(sql_query, [id_user, id_post])
        return res.status(200).json('like removed succesfully')
    } catch (error) {
        return next(error)
    }
}

const getNbLikes = async (req, res, next) => {
    const { id_post } = req.params
    const sql_query = `
        SELECT COUNT(*) nb_likes FROM Likes 
        WHERE id_post = ?
        GROUP BY id_post
    `
    try {
        const [result, _] = await db.execute(sql_query, [id_post])
        const response = result[0]?.nb_likes ?? 0
        return res.status(200).json(response)
    } catch (error) {
        return next(error)
    }
}

const isLiked = async (req, res, next) => {
    const { id_user } = req.user
    const { id_post } = req.params
    const sql_query = `
        SELECT COUNT(1) liked FROM Likes WHERE id_user = ? AND id_post = ?
    `
    try {
        const [exist, _] = await db.execute(sql_query, [id_user, id_post])
        return res.status(200).json(exist[0])
    } catch (error) {
        return next(error)
    }
}

const addComment = async (req, res, next) => {
    const { id_user } = req.user
    const { allow_comments_notifications } = req.notifications
    const { id_post } = req.params
    const { comment_content } = req.body
    if (!comment_content) return next(CustomAPIError.badRequest("missing required value : comment_content"))
    const sql_query = `
        INSERT INTO COMMENTS (id_user, id_post, comment_content) VALUES (?, ?, ?)
    `
    const sql_query_2 = `
        INSERT INTO Notifications (id_post, triggered_by, message) VALUES(?,?,?)
    `
    try {
        await db.execute(sql_query, [id_user, id_post, comment_content])
        if (allow_comments_notifications){
            console.log('yeah')
            await db.execute(sql_query_2, [id_post, id_user, "commented your post"])
        }
        return res.status(200).json('Comment added succesfully')
    } catch (error) {
        return next(error)
    }
}

const getComments = async (req, res, next) => {
    const { id_post } = req.params
    const sql_query = `
        SELECT u.id_user, u.username, u.profile_pic_link, c.id_comment, c.comment_content FROM Posts p
        INNER JOIN Comments c 
        ON p.id_post = c.id_post
        INNER Join Users u
        ON u.id_user = c.id_user
        WHERE p.id_post = ?
    `
    try {
        const [comments, _] = await db.execute(sql_query, [id_post])
        return res.status(200).json(comments)
    } catch (error) {
        return next(error)
    }
}

const getNbComments = async (req, res, next) => {
    const { id_post } = req.params
    const sql_query = `
        SELECT COUNT(*) nb_comments FROM Comments 
        WHERE id_post = ?
        GROUP BY id_post
    `
    try {
        const [result, _] = await db.execute(sql_query, [id_post])
        const response = result[0]?.nb_comments ?? 0
        return res.status(200).json(response)
    } catch (error) {
        return next(error)
    }
}


const addToSaved = async (req, res, next) => {
    const { id_user } = req.user
    const { id_post } = req.params

    const sql_query = `
        INSERT INTO Saved (id_user, id_post) VALUES (?, ?)
    `

    try {
        await db.execute(sql_query, [id_user, id_post])
        return res.status(200).json('Post saved Succesfully')
    } catch (error) {
        return next(error)
    }
}

const removeFromSaved = async (req, res, next) => {
    const { id_user } = req.user
    const { id_post } = req.params

    const sql_query = `
        DELETE FROM Saved WHERE id_user =?  AND id_post = ?
    `
    try {
        await db.execute(sql_query, [id_user, id_post])
        return res.json('Post unsaved succesfully')
    } catch (error) {
        return next(error)
    }
}

const getSavedPosts = async (req, res, next) => {
    const { id_user } = req.user

    const sql_query = `
        SELECT p.*, u.profile_pic_link, GROUP_CONCAT(m.media_link) media_links FROM Posts p
        INNER JOIN Saved s
        ON s.id_post = p.id_post
        INNER JOIN Users u 
        ON u.id_user = p.id_user 
        LEFT JOIN Media_posts m
        ON m.id_post = p.id_post
        WHERE s.id_user = ?
        GROUP BY p.id_post
        ORDER BY p.id_post DESC
    `
    try {
        const [savedposts, _] = await db.execute(sql_query, [id_user])
        return res.status(200).json(savedposts)
    } catch (error) {
        return next(error)
    }
}

const sharePost = async (req, res, next) => {
    const { id_user } = req.user
    const { id_post } = req.params

    const sql_query = `
        INSERT INTO Shared (id_user, id_post) VALUES (?, ?)
    `
    try {
        await db.execute(sql_query, [id_user, id_post])
        return res.json('post shared succesfully')
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getAllPosts,
    getSinglePost,
    createPost,
    deletePost,
    addLike,
    removeLike,
    getNbLikes,
    isLiked,
    addComment,
    getComments,
    getNbComments,
    addToSaved,
    removeFromSaved,
    getSavedPosts,
    sharePost
}