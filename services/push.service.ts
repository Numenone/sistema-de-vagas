import { prisma } from '../lib/prisma';

export async function saveSubscription(subscription: any, usuarioId: number) {
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