import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../utils/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Route = RouteProp<RootStackParamList, 'MinesweeperResult'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MinesweeperResultScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { time } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💥 Kaybettiniz!</Text>
      <Text style={styles.time}>⏱ Süre: {time} saniye</Text>

      <View style={styles.buttons}>
        <Button title="🔁 Tekrar Oyna" onPress={() => navigation.replace('MinesweeperDifficulty')} />
        <Button title="🏠 Ana Sayfa" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, marginBottom: 10, color: '#c00' },
  time: { fontSize: 20, marginBottom: 30 },
  buttons: { gap: 12 },
});
