import Usuario from "./usuario";

export interface Feedback{
    id: number,
    descricao: string,
    avaliacao: number,
    usuario: Usuario
}