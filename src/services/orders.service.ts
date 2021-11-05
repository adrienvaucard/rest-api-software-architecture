import { UnknownOrderError } from '../errors/unknown-order.error'
import { OrdersDAO } from '../dao/orders.dao';
import { OrderModel } from '../models/order.model';
import { existsSync } from 'fs';

const uuid = require('uuid');

export class OrdersService {
    private orderDAO: OrdersDAO = new OrdersDAO()

    public getAllOrders(): OrderModel[] {
        return this.orderDAO.list()
    }

    public getOrderByID(id: string) {
        return this.orderDAO.findById(id);
    }

    public createOrder(order: OrderModel) {
        if (!this.checkOrderToCreateIsValid(order)) {
            throw new Error('invalid order');
        }

        const orderToCreate = {
            ...order,
            id: uuid.v4()
        }
        return this.orderDAO.create(orderToCreate);
    }

    public deleteOrder(orderID: string, currentOrderID: string) {
        if (orderID === currentOrderID) {
            throw new Error('order cannot remove himself !')
        }
        const order = this.orderDAO.getByID(orderID);
        if (!order) {
            throw new UnknownOrderError('unknown order')
        }
        return this.orderDAO.delete(orderID);
    }

    public updateOrder(order: OrderModel): OrderModel {
        const existingOrder = this.orderDAO.getByID(order.id);
        if (!existingOrder) {
            throw new UnknownOrderError('unknown order')
        }
        const orderToUpdate = {
            ...existingOrder,
            ...order
        }

        return this.orderDAO.update(orderToUpdate)
    }

    private checkOrderToCreateIsValid(order: OrderModel) {
        return order && order.user && order.items
    }
}