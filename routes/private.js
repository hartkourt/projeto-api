import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Rota para criar um produto 
router.post('/criar-produto', async (req, res) => {
    const { name, description, amount, price, categories } = req.body;

    try {
        // Criação do produto
        const product = await prisma.product.create({
            data: {
                name,
                description,
                amount,
                price
            }
        });

        // Criação das associações entre o produto e as categorias na tabela de junção CategoryProduct
        const categoryProductAssociations = categories.map(categoryId => ({
            categoryId, 
            productId: product.id
        }));

        // Inserir as associações na tabela CategoryProduct
        await prisma.categoryProduct.createMany({
            data: categoryProductAssociations
        });

        res.status(201).json(product);  // Retorna o produto criado
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar produto' });
    }
});

// Rota para listar todos os produtos 
router.get('/listar-produtos', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: { categories: true }  // Inclui categorias associadas ao produto
        });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar produtos' });
    }
});

// Rota para listar um produto específico
router.get('/listar-produto/:id', async (req, res) => {
    const { id } = req.params;  // ID do produto que queremos buscar

    try {
        const product = await prisma.product.findUnique({
            where: { id },
            include: { categories: true }  // Inclui categorias associadas ao produto
        });

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produto' });
    }
});

// Rota para editar um produto 
router.put('/editar-produto/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, amount, price, categories } = req.body;

    try {
        // Verifica se as categorias fornecidas existem no banco de dados
        const existingCategories = await prisma.category.findMany({
            where: {
                id: { in: categories },  // Verifica se todas as categorias fornecidas existem
            }
        });

        // Se o número de categorias encontradas for menor do que o número de categorias fornecidas,
        // alguma categoria não foi encontrada.
        if (existingCategories.length !== categories.length) {
            return res.status(400).json({ error: 'Uma ou mais categorias não foram encontradas' });
        }

        // Atualizando o produto e conectando as novas categorias
        const product = await prisma.product.update({
            where: { id },  // Identifica o produto a ser atualizado
            data: {
                name,
                description,
                amount,
                price,
                categoryProducts: {
                    // Desvincula as categorias que já estão associadas a este produto
                    disconnect: { 
                        productId: id // Certifica-se de desconectar apenas as categorias associadas a esse produto
                    }
                },
                categories: {
                    // Conecta as novas categorias ao produto
                    connect: existingCategories.map((category) => ({
                        id: category.id  // Usa os IDs das categorias existentes
                    }))
                }
            }
        });

        res.status(200).json(product);  // Retorna o produto atualizado
    } catch (error) {
        console.error(error);
        if (error.code === 'P2014') {
            return res.status(400).json({ error: 'Erro de relação entre categorias e produtos.' });
        }
        res.status(500).json({ error: 'Erro ao editar produto' });
    }
});

// Rota para deletar um produto 
router.delete('/deletar-produto/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Desvincula as categorias associadas ao produto
        await prisma.categoryProduct.deleteMany({
            where: {
                productId: id,  // Identifica todos os registros na tabela de relação
            }
        });

        // Agora é seguro deletar o produto, pois as relações foram removidas
        const product = await prisma.product.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar produto' });
    }
});

// Rota para criar uma categoria 
router.post('/criar-categoria', async (req, res) => {
    const { name, description } = req.body;

    try {
        const category = await prisma.category.create({
            data: {
                name,
                description
            }
        });
        res.status(201).json(category);  // Retorna a categoria criada
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar categoria' });
    }
});

// Rota para listar todas as categorias
router.get('/listar-categorias', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { products: true }  // Inclui os produtos associados à categoria
        });
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar categorias' });
    }
});

// Rota para listar uma categoria específica 
router.get('/listar-categoria/:id', async (req, res) => {
    const { id } = req.params;  // ID da categoria que queremos buscar

    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: { products: true }  // Inclui os produtos associados à categoria
        });

        if (!category) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar categoria' });
    }
});

// Rota para editar uma categoria 
router.put('/editar-categoria/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                description
            }
        });
        res.status(200).json(category);  // Retorna a categoria atualizada
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao editar categoria' });
    }
});

// Rota para deletar uma categoria 
router.delete('/deletar-categoria/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Remover as associações na tabela de junção CategoryProduct
        await prisma.categoryProduct.deleteMany({
            where: {
                categoryId: id,  // Remove todas as associações dessa categoria
            }
        });

        // Agora podemos excluir a categoria
        const category = await prisma.category.delete({
            where: { id }
        });

        res.status(200).json({ message: 'Categoria deletada com sucesso' });
    } catch (error) {
        console.error(error);
        // Se o erro for específico do Prisma, podemos tratá-lo de maneira mais específica
        if (error.code === 'P2014') {
            return res.status(400).json({ error: 'Não é possível excluir a categoria, pois ela está associada a produtos.' });
        }
        res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
});

export default router;
