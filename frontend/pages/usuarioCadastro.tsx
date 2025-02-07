import api from '@/services/api';
import React, { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Navbar from '@/components/navbar';
import Usuario from '@/types/usuario';

export default function UsuarioCadastro({ userDetails }: any) {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [cep, setCep] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senha2, setSenha2] = useState('');
    const [cargoId, setCargo] = useState<number>(2);
    const [enviando, setEnviando] = useState(false);
    const [usuarios, setUsuarios] = useState<Usuario[]>([])

    const cargos = [
        { value: 1, label: 'Administrador' },
        { value: 2, label: 'Cidadão' }
    ];

    const mascararCPF = (valor: any) => {
        return valor
            .replace(/\D/g, '')
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const mascararData = (valor: any) => {
        return valor
            .replace(/\D/g, '')
            .slice(0, 8)
            .replace(/(\d{2})(\d)/, '$1/$2')
            .replace(/(\d{2})(\d{1,4})$/, '$1/$2');
    };

    const mascararCEP = (valor: any) => {
        return valor
            .replace(/\D/g, '')
            .slice(0, 8)
            .replace(/(\d{5})(\d{1,3})$/, '$1-$2');
    };

    const enviarFormulario = async () => {
        if (!nome || !cpf || !dataNascimento || !cep || !email || !senha) {
            Alert.alert('Atenção!','Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (dataNascimento[2] !== "/" || dataNascimento[5] !== "/") {
            Alert.alert('Atenção!',"Por favor, insira a data de nascimento no formato dd/mm/aaaa")
            return
        }

        if (senha !== senha2) {
            Alert.alert('Atenção!',"As senhas não coincidem")
            return
        }

        if (!enviando) {
            setEnviando(true);

            let data = formatarData(dataNascimento)
            const usuarioData = {
                nome,
                cpf,
                cep,
                data_nascimento: data,
                email,
                senha,
                cargoId,
            };

            try {
                const response = await api.post('/usuario/cadastrar', usuarioData);
                console.log(response.data);
                if (response.status === 201) {
                    Alert.alert('Confirmado!','Usuário cadastrado com sucesso!');
                    limparFormulario();
                } else if ( response.status === 202) {
                    Alert.alert('Atenção!',response.data.message);
                    return
                }
            } catch (error: any) {
                Alert.alert('Atenção!','Erro ao cadastrar usuário. Tente novamente.');
            } finally {
                setEnviando(false);
            }
        }
    };

    const formatarData = (data: string) => {
        const [dia, mes, ano] = data.split("/");
        return `${ano}-${mes}-${dia}`;
    };

    const limparFormulario = () => {
        setNome('');
        setCpf('');
        setDataNascimento('');
        setCep('');
        setEmail('');
        setSenha('');
        setSenha2('');
    };

    return (
        <>
            <Navbar />
            <ScrollView contentContainerStyle={styles.container}>

                <Text style={styles.label}>Nome Completo <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Digite seu nome completo"
                />

                <Text style={styles.label}>CPF <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={cpf}
                    onChangeText={(text) => setCpf(mascararCPF(text))}
                    placeholder="Digite seu CPF"
                />

                <Text style={styles.label}>Data de Nascimento <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={dataNascimento}
                    onChangeText={(text) => setDataNascimento(mascararData(text))}
                    placeholder="dd/mm/aaaa"
                />

                <Text style={styles.label}>CEP <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={cep}
                    onChangeText={(text) => setCep(mascararCEP(text))}
                    placeholder="Digite seu CEP"
                />


                <Text style={styles.label}>E-mail <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite seu e-mail"
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Senha <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={senha}
                    onChangeText={setSenha}
                    placeholder="Digite sua senha"
                    secureTextEntry
                />

                <Text style={styles.label}> Confirme a Senha <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={senha2}
                    onChangeText={setSenha2}
                    placeholder="Digite sua senha novamente"
                    secureTextEntry
                />

                {userDetails !== null ? (
                    <>
                        <Text style={styles.label}>Cargo <Text style={styles.required}>*</Text></Text>
                        <RNPickerSelect
                            onValueChange={(value) => setCargo(value)}
                            items={cargos}
                            style={pickerSelectStyles}
                            placeholder={{ label: 'Selecione uma opção', value: '0' }}
                        />
                    </>
                ) : (
                    <></>
                )}

                <TouchableOpacity style={styles.submitButton} onPress={enviarFormulario}>
                    <Text style={styles.submitButtonText}>Enviar</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        display: 'flex',

        justifyContent: 'center'
    },
    label: {
        fontSize: 24,
        marginVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
    },
    required: {
        color: 'red',
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