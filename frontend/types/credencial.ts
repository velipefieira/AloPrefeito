import Cargo from "./cargo";

export default interface Credencial {
    id: number,
    email: string;
    senha: string;
    cargo: Cargo
}