const router = require('express').Router()
const eventsController = require('../controllers/events')

router.get('/', eventsController.getAllEvents)
router.get('/:id_event', eventsController.getSingleEvent)
router.post('/create-event', eventsController.createEvent)
router.delete('/:id_event', eventsController.removeEvent)

router.post('/:id_event/add-to-interest', eventsController.addToInterest)
router.delete('/:id_event/remove-from-interest', eventsController.removeFromInterest)

module.exports = router