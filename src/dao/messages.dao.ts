import { MessageModel } from '../models/message.model'
import { DatabaseConnection } from './database-connection'
import { JsonDB } from 'node-json-db';

export class MessageDAO {

    private databaseConnection: JsonDB

    constructor() {
        // initialize database connection
        this.databaseConnection = DatabaseConnection.getConnection();
    }

    public list(): MessageModel[] {
        return this.databaseConnection.getData('/messages');
    }

    public create(message: MessageModel): MessageModel {
        this.databaseConnection.push('/messages[]', message);
        return message;
    }

    public delete(messageID: string): string {
        const index = this.getMessageIndexByID(messageID);
        if (index > -1) {
            this.databaseConnection.delete(`/messages[${index}]`)
            return messageID;
        }
    }

    public getByID(messageID: string): MessageModel {
        const index = this.getMessageIndexByID(messageID);
        if (index > -1) {
            return this.databaseConnection.getData(`/messages[${index}]`)
        }
    }

    public update(message: MessageModel): MessageModel {
        const index = this.getMessageIndexByID(message.id);
        if (index > -1) {
            this.databaseConnection.push(`/messages[${index}]`, message, true)
            return message
        }
    }

    public getById(id: string): MessageModel {
        const index = this.databaseConnection.getIndex('/messages', id, 'id');
        if (index > -1) {
            return this.databaseConnection.getObject(`/messages[${index}]`)
        }
        return null;
    }

    private getMessageIndexByID(messageId: string): number {
        return this.databaseConnection.getIndex('/messages', messageId, 'id');
    }
}