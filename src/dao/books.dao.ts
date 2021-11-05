import { BookModel } from '../models/book.model'
import { DatabaseConnection } from './database-connection'
import { JsonDB } from 'node-json-db';

export class BookDAO {

    private databaseConnection: JsonDB

    constructor() {
        // initialize database connection
        this.databaseConnection = DatabaseConnection.getConnection();
    }

    public list(): BookModel[] {
        return this.databaseConnection.getData('/books');
    }

    public create(book: BookModel): BookModel {
        this.databaseConnection.push('/books[]', book);
        console.log(book)
        return book;
    }

    public delete(bookID: string): string {
        const index = this.getBookIndexByID(bookID);
        if (index > -1) {
            this.databaseConnection.delete(`/books[${index}]`)
            return bookID;
        }
    }

    public getByID(bookID: string): BookModel {
        const index = this.getBookIndexByID(bookID);
        if (index > -1) {
            return this.databaseConnection.getData(`/books[${index}]`)
        }
    }

    public update(book: BookModel): BookModel {
        const index = this.getBookIndexByID(book.id);
        if (index > -1) {
            this.databaseConnection.push(`/books[${index}]`, book, true)
            return book
        }
    }

    public getByISBN(isbn: string): BookModel {
        const index = this.databaseConnection.getIndex('/books', isbn, 'isbn');
        if (index > -1) {
            return this.databaseConnection.getObject(`/books[${index}]`)
        }
        return null;
    }

    private getBookIndexByID(bookID: string): number {
        return this.databaseConnection.getIndex('/books', bookID, 'id');
    }
}