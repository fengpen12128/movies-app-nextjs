import { createClient } from "redis";

let client;

export async function getRedisClient() {
  if (!client) {
    client = createClient({
      database: 1,
      url: "redis://192.168.1.37:6379",
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
