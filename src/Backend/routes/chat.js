
import { Chat_handler } from "../controllers/chatController.js";
import express from 'express'


const router = express.Router()


router.post("/chat", Chat_handler)

export default router