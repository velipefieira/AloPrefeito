import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';

export default function Mapa({ localizacao, setLocalizacao, endereco, setEndereco }: any) {
    const [initialRegion, setInitialRegion] = useState<Region | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Permita o acesso à localização para continuar.');
                return;
            } 

            const location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
            });
            await fetchEndereco(location.coords.latitude, location.coords.longitude)
            setLocalizacao(location.coords)
            // setInitialRegion({
            //     latitude: -23.1791,
            //     longitude: -45.8872,
            //     latitudeDelta: 0.001,
            //     longitudeDelta: 0.001,
            // });

        })();
    }, []);

    const handleSelectLocation = async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setLocalizacao({ latitude, longitude });
        await fetchEndereco(latitude, longitude);
    };

    const fetchEndereco = async (latitude: number, longitude: number) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                {
                    headers: {
                      'User-Agent': 'AloPrefeito (github.com/velipefieira)',
                      'Accept-Language': 'pt-BR'
                    }
                  }
            );
            const addressData = response.data.address;

            // Filtra as informações relevantes

            const rua = addressData.road || ''
            const bairro = addressData.neighbourhood || addressData.suburb || ''
            const cidade = addressData.city || addressData.town || addressData.village || ''
            const cep = addressData.postcode

            const formattedAddress = `${rua}, ${bairro}, ${cidade} - CEP: ${cep}`;
            setEndereco(formattedAddress);

        } catch (error) {
            console.log(error);
            Alert.alert('Erro', 'Não foi possível carregar o mapa, tente novamente mais tarde.');
        }
    };

    if (!initialRegion) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Carregando mapa...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
                onPress={handleSelectLocation}
            >
                {localizacao && <Marker coordinate={localizacao} />}
            </MapView>

            {endereco && (
                <View>
                    <Text style={styles.enderecoTitle}>Local Selecionado:</Text>
                    <Text style={styles.endereco}>{endereco}</Text>
                </View>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        textAlign: 'center'
    },
    map: {
        height: 300,
        width: 300,
        padding: 2
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    endereco: {
        backgroundColor: '#fff',
        fontSize: 16,
    },
    enderecoTitle: {
        marginTop: 3,
        marginBottom: 3,
        fontSize: 20,
        fontWeight: 'bold'
    }
});