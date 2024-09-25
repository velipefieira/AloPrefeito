import { Relato } from "@/types/relatoProps";
import { View, StyleSheet, Text, Image } from "react-native";
import { useEffect, useState } from "react";

export default function RelatoComponente(props: Relato) {
    const [image, setImage] = useState<string | null>(null);
    
    const status = props.status.nome;
    const categoria = props.categoria.nome;
    const descricao = props.descricao;
    const data_inicial = new Date(props.data_inicio);
    const data_final = props.data_final;
    const imagem = props.imagem;

    return (
        <View style={style.relato}>
            <View style={style.relatoContainer}>
                <Text style={style.categoriaText}> {categoria} </Text>
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
                <Text> </Text>
                <Text style={style.dataText}> 
                    {data_inicial.getDate()}/{data_inicial.getMonth() + 1}/{data_inicial.getFullYear()} - 
                    {data_final ? (() => {
                        const dateObject = new Date(data_final);
                        return `${dateObject.getDate()}/${dateObject.getMonth() + 1}/${dateObject.getFullYear()}`;
                    })() : ""}
                </Text>
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
        borderRadius: 20,
        padding: 5,
        margin: 10
    },
    imageContainer: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center"
    },
    previewImage: {
        width: 350,
        height: 200,
        marginTop: 10,
        borderRadius: 20,
        resizeMode: 'contain',
    },
    categoriaText: {
        fontSize: 24,
        fontWeight: "bold"
    },
    descricaoText: {
        fontSize: 28,
        width: "90%",
        marginLeft: 10
    },
    dataText: {
        fontSize: 24,
        marginLeft: 10,
        fontWeight: 'bold'
    },
    relatoContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        fontSize: 30,
        padding: 10
    },
    pendente: {
        backgroundColor: "#FFA500",
        borderRadius: 20,
        fontSize: 24,
        padding: 10,
        fontWeight: "bold"
    },
    resolvido: {
        backgroundColor: "#28A745",
        borderRadius: 20,
        fontSize: 24,
        padding: 10,
        fontWeight: "bold"
    }
});
