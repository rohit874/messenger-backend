import express from 'express';
import { registerController, loginController, ChatController, userController } from '../controller';
import auth from '../middilewares/auth';
const router = express.Router();

router.post('/register', registerController.register)
router.post('/login', loginController.login)
router.get('/getuser', auth, userController.getUser)
router.post('/getfriends', auth, userController.getFriends)
router.post('/search', auth, userController.searchFriend)
router.post('/conversations', ChatController.Conversations)
router.get('/conversations/:userID', ChatController.getConversation)
router.post('/message', ChatController.saveMessage)
router.get('/message/:conversationID', ChatController.getMessages)


export default router;