import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, RefreshControl, ActivityIndicator } from "react-native";
import RelatoComponente from "../components/relato";
import { Relato } from "@/types/relatoProps";
import api from "@/services/api";
import Navbar from "@/components/navbar";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import React from "react";

export default function Home({ userDetails }: any) {
  const [relatos, setRelatos] = useState<Relato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRelatos = async () => {
    try {
      if (userDetails !== null) {
        if (userDetails.cargo == "Administrador") {
          var response = await api.get("/relato")
        } else {
          response = await api.get(`/relato/usuario/${userDetails.id}`)
        }
        setRelatos(response.data)
        setLoading(false)
      }
    } catch (error) {
      console.log
        (`Erro ao buscar relatos ` + error)
    }
  }

  useEffect( () => {
    fetchRelatos()
  }, [])



  const onRefresh = async () => {
    setLoading(true);
    try {
      await fetchRelatos()
    } catch (error) {
      setError(`Erro ao buscar relatos: ${error}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />
      {loading === true ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text> Carregando ... </Text>
        </ScrollView>
      ) : (
        <ScrollView style={style.container}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }>
          {relatos.length > 0 && isRefreshing == false ? (
            <View>
              {relatos.map((rel, index) => (
                <View key={index}>
                  <Text>  </Text>
                  <RelatoComponente key={index} {...rel} />
                </View>
              ))}
            </View>
          ) : (
            <View>
              {isRefreshing ? (
                <View>
                </View>
              ) : (
                <View>
                  <Text> Você ainda não possui nenhum relato. </Text>
                </View >
              )}
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
}


const style = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
    display: 'flex'
  },
  relato: {
    display: 'flex',
    margin: 16,
    padding: 20
  },
  title: {
    margin: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold'
  }
})