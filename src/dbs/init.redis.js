import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

class Redis {
    constructor() {
        this.client = null;
        this.connect();
    }

    async connect() {
        console.log('[Redis] Attempting to connect...');
        try {
            this.client = createClient({ url: redisUrl });

            this.client.on('error', (err) => console.error('Redis Client Error', err));
            this.client.on('connect', () => console.log('Redis client connected'));
            this.client.on('ready', () => console.log('Redis client ready to use'));

            await this.client.connect();
            console.log('[Redis] ✅ Connected successfully');
        } catch (err) {
            console.error('[Redis] ❌ Cannot connect');
            console.error('[Redis] Error message:', err.message);
            process.exit(1);
        }
    }

    static getInstance() {
        if (!Redis.instance) {
            Redis.instance = new Redis();
        }
        return Redis.instance.client;
    }
}

export default Redis;
