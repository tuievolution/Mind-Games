import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  board: number[][];
  initialGrid: number[][];
  notes: number[][][];
  onSelect: (row: number, col: number) => void;
  selected: { row: number; col: number } | null;
  noteMode: boolean;
  errors: boolean[][];
};

export default function SudokuBoard({
  board,
  initialGrid,
  notes,
  onSelect,
  selected,
  noteMode,
  errors,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.board}>
      {board.map((row, rIdx) => (
        <View key={rIdx} style={styles.row}>
          {row.map((cell, cIdx) => {
            const isInitial = initialGrid[rIdx][cIdx] !== 0;
            const isSelected = selected?.row === rIdx && selected?.col === cIdx;
            const isError = errors[rIdx][cIdx];

            return (
              <TouchableOpacity
                key={cIdx}
                style={[
                  styles.cell,
                  isSelected && { backgroundColor: colors.selected },
                  isInitial && { backgroundColor: colors.fixedBackground },
                  (rIdx % 3 === 2 && rIdx !== 8) && { borderBottomWidth: 2 },
                  (cIdx % 3 === 2 && cIdx !== 8) && { borderRightWidth: 2 },
                ]}
                onPress={() => onSelect(rIdx, cIdx)}
                disabled={isInitial}
              >
                {cell !== 0 ? (
                  <Text style={{
                    fontWeight: isInitial ? 'bold' : '600',
                    fontSize: 18,
                    color: isInitial ? colors.fixedText : (isError ? 'red' : colors.userInput),
                  }}>
                    {cell}
                  </Text>
                ) : (
                  noteMode && notes[rIdx][cIdx].length > 0 ? (
                    <View style={styles.notesGrid}>
                      {Array.from({ length: 9 }, (_, i) => (
                        <Text key={i} style={styles.noteText}>
                          {notes[rIdx][cIdx].includes(i + 1) ? i + 1 : ' '}
                        </Text>
                      ))}
                    </View>
                  ) : null
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: { width: '100%', maxWidth: 400, alignSelf: 'center', aspectRatio: 1 },
  row: { flexDirection: 'row', flex: 1 },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 30,
    minWidth: 30,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    padding: 2,
    justifyContent: 'center',
  },
  noteText: {
    width: '33%',
    textAlign: 'center',
    fontSize: 10,
    color: '#888',
  },
});
