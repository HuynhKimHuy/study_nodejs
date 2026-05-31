import amqplib from 'amqplib'

const reciveEmail = async () => {
    try {
        //create connection
        const conn = await amqplib.connect('amqp://guest:guest@localhost:5672');

        //create channel
        const chanel = await conn.createChannel()

        //create exchange
        const exchangeName = 'send_email'
        await chanel.assertExchange(exchangeName, 'topic', {
            durable: false
        })

        const { queue } = await chanel.assertQueue('', {
            exclusive: true
        })

        //binding
        const args = process.argv.slice(2)
        if (!args.length) {
            process.exit(0)
        }
        console.log(`waiting queue ${queue} :::  ${args}`);

        args.forEach(async key => {
            await chanel.bindQueue(queue, exchangeName, key)
        })

        //  public
        await chanel.consume(queue, msg => {
            console.log(`Routing Key ${msg.fields.routingKey}`);
        })

    } catch (error) {
        console.log(error);
    }
}

reciveEmail()


