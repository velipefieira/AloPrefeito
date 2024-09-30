import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, RefreshControl } from "react-native";
import RelatoComponente from "../components/relato";
import { Relato } from "@/types/relatoProps";
import api from "@/services/api";
import Navbar from "@/components/navbar";

export default function Home() {
  const [relatos, setRelatos] = useState<Relato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);


  useEffect(() => {
    const fetchRelatos = async () => {
      try {
        const response = await api.get("/relato")

        setRelatos(response.data)
        setLoading(false)
      } catch (error) {
        console.log
          (`Erro ao buscar relatos ` + error)

      }
    }
    fetchRelatos()
  }, [])


  const onRefresh = async () => {
    setIsRefreshing(true);

    try {
      const response = await api.get("/relato");
      setRelatos(response.data);
    } catch (error) {
      setError(`Erro ao buscar relatos: ${error}`);
    } finally {
      setIsRefreshing(false);
    }
  };


  return (
    <>
      <Navbar />
      {loading === true ? (
        <View>
          <Text> Carregando ... </Text>
        </View>
      ) : (
        <ScrollView style={style.container}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }>
          {relatos.length > 0 && isRefreshing == false ? (
            <>
              {relatos.map((rel, index) => (
                <View key={index}>
                  <Text>  </Text>
                  <RelatoComponente key={index} {...rel} />
                </View>
              ))}
            </>
          ) : (
            <>
              {isRefreshing ? (
                <>
                </>
              ) : (
                <View>
                  <Text> Não foram encontrados relatos. </Text>
                </View >
              )}
            </>
          )}
        </ScrollView >
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