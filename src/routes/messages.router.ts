import { Router } from 'express';
import { UnknownMessageError } from '../errors/unknown-message.error';
import { MessagesService } from '../services/messages.service';
const messagesRouter = Router();

const messagesService = new MessagesService();


/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 */
 messagesRouter.get('/', (req, res) => {
    const messages = messagesService.getAllMessages();
    res.status(200).send(messages);
})


/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: creates a new user
 */
messagesRouter.post('/', (req, res) => {
    try {
        res.status(200).send(messagesService.createMessage(req.body))
    } catch (error) {
        res.status(400).send(error.message)
    }
})

messagesRouter.put('/:messageId', (req, res) => {
    try {
        res.status(200).send(messagesService.updateMessage(req.body));
    } catch (error) {
        res.status(400).send(error.message);
    }
})

messagesRouter.delete('/:messageID', (req: any, res) => {
    try {
        res.status(200).send(messagesService.deleteMessage(req.params.messageID, req.message.id))
    } catch (error) {
        if (error instanceof UnknownMessageError) {
            res.status(404)
        } else {
            res.status(400)
        }
        res.send(error.message)
    }
})

export default messagesRouter;