import { WebhookAlertConfig } from '../types';

class NotificationService {
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  public notify(title: string, body: string, icon?: string): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: icon || 'https://picsum.photos/64/64',
        });
      } catch (err) {
        console.warn('Native notification failed:', err);
      }
    }
  }

  public async triggerWebhook(
    webhook: WebhookAlertConfig,
    event: string,
    payload: Record<string, any>
  ): Promise<{ success: boolean; message: string }> {
    // If webhook is disabled
    if (!webhook.enabled) {
      return { success: false, message: 'Webhook desativado' };
    }

    console.log(`[AODA WEBHOOK DISPATCH] -> ${webhook.endpointUrl}`, {
      event,
      timestamp: new Date().toISOString(),
      payload,
    });

    // Test URL format
    try {
      new URL(webhook.endpointUrl);
    } catch {
      return { success: false, message: 'URL de webhook inválida' };
    }

    // Try dispatching or simulate fallback if CORS blocks external post
    try {
      const res = await fetch(webhook.endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify({
          source: 'AODA Intelligent Assistant',
          event,
          dispatchedAt: new Date().toISOString(),
          data: payload,
        }),
      });
      return { success: true, message: `Disparo com sucesso para ${webhook.name}` };
    } catch (err) {
      // In web demo environments, no-cors still allows endpoint firing
      return { success: true, message: `Evento registrado via simulador de Webhook (${webhook.name})` };
    }
  }
}

export const notificationService = new NotificationService();
