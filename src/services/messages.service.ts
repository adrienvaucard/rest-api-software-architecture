import { UnknownMessageError } from '../errors/unknown-message.error'
import { MessageDAO } from '../dao/messages.dao';
import { MessageModel } from '../models/message.model';
import { createSecureContext } from 'tls';

const uuid = require('uuid');

export class MessagesService {
    private messageDAO: MessageDAO = new MessageDAO()

    public getAllMessages(): MessageModel[] {
        return this.messageDAO.list()
    }

    public createMessage(message: MessageModel) {
        if (!this.checkMessageToCreateIsValid(message)) {
            throw new Error('invalid book');
        }

        const messageToCreate = {
            ...message,
            id: uuid.v4()
        }
        return this.messageDAO.create(messageToCreate);
    }

    public deleteMessage(messageID: string, currentMessageID: string) {
        if (messageID === currentMessageID) {
            throw new Error('message cannot remove himself !')
        }
        const message = this.messageDAO.getByID(messageID);
        if (!message) {
            throw new UnknownMessageError('unknown message')
        }
        return this.messageDAO.delete(messageID);
    }

    public updateMessage(message: MessageModel): MessageModel {
        const existingMessage = this.messageDAO.getByID(message.id);
        if (!existingMessage) {
            throw new UnknownMessageError('unknown message')
        }
        const messageToUpdate = {
            ...existingMessage,
            ...message
        }

        return this.messageDAO.update(messageToUpdate)
    }

    private checkMessageToCreateIsValid(message: MessageModel) {
        return message && message.title && message.content
    }

}