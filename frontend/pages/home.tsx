import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, RefreshControl, ActivityIndicator, TouchableOpacity } from "react-native";
import RelatoComponente from "../components/relato";
import { Relato } from "@/types/relatoProps";
import api from "@/services/api";
import Navbar from "@/components/navbar";
import FiltroStatus from "@/components/filtroStatus";
import FiltroCategoria from "@/components/filtroCategoria";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Home({ userDetails }: any) {
  const [relatos, setRelatos] = useState<Relato[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [filtroCategoriaVisivel, setFiltroCategoriaVisivel] = useState(false);
  const [statusSelecionados, setStatusSelecionados] = useState<string[]>(['Resolvido', 'Pendente']);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>(["Infraestrutura", "Segurança", "Ambiente", "Serviços Públicos"]);
  const [relatosFiltrados, setRelatosFiltrados] = useState<Relato[]>([]);

  const fetchRelatos = async () => {
    try {
      if (userDetails !== null) {
        const response = userDetails.cargo === "Administrador"
          ? await api.get("/relato")
          : await api.get(`/relato/usuario/${userDetails.id}`);

        setRelatos(response.data);
        setRelatosFiltrados(response.data);
        setStatusSelecionados(['Resolvido', 'Pendente'])
        setCategoriasSelecionadas(["Infraestrutura", "Segurança", "Ambiente", "Serviços Públicos", "Outros"])
        setLoading(false);
      }
    } catch (error) {
      console.log(`Erro ao buscar relatos: ${error}`);
    }
  };

  const onRefresh = async () => {
    setLoading(true);
    try {
      await fetchRelatos();
    } catch (error) {
      console.log(`Erro ao buscar relatos: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatos();
  }, []);

  useEffect(() => {
    const filtrarRelatos = () => {
      const filtrados = relatos.filter((relato) =>
        statusSelecionados.includes(relato.status.nome) &&
        (categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(relato.categoria.nome))
      );
      setRelatosFiltrados(filtrados);
    };

    filtrarRelatos();
  }, [statusSelecionados, categoriasSelecionadas, relatos]); // Dependência de status, categoria e relatos

  return (
    <>
      <Navbar />
      {loading ? (
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
          <View style={style.filterContainer}>
            <TouchableOpacity onPress={() => setFiltroVisivel(true)} style={style.filterButton}>
              <Text style={style.filterText}> Status <MaterialCommunityIcons name="arrow-down-drop-circle-outline" color={"black"} size={24} /> </Text>
            </TouchableOpacity>
            <FiltroStatus
              visivel={filtroVisivel}
              setVisivel={setFiltroVisivel}
              statusSelecionados={statusSelecionados}
              setStatusSelecionados={setStatusSelecionados}
              relatos={relatos}
              setRelatosFiltrados={setRelatosFiltrados}
            />
            <TouchableOpacity onPress={() => setFiltroCategoriaVisivel(true)} style={style.filterButton}>
              <Text style={style.filterText}> Categoria <MaterialCommunityIcons name="arrow-down-drop-circle-outline" color={"black"} size={24} /> </Text>
            </TouchableOpacity>
            <FiltroCategoria
              visivel={filtroCategoriaVisivel}
              setVisivel={setFiltroCategoriaVisivel}
              categoriasSelecionadas={categoriasSelecionadas}
              setCategoriasSelecionadas={setCategoriasSelecionadas}
              relatos={relatos}
              setRelatosFiltrados={setRelatosFiltrados}
            />
          </View>
          {relatosFiltrados.length > 0 ? (
            <View>
              {relatosFiltrados.map((rel, index) => (
                <View key={index}>
                  {statusSelecionados.includes(rel.status.nome) && categoriasSelecionadas.includes(rel.categoria.nome) &&(
                    <View key={index}>
                      <RelatoComponente relato={rel} userDetails={userDetails} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View>
              <Text> Você ainda não possui nenhum relato. </Text>
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
  filterContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: "row"
  },
  filterButton: {
    backgroundColor: "#D2E4EE",
    padding: 10,
    width: '45%',
    borderRadius: 10,
    justifyContent: 'center'
  },
  filterText: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center"
  }
});
