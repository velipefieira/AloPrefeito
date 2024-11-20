import Usuario from "./usuario";

export interface Comentario{
    id: number,
    descricao: string,
    data: Date,
    usuario: Usuario,
    relatoId: number
}