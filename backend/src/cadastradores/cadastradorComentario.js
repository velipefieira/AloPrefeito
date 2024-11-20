import prisma from "../config/db.js";

async function cadastrarComentario(relatoId, body) {
    try {
        let data = new Date()
        let descricao = body.descricao
        let usuarioId = body.usuarioId
        const novoComentario = await prisma.comentario.create({
            data: {
                descricao,
                data,
                usuario: { connect: { id: usuarioId } },
                relato: { connect: { id: relatoId } },
            },
        });

        return novoComentario;
    } catch (error) {
        throw error;
    }
}

export default { cadastrarComentario }