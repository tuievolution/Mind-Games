import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  onInput: (num: number) => void;
  onClear: () => void;
  noteMode: boolean;
  toggleNoteMode: () => void;
};

export default function Controls({ onInput, onClear, noteMode, toggleNoteMode }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {Array.from({ length: 9 }, (_, i) => (
          <TouchableOpacity key={i} style={styles.key} onPress={() => onInput(i + 1)}>
            <Text style={styles.keyText}>{i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={onClear} style={styles.actionKey}>
          <Text style={styles.keyText}>🗑️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleNoteMode} style={[styles.actionKey, noteMode && { backgroundColor: '#ffd' }]}>
          <Text style={styles.keyText}>{noteMode ? 'Note ✏️' : 'Normal'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  key: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 4,
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionKey: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
    borderRadius: 4,
  },
});
