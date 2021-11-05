import { BookModel } from '../models/book.model'
import { DatabaseConnection } from './database-connection'
import { JsonDB } from 'node-json-db';
import { OrderModel } from '../models/order.model';

export class OrdersDAO {

    private databaseConnection: JsonDB

    constructor() {
        // initialize database connection
        this.databaseConnection = DatabaseConnection.getConnection();
    }

    public list(): OrderModel[] {
        return this.databaseConnection.getData('/orders');
    }

    public findById(id: string): OrderModel {
        const index = this.getOrderIndexByID(id);
        return this.databaseConnection.getData(`/comments[${index}]`)
    }

    public create(order: OrderModel): OrderModel {
        this.databaseConnection.push('/orders[]', order);
        return order;
    }

    public delete(orderID: string): string {
        const index = this.getOrderIndexByID(orderID);
        if (index > -1) {
            this.databaseConnection.delete(`/orders[${index}]`)
            return orderID;
        }
    }

    public getByID(orderID: string): OrderModel {
        const index = this.getOrderIndexByID(orderID);
        if (index > -1) {
            return this.databaseConnection.getData(`/orders[${index}]`)
        }
    }

    public update(order: OrderModel): OrderModel {
        const index = this.getOrderIndexByID(order.id);
        if (index > -1) {
            this.databaseConnection.push(`/orders[${index}]`, order, true)
            return order
        }
    }

    private getOrderIndexByID(id: string): number {
        return this.databaseConnection.getIndex('/orders', id, 'id');
    }
}