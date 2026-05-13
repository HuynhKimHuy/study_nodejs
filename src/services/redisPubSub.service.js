import Redis from '../dbs/init.redis.js';

const redisClient = Redis.getInstance();

class RedisPubSubService {
    constructor() {
        this.publisher = redisClient;
        this.subscriber = redisClient;
    }

    async publish(channel, message) {
        return await this.publisher.publish(channel, message);
    }
    
    async subscribe(channel, callback) {
        await this.subscriber.subscribe(channel, (message) => {
            callback(message);
        });
    }
}


export default new RedisPubSubService()