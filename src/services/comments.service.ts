import { UnknownCommentError } from '../errors/unknown-comment.error'
import { CommentsDAO } from '../dao/comments.dao';
import { CommentModel } from '../models/comment.model';
import { existsSync } from 'fs';

const uuid = require('uuid');

export class CommentsService {
    private commentDAO: CommentsDAO = new CommentsDAO()

    public getAllComments(): CommentModel[] {
        return this.commentDAO.list()
    }

    public getCommentByID(id: string) {
        return this.commentDAO.findById(id);
    }

    public createComment(comment: CommentModel) {
        if (!this.checkCommentToCreateIsValid(comment)) {
            throw new Error('invalid comment');
        }

        const commentToCreate = {
            ...comment,
            id: uuid.v4()
        }
        return this.commentDAO.create(commentToCreate);
    }

    public deleteComment(commentID: string, currentCommentID: string) {
        if (commentID === currentCommentID) {
            throw new Error('comment cannot remove himself !')
        }
        const comment = this.commentDAO.getByID(commentID);
        if (!comment) {
            throw new UnknownCommentError('unknown comment')
        }
        return this.commentDAO.delete(commentID);
    }

    public updateComment(comment: CommentModel): CommentModel {
        const existingComment = this.commentDAO.getByID(comment.id);
        if (!existingComment) {
            throw new UnknownCommentError('unknown book')
        }
        const commentToUpdate = {
            ...existingComment,
            ...comment
        }

        return this.commentDAO.update(commentToUpdate)
    }

    private checkCommentToCreateIsValid(comment: CommentModel) {
        return comment && comment.user && comment.content
    }
}