import api from "@/services/api";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, TouchableOpacity, View, Text, ScrollView, StyleSheet, Alert, TextInput, TouchableWithoutFeedback } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export interface FeedbackProps {
    visivel: boolean
    setVisivel: (visible: boolean) => void;
}

export default function FeedbackForms({ visivel, setVisivel }: FeedbackProps) {
    const [descricao, setDescricao] = useState("");
    const [avaliacao, setAvaliacao] = useState<number>(-1)
    const [carregando, setCarregando] = useState(false);
    const avaliacoes = [1, 2, 3, 4, 5]


    const handleDismiss = () => {
        setVisivel(false);
    };

    const estrela = (nota: number) => {
        return (
            <TouchableOpacity key={nota} onPress={() => setAvaliacao(nota)}>
                <MaterialCommunityIcons
                    name={nota <= avaliacao ? "star" : "star-outline"}
                    size={24}
                    color="#ffd700"
                />
            </TouchableOpacity>
        );
    };

    const enviarFeedback = async () => {
        setCarregando(true);

        if (avaliacao == -1 || descricao.length == 0) {
            Alert.alert("Atenção", "Você precisa avaliar entre 1 até 5 estrelas e escrever uma breve descrição sobre")
            setCarregando(false)
            return
        }
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const decoded: any = jwtDecode(token);


                await api.post(`/feedback/cadastrar/${decoded.id}`, {
                    avaliacao: avaliacao,
                    descricao: descricao,
                    usuarioId: decoded.id,
                });

                Alert.alert("Confirmado!", "Feedback enviado com sucesso!");
                setDescricao("");
                setAvaliacao(-1);
            }
        } catch (error) {
            console.log("Erro ao enviar feedback:", error);
            Alert.alert("Erro", "Erro ao enviar o feedback. Tente novamente.");
        } finally {
            setCarregando(false);
        }
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

                            <Text style={styles.commentText}>
                                De 1 a 5 estrelas, como você avalia sua experiência no aplicativo?
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.starsContainer}>
                                {avaliacoes.map((nota) => (
                                    <TouchableOpacity key={nota} onPress={() => setAvaliacao(nota)}>
                                        <MaterialCommunityIcons
                                            name={nota <= avaliacao ? "star" : "star-outline"}
                                            size={24}
                                            color="#ffd700"
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.commentText}>
                                Explique o porque:
                                <Text style={styles.required}>*</Text>
                            </Text>
                            <View style={styles.textContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Escreva seu feedback..."
                                    value={descricao}
                                    onChangeText={setDescricao}
                                    maxLength={190}
                                    multiline={true}
                                />
                                <Text> {descricao.length}/190 </Text>

                            </View>
                            <View>
                                <TouchableOpacity
                                    onPress={() => enviarFeedback()}
                                    disabled={carregando}
                                    style={styles.submitButton}
                                >
                                    <Text
                                        style={styles.submitButtonText}
                                    >{carregando ? "..." : "Enviar"}</Text>
                                </TouchableOpacity>
                            </View>
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
        width: "90%",
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 10,
    },
    closeText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    starsContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    commentBox: {
        marginBottom: 20,
    },
    commentUser: {
        fontWeight: "bold",
        fontSize: 20,
    },
    commentTitle: {
        fontWeight: "bold",
        fontSize: 14,
    },
    commentText: {
        marginTop: 25,
        fontSize: 20,
        color: "#555",
    },
    input: {
        borderColor: "#ccc",
        borderWidth: 1,
        width: '85%',
        borderRadius: 5,
        padding: 10,
        margin: 10,
        marginLeft: 0,
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#28a745',
        width: 'auto',
        margin: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#000',
        fontWeight: 'bold',
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    required: {
        color: 'red',
    }
});
