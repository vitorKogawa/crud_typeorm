import { Request, Response } from 'express'
import { Equal, getRepository } from 'typeorm'
import { User } from '../database/entity/User'
import * as jwt from 'jsonwebtoken'

class UserController {
    //listando todos os usuário cadastrados na base de dados
    async index(request: Request, response: Response){
        const repository = getRepository(User)
        const all_user = await repository.find()

        //aqui poderia vir um filtro para identificar se existe algum registro na base de dados ou não ( estudando..... )
        return response.json(all_user)
    }

    //listando um usuário em específico da base de dados (pelo id)
    async show(request: Request, response: Response){
        const repository = getRepository(User)
        const { id } = request.params

        //verificando se este usuário(id) existe na base de dados
        const user = await repository.findOne( { where: { id: Equal(id) } } )
        if(!user)
            return response.json({ message: 'Este usuário não existe na base de dados.' })

        return response.json(user)
    }

    async store(request: Request, response: Response){
        let repository = getRepository(User)

        const {
            name,
            email,
            username,
            password
        } = request.body

       //verificando se o usuário existe na base de dados
       const userExists = await repository.findOne({
           where: [
               { email },
               { username }
           ]
       })

       if(userExists)
            return response.json({ message: 'Usuário já cadastrado na plataforma.' })
        
        const user = repository.create({
            name,
            email,
            username,
            password,
            idEnabled: true
        })

        await repository.save(user)

        return response.json(user)
    }

    //mostrando uma das maneiras de remover um registro da base de dados ( eu acredito que a melhor maneira seja apenas desabilitar / modificar o status do registro ao invés de remover ele completamente da base da dados )
    async delete(request: Request, response: Response){
        const repository = getRepository(User)
        const { id } = request.params

        //verificando se o id informado existe na base de dados
        const user = await repository.findOne({ where: { id: Equal(id) } })
        if(!user)
            return response.json({ message: 'Usuário não existe na base de dados.' })
        
        await repository.remove(user)

        return response.json({ message: 'Usuário removido com sucesso.' })
    }

    async update(request: Request, response: Response){
        const repository = getRepository(User)
        const {
            id,
            name,
            username,
            email,
            password
        } = request.body

        //verificando se o usuário existe na base de dados
        const userToUpdate = await repository.findOne({ where: { id: Equal(id) } })

        if(!userToUpdate)
            return response.json({ message: 'Este usuário não existe na base de dados.' })
        
        userToUpdate.name = name,
        userToUpdate.email = email,
        userToUpdate.username = username,
        userToUpdate.password = password

        await repository.save(userToUpdate)

        return response.json({ message: 'Dados atualizados com sucesso.' })
    }
}

export default new UserController()