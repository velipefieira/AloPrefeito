import { Categoria } from "./categoria"
import { Comentario } from "./comentario"
import { Status } from "./status"

export interface RelatoProps {
    relatos: Relato[]
}

export interface Relato {
    id: number,
    descricao: string,
    latitude?: string,
    longitude?: string,
    data_inicio: Date,
    data_final?: Date,
    imagem: any,
    comentario?: Comentario[],
    endereco: string,
    usuarioId?: number,
    categoria: Categoria,
    status: Status
}