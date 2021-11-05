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

    public findById(id: string): BookModel {
        const index = this.getBookIndexByID(id);
        return this.databaseConnection.getData(`/books[${index}]`)
    }

    public findByISBN(isbn: string): BookModel {
        const index = this.getBookIndexByISBN(isbn);
        return this.databaseConnection.getData(`/books[${index}]`)
    }

    public findByTitle(title: string): BookModel[] {
        return this.getBooksByTitle(title);
    }

    public findByAuthor(author: string): BookModel[] {
        return this.getBooksByAuthor(author);
    }

    public findByCategory(category: string): BookModel[] {
        return this.getBooksByCategory(category);
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

    private getBookIndexByID(id: string): number {
        return this.databaseConnection.getIndex('/books', id, 'id');
    }

    private getBookIndexByISBN(isbn: string): number {
        return this.databaseConnection.getIndex('/books', isbn, 'isbn');
    }

    private getBooksByTitle(title: string): BookModel[] {
        return this.databaseConnection.filter('/books', (book) => book.title.toLowerCase().includes(title.toLowerCase()));
    }

    private getBooksByAuthor(author: string): BookModel[] {
        return this.databaseConnection.filter('/books', (book) => book.author.toLowerCase() === author.toLowerCase());
    }

    private getBooksByCategory(category: string): BookModel[] {
        return this.databaseConnection.filter('/books', (book) => book.category.toLowerCase() === category.toLowerCase());
    }
}