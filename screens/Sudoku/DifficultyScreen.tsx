import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/types';
import { useTheme } from '../../context/ThemeContext';

type DifficultyScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SudokuDifficulty'>;

export default function DifficultyScreen() {
  const navigation = useNavigation<DifficultyScreenNavigationProp>();
  const { colors } = useTheme();
  const difficulties: RootStackParamList['SudokuGame']['difficulty'][] = ['easy', 'medium', 'hard', 'extreme'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Choose Difficulty</Text>
      {difficulties.map((level) => (
        <View key={level} style={styles.button}>
          <Button
            title={level.toUpperCase()}
            onPress={() => navigation.navigate('SudokuGame', { difficulty: level })}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  button: { marginVertical: 5, width: '60%' },
});
