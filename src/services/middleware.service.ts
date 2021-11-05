const jwt = require('jsonwebtoken')

export class JWTService {
    public verify(req: any, res: any, next: any) {
        const accessToken = req.headers.authorization.substring(7, req.headers.authorization.length);

        if (!accessToken){
            return res.status(403).send("Insufficient privileges")
        }

        let payload
        try{
            payload = jwt.verify(accessToken, process.env.TOKEN_KEY)

            if (payload.roles.includes('administrator')) {
                next()
            } else {
                return res.status(401).send("Insufficient privileges")
            }
            next()
        }
        catch(e){
            console.log(e)
            return res.status(401).send("Insufficient privileges")
        }
    }
}
