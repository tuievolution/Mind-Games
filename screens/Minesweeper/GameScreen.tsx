import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { generateBoard } from '../../services/logic';
import { RootStackParamList } from '../../utils/types';
import { addStarsAndHints } from '../../services/scoreManager';

type GameRoute = RouteProp<RootStackParamList, 'MinesweeperGame'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function MinesweeperGameScreen() {
  const route = useRoute<GameRoute>();
  const navigation = useNavigation<Nav>();
  const { rows, cols, mines } = route.params;

  const [board] = useState(() => generateBoard(rows, cols, mines));
  const [revealed, setRevealed] = useState<boolean[][]>(() => Array(rows).fill(null).map(() => Array(cols).fill(false)));
  const [flags, setFlags] = useState<boolean[][]>(() => Array(rows).fill(null).map(() => Array(cols).fill(false)));
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  
  // DİKKAT: Oyuna 3 can ile başlıyorsun. Yani 3 bombaya basana kadar oyun BİTMEZ.
  const [lives, setLives] = useState(3);

  // Navigasyonun iki kez tetiklenmesini ve zamanlayıcıyı durdurmayı sağlayan Ref
  const isFinishedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isFinishedRef.current) setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // OYUN BİTİRME VE YÖNLENDİRME FONKSİYONU
  const handleEndGame = async (status: 'won' | 'lost') => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setGameOver(true);

    if (status === 'won') {
      try {
        // Puan eklerken olası bir çökme ekranı kilitlemesin diye try-catch içine aldık
        await addStarsAndHints(20);
      } catch (error) {
        console.log("Yıldız eklenirken hata oluştu: ", error);
      }
    }

    // replace yerine navigate kullanıyoruz. Bu, kilitlenme (freeze) sorununu %100 çözer.
    setTimeout(() => {
      navigation.navigate('MinesweeperResult', { time, status });
    }, 400); // Kullanıcının son hamleyi görmesi için yarım saniye bekle
  };

  const revealCell = (r: number, c: number) => {
    // Oyun bittiyse veya hücre zaten açıksa/bayraklıysa işlem yapma
    if (gameOver || isFinishedRef.current || revealed[r][c] || flags[r][c]) return;

    const newRevealed = revealed.map(row => [...row]);
    const newFlags = flags.map(row => [...row]);
    const cell = board[r][c];

    if (cell === '💣') {
      // 💥 BOMBAYA BASILDI
      const nextLives = lives - 1;
      setLives(nextLives);
      
      newRevealed[r][c] = true;
      newFlags[r][c] = true; // Görsel olarak o mayına bayrak koy
      
      setRevealed(newRevealed);
      setFlags(newFlags);

      // Sadece canı 0'a ulaştığında oyunu kaybetmiş say
      if (nextLives <= 0) {
        handleEndGame('lost');
        return;
      }
    } else {
      // ✅ GÜVENLİ SAYI AÇILDI
      if (cell === 0) {
        revealZeros(r, c, newRevealed, newFlags);
      } else {
        newRevealed[r][c] = true;
      }
      setRevealed(newRevealed);
    }

    // 🏆 KAZANMA KONTROLÜ (Gerçek zamanlı kopya üzerinden)
    let unrevealedSafeCells = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Eğer hücre BOMBA DEĞİLSE ve HALA AÇILMAMIŞSA (Bayrak konmuş olsa bile sayar)
        if (board[i][j] !== '💣' && !newRevealed[i][j]) {
          unrevealedSafeCells++;
        }
      }
    }

    // Açılmamış hiçbir "sayı/boşluk" kalmadıysa oyun KESİN OLARAK KAZANILDI
    if (unrevealedSafeCells === 0) {
      handleEndGame('won');
    }
  };

  const revealZeros = (r: number, c: number, rev: boolean[][], flg: boolean[][]) => {
    const queue: [number, number][] = [[r, c]];
    rev[r][c] = true;
    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = currR + dr, nc = currC + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !rev[nr][nc] && !flg[nr][nc]) {
            rev[nr][nc] = true;
            if (board[nr][nc] === 0) queue.push([nr, nc]);
          }
        }
      }
    }
  };

  const toggleFlag = (r: number, c: number) => {
    if (revealed[r][c] || gameOver) return;
    const newFlags = flags.map(row => [...row]);
    newFlags[r][c] = !newFlags[r][c];
    setFlags(newFlags);
  };

  // Kalan Bayrak Sayısı (Ekranda eksiye düşmemesi için Math.max kullanıldı)
  const currentFlags = flags.flat().filter(f => f).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>⏱ {time}s | ❤️ {lives} | 🚩 {Math.max(0, mines - currentFlags)}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.exitText}>🏠 Vazgeç</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.boardContainer}>
        {board.map((row, r) => (
          <View key={`row-${r}`} style={styles.row}>
            {row.map((cell, c) => (
              <TouchableOpacity
                key={`cell-${r}-${c}`}
                style={[styles.cell, revealed[r][c] && styles.revealed]}
                onPress={() => revealCell(r, c)}
                onLongPress={() => toggleFlag(r, c)}
                delayLongPress={200}
                activeOpacity={0.7}
              >
                <Text style={[styles.cellText, { color: getCellColor(cell) }]}>
                  {flags[r][c] ? '🚩' : (revealed[r][c] ? (cell === 0 ? '' : cell) : '')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const getCellColor = (val: any) => {
    const colors: any = { 1: '#0052cc', 2: '#27ae60', 3: '#e74c3c', 4: '#8e44ad', '💣': '#2c3e50' };
    return colors[val] || '#333';
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', backgroundColor: '#f4f6f9' },
  header: { padding: 20, alignItems: 'center' },
  headerText: { fontSize: 22, fontWeight: '800', color: '#2c3e50' },
  exitText: { color: '#e74c3c', marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  boardContainer: { padding: 6, backgroundColor: '#95a5a6', borderRadius: 8, elevation: 6, marginTop: 15 },
  row: { flexDirection: 'row' },
  cell: { 
    width: 36, height: 36, backgroundColor: '#bdc3c7', margin: 1, 
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderLeftColor: '#ecf0f1', borderTopColor: '#ecf0f1',
    borderRightColor: '#7f8c8d', borderBottomColor: '#7f8c8d'
  },
  revealed: { backgroundColor: '#ecf0f1', borderWidth: 1, borderColor: '#bdc3c7' },
  cellText: { fontSize: 20, fontWeight: '900' }
});