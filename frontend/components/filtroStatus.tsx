import relato from "@/services/relato";
import { Relato } from "@/types/relatoProps";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";

type FiltroStatusProps = {
    statusSelecionados: string[];
    setStatusSelecionados: (status: string[]) => void;
    visivel: boolean;
    setVisivel: (visivel: boolean) => void;
    relatos: Relato[];
    setRelatosFiltrados: (relatos: Relato[]) => void;
};

export default function FiltroStatus({
    statusSelecionados,
    setStatusSelecionados,
    visivel,
    setVisivel,
    relatos,
    setRelatosFiltrados,
}: FiltroStatusProps) {
    const opcoes = ["Resolvido", "Pendente"];

    const toggleStatus = (status: string) => {
        if (statusSelecionados.includes(status)) {
            setStatusSelecionados(statusSelecionados.filter((s) => s !== status));
        } else {
            setStatusSelecionados([...statusSelecionados, status]);
        }
    };
    
    useEffect(() => {
        const filtrarRelatos = () => {
            const filtrados = relatos.filter((relato) =>
                statusSelecionados.length === 0 || statusSelecionados.includes(relato.status.nome)
            );
            setRelatosFiltrados(filtrados);
        };
    
        filtrarRelatos();
    }, [statusSelecionados, relatos]); 

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
                                <Text style={styles.title}>Selecione os status:</Text>
                                {opcoes.map((opcao) => (
                                    <TouchableOpacity
                                        key={opcao}
                                        style={styles.option}
                                        onPress={() => toggleStatus(opcao)}
                                    >
                                        <Text style={styles.optionText}>{opcao}</Text>
                                        <View style={styles.checkbox}>
                                            {statusSelecionados.includes(opcao) && (
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
        </Modal >
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
