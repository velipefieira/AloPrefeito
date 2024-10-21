import Navbar from "@/components/navbar";
import api from "@/services/api";
import React, { useEffect, useState } from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function Perfil({ handleLogout, userDetails }: any) {
    const [relatos, setRelatos] = useState<number>(0)

    const fetchRelatos = async () => {
        try {
          if (userDetails !== null) {
            if (userDetails.cargo == "Administrador") {
              var response = await api.get("/relato")
            } else {
              response = await api.get(`/relato/usuario/${userDetails.id}`)
            }
            const relatos = response.data
            setRelatos(relatos.length)          }
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
                    <Text style={style.relatosNumber}> {relatos} </Text>
                </View>

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
    }
})