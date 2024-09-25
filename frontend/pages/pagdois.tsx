import { Link } from 'expo-router';
import React from 'react';
import { View, Text, Button } from 'react-native';
import Index from './home';

export default function PagDois() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Aqui vai ficar o cadastro</Text>
      <Link href={'/'}> volte para a home</Link>
    </View>
  );
}
