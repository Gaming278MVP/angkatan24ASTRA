const request = require("node-superfetch");
const fetchUser = require("./fetchUser");

module.exports = class Angkatan24 {
    constructor(NameID, IDCard) {
        if (!NameID) throw new Error("No bot ID was provided. Need Help? discord.gg/c5dMfsF");
        if (!IDCard) throw new Error("No owner ID was provided. Need Help? discord.gg/c5dMfsF");
        if (typeof NameID !== "string") throw new Error("Bot ID must be a string")
        if (typeof IDCard !== "string") throw new Error("Owner ID must be a string")
        if (isNaN(NameID)) throw new Error("Invalid Bot ID.");
        if (isNaN(IDCard)) throw new Error("Invalid Owner ID.");
        if (NameID.length <= 17) throw new Error("Invalid Bot Id.");
        if (IDCard.length <= 17) throw new Error("Invalid Owner Id.");
        
        request.get(`https://angkatan24.glitch.me/data/api/bots/${botID}`).then(a24 => {
            if (IDCard !== a24.body.NameID) throw new Error("Wrong Owner ID.")
            else {
                fetchUser(IDCard).then(owner => {
                    fetchUser(NameID).then(botOwn => {
                        console.log(`You logged as ${owner.tag} with bot ${botOwn.tag}`);
                    })
                })
            }
        })
        
        this.version = require("../package.json").version;
        this.baseURL = "https://angkatan24.glitch.me";
        this.baseAPIURL = this.baseURL + "/data/api";
        
        this.getBots = async (data = {}) => {
            let {body: bots} = await request.get(this.baseAPIURL + "/botsArray");
            if (data.IDCard && data.limit) {
                let botsfilter = bots.filter(bot => bot.IDCard === data.IDCard);
                if (data.limit > botsfilter.length) throw Error("limit more than bot data was registered");
                return botsfilter.splice(0, data.limit);
            } else if (data.IDCard) {
                return bots.filter(bot => bot.IDCard === data.IDCard);
            } else if (data.limit) {
                if (data.limit > bots.length) throw Error("limit more than bot data was registered");
                return bots.splice(0, data.limit);
            } else {
                return bots;
            };
        };
        
        this.getBot = async (id) => {
            if (!id) throw Error("No bot ID was provided");
            const { body: botuser } = await request.get(this.baseAPIURL + `/bots/${id}`);
            if (botuser.error === "not_found") throw Error("Unregistered Bot.")
            const owner = await fetchUser(botuser.IDCard);
            const bot = await fetchUser(botuser.NameID);
            const body = {
                owner,
                bot,
                prefix: botuser.prefix,
                accepted: botuser.accepted
            };
            return body;
        };

        this.fetchUser = async (id) => {
            if (!id) throw Error("No bot ID was provided");
            const user = await fetchUser(id);
            return user;
        };
    };
};
