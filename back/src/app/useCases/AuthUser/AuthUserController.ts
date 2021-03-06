import { Request, Response } from 'express'
import { container } from 'tsyringe';
import { AppError } from '../../errors/AppError';
import { AuthUserUseCase } from './AuthUserUseCase'

export class AuthUserController {


    async handle(request: Request, response: Response): Promise<Response>{
        const { email, password } = request.body;

        const authUserUseCase = container.resolve(AuthUserUseCase)
        const result = await authUserUseCase.execute({ email, password }) 

        if(result instanceof AppError){
            return response.status(401).json(result)
        }
        
        return response.status(200).json(result)
    }

    index(req:Request, res:Response){
        res.status(200).json({
            userId: req.userId
        });
    }
}