// Pusher integration with graceful no-op fallback when env vars are absent.

type PusherClient = {
  trigger: (channel: string, event: string, data: unknown) => Promise<unknown>;
};

let pusher: PusherClient | null = null;
let initStarted = false;

const appId = process.env.PUSHER_APP_ID;
const key = process.env.PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.PUSHER_CLUSTER;

function init(): void {
  if (initStarted) return;
  initStarted = true;
  if (!(appId && key && secret && cluster)) {
    console.warn("[pusher] env vars missing; real-time push disabled (no-op).");
    return;
  }
  // Async load without top-level await (tsx CJS-friendly).
  import("pusher" as string)
    .then((mod: { default: new (opts: unknown) => PusherClient }) => {
      pusher = new mod.default({ appId, key, secret, cluster, useTLS: true });
    })
    .catch(() => {
      console.warn("[pusher] 'pusher' package not installed; real-time push disabled.");
    });
}

init();

export function triggerEvent(channel: string, event: string, data: unknown): void {
  if (!pusher) return;
  pusher.trigger(channel, event, data).catch((err: unknown) => {
    console.error("[pusher] trigger failed:", err);
  });
}
