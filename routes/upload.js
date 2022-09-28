const router = require('express').Router()
const upload = require('../middlewares/upload_files')
const { multiple_save_in_db, single_save_in_db } = require('../controllers/upload')

router.post('/multiple/:id_post', upload.array('images', 4), multiple_save_in_db)
router.post('/single/:id_post', upload.single('image'), single_save_in_db)

module.exports = router