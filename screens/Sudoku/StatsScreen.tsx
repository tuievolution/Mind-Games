import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../utils/types';

export default function StatsScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const { colors } = useTheme();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const load = async () => {
      const hist = JSON.parse(await AsyncStorage.getItem('history') || '[]');
      const starsVal = parseInt(await AsyncStorage.getItem('stars') || '0', 10);
      const streakVal = parseInt(await AsyncStorage.getItem('streak') || '0', 10);
      setHistory(hist);
      setStars(starsVal);
      setStreak(streakVal);
    };
    load();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>📈 İstatistikler</Text>
      <Text style={{ color: colors.text }}>⭐ Toplam Yıldız: {stars}</Text>
      <Text style={{ color: colors.text }}>🔥 Seri: {streak}</Text>

      <FlatList
        data={history}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{ color: colors.text }}>🗓️ {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={{ color: colors.text }}>🎮 Zorluk: {item.difficulty}</Text>
            <Text style={{ color: colors.text }}>⭐ Yıldız: {item.stars}</Text>
            <Text style={{ color: colors.text }}>
              ⏱️ Süre: {Math.floor(item.time / 60)}:{(item.time % 60).toString().padStart(2, '0')}
            </Text>
          </View>
        )}
      />

      <Button title="🏠 Ana Menüye Dön" onPress={() => navigation.navigate('Home')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  header: { fontSize: 24, marginBottom: 10 },
  item: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
  },
});
