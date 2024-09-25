import { Categoria } from "./categoria"
import { Comentario } from "./comentario"
import { Status } from "./status"

export interface RelatoProps {
    relatos: Relato[]
}

export interface Relato {
    id: number,
    descricao: string,
    latitude?: number,
    longitude?: number,
    data_inicio: Date,
    data_final?: Date,
    imagem: any,
    comentario?: Comentario[],
    usuarioId?: number,
    categoria: Categoria,
    status: Status
}