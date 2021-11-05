import { UnknownBookError } from '../errors/unknown-book.error'
import { BookDAO } from '../dao/books.dao';
import { BookModel } from '../models/book.model';

const uuid = require('uuid');

export class BooksService {
    private bookDAO: BookDAO = new BookDAO()

    public getAllBooks(): BookModel[] {
        return this.bookDAO.list()
    }

    public getBookByID(id: string) {
        return this.bookDAO.findById(id);
    }

    public getBookByISBN(isbn: string) {
        return this.bookDAO.findByISBN(isbn);
    }

    public getBooksByTitle(isbn: string) {
        return this.bookDAO.findByTitle(isbn);
    }

    public getBooksByAuthor(isbn: string) {
        return this.bookDAO.findByAuthor(isbn);
    }

    public getBooksByCategory(category: string) {
        return this.bookDAO.findByCategory(category);
    }

    public createBook(book: BookModel) {
        if (!this.checkBookToCreateIsValid(book)) {
            throw new Error('invalid book');
        }

        const bookToCreate = {
            ...book,
            id: uuid.v4()
        }
        return this.bookDAO.create(bookToCreate);
    }

    public deleteBook(bookID: string, currentBookID: string) {
        if (bookID === currentBookID) {
            throw new Error('book cannot remove himself !')
        }
        const book = this.bookDAO.getByID(bookID);
        if (!book) {
            throw new UnknownBookError('unknown book')
        }
        return this.bookDAO.delete(bookID);
    }

    public updateBook(book: BookModel): BookModel {
        const existingBook = this.bookDAO.getByID(book.id);
        if (!existingBook) {
            throw new UnknownBookError('unknown book')
        }
        const bookToUpdate = {
            ...existingBook,
            ...book
        }

        return this.bookDAO.update(bookToUpdate)
    }

    private checkBookToCreateIsValid(book: BookModel) {
        return book && book.isbn && book.title && book.subtitle && book.author
    }
}