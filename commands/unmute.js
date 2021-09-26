const { MessageEmbed } = require("discord.js")
const servers = require("../models/servers")
const cases = require("../models/cases")
const moment = require('moment')
const CLOCK = require("../models/clock")

module.exports.run = (client , message, args) => {
    servers.findOne({
        guildID: message.guild.id}, (err , welchannel) => {
            if (!args[0]) return message.reply('**❌ Please provide a user for the action!**')
            let member2 = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if(!member2) return message.channel.send("❌ Seems like i can't find the user!")
            if(welchannel.mutedrole === "String"){
                return message.channel.send("❌ You should configure muted role by from dashboard <https://vaporbot.xyz/>")
            }
            if(!message.guild.roles.cache.get(welchannel.mutedrole)){
                return message.channel.send("❌ I can't find the mute role try set another one from dashboard <https://vaporbot.xyz/>")
            }
            if(!member2.roles.cache.get(welchannel.mutedrole)){
                return message.channel.send("❌ That player not muted!")
            }
            if(member2.roles.highest.position >= message.member.roles.highest.position){
                return message.channel.send("❌ You can't unmute person have roles higher than or same to you!")
           }
           let reason = args.slice(1).join(" ")
           if(!reason){
               reason = "No reason provided!"
           }
            let role2 = message.guild.roles.cache.get(welchannel.mutedrole);
            if(role2.position >= message.guild.me.roles.highest.position) return message.channel.send("Mute role is higher than my role or same to me!")
            servers.findOne({
                guildID: message.guild.id}, (err, res) => {
               let channel = message.guild.channels.cache.get(res.mod)
               if(channel){
                channel.send('🔊 ``' + member2.user.tag + "`` has been unmuted by ``" + message.author.tag + "`` , Reason: ``" + reason + "``")
               }
               })
            member2.roles.remove(role2).catch(console.error).then(message.channel.send('🔊 ``' + member2.user.tag + "`` has been unmuted by ``" + message.author.tag + "`` , Reason: ``" + reason + "``"))
            CLOCK.findOne({
                userID: member2.user.id,
                action: "Mute",
                serverID: message.guild.id}, async (err, res) => {
               if(res){
                   res.deleteOne()
               }
        })
        CLOCK.findOne({
            userID: member2.user.id,
            action: "TempMute",
            serverID: message.guild.id}, async (err, res) => {
           if(res){
               res.deleteOne()
           }
    })
            cases.find({
                serverID: message.guild.id
                    }).sort([
                      ['descending']
                    ]).exec((err, res) => {
                let cases1 = new cases({
                    userID: member2.user.id,
                    reason: reason,
                    action: "Unmute",
                    Moderator: message.author.id,
                    serverID: message.guild.id,
                    time: moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'),
                    case: res.length + 1
                })
                cases1.save()
                let embed = new MessageEmbed()
                .setAuthor(`${message.guild.name} | Unmute`, message.guild.iconURL({dynamic: true}))
                .setColor("GREEN")
                .setDescription(`Case Number: \`#${res.length}\` \nModerator: **${message.author.tag}** (\`${message.author.id}\`) \nAllegation: **${member2.user.tag}** (\`${member2.user.id}\`)`)
                .addField("**Reason**", reason)
                .setFooter(moment(message.createdAt).format('MM/DD/YYYY HH:mm:ss A'))
                member2.send(embed).catch(() => {})
            })
})
}

module.exports.help = {
    name: "unmute",
    category: "moderation",
    aliases: ['umute'],
    description: "Unmute members from server",
    example: "``unmute <@user> [reason]``"
}

module.exports.requirements = {
    userPerms: ["MUTE_MEMBERS"],
    clientPerms: ["MANAGE_ROLES"],
    ownerOnly: false
}

module.exports.limits = {
    rateLimit: 2,
    cooldown: 1e4
}