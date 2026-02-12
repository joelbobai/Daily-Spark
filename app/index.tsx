import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { QuoteCard } from '@/components/QuoteCard';
import { quotes } from '@/data/quotes';
import { getDayOfYear, getFormattedDate } from '@/utils/dateUtils';

export default function DailyQuoteScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [today, setToday] = useState(() => new Date());

  // Deterministic selection ensures the same quote is shown for the entire day.
  const quoteOfTheDay = useMemo(() => {
    const dayOfYear = getDayOfYear(today);
    const quoteIndex = dayOfYear % quotes.length;

    return quotes[quoteIndex];
  }, [today]);

  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>DailySpark</Text>
        <Text style={[styles.dateText, isDarkMode ? styles.subtleTextDark : styles.subtleTextLight]}>
          {getFormattedDate(today)}
        </Text>

        <QuoteCard quote={quoteOfTheDay} />

        <Pressable
          onPress={() => setToday(new Date())}
          style={({ pressed }) => [
            styles.refreshButton,
            isDarkMode ? styles.refreshButtonDark : styles.refreshButtonLight,
            pressed && styles.refreshButtonPressed,
          ]}>
          <Text style={[styles.refreshButtonText, isDarkMode ? styles.textDark : styles.textLight]}>
            Refresh
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  containerLight: {
    backgroundColor: '#f4f4f4',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    width: '100%',
    maxWidth: 520,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 17,
    marginBottom: 6,
  },
  refreshButton: {
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderWidth: 1,
  },
  refreshButtonLight: {
    borderColor: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  refreshButtonDark: {
    borderColor: '#f1f1f1',
    backgroundColor: '#232323',
  },
  refreshButtonPressed: {
    opacity: 0.75,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  textLight: {
    color: '#1a1a1a',
  },
  textDark: {
    color: '#f5f5f5',
  },
  subtleTextLight: {
    color: '#4f4f4f',
  },
  subtleTextDark: {
    color: '#c7c7c7',
  },
});
