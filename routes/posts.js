const router = require('express').Router()
const postsController = require('../controllers/posts')
const verifyNotificationSettings = require('../middlewares/verify_notifications_settings')

router.get('/', postsController.getAllPosts) // get a post of a specific user 
router.get('/saved', postsController.getSavedPosts)
router.get('/:id_post', postsController.getSinglePost) // get single post 

router.post('/create-post', postsController.createPost)
// router.delete('/:id_post', verify_owner, postsController.deletePost) 

router.post('/:id_post/add-like', verifyNotificationSettings, postsController.addLike)
router.delete('/:id_post/remove-like', postsController.removeLike)
router.get('/:id_post/nb-likes', postsController.getNbLikes)
router.get('/:id_post/is-liked', postsController.isLiked)

router.post('/:id_post/add-comment', verifyNotificationSettings, postsController.addComment)
router.get('/:id_post/comments', postsController.getComments)
router.get('/:id_post/nb-comments', postsController.getNbComments)

router.post('/:id_post/add-to-saved', postsController.addToSaved)
router.delete('/:id_post/remove-from-saved', postsController.removeFromSaved)

router.post('/:id_post/share-post', postsController.sharePost)

module.exports = router