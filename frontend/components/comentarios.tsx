import api from "@/services/api";
import { Comentario } from "@/types/comentario";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, TouchableOpacity, View, Text, ScrollView, StyleSheet, Alert, TextInput, TouchableWithoutFeedback } from "react-native";

interface ComentarioModalProps {
    visivel: boolean;
    setVisivel: (visible: boolean) => void;
    comentarios: Comentario[];
    relatoId: number;
    status: string
}

export default function Comentarios({ visivel, setVisivel, comentarios, relatoId, status }: ComentarioModalProps) {
    const [novoComentario, setNovoComentario] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [comentariosAtuais, setComentariosAtuais] = useState<any[]>([]);

    const handleDismiss = () => {
        setVisivel(false);
    };

    function calcularTempoDesde(data: string): string {
        const dataComentario = new Date(data);
        const agora = new Date();
        const diferenca = agora.getTime() - dataComentario.getTime();
    
        const segundos = Math.floor(diferenca / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);
    
        if (segundos < 60) return `${segundos} s`;
        if (minutos < 60) return `${minutos} min`;
        if (horas < 24) return `${horas} h`;
        return `${dias} d`;
    }

    useEffect(() => {
        setComentariosAtuais(comentarios);
    }, [comentarios]);

    const enviarComentario = async () => {
        setCarregando(true);

        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const decoded: any = jwtDecode(token);
                const novoComentarioObj = {
                    descricao: novoComentario,
                    usuario: {
                        id: decoded.id,
                        nome: decoded.nome
                    },
                    data: new Date().toISOString(),
                };

                await api.post(`/comentario/cadastrar/${relatoId}`, {
                    descricao: novoComentario,
                    usuarioId: decoded.id,
                });

                setComentariosAtuais([...comentariosAtuais, novoComentarioObj]);

                Alert.alert("Confirmado!", "Comentário enviado com sucesso!");
                setNovoComentario("");
            }
        } catch (error) {
            console.log("Erro ao enviar comentário:", error);
            Alert.alert("Erro", "Erro ao enviar o comentário. Tente novamente.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visivel}
            onRequestClose={() => setVisivel(false)}
        >
            <TouchableWithoutFeedback onPress={handleDismiss}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setVisivel(false)}>
                                <Text style={styles.closeText}>X</Text>
                            </TouchableOpacity>

                            <View style={styles.commentsContainer}>
                                {comentariosAtuais && (
                                    <View>
                                        {comentariosAtuais.map((comentario, index) => (
                                            <View key={index} style={styles.commentBox}>
                                                <Text style={styles.commentUser}>
                                                    {comentario.usuario.nome} - {calcularTempoDesde(comentario.data)}
                                                </Text>
                                                <Text style={styles.commentText}>{comentario.descricao}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>

                            {status == "Pendente" && (

                                <View style={styles.textContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Escreva seu comentário..."
                                        value={novoComentario}
                                        onChangeText={setNovoComentario}
                                        maxLength={190}
                                        multiline={true}
                                    />
                                    <Text> {novoComentario.length}/190 </Text>

                                    {novoComentario.trim() && (
                                        <View>
                                            <TouchableOpacity
                                                onPress={() => enviarComentario()}
                                                disabled={carregando}
                                                style={styles.submitButton}
                                            >
                                                <Text
                                                    style={styles.submitButtonText}
                                                >{carregando ? "..." : "Enviar"}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
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
        justifyContent: "flex-end",
        alignItems: 'flex-end',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        width: "100%",
    },
    closeButton: {
        alignSelf: "flex-end",
        padding: 10,
    },
    closeText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    commentsContainer: {
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
        marginTop: 5,
        fontSize: 16,
        color: "#555",
    },
    input: {
        borderColor: "#ccc",
        borderWidth: 1,
        width: '60%',
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
});
