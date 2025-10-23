const apiUrl = import.meta.env.VITE_API_URL;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPush(fetchAutenticado: (url: string, options?: RequestInit) => Promise<Response>) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push messaging is not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const vapidKeyResponse = await fetch(`${apiUrl}/api/push/vapid-key`);
    if (!vapidKeyResponse.ok) {
      console.error('Failed to get VAPID key from server.');
      return;
    }
    const { publicKey } = await vapidKeyResponse.json();
    const applicationServerKey = urlBase64ToUint8Array(publicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });

    console.log('User is subscribed:', subscription);

    await fetchAutenticado(`${apiUrl}/api/push/subscribe`, {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Subscription sent to server.');
  } catch (error) {
    console.error('Failed to subscribe the user: ', error);
  }
}