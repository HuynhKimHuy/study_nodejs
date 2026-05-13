import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();
class LoggerService {
    constructor() {
        const token = process.env.DISCORD_BOT_TOKEN;
        const chanelId = process.env.CHANEL_ID;
        console.log(chanelId);
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages
            ],
            partials: [Partials.Channel]
        });
        this.addChanelId = chanelId;

        this.client.on(Events.ClientReady, readyClient => {
            console.log(chanelId);
            console.log(`Logged in as ${this.client.user.tag}!`);
        });

        // this.client.login(token).catch(err => {
        //     console.error('Failed to login to Discord:', err);
        // });

        this.client.on(Events.MessageCreate, message => {
            if (message.author.bot) return; // Ignore messages from bots
            if (message.content.toLowerCase().includes('hello')) {
                message.reply('Hi, Im Bot Discord! , chưa biết nói gì nên cứ nói vậy thôi :D');
            }
            if (typeof message.content === 'string') {
                message.reply(`Chào mừng bạn đến với server của chúng tôi! Bạn đã gửi: "${message.content}" , bạn thật đần :D`);
            }
            console.log(`Received message: ${message.content} from ${message.author.tag}`);
        });
    }
    sendToFormateCode(logData) {
        const { code, message = 'this is some addtiditional information about the code ', title = 'code Example' } = logData;

        const codeMessage ={
            content: `**${title}**\n\`\`\`${code}\n${message}\n\`\`\``,
            embeds:[
                {
                    color: 0x0099ff,
                    title: 'Code Example',
                    description: `\`\`\`${code}\n${message}\n\`\`\``,
                    timestamp: new Date().toISOString(),
                }
            ]

        }
        this.sendToDiscord(codeMessage);
    }
    sendToDiscord(message = 'message') {
        const channel = this.client.channels.cache.get(this.addChanelId);
        if (channel) {
            channel.send(message).catch(err => {
                console.error('Failed to send message to Discord:', err);
            });
        } else {
            console.warn('Discord channel not found. Message not sent:', message);
        }
    }
}
const loggerService = new LoggerService();
export default loggerService;