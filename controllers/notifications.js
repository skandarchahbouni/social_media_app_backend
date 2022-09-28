const db = require("../config/db.config")

const getNotifications = async (req, res, next) => {
    const { id_user } = req.user
    const sql_query = `
        SELECT n.*, u.username, u.profile_pic_link FROM Notifications n 
        INNER JOIN Users u
        ON u.id_user = n.triggered_by
        INNER JOIN Posts p
        ON p.id_post = n.id_post 
        WHERE p.id_user = ?
        ORDER BY n.id_notification DESC
        LIMIT 5
    `
    try {
        const [notifications, _] = await db.execute(sql_query, [id_user])
        return res.status(200).json(notifications)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    getNotifications
}