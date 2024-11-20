import prisma from '../config/db.js';

async function atualizarRelato(id) {
    try {
      let relato = await prisma.relato.findFirst({
        where: {
          id
        }
      })
      relato.statusId = 2
      let data_final = new Date()
      relato.data_final = data_final
      const relatoAtualizado = await prisma.relato.update({
        where: { id },
        data: relato,
      });
  
      return relatoAtualizado;
    } catch (error) {
      throw error;
    }
  }

export default { atualizarRelato }