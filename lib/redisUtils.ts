import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (!client) {
    client = createClient({
      database: 1,
      url: `redis://${process.env.NEXT_PUBLIC_REDIS_DB}`,
    });
    await client.connect();
  }
  return client;
}

export async function disconnectRedis(): Promise<void> {
  if (client) {
    await client.disconnect();
    client = null;
  }
}
