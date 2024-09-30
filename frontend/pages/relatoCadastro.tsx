import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import api from '@/services/api';

const RelatoCadastro = () => {
    const [descricao, setDescricao] = useState('');
    const [opcaoSelecionada, setOpcaoSelecionada] = useState<string>('0');
    const [imagem, setImagem] = useState<string | null>(null);
    const [enviando, setEnviando] = useState<boolean>(false);

    const [categorias, setCategorias] = useState([
        { value: '1', label: "Infraestrutura" },
        { value: '2', label: "Segurança" },
        { value: '3', label: "Ambiente" },
        { value: '4', label: "Serviços Públicos" },
        { value: '5', label: "Outros" }])

    // Função para abrir a galeria e selecionar a imagem
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

    const limparFormulario = async () => {
        setDescricao('')
        setOpcaoSelecionada('0')
        setImagem(null)
    }

    // const getBlobFromUri = async (uri: string | URL | Request) => {
    //     const response = await fetch(uri);
    //     const blob = await response.blob();
    //     return blob;
    // };

    const enviarFormulario = async () => {
        if (descricao === "" || opcaoSelecionada === '0') {
            alert("Você precisa fornecer uma categoria e uma breve descrição do relato");
        } else if ( enviando !== true ){
            setEnviando(true)
            const formData = new FormData();
            formData.append('descricao', descricao);
            formData.append('categoriaId', opcaoSelecionada);
    
            if (imagem) {
                formData.append('imagem', {
                    uri: imagem,
                    type: 'image/jpeg',
                    name: 'imagem.jpg',
                } as any);
            }
            
            try {
                let response = await api.post('/relato/cadastrar', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(response.data);
                alert("Relato enviado com sucesso!")
                limparFormulario();                
            } catch (error:any) {
                console.error('Erro ao enviar o formulário:', error.response ? error.response.data : error.message);
            }
            setEnviando(false)
        }
    };
    

    return (
        <View style={styles.container}>

            <Text style={styles.label}>Categoria do relato:</Text>
            <RNPickerSelect
                onValueChange={(value) => setOpcaoSelecionada(value)}
                items={categorias}
                style={pickerSelectStyles}
                placeholder={{ label: 'Selecione uma opção' }}
            />

            <Text style={styles.label}>Descrição do relato:</Text>
            <TextInput
                style={styles.input}
                value={descricao}
                onChangeText={setDescricao}
                placeholder='Descreva o relato'
            />

            {/* Aqui ficará o campo para enviar a geolocalização! */}

            <Text style={styles.label}>Deseja anexar uma imagem?</Text>
            <Button title="Anexar Imagem" onPress={pickImage} />
            {imagem && (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: imagem }} style={styles.previewImage} />
                </View>
            )}

            <Text> </Text>

            <Button title="Enviar" onPress={enviarFormulario} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        marginBottom: 20,
    },
    imageButton: {
        color: "#D2E4EE",
        width: "50%"
    },
    imagePicker: {
        backgroundColor: '#ccc',
        padding: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    imagePickerText: {
        color: '#000',
    },
    imageContainer: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center"
    },
    previewImage: {
        width: 300,
        height: 200,
        marginTop: 10,
        resizeMode: 'contain',
    }
});

const pickerSelectStyles = {
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
        marginBottom: 20,
    },
};

export default RelatoCadastro;