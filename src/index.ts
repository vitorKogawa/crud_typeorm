import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./database/entity/User";
import * as express from 'express'
import router from './routes'


createConnection({
    type: 'mysql',
    username: 'root',
    password: '',
    database: 'basic_crud',
    port: 3306,
    entities: [
        User
    ],
    synchronize: true,
    logging: false
})
.then(response => {
    const server = express()
    server.use(express.json())
    server.use(router)
    const port = 3333

    server.listen(port, () => console.log('Servidor rodando na porta: ', port))
})
.catch(error => console.error(error))