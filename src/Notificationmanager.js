import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

class NotificationManager {
    configure = () => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log('TOKEN:', token);
            },
            onNotification: function (notification) {
                console.log('NOTIFICATION:', notification);
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,
            requestPermissions: true,
        });
        PushNotification.createChannel(
            {
                channelId: 'fcm_fallback_notification_channel', // (required)
                channelName: 'Channel', // (required)
            },
            (created) => console.log(`createChannel returned '${created}`),
        );
    };

    buildAdroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id: id,
            autoCancel: true,
            largeIcon: options.largeIcon || 'ic_launcher',
            smallIcon: options.smallIcon || 'ic_launcher',
            bigText: message || '',
            subText: title || '',
            vibration: options.vibration || 300,
            vibrate: options.vibrate || false,
            priority: options.priority || 'high',
            importance: options.importance || 'high',
            data: data,
        };
    };
    buildIOSNotification = (id, title, message, data = {}, options = {}) => {
        return {
            alertAction: options.alertAction || 'view',
            category: options.category || '',
            userInfo: {
                id: id,
                item: data,
            },
        };
    };
    cancelAllNotification = () => {
        console.log('cancel');
        PushNotification.cancelAllLocalNotifications();
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        }
    };

    showNotification = (id, title, message, data = {}, options = {}, date) => {
        PushNotification.localNotificationSchedule({
            //Android
            ...this.buildAdroidNotification(id, title, message, data, options),

            // iOS
            ...this.buildIOSNotification(id, title, message, data, options),

            // Android and iOS
            title: title || '',
            message: message || '',
            playSound: options.playSound || false,
            soundName: options.soundName || 'default',
            date: date,
        });
    };
    unregister = () => {
        PushNotification.unregister();
    };
}
export const notificationManager = new NotificationManager();