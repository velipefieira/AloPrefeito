import prisma from '../config/db.js';

async function buscarUsuarios() {
    let usuarios = prisma.usuario.findMany({
        include: {
            credencial: true
        }
    });
    return usuarios
}

async function buscarUsuariosPorId(id) {
    let usuarios = prisma.usuario.findMany({
        where: {
            id: id
        },
        include: {
            credencial: true
        }
    });
    return usuarios
}

export default { buscarUsuarios, buscarUsuariosPorId }