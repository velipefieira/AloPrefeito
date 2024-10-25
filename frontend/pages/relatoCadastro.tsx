import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import api from '@/services/api';
import Mapa from '@/components/mapa';

const RelatoCadastro = ({ userDetails }: any) => {
    const [descricao, setDescricao] = useState('');
    const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('0');
    const [imagem, setImagem] = useState<string | null>(null);
    const [enviando, setEnviando] = useState<boolean>(false);
    const [localizacao, setLocalizacao] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [endereco, setEndereco] = useState<string>('')

    const categorias = [
        { value: '1', label: 'Infraestrutura' },
        { value: '2', label: 'Segurança' },
        { value: '3', label: 'Ambiente' },
        { value: '4', label: 'Serviços Públicos' },
        { value: '5', label: 'Outros' },
    ];

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImagem(result.assets[0].uri);
        }
    };

    const limparFormulario = () => {
        setDescricao('');
        setOpcaoSelecionada('0');
        setImagem(null);
    };

    const handleDescricaoChange = (text: string) => {
        if (text.length <= 191) {
            setDescricao(text);
        }
    };

    const enviarFormulario = async () => {
        if (descricao === '' || opcaoSelecionada === '0') {
            Alert.alert('Atenção!','Você precisa fornecer uma categoria e uma breve descrição do relato');
            return;
        }

        if (!enviando) {
            setEnviando(true);
            const formData = new FormData();
            formData.append('descricao', descricao);
            formData.append('categoriaId', opcaoSelecionada);
            formData.append('usuarioId', userDetails.id);
            formData.append('endereco', endereco)

            if (imagem) {
                formData.append('imagem', {
                    uri: imagem,
                    type: 'image/jpeg',
                    name: 'imagem.jpg',
                } as any);
            }

            formData.append('latitude', localizacao ? localizacao.latitude.toString(): '0')
            formData.append('longitude', localizacao ? localizacao.longitude.toString(): '0')

            try {
                const response = await api.post('/relato/cadastrar', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                console.log(response.data);
                Alert.alert('Confirmado!','Relato enviado com sucesso!');
                limparFormulario();
            } catch (error: any) {
                console.error('Erro ao enviar o formulário:', error.response ? error.response.data : error.message);
            } finally {
                setEnviando(false);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Text style={styles.label}>Categoria do relato <Text style={styles.required}>*</Text></Text>
            <RNPickerSelect
                onValueChange={(value) => setOpcaoSelecionada(value)}
                items={categorias}
                style={pickerSelectStyles}
                placeholder={{ label: 'Selecione uma opção', value: '0' }}
            />

            <Text style={styles.label}>Descrição <Text style={styles.required}>*</Text></Text>
            <TextInput
                style={styles.input}
                value={descricao}
                onChangeText={handleDescricaoChange}
                placeholder="Descreva o relato..."
                numberOfLines={5}
            />

            <Text style={styles.label}>Forneça a localização do relato</Text>
            <View style={styles.mapPlaceholder}>
                <Mapa 
                    localizacao={localizacao} setLocalizacao={setLocalizacao} 
                    endereco={endereco} setEndereco={setEndereco}
                />
            </View>

            <Text style={styles.label}>Deseja anexar uma imagem?</Text>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                <Text style={styles.imageButtonText}>Anexar imagem</Text>
            </TouchableOpacity>

            {imagem && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imagem }} style={styles.previewImage} />
                </View>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={enviarFormulario}>
                <Text style={styles.submitButtonText}>Enviar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 20,
        marginBottom: 5,
        fontWeight: '500',
    },
    required: {
        color: 'red'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    mapPlaceholder: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 15,
    },
    imageButton: {
        backgroundColor: '#f9f9f9',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    imageButtonText: {
        color: '#000',
        fontSize: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    previewImage: {
        width: 300,
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',

    },
    submitButton: {
        marginTop: 10,
        backgroundColor: '#28A745',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        color: 'black',
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    inputAndroid: {
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        color: 'black',
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
};

export default RelatoCadastro;
