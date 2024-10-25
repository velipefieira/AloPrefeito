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

async function verificarUsuario(body) {
    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { cpf: body.cpf },
          { credencial: { email: body.email } }
        ]
      },
      include: {
        credencial: true
      }
    });
  
    return !!usuario;
  }

export default { buscarUsuarios, buscarUsuariosPorId, verificarUsuario }