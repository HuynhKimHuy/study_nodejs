import amqplib from 'amqplib';

const queue = 'test_queue_MicroService';
const message = 'Hello RabbitMQ! This is MicroSevice';
const run = async () => {
    const connection = await amqplib.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`Sent message: ${message}`);
    await channel.close();
    await connection.close();
};

run().catch(console.error);