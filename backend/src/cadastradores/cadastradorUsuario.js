import bcrypt from'bcryptjs';
import prisma from '../config/db.js';

async function cadastrarUsuario(body) {
    try {
        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(body.senha, salt);

        const credencial = await prisma.credencial.create({
            data: {
                email: body.email,
                senha: hashedPassword,
                cargoId: body.cargoId
            }
        })

        const usuario = await prisma.usuario.create({
            data: {
                nome: body.nome,
                cpf: body.cpf,
                data_nascimento: new Date(body.data_nascimento),
                credencialId: credencial.id,
                cep: body.cep
            },
        });
    } catch (error) {
        console.error('Erro ao cadastrar usuario:', error);
        throw error;
    }
}

export default { cadastrarUsuario }