import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

interface TOKEN_PAYLOAD {
    id: number,
    iat: number,
    exp: number
}

export default function authMiddleware(request: Request, response: Response, next_function: NextFunction){
    const { authorization } = request.headers

    //verificando se existe o módulo de autenticação no cabeçalho de requisição
    if(!authorization)
        return response.sendStatus(401)
    
    const token = authorization.replace('Bearer', '').trim()

    try{
        const data = jwt.verify(token, 'secret')
        const { id } = data as TOKEN_PAYLOAD 
        request.userId = id

        next_function()
    }catch{
        return response.sendStatus(401)
    }


}