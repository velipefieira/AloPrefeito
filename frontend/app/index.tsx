import React, { useEffect, useState } from 'react';
import { Button, View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import Home from '../pages/home';
import RelatoCadastro from '../pages/relatoCadastro';
import Login from '../pages/login';
import Perfil from '@/pages/perfil';
import CadastroUsuario from '@/pages/usuarioCadastro';
import UsuarioCadastro from '@/pages/usuarioCadastro';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function Tabs({ handleLogout, userDetails }: any) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        children={() => <Home userDetails={userDetails} />}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
        <Tab.Screen
          name="Novo Relato"
          children={() => <RelatoCadastro userDetails={userDetails} />}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="access-point-plus" color={color} size={size} />
            ),
          }}
        />
      {userDetails.cargo == "Administrador" && (
        <Tab.Screen
          name="Novo Usuário"
          children={() => <UsuarioCadastro userDetails={userDetails} />}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-plus" color={color} size={size} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="Perfil"
        children={() => <Perfil userDetails={userDetails} handleLogout={handleLogout} />}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkUserLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        setUserDetails(decoded);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao buscar usuário no AsyncStorage', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserDetails(null);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <Login
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                  setUserDetails={setUserDetails}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="CadastroUsuario"
              children={() => <UsuarioCadastro userDetails={null} />}
            />
          </>
        ) : (
          <Stack.Screen name="Tabs">
            {(props) => (
              <Tabs
                {...props}
                handleLogout={handleLogout}
                userDetails={userDetails}
              />
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
