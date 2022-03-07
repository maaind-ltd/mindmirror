import {getTypedState} from '../store/combinedStore';
import notifee, {
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
} from '@notifee/react-native';

const baseTrigger: Partial<TimestampTrigger> = {
  type: TriggerType.TIMESTAMP,
  repeatFrequency: RepeatFrequency.DAILY,
};

export const enum NotificationType {
  MORNING,
  NOON,
  EVENING,
  MORNING_WEARABLE,
  NOON_WEARABLE,
  EVENING_WEARABLE,
}

export const NotificationTexts = {
  [NotificationType.MORNING]:
    'Good morning, would you like to do a voice check in to start your day?',
  [NotificationType.NOON]: 'Would you like to check in on your state of mind?',
  [NotificationType.EVENING]: 'Good evening, how are you feeling now?',
  [NotificationType.MORNING_WEARABLE]:
    'Good morning, you seem to be in a Mellow state, open MM to manage your state of mind”',
  [NotificationType.NOON_WEARABLE]:
    'Would you like to check your state of mind?',
  [NotificationType.EVENING_WEARABLE]:
    'Time for an evening check in, what state of mind do you want to be in now?',
};

export const setupNotifications = async () => {
  const hasWearable = !!getTypedState().settings.pairingCode;
  notifee.cancelAllNotifications();

  const dates = [
    new Date(Date.now()),
    new Date(Date.now()),
    new Date(Date.now()),
  ];
  dates[0].setHours(12, 45, 0, 0);
  dates[1].setHours(14, 0, 0, 0);
  dates[2].setHours(19, 0, 0, 0);

  const triggers = [
    {...baseTrigger, timestamp: dates[0].getTime()} as TimestampTrigger,
    {...baseTrigger, timestamp: dates[1].getTime()} as TimestampTrigger,
    {...baseTrigger, timestamp: dates[2].getTime()} as TimestampTrigger,
  ];

  const notificationTexts = [
    NotificationTexts[
      hasWearable ? NotificationType.MORNING_WEARABLE : NotificationType.MORNING
    ],
    NotificationTexts[
      hasWearable ? NotificationType.NOON_WEARABLE : NotificationType.NOON
    ],
    NotificationTexts[
      hasWearable ? NotificationType.EVENING_WEARABLE : NotificationType.EVENING
    ],
  ];

  const channelId = await notifee.createChannel({
    id: 'voice_checkin',
    name: 'Voice Checkin Reminders',
  });

  for (let i = 0; i < 3; i++) {
    await notifee.createTriggerNotification(
      {
        title: 'Voice Checkin',
        body: notificationTexts[i],
        android: {
          channelId,
        },
      },
      triggers[i],
    );
  }
};

// 9am Good morning, would you like to do a voice check in to start your day?
// 2pm Would you like to check in on your state of mind?
// 7pm Good evening, how are you feeling now?
// 3. for wearable users, we can use the same timings and instead just tell them what state they seem to be in ie:
// 9am Good morning, you seem to be in a Mellow state, open MM to manage your state of mind”
// 2pm Would you like to check your state of mind?
// 7pm Time for an evening check in, what state of mind do you want to be in now?
