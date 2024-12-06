import prisma from "../config/db.js";

async function cadastrarFeedback(usuarioId, body) {
    try {
        let descricao = body.descricao
        let avaliacao = parseInt(body.avaliacao)
        const novoFeedback = await prisma.feedback.create({
            data: {
                descricao,
                avaliacao,
                usuario: { connect: { id: usuarioId } }
            },
        });

        return novoFeedback;
    } catch (error) {
        throw error;
    }
}

export default { cadastrarFeedback }