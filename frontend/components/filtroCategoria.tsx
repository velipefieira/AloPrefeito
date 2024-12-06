import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";
import { Relato } from "@/types/relatoProps";

type FiltroCategoriaProps = {
    categoriasSelecionadas: string[];
    setCategoriasSelecionadas: (categorias: string[]) => void;
    visivel: boolean;
    setVisivel: (visivel: boolean) => void;
    relatos: Relato[];
    setRelatosFiltrados: (relatos: Relato[]) => void;
};

export default function FiltroCategoria({
    categoriasSelecionadas,
    setCategoriasSelecionadas,
    visivel,
    setVisivel,
    relatos,
    setRelatosFiltrados,
}: FiltroCategoriaProps) {
    const opcoes = ["Segurança", "Infraestrutura", "Ambiente", "Serviços Públicos", "Outros"]

    const toggleCategoria = (categoria: string) => {
        if (categoriasSelecionadas.includes(categoria)) {
            setCategoriasSelecionadas(categoriasSelecionadas.filter((s) => s !== categoria));
        } else {
            setCategoriasSelecionadas([...categoriasSelecionadas, categoria]);
        }
    };
    
    useEffect(() => {
        const filtrarRelatos = () => {
            const filtrados = relatos.filter((relato) =>
                categoriasSelecionadas.includes(relato.categoria.nome)
            );
            setRelatosFiltrados(filtrados);
        };
    
        filtrarRelatos();
    }, [categoriasSelecionadas, relatos]);

    const handleDismiss = () => {
        setVisivel(false);
    };

    return (
        <Modal
            visible={visivel}
            transparent
            animationType="slide"
            onRequestClose={() => handleDismiss()}
        >
            <TouchableWithoutFeedback onPress={() => handleDismiss()}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View>
                            <View style={styles.container}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => handleDismiss()}
                                >
                                    <Text style={styles.closeButtonText}>X</Text>
                                </TouchableOpacity>
                                <Text style={styles.title}>Selecione as categorias:</Text>
                                {opcoes.map((categoria) => (
                                    <TouchableOpacity
                                        key={categoria}
                                        style={styles.option}
                                        onPress={() => toggleCategoria(categoria)}
                                    >
                                        <Text style={styles.optionText}>{categoria}</Text>
                                        <View style={styles.checkbox}>
                                            {categoriasSelecionadas.includes(categoria) && (
                                                <Text style={styles.checked}> X </Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "95%",
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 10,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        marginTop: 10,
    },
    optionText: {
        fontSize: 18,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 4,
    },
    checked: {
        fontWeight: "bold",
    },
});
