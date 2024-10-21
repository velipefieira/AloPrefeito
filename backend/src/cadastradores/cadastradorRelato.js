import prisma from '../config/db.js';

async function cadastrarRelato(params, imagem) {
    try {
        let descricao = params.descricao;
        let usuarioId = parseInt(params.usuarioId);
        let categoriaId = parseInt(params.categoriaId);

        if(params.latitude !== '0' && params.latitude !== null){
            var latitude = parseFloat(params.latitude)
        }

        if(params.longitude !== '0' && params.longitude !== null){
            var longitude = parseFloat(params.longitude)
        }

        let endereco = params.endereco

        let statusId = 1
        let data_inicio = new Date()

        const relato = await prisma.relato.create({
            data: {
                descricao,
                usuarioId,
                categoriaId,
                latitude,
                longitude,
                endereco,
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