import Credencial from "./credencial";

export default interface Usuario{
    id: number;
    nome: String;
    cpf: String;
    cep: String;
    data_nascimento: Date;
    credencial: Credencial
}