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

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    const fetchRelatos = async () => {
      try {
        const response = await api.get("/relato")
        console.log('veio isso do back' + response.data);
        
        setRelatos(response.data)
      } catch (error) {
        setError(`Erro ao buscar relatos` + error)
      }
      setLoading(false)
    }
      fetchRelatos()
      setIsRefreshing(false);
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
          {relatos ? (
            <>
              {relatos.map((rel, index) => (
                <View key={index}>
                  <Text>  </Text>
                  <RelatoComponente key={index} {...rel} />
                </View>
              ))}
            </>
          ) : (
            <View>
              <Text> Não foram encontrados relatos. </Text>
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