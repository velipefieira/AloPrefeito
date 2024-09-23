import prisma from '../config/db.js';

async function cadastrarRelato(params) {
    try {
        let descricao = params.descricao;
        let usuarioId = params.usuarioId;
        let categoriaId = params.categoriaId;
        let statusId = params.statusId;
        let data_inicio = new Date()

        const relato = await prisma.relato.create({
            data: {
                descricao,
                usuarioId,
                categoriaId,
                statusId,
                data_inicio,
            },
        });

        return relato;
    } catch (error) {
        console.error('Erro ao cadastrar relato:', error);
        throw error;
    }
}


export default { cadastrarRelato }