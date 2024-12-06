import FeedbackComponente from "@/components/feedbackComponente";
import FeedbackForms from "@/components/feedbackforms";
import Navbar from "@/components/navbar";
import api from "@/services/api";
import { Relato } from "@/types/relatoProps";
import React, { useEffect, useState } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Perfil({ handleLogout, userDetails }: any) {
    const [relatosPendentes, setRelatosPendentes] = useState<number>(0)
    const [relatosResolvidos, setRelatosResolvidos] = useState<number>(0)
    const [visivel, setVisivel] = useState<boolean>(false)

    const fetchRelatos = async () => {
        try {
            if (userDetails !== null) {
                if (userDetails.cargo == "Administrador") {
                    var response = await api.get("/relato")
                } else {
                    response = await api.get(`/relato/usuario/${userDetails.id}`)
                }
                const relatos = response.data
                let pendentes = 0;
                let resolvidos = 0;
    
                relatos.forEach((relato: Relato) => {
                    if (relato.status.nome === "Pendente") {
                        pendentes++;
                    } else {
                        resolvidos++;
                    }
                });
    
                setRelatosPendentes(pendentes);
                setRelatosResolvidos(resolvidos);
            }
        } catch (error) {
            console.log
                (`Erro ao buscar relatos ` + error)
        }
    }

    useEffect(() => {
        fetchRelatos()
    }, [])

    return (
        <>
            <Navbar />
            <View style={{ flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                <Text style={style.tituloText}> Olá <Text style={style.nomeText}>{userDetails.nome}</Text>!</Text>

                <View>
                    <Text style={style.relatosText}> Relatos Pendentes: </Text>
                    <Text style={style.relatosNumber}> {relatosPendentes} </Text>
                    <Text style={style.relatosText}> Relatos Resolvidos: </Text>
                    <Text style={style.relatosNumber}> {relatosResolvidos} </Text>
                </View>

                {userDetails.cargo == "Administrador" ? (
                    <View>
                        <TouchableOpacity onPress={() => { setVisivel(!visivel) }}
                            style={style.feedbackButton}>
                            <Text style={style.relatosText}>
                                Ver feedbacks
                            </Text>
                        </TouchableOpacity>
                        {visivel && (
                            <View>
                                <FeedbackComponente
                                    visivel={visivel}
                                    setVisivel={setVisivel}
                                />
                            </View>
                        )}
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity onPress={() => { setVisivel(!visivel) }}
                            style={style.feedbackButton}>
                            <Text style={style.relatosText}>
                                Enviar feedback
                            </Text>
                        </TouchableOpacity>
                        {visivel && (
                            <View>
                                <FeedbackForms
                                    visivel={visivel}
                                    setVisivel={setVisivel}
                                />
                            </View>
                        )}
                    </View>
                )}

                <TouchableOpacity style={style.exitButton} onPress={handleLogout}>
                    <Text style={style.exitText}> Sair </Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const style = StyleSheet.create({
    tituloText: {
        fontSize: 24,
        textAlign: 'center'
    },
    nomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    relatosText: {
        fontSize: 24,
        textAlign: 'center'
    },
    relatosNumber: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    exitButton: {
        backgroundColor: '#F94449',
        padding: 10,
        width: '60%',
        borderRadius: 8,
        alignItems: 'center',
    },
    exitText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    feedbackButton: {
        backgroundColor: "#D2E4EE",
        padding: 10,
        width: '50%',
        borderRadius: 10,
        justifyContent: 'center'
      },
})