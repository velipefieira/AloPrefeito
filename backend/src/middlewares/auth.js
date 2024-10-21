import prisma from "../config/db.js";
import bcrypt from'bcryptjs';
import jwt from "jsonwebtoken"

const JWT_SECRET = 'AloPrefeito';

async function login(email, senha){
    const credencial = await prisma.credencial.findUnique({
        where: { email },
        include: { usuario: true, cargo: true },
      });
  
      if (!credencial) {
        return {undefined, undefined}
      }
  
      const isMatch = await bcrypt.compare(senha, credencial.senha);
  
      if (!isMatch) {
        return {undefined, undefined}
      }
  
      const token = jwt.sign(
        {
          id: credencial.usuario.id,
          nome: credencial.usuario.nome,
          email: credencial.email,
          usuarioId: credencial.usuario ? credencial.usuario.id : null,
          cargo: credencial.cargo.nome,
        },
        JWT_SECRET
    );
    return {token, credencial}
}

export default { login }