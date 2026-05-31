import amqplib from 'amqplib'

const producerDLX = async () => {

    try {
        const conn = await amqplib.connect('amqp://guest:guest@localhost:5672');
        const channel = await conn.createChannel()

        const noticationExchange = 'noticationExchange'
        const notiQueue = 'noticationQueueProcess'
        const noticationExchangDLX = 'noticationExchangDLX'
        const noticationRoutingKey = 'noticationRoutingKey'

        //1.Create Exchange
        await channel.assertExchange(noticationExchange, 'direct', {
            durable: true
        })


        //2.Create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,//cho phép các kết nối cùng  truy cập 1 hàng đợi 
            deadLetterExchange: noticationExchangDLX,
            deadLetterRoutingKey: noticationRoutingKey
        })

        //3.Bind Queue
        await channel.bindQueue(queueResult.queue, noticationExchange)

        //4.sendMEssage
        const msg = 'Hi Test Dead  Letter  Exchange'
        console.log(`producer msg::: ${msg}`)

        const send = await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: 10000
        })
        console.log(`sendToQueue accepted by broker: ${send}`);

        setTimeout(function () {
            conn.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(error)
    }
}
producerDLX()