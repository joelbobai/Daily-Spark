import { StyleSheet, Text, View, useColorScheme } from 'react-native';

import type { Quote } from '@/data/quotes';

type QuoteCardProps = {
  quote: Quote;
};

export function QuoteCard({ quote }: QuoteCardProps) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.card, isDarkMode ? styles.cardDark : styles.cardLight]}>
      <Text style={[styles.quoteText, isDarkMode ? styles.textDark : styles.textLight]}>
        “{quote.text}”
      </Text>
      <Text style={[styles.authorText, isDarkMode ? styles.textMutedDark : styles.textMutedLight]}>
        — {quote.author}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardLight: {
    backgroundColor: '#ffffff',
  },
  cardDark: {
    backgroundColor: '#1f1f1f',
  },
  quoteText: {
    fontSize: 26,
    lineHeight: 36,
    textAlign: 'center',
    fontWeight: '600',
  },
  authorText: {
    marginTop: 18,
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textLight: {
    color: '#1a1a1a',
  },
  textDark: {
    color: '#f5f5f5',
  },
  textMutedLight: {
    color: '#4f4f4f',
  },
  textMutedDark: {
    color: '#cfcfcf',
  },
});
