const router = require('express').Router()
const usersController = require('../controllers/users')
const upload = require('../middlewares/upload_files')

router.get('/', usersController.getUsers)
router.get('/my-profile', usersController.getProfile)
router.get('/is_followed/:id_user', usersController.isFollowed)
router.get('/close-account', usersController.closeAccount)
router.get('/:id_user', usersController.getSingleUser)
router.put('/edit_profile', usersController.editProfile)
router.put('/change-profile-pic', upload.single('image'), usersController.changeProfilePic)
router.put('/change-cover-pic', upload.single('image'), usersController.changeCoverPic)
router.post('/:id_user/follow', usersController.follow)
router.delete('/:id_user/unfollow', usersController.unfollow)

module.exports = router