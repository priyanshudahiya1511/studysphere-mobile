import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken } from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { requestNotifications } from 'react-native-permissions';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }

    return true;
  }

  const { status } = await requestNotifications(['alert', 'sound', 'badge']);

  return status === 'granted';
};

export const getFcmToken = async (): Promise<string | null> => {
  try {
    const messaging = getMessaging(getApp());
    const token = await getToken(messaging);
    return token;
  } catch (err) {
    console.log('Error getting FCM token:', err);
    return null;
  }
};
