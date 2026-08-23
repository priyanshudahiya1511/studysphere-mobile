import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import React from 'react';
import { LibraryStackParamList } from '../../navigation/LibraryStack';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import Pdf from 'react-native-pdf';

type Props = NativeStackScreenProps<LibraryStackParamList, 'PdfViewer'>;

const PdfViewerScreen = ({ navigation, route }: Props) => {
  const { theme } = useTheme();
  const { fileUrl, title } = route.params;
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

      <Pdf
        source={{ uri: fileUrl, cache: true }}
        style={styles.pdf}
        trustAllCerts={false}
        onError={error => {
          console.log('PDF error:', error);
        }}
      />
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
});
