import { Router } from 'express';
import { UnknownMessageError } from '../errors/unknown-message.error';
import { MessagesService } from '../services/messages.service';
const messagesRouter = Router();

const messagesService = new MessagesService();


/**
 * @openapi
 * /messages:
 *   get:
 *     summary: Retrieve a list of messages
 */
messagesRouter.get('/', (req, res) => {
    const messages = messagesService.getAllMessages();
    res.status(200).send(messages);
})


/**
 * @openapi
 * /messages:
 *   post:
 *     summary: Create a new message
 *     description: creates a new message
 */
messagesRouter.post('/', (req, res) => {
    try {
        res.status(200).send(messagesService.createMessage(req.body))
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/**
 * @openapi
 * /messages:
 *   put:
 *     summary: Update a message
 *     description: Update a message
 */
messagesRouter.put('/:messageId', (req, res) => {
    try {
        res.status(200).send(messagesService.updateMessage(req.body));
    } catch (error) {
        res.status(400).send(error.message);
    }
})

/**
 * @openapi
 * /messages:
 *   delete:
 *     summary: Delete a message
 *     description: Delete a message
 */
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