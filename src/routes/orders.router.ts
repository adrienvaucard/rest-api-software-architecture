import { Router } from 'express';
import { UnknownOrderError } from '../errors/unknown-order.error';
import { OrdersService } from '../services/orders.service';
const ordersRouter = Router();

const ordersService = new OrdersService();


/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Retrieve a list of orders
 */
ordersRouter.get('/', (req, res) => {
    const orders = ordersService.getAllOrders();
    res.status(200).send(orders);
})


/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create a new order
 *     description: creates a new order
 */
ordersRouter.post('/', (req, res) => {
    try {
        res.status(200).send(ordersService.createOrder(req.body))
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/**
 * @openapi
 * /orders:
 *   put:
 *     summary: Edit an order
 *     description: Edit an order
 */
ordersRouter.put('/:orderID', (req, res) => {
    try {
        res.status(200).send(ordersService.updateOrder(req.body));
    } catch (error) {
        res.status(400).send(error.message);
    }
})

/**
 * @openapi
 * /orders:
 *   delete:
 *     summary: Delete an order
 *     description: Delete an order
 */
ordersRouter.delete('/:orderID', (req: any, res) => {
    try {
        res.status(200).send(ordersService.deleteOrder(req.params.orderID, req.order.id))
    } catch (error) {
        if (error instanceof UnknownOrderError) {
            res.status(404)
        } else {
            res.status(400)
        }
        res.send(error.message)
    }
})

export default ordersRouter;