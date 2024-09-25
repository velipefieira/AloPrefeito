import { Relato } from "@/types/relatoProps";
import api from "./api";

class RelatoService {
    async get(): Promise<Relato[]> {
        const {data} = await api.get("/relato")
        return data;
    }
}

const relato = new RelatoService();
export default relato;
