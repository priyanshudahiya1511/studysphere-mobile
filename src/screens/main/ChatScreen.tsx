import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import {
  startChatService,
  sendMessageService,
} from '../../services/chat.services';
import { ChatMessage } from '../../types/chat.types';
import { LibraryStackParamList } from '../../navigation/LibraryStack';
import Markdown from 'react-native-markdown-display';

type Props = NativeStackScreenProps<LibraryStackParamList, 'Chat'>;

export default function ChatScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { documentId } = route.params;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const listRef = useRef<FlatList<ChatMessage>>(null);

  const initChat = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const data = await startChatService(documentId);
      setSessionId(data.session._id);
      setMessages(data.session.messages || []);
    } catch (err: any) {
      setError(
        `Status: ${err.response?.status ?? 'none'} | ${
          err.response?.data?.message ?? err.message
        }`,
      );
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    initChat();
  }, [initChat]);

  const scrollToEnd = () => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleSend = async () => {
    const question = input.trim();
    if (!question || !sessionId || sending) return;

    const userMessage: ChatMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);
    scrollToEnd();

    try {
      const data = await sendMessageService(sessionId, question);
      const aiMessage: ChatMessage = {
        role: 'assistant',
        content: data.answer,
      };
      setMessages(prev => [...prev, aiMessage]);
      scrollToEnd();
    } catch {
      const errMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I could not answer that. Please try again.',
      };
      setMessages(prev => [...prev, errMessage]);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.bubbleRow,
          { justifyContent: isUser ? 'flex-end' : 'flex-start' },
        ]}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser ? theme.primary : theme.card,
              borderBottomRightRadius: isUser ? 4 : 16,
              borderBottomLeftRadius: isUser ? 16 : 4,
            },
          ]}
        >
          {isUser ? (
            <Text style={[styles.bubbleText, { color: theme.white }]}>
              {item.content}
            </Text>
          ) : (
            <Markdown style={markdownStyles(theme)}>{item.content}</Markdown>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Ask AI
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={[styles.errorText, { color: theme.error }]}>
            {error}
          </Text>
          <Pressable onPress={initChat}>
            <Text style={[styles.retry, { color: theme.primary }]}>
              Tap to retry
            </Text>
          </Pressable>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(_, i) => String(i)}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={scrollToEnd}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                  Ask a question about this document
                </Text>
              </View>
            }
          />

          {sending && (
            <View style={styles.typingRow}>
              <View style={[styles.bubble, { backgroundColor: theme.card }]}>
                <Text style={[styles.bubbleText, { color: theme.textMuted }]}>
                  Thinking...
                </Text>
              </View>
            </View>
          )}

          <View style={[styles.inputBar, { borderTopColor: theme.border }]}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.textPrimary,
                },
              ]}
              value={input}
              onChangeText={setInput}
              placeholder="Ask a question..."
              placeholderTextColor={theme.textMuted}
              multiline
            />
            <Pressable
              onPress={handleSend}
              disabled={!input.trim() || sending}
              style={[
                styles.sendButton,
                {
                  backgroundColor: input.trim() ? theme.primary : theme.border,
                },
              ]}
            >
              <Send size={20} color={theme.white} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14 },
  retry: { fontSize: 13, fontWeight: '500', marginTop: 8 },
  messagesContent: { padding: 16, flexGrow: 1 },
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: { fontSize: 14 },
  bubbleRow: { flexDirection: 'row', marginBottom: 10 },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  typingRow: { paddingHorizontal: 16, marginBottom: 8 },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const markdownStyles = (theme: any) => ({
  body: { color: theme.textPrimary, fontSize: 14, lineHeight: 20 },
  heading1: {
    color: theme.textPrimary,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  heading2: {
    color: theme.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  heading3: {
    color: theme.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 4,
  },
  strong: { fontWeight: '700', color: theme.textPrimary },
  code_inline: {
    backgroundColor: theme.background,
    color: theme.primary,
    paddingHorizontal: 4,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  code_block: {
    backgroundColor: theme.background,
    color: theme.textPrimary,
    padding: 10,
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
  },
  fence: {
    backgroundColor: theme.background,
    color: theme.textPrimary,
    padding: 10,
    borderRadius: 8,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 13,
  },
  bullet_list: { color: theme.textPrimary },
  list_item: { color: theme.textPrimary },
});
