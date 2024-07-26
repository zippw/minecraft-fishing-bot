const mineflayer = require('mineflayer');
const inventoryViewer = require('mineflayer-web-inventory');
const Fishing = require('./Fishing');

const bot = mineflayer.createBot({
    host: 'mc.goodserver.com', // server ip
    username: 'Nickname', // your nickname
    // auth: 'microsoft', // uncomment for online mode servers
    // port: 25565
    version: '1.20.1'
});

bot.once('spawn', async () => {
    const autoeatModule = await import('mineflayer-auto-eat');
    const { plugin: autoeat } = autoeatModule;
    bot.loadPlugin(autoeat);

    console.log("Bot is ready");
    /* eating */
    bot.autoEat.options.priority = 'auto'
    bot.autoEat.options.startAt = 12
    bot.autoEat.options.bannedFood.push('enchanted_golden_apple')

    setTimeout(() => {
        new Fishing(bot)
    }, 10000); // wait to load chunks
});

let initialHp = 0;
bot.on('health', async () => {
    // damage leave
    if (bot.health < initialHp) {
        setTimeout(() => {
            bot.quit();
        }, 1000 + Math.random() * 2000);
        return;
    }
    initialHp = bot.health;
});

bot.on('kicked', console.error);
bot.on('error', console.error);
bot.on('autoeat_error', console.error);

inventoryViewer(bot, { port: 1122 });