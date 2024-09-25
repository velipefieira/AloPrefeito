import prisma from '../config/db.js';

async function cadastrarRelato(params, imagem) {
    try {
        let descricao = params.descricao;
        let usuarioId = params.usuarioId;
        let categoriaId = parseInt(params.categoriaId);
        let statusId = 1
        let data_inicio = new Date()

        const relato = await prisma.relato.create({
            data: {
                descricao,
                usuarioId,
                categoriaId,
                statusId,
                data_inicio,
                imagem
            },
        });

        return relato;
    } catch (error) {
        console.error('Erro ao cadastrar relato:', error);
        throw error;
    }
}


export default { cadastrarRelato }