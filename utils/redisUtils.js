import { createClient } from "redis";

let client;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      database: 1,
      url: `redis://127.0.0.1`,
    });
    await client.connect();
  }
  return client;
}

export async function disconnectRedis() {
  if (client) {
    await client.disconnect();
    client = null;
  }
}
