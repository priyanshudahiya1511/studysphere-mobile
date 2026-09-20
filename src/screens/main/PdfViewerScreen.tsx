import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { LibraryStackParamList } from '../../navigation/LibraryStack';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import Pdf from 'react-native-pdf';
import { WebView } from 'react-native-webview';

type Props = NativeStackScreenProps<LibraryStackParamList, 'PdfViewer'>;

const PdfViewerScreen = ({ navigation, route }: Props) => {
  const { theme } = useTheme();
  const { fileUrl, title } = route.params;
  const [loading, setLoading] = useState(true);

  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
    fileUrl,
  )}`;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Text
          style={[styles.headerTitle, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {Platform.OS === 'ios' ? (
        <Pdf
          source={{ uri: fileUrl, cache: true }}
          style={styles.pdf}
          trustAllCerts={false}
          onError={err => console.log('PDF error:', err)}
        />
      ) : (
        <View style={styles.pdf}>
          <WebView
            source={{ uri: googleViewerUrl }}
            style={{ flex: 1 }}
            onLoadEnd={() => setLoading(false)}
            onError={syntheticEvent => {
              console.log('WebView error:', syntheticEvent.nativeEvent);
            }}
            startInLoadingState
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={theme.primary} size="large" />
              <Text
                style={[styles.loadingText, { color: theme.textSecondary }]}
              >
                Loading document...
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  safe: { flex: 1 },
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
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  loadingText: { fontSize: 13, marginTop: 12 },
});
