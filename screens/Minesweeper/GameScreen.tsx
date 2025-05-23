import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateBoard } from '../../services/logic';
import { RootStackParamList } from '../../utils/types';
import { RouteProp, NavigationProp } from '@react-navigation/native';

type GameRoute = RouteProp<RootStackParamList, 'MinesweeperGame'>;
type Nav = NavigationProp<RootStackParamList>;

export default function MinesweeperGameScreen() {
  const route = useRoute<GameRoute>();
  const navigation = useNavigation<Nav>();
  const { rows, cols, mines } = route.params;

  const [board, setBoard] = useState<(string | number)[][]>(() => generateBoard(rows, cols, mines));
  const [revealed, setRevealed] = useState<boolean[][]>(Array(rows).fill(null).map(() => Array(cols).fill(false)));
  const [flags, setFlags] = useState<boolean[][]>(Array(rows).fill(null).map(() => Array(cols).fill(false)));
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) setTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  const revealCell = (r: number, c: number) => {
    if (revealed[r][c] || flags[r][c] || gameOver) return;

    const newRevealed = revealed.map((row) => [...row]);
    newRevealed[r][c] = true;
    setRevealed(newRevealed);

    const cell = board[r][c];
    if (cell === '💣') {
      const remainingLives = lives - 1;
      setLives(remainingLives);

      if (remainingLives <= 0) {
        setGameOver(true);
        navigation.navigate('MinesweeperResult', { time });
      }
    } else if (cell === 0) {
      revealZeros(r, c, newRevealed);
    }

    saveGame(newRevealed, flags, time + 1, lives);
  };

  const revealZeros = (r: number, c: number, revealedMap: boolean[][]) => {
    const queue: [number, number][] = [[r, c]];

    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nx = x + dx;
          const ny = y + dy;
          if (
            nx >= 0 && nx < rows &&
            ny >= 0 && ny < cols &&
            !revealedMap[nx][ny] &&
            !flags[nx][ny]
          ) {
            revealedMap[nx][ny] = true;
            if (board[nx][ny] === 0) {
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    setRevealed([...revealedMap]);
  };

  const toggleFlag = (r: number, c: number) => {
    if (revealed[r][c] || gameOver) return;

    const newFlags = flags.map((row) => [...row]);
    const flagCount = flags.flat().filter(f => f).length;

    if (!flags[r][c] && flagCount >= mines) return;

    newFlags[r][c] = !newFlags[r][c];
    setFlags(newFlags);

    saveGame(revealed, newFlags, time, lives);
  };

  const saveGame = async (
    revealedMap: boolean[][],
    flagMap: boolean[][],
    timeVal: number,
    livesLeft: number
  ) => {
    await AsyncStorage.setItem('minesweeper_save', JSON.stringify({
      board,
      revealed: revealedMap,
      flags: flagMap,
      time: timeVal,
      lives: livesLeft,
      rows,
      cols,
      mines,
    }));
  };

  const handleExit = async () => {
    await saveGame(revealed, flags, time, lives);
    navigation.navigate('Home');
  };

  const flagsUsed = flags.flat().filter(f => f).length;
  const remainingMines = Math.max(mines - flagsUsed, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏱ Süre: {time} sn | ❤️ {lives} can | 🚩 Kalan Bomba: {remainingMines}</Text>

      <TouchableOpacity onPress={handleExit}>
        <Text style={styles.exit}>🏠 Ana Sayfa</Text>
      </TouchableOpacity>

      {board.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((cell, c) => (
            <TouchableOpacity
              key={c}
              style={[styles.cell, revealed[r][c] && styles.revealed]}
              onPress={() => revealCell(r, c)}
              onLongPress={() => toggleFlag(r, c)}
              disabled={gameOver}
            >
              <Text style={styles.cellText}>
                {flags[r][c]
                  ? '🚩'
                  : revealed[r][c]
                  ? cell === 0
                    ? ''
                    : cell
                  : ''}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  timer: { fontSize: 16, marginBottom: 6 },
  exit: { fontSize: 16, marginBottom: 12, color: '#007AFF' },
  row: { flexDirection: 'row' },
  cell: {
    width: 30,
    height: 30,
    margin: 1,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revealed: { backgroundColor: '#eee' },
  cellText: { fontSize: 16, fontWeight: 'bold' },
});
