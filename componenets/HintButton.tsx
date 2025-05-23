import { useState } from 'react';
import React from 'react';
import { Button } from 'react-native';
import { useHint } from '../services/hintManager';

export default function HintButton({ disabled, onHint }) {
  const [usable, setUsable] = useState(true);

  const handlePress = async () => {
    if (await useHint()) {
      onHint();
    } else {
      alert("İpucu kalmadı!");
    }
  };

  return (
    <Button title="🧠 İpucu" disabled={disabled || !usable} onPress={handlePress} />
  );
}
