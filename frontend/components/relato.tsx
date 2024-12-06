import { Relato } from "@/types/relatoProps";
import { View, StyleSheet, Text, Image, Alert, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import relato from "@/services/relato";
import { Categoria } from "@/types/categoria";
import api from "@/services/api";
import Comentarios from "./comentarios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface relatoComponente{
    relato: Relato,
    userDetails: any
}

export default function RelatoComponente({relato, userDetails}:relatoComponente) {
    const [status, setStatus] = useState<string>(relato.status.nome);
    const [categoria, setCategoria] = useState<Categoria>(relato.categoria);
    const [descricao, setDescricao] = useState<string>(relato.descricao);
    const [data_inicio, setDataInicio] = useState<Date>(new Date(relato.data_inicio));
    const [data_final, setDataFinal] = useState<Date | undefined>(relato.data_final);
    const [imagem] = useState(relato.imagem);
    const [endereco] = useState(relato.endereco);
    const [enviando, setEnviando] = useState<boolean>(false)
    const [visivel, setVisivel] = useState<boolean>(false)
    const [decoded, setDecoded] = useState(null)

    const confirmarAtualizacao = () => {
        Alert.alert(
            "Confirmação",
            "Tem certeza de que deseja marcar este relato como resolvido?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Confirmar",
                    onPress: atualizarRelato,
                },
            ]
        );
    };

    const atualizarRelato = async () => {
        if (!enviando) {
            setEnviando(true)
            try {
                const response = await api.put(`/relato/atualizar/${relato.id}`);
                console.log(response.data);
                if (response.status === 201) {
                    Alert.alert('Confirmado!', 'relato atualizado com sucesso!');
                    setStatus("Resolvido")
                    setDataFinal(new Date())
                } else {
                    Alert.alert("Ops", "Não foi possível marcar o relato como concluido, tente novamente mais tarde")
                }
            } catch (error: any) {
                Alert.alert('Atenção!', 'Erro ao atualizar relato. Tente novamente.');
            } finally {
                setEnviando(false);
            }
        }
    }

    return (
        <View style={style.relato}>
            <View style={style.relatoContainer}>
                <Text style={style.categoriaText}> {categoria.nome} </Text>
                <View>
                    {status === "Pendente" ? (
                        <Text style={style.pendente}> {status} </Text>
                    ) : (
                        <Text style={style.resolvido}> {status} </Text>
                    )}
                </View>
            </View>
            <View>
                <Text style={style.descricaoText}>{descricao} </Text>
            </View>
            <View>
                {imagem !== null && (
                    <View style={style.imageContainer}>
                        <Image source={{ uri: imagem }} style={style.previewImage} />
                    </View>
                )}
            </View>
            {endereco && (
                <View style={style.enderecoContainer}>
                    <View>
                        <Image source={require('../assets/images/pin.png')} style={style.pinImage} />
                    </View>
                    <View>
                        <Text style={style.enderecoText}>{endereco} </Text>
                    </View>
                </View>
            )}
            <View>
                <View style={style.descricaoContainer}>
                    <View style={style.comentariosDataContainer}>
                        <TouchableOpacity onPress={() => { setVisivel(!visivel) }}>
                            <Text style={style.comentarioText}>
                                Ver comentários
                            </Text>
                        </TouchableOpacity>
                        {visivel && (
                            <View>
                                <Comentarios
                                    visivel={visivel}
                                    setVisivel={setVisivel}
                                    comentarios={relato.comentarios}
                                    relatoId={relato.id}
                                    status={status}
                                />
                            </View>
                        )}
                        <Text style={style.dataText}>
                            {data_inicio.getDate()}/{data_inicio.getMonth() + 1}/{data_inicio.getFullYear()} - {data_final ? (() => {
                                const dateObject = new Date(data_final);
                                return`${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`;
                            })() : ""}
                        </Text>
                    </View>
                    {status == "Pendente" && userDetails.cargo == "Administrador" &&(
                        <View style={style.buttonContainer}>
                            <TouchableOpacity style={style.button} onPress={confirmarAtualizacao}>
                                <Text style={style.buttonText}>
                                    Marcar como Resolvido
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    relato: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#D2E4EE",
        width: "95%",
        borderRadius: 12,
        padding: 15,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    relatoContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    categoriaText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#004B87",
    },
    pendente: {
        backgroundColor: "#FFA500",
        borderRadius: 15,
        fontSize: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: "#FFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    resolvido: {
        backgroundColor: "#28A745",
        borderRadius: 15,
        fontSize: 20,
        paddingVertical: 5,
        paddingHorizontal: 10,
        color: "#FFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    descricaoText: {
        fontSize: 20,
        color: "#333",
        marginVertical: 5,
    },
    imageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    previewImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        resizeMode: "cover",
    },
    enderecoContainer: {
        display: "flex",
        width: '90%',
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    pinImage: {
        width: 40,
        height: 40,
        marginRight: 5,
    },
    enderecoText: {
        fontSize: 14,
        fontWeight: "bold",
    },
    descricaoContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
    },
    comentariosDataContainer: {
        display: "flex",
        flexDirection: "column",
    },
    comentarioText: {
        color: "#002E5D",
        fontSize: 16,
        fontWeight: "bold",
    },
    dataText: {
        fontSize: 14,
        color: "#666",
        fontWeight: "bold",
        marginTop: 5,
    },
    buttonContainer: {
        marginTop: 10,
        alignItems: "flex-end",
    },
    button: {
        backgroundColor: "#28A745",
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
    },
});
