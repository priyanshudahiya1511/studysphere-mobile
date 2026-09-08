import { getApp } from '@react-native-firebase/app';
import {
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
} from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { requestNotifications } from 'react-native-permissions';
import api from './api';
import { navigate } from '../navigation/navigationRef';
import notifee, { AndroidImportance } from '@notifee/react-native';

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

export const saveFcmTokenToBackend = async (token: string) => {
  try {
    await api.post('/api/v1/auth/save-fcm-token', { fcmToken: token });
  } catch (err) {
    console.log('Failed to save FCM token to backend:', err);
  }
};

export const setupNotificationsHandlers = () => {
  const messaging = getMessaging(getApp());

  onNotificationOpenedApp(messaging, remoteMessage => {
    handleNotificationTap(remoteMessage?.data);
  });

  getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage) {
      handleNotificationTap(remoteMessage?.data);
    }
  });
};

const handleNotificationTap = (data: any) => {
  if (!data) return;
  if (data.screen === 'planner') {
    navigate('Planner');
  } else if (data.screen === 'document' && data.documentId) {
    navigate('Library', {
      screen: 'DocumentDetail',
      params: { documentId: data.documentId, title: '' },
    });
  }
};

export const foregroundCreateNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
};

export const foregroundDisplayNotification = async (
  title: string,
  body: string,
  data: any = {},
) => {
  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId: 'default',
      importance: AndroidImportance.HIGH,
      pressAction: { id: 'default' },
    },
  });
};

export const setupForegroundHandler = () => {
  const messaging = getMessaging(getApp());
  return onMessage(messaging, async remoteMessage => {
    await foregroundDisplayNotification(
      remoteMessage.notification?.title ?? 'Notification',
      remoteMessage.notification?.body ?? '',
      remoteMessage.data,
    );
  });
};
