import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {useThemeColor} from "@/src/hooks/use-theme-color";
import {colors} from "@/src/styles/global";

type ProgressBarProps = {
    text?: string;
    progress: number;
}

export default function ProgressBar({ text, progress }: ProgressBarProps) {
  // Sicherstellen, dass der Wert mathematisch zwischen 0 und 100% bleibt
  const percentage = Math.min(Math.max(progress * 100, 0), 100);
//progressBar {[styles.progressBar, { width: `${percentage}%` }]}

  const backgroundColor = useThemeColor({ light: '#22b845', dark: "#539f54" }, "background"); // #7cba7d

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBar}>
        <View style={styles.progressBar} />
      </View>
      <Text style={styles.progressText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 40,
    marginVertical: 10,
    marginBottom: 20
  },
  backgroundBar: {
    height: 10, 
    width: '100%',
    backgroundColor: '#e1dede',
    borderRadius: 6,
    overflow: 'hidden', // Wichtig, damit der innere Balken an den Ecken nicht übersteht
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#22b845',
    borderRadius: 6,
  },
  progressText: {
    marginTop: 6,
    fontSize: 12,
    color: '#434343',
    textAlign: 'right',
  },
});