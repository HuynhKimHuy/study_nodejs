import amqplib from 'amqplib';

const queue = 'test_queue';

const run = async () => {
    const connection = await amqplib.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg) => {
        if (msg) {
            console.log(`Received message: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    }, { noAck: false });
};

run().catch(console.error)