import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'MinesweeperDifficulty'>;

export default function MinesweeperDifficulty() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Zorluk Seçin</Text>
      <Button title="Kolay (8x8, 10 mayın)" onPress={() => navigation.navigate('MinesweeperGame', { rows: 8, cols: 8, mines: 10 })} />
      <Button title="Orta (12x12, 20 mayın)" onPress={() => navigation.navigate('MinesweeperGame', { rows: 12, cols: 12, mines: 20 })} />
      <Button title="Zor (16x16, 40 mayın)" onPress={() => navigation.navigate('MinesweeperGame', { rows: 16, cols: 16, mines: 40 })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
});
