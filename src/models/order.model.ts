import { BookModel } from "./book.model";

export interface OrderModel {
    id: string;
    user: string;
    items: BookModel[]
}
