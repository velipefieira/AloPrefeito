import prisma from '../config/db.js';

async function buscarCategorias() {
    let categorias = prisma.categoria.findMany();
    return categorias
}

export default { buscarCategorias }