import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

//Cadastro de usuário

router.post('/cadastro', async (req, res) => {
    try {
    const user = req.body

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)
    
    await prisma.user.create({
        data: {
            name: user.name,
            username: user.username,
            password: hashPassword,
        }
    })
    res.status(201).json(user)
} catch (err) {
    res.status(500).json({message: 'Erro no servidor, tente novamente!'})
}
})

//login

router.post('/login', async(req, res) => {
    try{
    const userInfo = req.body

    //Busca o usuário no BD

    const user = await prisma.user.findUnique({where:{username: userInfo.username}})

    // Verifica se o usuário existe no BD

    if(!user){
        return res.status(404).json({message:"Usuário não encontrado"})
    }

    // Compara a senha que o usuário digitou e a que existe no BD

    const isMatch = await bcrypt.compare(userInfo.password, user.password)

    if(!isMatch){
        return res.status(400).json({message: 'Senha inválida'})
    }

    //Gerar token JWT

    const token = jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '1h'})

    res.status(200).json(token)

    } catch (err) {
        res.status(500).json({message: 'Erro no servidor, tente novamente!'})
    }
})

export default router