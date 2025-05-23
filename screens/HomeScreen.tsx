import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';

type HomeNav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeNav>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oyun Seç</Text>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('SudokuDifficulty')}>
        <Image source={require('../assets/sudoku.png')} style={styles.image} />
        <Text style={styles.label}>Sudoku</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MinesweeperDifficulty')}>
        <Image source={require('../assets/minesweeper.png')} style={styles.image} />
        <Text style={styles.label}>Minesweeper</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, marginBottom: 20 },
  card: { margin: 12, alignItems: 'center' },
  image: { width: 100, height: 100, resizeMode: 'contain' },
  label: { marginTop: 8, fontSize: 16 },
});
