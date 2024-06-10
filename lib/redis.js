import { createClient } from 'redis';

const client = createClient({
  url: process.env.UPSTASH_REDIS_REST_URL,
});

client.on('error', (err) => {
  console.error('Redis Client Error', err);
});

await client.connect();

export default client;
