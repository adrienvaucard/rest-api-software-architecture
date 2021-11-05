import { Router } from 'express';
import { UnknownBookError } from '../errors/unknown-book.error';
import { BooksService } from '../services/books.service';
import { JWTService } from '../services/middleware.service';

const booksRouter = Router();

const booksService = new BooksService();
const jwtService = new JWTService()


/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve a list of books
 */
 booksRouter.get('/', (req, res) => {
    const books = booksService.getAllBooks();
    res.status(200).send(books);
})

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve a book by ID
 */
 booksRouter.get('/id/:bookID', (req, res) => {
    const book = booksService.getBookByID(req.params.bookID);
    res.status(200).send(book);
})

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve books by title
 */
 booksRouter.get('/title/:title', (req, res) => {
    const books = booksService.getBooksByTitle(req.params.title);
    res.status(200).send(books);
})

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve a book by ISBN
 */
 booksRouter.get('/isbn/:isbn', (req, res) => {
    const book = booksService.getBookByISBN(req.params.isbn);
    res.status(200).send(book);
})

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve books from author
 */
 booksRouter.get('/author/:authorID', (req, res) => {
    const books = booksService.getBooksByAuthor(req.params.authorID);
    res.status(200).send(books);
})

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Retrieve books from category
 */
 booksRouter.get('/category/:categoryID', (req, res) => {
    const books = booksService.getBooksByAuthor(req.params.categoryID);
    res.status(200).send(books);
})

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new book
 *     description: creates a new book
 */
booksRouter.post('/', jwtService.verify, (req, res) => {
    try {
        res.status(200).send(booksService.createBook(req.body))
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/**
 * @openapi
 * /users:
 *   put:
 *     summary: Edit a book
 *     description: Edit a book
 */
booksRouter.put('/:bookId', jwtService.verify, (req, res) => {
    try {
        res.status(200).send(booksService.updateBook(req.body));
    } catch (error) {
        res.status(400).send(error.message);
    }
})

/**
 * @openapi
 * /users:
 *   delete:
 *     summary: Delete a book
 *     description: Delete a book
 */
booksRouter.delete('/:bookID', jwtService.verify, (req: any, res) => {
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