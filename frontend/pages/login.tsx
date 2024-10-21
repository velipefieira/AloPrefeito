import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';
import { jwtDecode } from 'jwt-decode';
import { Link } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import UsuarioCadastro from './usuarioCadastro';

export default function Login({ setIsAuthenticated, setUserDetails }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (email.trim() && senha.trim()) {
      const userDetails = { email, senha };

      try {
        const response = await api.post('/login', userDetails);
        const token = response.data.token

        if (token === 'E-mail ou senha incorretos') {
          Alert.alert('Erro', 'E-mail ou senha incorretos');
        } else if (response.status === 200) {
          await AsyncStorage.setItem('token', token);
          setUserDetails(jwtDecode(token));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Ocorreu um erro ao fazer login.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.title}> Alô Prefeito </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry={true}
        style={styles.input}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleLogin} >
        <Text style={styles.submitButtonText}> Entrar </Text>
      </TouchableOpacity>

      <Text>
        Não tem uma conta?
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('CadastroUsuario')}>
        <Text style={styles.cadastroText}>
          Cadastre-se
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    color: '#002E5D',
    fontWeight: 'bold'
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200
  }, 
  cadastroText: {
    textAlign: 'center',
    color: '#007bff',
    marginTop: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '40%',
    marginBottom: 20
  },
  submitButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  }
});
