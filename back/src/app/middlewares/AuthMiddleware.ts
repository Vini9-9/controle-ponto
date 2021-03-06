import { Request, Response, NextFunction } from 'express';
import jwt = require("jsonwebtoken");
import SECRET_KEY from '../../../env';

interface TokenPayload {
    id:string;
    iat:number;
    exp:number;
}

export default function AuthMiddleware(
    req:Request, res:Response, next:NextFunction
){

    const { authorization } = req.headers;

    if(!authorization){
        return res.sendStatus(401);
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, SECRET_KEY);

        const { id } = data as TokenPayload;

        req.userId = id;
        return next();
    } catch {
        return res.sendStatus(401);
    }

}