import { prisma } from '../lib/prisma.js';
import webpush from 'web-push';

interface SubscriptionJSON {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:admin@example.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export function isPushAvailable() {
  return !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

export const sendPushNotification = (subscription: SubscriptionJSON, payload: string) => webpush.sendNotification(subscription, payload);

export async function saveSubscription(subscription: SubscriptionJSON, usuarioId: number) {
  try {
    await prisma.pushSubscription.create({
      data: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        usuarioId: usuarioId,
      },
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('Subscription already exists.');
      return; // Ignore unique constraint errors
    }
    throw error;
  }
}