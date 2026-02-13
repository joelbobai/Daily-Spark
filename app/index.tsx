import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { QuoteCard } from '@/components/QuoteCard';
import { quotes } from '@/data/quotes';
import { getDayOfYear, getFormattedDate } from '@/utils/dateUtils';

const getDailyQuote = (date: Date) => {
  const dayOfYear = getDayOfYear(date);

  return quotes[dayOfYear % quotes.length];
};

const getRandomQuote = (excludeId?: string) => {
  if (quotes.length <= 1) {
    return quotes[0];
  }

  const availableQuotes = quotes.filter((quote) => quote.id !== excludeId);
  const randomIndex = Math.floor(Math.random() * availableQuotes.length);

  return availableQuotes[randomIndex];
};

export default function DailyQuoteScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [today] = useState(() => new Date());
  const [activeQuote, setActiveQuote] = useState(() => getDailyQuote(new Date()));
  const [history, setHistory] = useState<string[]>([]);
  const [savedQuoteIds, setSavedQuoteIds] = useState<string[]>([]);

  const isSaved = savedQuoteIds.includes(activeQuote.id);

  const historyQuotes = useMemo(
    () => history.map((quoteId) => quotes.find((quote) => quote.id === quoteId)).filter(Boolean),
    [history],
  );

  const showNewQuote = (source: 'refresh' | 'daily') => {
    setHistory((previous) => [activeQuote.id, ...previous].slice(0, 8));

    if (source === 'daily') {
      setActiveQuote(getDailyQuote(today));
      return;
    }

    setActiveQuote(getRandomQuote(activeQuote.id));
  };

  const goToPreviousQuote = () => {
    if (history.length === 0) {
      return;
    }

    const [previousQuoteId, ...remainingHistory] = history;
    const previousQuote = quotes.find((quote) => quote.id === previousQuoteId);

    if (!previousQuote) {
      setHistory(remainingHistory);
      return;
    }

    setHistory(remainingHistory);
    setActiveQuote(previousQuote);
  };

  const toggleSavedQuote = () => {
    setSavedQuoteIds((previous) =>
      previous.includes(activeQuote.id)
        ? previous.filter((quoteId) => quoteId !== activeQuote.id)
        : [activeQuote.id, ...previous],
    );
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.containerDark : styles.containerLight]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, isDarkMode ? styles.textDark : styles.textLight]}>DailySpark</Text>
        <Text style={[styles.dateText, isDarkMode ? styles.subtleTextDark : styles.subtleTextLight]}>
          {getFormattedDate(today)}
        </Text>

        <QuoteCard quote={activeQuote} />

        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => showNewQuote('refresh')}
            style={({ pressed }) => [
              styles.actionButton,
              isDarkMode ? styles.actionButtonDark : styles.actionButtonLight,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={[styles.actionText, isDarkMode ? styles.textDark : styles.textLight]}>
              Refresh Quote
            </Text>
          </Pressable>

          <Pressable
            onPress={toggleSavedQuote}
            style={({ pressed }) => [
              styles.actionButton,
              isSaved ? styles.actionButtonSaved : isDarkMode ? styles.actionButtonDark : styles.actionButtonLight,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={[styles.actionText, isSaved ? styles.textDark : isDarkMode ? styles.textDark : styles.textLight]}>
              {isSaved ? 'Saved ★' : 'Save'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            onPress={goToPreviousQuote}
            disabled={history.length === 0}
            style={({ pressed }) => [
              styles.actionButton,
              isDarkMode ? styles.actionButtonDark : styles.actionButtonLight,
              history.length === 0 && styles.actionButtonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={[styles.actionText, isDarkMode ? styles.textDark : styles.textLight]}>Previous</Text>
          </Pressable>

          <Pressable
            onPress={() => showNewQuote('daily')}
            style={({ pressed }) => [
              styles.actionButton,
              isDarkMode ? styles.actionButtonDark : styles.actionButtonLight,
              pressed && styles.buttonPressed,
            ]}>
            <Text style={[styles.actionText, isDarkMode ? styles.textDark : styles.textLight]}>
              Today&apos;s pick
            </Text>
          </Pressable>
        </View>

        <View style={[styles.panel, isDarkMode ? styles.panelDark : styles.panelLight]}>
          <Text style={[styles.panelTitle, isDarkMode ? styles.textDark : styles.textLight]}>
            Your activity
          </Text>
          <Text style={[styles.panelText, isDarkMode ? styles.subtleTextDark : styles.subtleTextLight]}>
            Saved quotes: {savedQuoteIds.length}
          </Text>
          <Text style={[styles.panelText, isDarkMode ? styles.subtleTextDark : styles.subtleTextLight]}>
            Recently viewed
          </Text>

          {historyQuotes.length === 0 ? (
            <Text style={[styles.emptyText, isDarkMode ? styles.subtleTextDark : styles.subtleTextLight]}>
              Refresh to build your quote history.
            </Text>
          ) : (
            historyQuotes.slice(0, 3).map((quote, index) => (
              <Pressable
                key={`${quote.id}-${index}`}
                onPress={() => setActiveQuote(quote)}
                style={({ pressed }) => [
                  styles.historyItem,
                  isDarkMode ? styles.historyItemDark : styles.historyItemLight,
                  pressed && styles.buttonPressed,
                ]}>
                <Text numberOfLines={2} style={[styles.historyText, isDarkMode ? styles.textDark : styles.textLight]}>
                  “{quote.text}”
                </Text>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLight: {
    backgroundColor: '#f4f4f4',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 52,
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
  actionsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonLight: {
    borderColor: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  actionButtonDark: {
    borderColor: '#f1f1f1',
    backgroundColor: '#232323',
  },
  actionButtonSaved: {
    borderColor: '#ffc857',
    backgroundColor: '#ffd47d',
  },
  actionButtonDisabled: {
    opacity: 0.45,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  panel: {
    width: '100%',
    borderRadius: 18,
    padding: 14,
    gap: 8,
    marginTop: 8,
    borderWidth: 1,
  },
  panelLight: {
    backgroundColor: '#ffffff',
    borderColor: '#d6d6d6',
  },
  panelDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#383838',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  panelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  historyItem: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  historyItemLight: {
    backgroundColor: '#f2f2f2',
  },
  historyItemDark: {
    backgroundColor: '#2a2a2a',
  },
  historyText: {
    fontSize: 13,
    lineHeight: 20,
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
