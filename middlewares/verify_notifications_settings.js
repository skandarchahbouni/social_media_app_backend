const db = require("../config/db.config")

const verifyNotificationSettings = async (req, res, next) => {
    const { id_user } = req.user 
    const sql_query = `
        SELECT allow_likes_notifications, allow_comments_notifications, allow_subscription_notifications FROM Users 
        WHERE id_user = ?
    `
    const [result, _] = await db.execute(sql_query, [id_user])
    const notifications = result[0]
    req.notifications = notifications
    return next()
}

module.exports = verifyNotificationSettings