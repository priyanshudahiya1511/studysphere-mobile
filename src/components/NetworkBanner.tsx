import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import NetInfo from '@react-native-community/netinfo';

const NetworkBanner = () => {
  const [isOffline, setIsOffline] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!isOffline) return null;

  return (
    <View style={[styles.banner, { paddingTop: insets.top + 8 }]}>
      <WifiOff size={16} color="#fff" />
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
};

export default NetworkBanner;

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E5484D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 10,
    zIndex: 1000,
  },
  text: { color: '#fff', fontSize: 13, fontWeight: '500' },
});
