import express from 'express'
import publicRoutes from './routes/public.js'
import privateRoutes from './routes/private.js'

import auth from './middlewares/auth.js'

const app = express()
app.use(express.json())

// Rotas públicas (não precisam de autenticação)
app.use('/public', publicRoutes)  // Sem middleware de autenticação

// Rotas privadas (precisam de autenticação)
app.use('/private', auth, privateRoutes)  // Apenas as rotas privadas exigem autenticação

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})
