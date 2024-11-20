import prisma from '../config/db.js';

async function buscarcomentarioPorRelato(id) {
    let comentario = prisma.comentario.findMany({
        where: {
            relatoId: id
        },
        include: {
            usuario: true
        }
    });
    return comentario
}

export default { buscarcomentarioPorRelato }