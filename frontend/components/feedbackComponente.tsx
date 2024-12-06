import { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback, Modal, TouchableOpacity } from "react-native";
import api from "@/services/api";
import Navbar from "@/components/navbar";
import React from "react";
import { Feedback } from "@/types/feedback";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { FeedbackProps } from "./feedbackforms";

export default function FeedbackComponente({ visivel, setVisivel }: FeedbackProps) {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const avaliacoes = [1, 2, 3, 4, 5]
    const [avaliacaoMedia, setAvaliacaoMedia] = useState<number>(0)

    const fetchFeedbacks = async () => {
        try {
            const response = await api.get("/feedback");
            const feedbacksData = response.data;
    
            setFeedbacks(feedbacksData);
    
            if (feedbacksData.length > 0) {
                const somaAvaliacoes = feedbacksData.reduce((soma: number, feedback:Feedback) => soma + feedback.avaliacao, 0);
                setAvaliacaoMedia(somaAvaliacoes / feedbacksData.length);
            } else {
                setAvaliacaoMedia(0);
            }
        } catch (error) {
            console.error(`Erro ao buscar feedbacks: ${error}`);
        }
    };
    

    useEffect(() => {
        fetchFeedbacks()
    }, [])

    const handleDismiss = () => {
        setVisivel(false);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visivel}
            onRequestClose={handleDismiss}
        >
            <TouchableWithoutFeedback onPress={handleDismiss}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
                                <Text style={styles.closeText}>X</Text>
                            </TouchableOpacity>
                            {feedbacks.length > 0 ? (
                                <View>
                                    <Text style={styles.commentText}>
                                        Avaliação média: {avaliacaoMedia}
                                        <MaterialCommunityIcons
                                            name={"star"}
                                            size={24}
                                            color="#ffd700"
                                        />
                                    </Text>
                                    {feedbacks.map((feedback, index) => (
                                        <View key={index} style={styles.container}>
                                            <Text style={styles.commentTitle}> {feedback.usuario.nome} </Text>
                                            <View style={styles.starsContainer}>
                                                {avaliacoes.map((nota, index) => (
                                                    <MaterialCommunityIcons
                                                        name={nota <= feedback.avaliacao ? "star" : "star-outline"}
                                                        key={index}
                                                        size={24}
                                                        color="#ffd700"
                                                    />
                                                ))}
                                            </View>
                                            <Text style={styles.commentText}>{feedback.descricao} </Text>
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <View>
                                    <Text> Você ainda não possui nenhum feedback. </Text>
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback >
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
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        width: "95%",
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 10,
    },
    closeText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    container: {
        marginTop: 15,
        backgroundColor: "#E7F4FB",
        padding: "1%",
        borderRadius: 15,
        display: 'flex',
        flexDirection: "column"
    },
    feedback: {
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
    },
    starsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 20,
    },
    commentTitle: {
        marginTop: 15,
        fontSize: 20,
        fontWeight: "bold",
        color: "#555",
    },
    commentText: {
        marginTop: 15,
        fontSize: 20,
        color: "#555",
    }
})