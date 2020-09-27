import { Request, Response } from 'express'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { getRepository } from 'typeorm'
import { User } from '../database/entity/User'


class AuthController{
    async auth(request: Request, response: Response){
        const repository = getRepository(User)
        const { username, password } = request.body

        //verificando se o username existe na base de dados
        const user = await repository.findOne({ where: { username } })
        if(!user)
            return response.json({ message: 'Este usuário não está cadastrado na base de dados.' })
        
        //verificando se a senha digitada corresponde aquela salva no banco de dados
        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword)
            return response.json({ message: 'Senha incorreta.' })
        
        //gerando o token de acesso
        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1d' })

        //só para n enviar a senha encriptada para o front end
        delete user.password

        return response.json({
            user,
            token
        })
    }
}

export default new AuthController()