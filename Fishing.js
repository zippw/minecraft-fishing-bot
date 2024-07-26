class Fishing {
    constructor(bot) {
        this.bot = bot;

        this.start();
    };

    async start() {
        /* note block searching */
        this.noteBlockPosition = this.bot.findBlocks({
            matching: require('minecraft-data')(this.bot.version).blocksByName.note_block.id,
            maxDistance: 10,
            count: 1
        });
        
        if (!this.noteBlockPosition.length) return console.log('No note blocks found nearby');
        this.noteBlock = this.bot.blockAt(this.noteBlockPosition[0]);

        /* Update facing position on player spawn, to emulate looking at note block */
        await this.bot.lookAt(this.noteBlockPosition[0]);
        await this.delay(Math.random() * 500);
        await this.bot.look(Math.random(), Math.random());
        await this.delay(Math.random() * 1000);
        await this.bot.lookAt(this.noteBlockPosition[0]);

        /* Fishing */
        await this.delay(Math.random() * 3000);
        await this.fish();
    }

    async fish() {
        await this.preparation();

        this.noteBlockInterval = setInterval(() => this.bot.activateBlock(this.noteBlock), 200);
        await this.bot.fish();
        clearInterval(this.noteBlockInterval);

        await this.delay(200);
        await this.fish();
    }

    async preparation() {
        const rod = this.bot.inventory.items().find(item => item.name === "fishing_rod" && !this.isDying(item));
        if (!rod) return console.log("PizoIinna", "I have no rod :(");
        if (!this.bot.heldItem || !this.bot.heldItem !== rod) await this.bot.equip(rod);
    }

    isDying(item) { return item.maxDurability - item.nbt.value['Damage'].value < 10 };
    delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };
};

module.exports = Fishing