import amqplib from 'amqplib'

const sendEmail = async () => {
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

        const args = process.argv.slice(2)
        const msg = args[1] || 'Message to send Email'
        const topic = args[0]

        console.log(`Rabbit msg :::  ${msg} Rabbit Topic ${topic} `);

        //public
        await chanel.publish(exchangeName, topic, Buffer.from(msg))
        console.log(`[Rabbit] Send OK :::${msg}`);
        setTimeout(function () {
            conn.close()
            process.exit(0)
        }, 2000)
    } catch (error) {
        console.log(error);

    }
}

sendEmail()


