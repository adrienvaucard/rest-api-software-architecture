import { Router } from 'express';
import { UnknownCommentError } from '../errors/unknown-comment.error';
import { CommentsService } from '../services/comments.service';
import { JWTService } from '../services/middleware.service';

const commentsRouter = Router();

const commentsService = new CommentsService();
const jwtService = new JWTService()


/**
 * @openapi
 * /comments:
 *   get:
 *     summary: Retrieve a list of comments
 */
commentsRouter.get('/', (req, res) => {
    const comments = commentsService.getAllComments();
    res.status(200).send(comments);
})


/**
 * @openapi
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     description: creates a new comment
 */
commentsRouter.post('/', (req, res) => {
    try {
        res.status(200).send(commentsService.createComment(req.body))
    } catch (error) {
        res.status(400).send(error.message)
    }
})

/**
 * @openapi
 * /comments:
 *   put:
 *     summary: Edit a comment
 *     description: Edit a comment
 */
commentsRouter.put('/:commentID', jwtService.verify, (req, res) => {
    try {
        res.status(200).send(commentsService.updateComment(req.body));
    } catch (error) {
        res.status(400).send(error.message);
    }
})

/**
 * @openapi
 * /comments:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment
 */
commentsRouter.delete('/:commentID', jwtService.verify, (req: any, res) => {
    try {
        res.status(200).send(commentsService.deleteComment(req.params.commentID, req.comment.id))
    } catch (error) {
        if (error instanceof UnknownCommentError) {
            res.status(404)
        } else {
            res.status(400)
        }
        res.send(error.message)
    }
})

export default commentsRouter;