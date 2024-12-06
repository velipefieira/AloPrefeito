import prisma from '../config/db.js';

async function buscarFeedbacks() {
    let feedbacks = prisma.feedback.findMany({
        include: {
            usuario: true,
        }
    });
    return feedbacks
}

async function buscarFeedbacksPorId(id) {
    let feedbacks = prisma.feedback.findMany({
        where: {
            id: id
        },
        include: {
            usuario: true,
        }
    });
    return feedbacks
}

async function buscarFeedbacksPorUsuario(usuarioId) {
    let feedbacks = prisma.feedback.findMany({
        where: {
            usuarioId: usuarioId
        }
    });
    return feedbacks
}

export default { buscarFeedbacks, buscarFeedbacksPorId, buscarFeedbacksPorUsuario }