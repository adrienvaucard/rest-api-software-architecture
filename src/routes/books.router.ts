import { Router } from 'express';
import { UnknownBookError } from '../errors/unknown-book.error';
import { BooksService } from '../services/books.service';
const booksRouter = Router();

const booksService = new BooksService();


/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 */
 booksRouter.get('/', (req, res) => {
    const books = booksService.getAllBooks();
    res.status(200).send(books);
})


/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: creates a new user
 */
booksRouter.post('/', (req, res) => {
    try {
        res.status(200).send(booksService.createBook(req.body))
    } catch (error) {
        res.status(400).send(error.message)
    }
})

booksRouter.put('/:bookId', (req, res) => {
    try {
        res.status(200).send(booksService.updateBook(req.body));
    } catch (error) {
        res.status(400).send(error.message);
    }
})

booksRouter.delete('/:bookID', (req: any, res) => {
    try {
        res.status(200).send(booksService.deleteBook(req.params.bookID, req.book.id))
    } catch (error) {
        if (error instanceof UnknownBookError) {
            res.status(404)
        } else {
            res.status(400)
        }
        res.send(error.message)
    }
})

export default booksRouter;