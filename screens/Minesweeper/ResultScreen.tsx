import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // NavigationProp çıkarıldı
import { RootStackParamList } from '../../utils/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Route = RouteProp<RootStackParamList, 'MinesweeperResult'>;

// DÜZELTİLEN KISIM BURASI: NavigationProp yerine NativeStackNavigationProp kullanıyoruz
type Nav = NativeStackNavigationProp<RootStackParamList>; 

export default function MinesweeperResultScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { time, status } = route.params;

  const isWon = status === 'won';

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isWon ? '#2ecc71' : '#e74c3c' }]}>
        {isWon ? '🎉 TEBRİKLER!' : '💥 OYUN BİTTİ'}
      </Text>
      <Text style={styles.subtitle}>
        {isWon ? 'Mayın Tarlasını Başarıyla Temizledin!' : 'Mayınlardan birine bastın.'}
      </Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statText}>⏱ Harcanan Süre: {time} saniye</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <Button title="Yeniden Başla" onPress={() => navigation.replace('MinesweeperDifficulty')} />
        <View style={{ height: 12 }} />
        <Button title="Ana Sayfa" color="#636e72" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, color: '#636e72', marginBottom: 30, textAlign: 'center' },
  statsCard: { padding: 20, backgroundColor: '#f1f2f6', borderRadius: 12, marginBottom: 40, width: '100%', alignItems: 'center' },
  statText: { fontSize: 20, fontWeight: '600' },
  buttonWrapper: { width: '80%' }
});