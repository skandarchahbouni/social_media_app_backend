const notificationsController = require('../controllers/notifications')

const router = require('express').Router()

router.get('/', notificationsController.getNotifications)

module.exports = router