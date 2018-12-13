///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//require stuff
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//discord.js
const Discord = require('discord.js');
const bot = new Discord.Client();

//nootbot.json
const config = require('./nootbot.json');

//youtube-search
const search = require('youtube-search');
var opts = {
  maxResults: 5,
  type: 'video',
  key: process.env.API_KEY
};

//fs
const fs = require('fs');

//ytdl-core
const yt = require('ytdl-core');

//giphy-api
const giphy = require('giphy-api')();

const gifsearch = require('gif-search');

//dictionary
const dictionary = require("dictionary-en-us");
const Nspell  = require("nspell");
var grtarget;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//declarations
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//IDs
var gt = "<@!111782598199513088>";
var gtid = "111782598199513088";
var nootbot = "<@195616848203481088>";
var nootbot2 = "<@!195616848203481088>";
var nootbotid = "195616848203481088";
var nbcontrol = "195666499254353920";

//messages
var prefix = config.prefix;
var lockdown = false;

//log
var nootlog = "210224808762408970";
var can_log = true;
var msgno = 0;

//music

var path = ".//songlist//";
var queues = {};


//poll [server id, index]
var poll = false;
var polls = {};
var options = [];
var votes = [];
var voted = [];
var votechannel;

//translate
const translate = require('google-translate-api');
//const lang = require('languages.js');

//games
var games = {}; //{ round, type, players[] }
var events = [
  ["picks their nose", "scratches their head", "questions their existance", "wanders aimlessly"], //individualEvents:
  ["dies from a heart attack", "dies falling off a cliff", "dies in a hunting accident", "...just dies"], //individualDeaths:
  ["shakes hands", "shares a high five", "meets with", "goes hunting with"], //doubleEvents:
  ["is killed by", "is punched to death by", "is choked to death by", "is shot to death by"] //doubleDeaths:
];
var stop = false;
var joinTimer = 10; //seconds
var eventInterval = 5; //seconds
/*
var individualEvents = [];
var doubleEvents = [];
var individualDeaths = [];
var doubleDeaths = [];
*/

function playGame(id)
{
  let game = games[id];
  if (!game.type == "hg") return msg.channel.send("invalid game type");

  bot.setInterval(() => {
    let rge = Math.floor(Math.random() * 4); //events.length
    if(rge == 0 || rge == 1)
    {
      let rgp = Math.floor(Math.random() * game.players.length);
      let rn = Math.floor(Math.random() * 4);
      game.channel.send(`${game.players[rgp]} ${events[rge][rn]}`)
    }
    else if(rge == 2 || rge == 3)
    {
      let rgp1 = Math.floor(Math.random() * game.players.length);
      let rgp2 = Math.floor(Math.random() * game.players.length);
      while (true)
      {
        if(rgp1 == rgp2) rgp2 = Math.floor(Math.random() * game.players.length);
        else break;
      }

      let rn = Math.floor(Math.random() * 4);
      game.channel.send(`${game.players[rgp1]} ${events[rge][rn]} ${game.players[rgp2]}`);
    }
    //let rgp = Math.floor(Math.random() * game.players.length);

  }, 5000);
  delete games[id];
} //playGame

//debug
var lastevent = "N/A";
var rrchance = 6;

//cmds
var cmds = //general | features | utility
[
commands = //0
{
	name:"cmds",
	syntax:prefix + "cmds",
	desc:"shows commands",
	type:"general"
},
stats = //1
{
	name:"stats",
	syntax:prefix + "stats",
	desc:"shows some nootbot stats",
	type:"general"
},
invite = //2
{
  name:"invite",
  syntax:prefix + "invite",
  desc:"posts a link to add nootbot to your servers with",
  type:"general"
},
rps = //3
{
	name:"rock paper scissor",
	syntax:prefix + "rps",
	desc:"play rock paper scissor with nootbot!",
	type:"features"
},
gif = //4
{
	name:"gif",
	syntax:prefix + "gif <something>",
	desc:"posts a random gif that matches your search",
	example:prefix + "gif dank meme",
	type:"features"
},
rr = //5
{
  name:"russian roulette or rr",
	syntax:`${prefix}russianroulette or ${prefix}rr`,
	desc:"play a harmless game of russian roulette",
	type:"features"
},
rrk = //6
{
  name:"russian roulette kick",
	syntax:`${prefix}russianroulette kick or ${prefix}rr kick`,
	desc:"play a game of russian roulette with a 1/6 chance of getting kicked",
	type:"features"
},
rrb = //7
{
  name:"russian roulette",
	syntax:`${prefix}russianroulette ban or ${prefix}rr ban`,
	desc:"play a game of russian roulette with a 1/6 chance of getting banned",
	type:"features"
},
noot = //8
{
  name:"noot",
	syntax:`${prefix}noot <question>`,
	desc:"ask for nootbot's opinion",
  example:prefix + "noot should i kms?",
	type:"features"
},
pick = //9
{
  name:"pick",
	syntax:`${prefix}pick <atleast 2 choices seperated by '/'>`,
	desc:"let nootbot make your decisions for you",
  example:prefix + "pick tits/ass",
	type:"features"
},
emojify = //10
{
  name:"emojify",
	syntax:`${prefix}emojify <something>`,
	desc:"turns your words into emojis",
  example:prefix + "emojify ayylmao",
	type:"features"
},
vapor = //11
{
  name:"vapor",
	syntax:`${prefix}vapor <something>`,
	desc:"A E S T H E T I C",
  example:prefix + "vapor aesthetic",
	type:"features"
}
];

var perms =
[
  'CREATE_INSTANT_INVITE',
  'KICK_MEMBERS',
  'BAN_MEMBERS',
  'ADMINISTRATOR',
  'MANAGE_CHANNELS',
  'MANAGE_GUILD',
  'ADD_REACTIONS', // add reactions to messages
  'READ_MESSAGES',
  'SEND_MESSAGES',
  'SEND_TTS_MESSAGES',
  'MANAGE_MESSAGES',
  'EMBED_LINKS',
  'ATTACH_FILES',
  'READ_MESSAGE_HISTORY',
  'MENTION_EVERYONE',
  'EXTERNAL_EMOJIS', // use external emojis
  'CONNECT', // connect to voice
  'SPEAK', // speak on voice
  'MUTE_MEMBERS', // globally mute members on voice
  'DEAFEN_MEMBERS', // globally deafen members on voice
  'MOVE_MEMBERS', // move member's voice channels
  'USE_VAD', // use voice activity detection
  'CHANGE_NICKNAME',
  'MANAGE_NICKNAMES', // change nicknames of others
  'MANAGE_ROLES_OR_PERMISSIONS',
  'MANAGE_WEBHOOKS',
  'MANAGE_EMOJIS'
];

function hms()
{
  bot.user.setGame(`.cmds | .invite | ${bot.guilds.size}`);
}

function getMsgNo()
{
  msgno = parseInt(bot.channels.get(nootlog).topic);
}

function now()
{
  let time = new Date();

  let date = time.getDate(); //date
  if(date < 10)
  {
    date = "0" + date;
  }

  let month = time.getMonth()+1; //month
  if(month < 10)
  {
    month = "0" + month;
  }
  month.toString();

  let year = time.getFullYear(); //year
  let hours = time.getHours(); //hours
  let suffix = hours >= 12 ? "PM":"AM"; //if greater >= 12 then PM, else AM
  hours = (hours + 11) % 12 + 1; //converts hours to 12h format
  if(hours < 10)
  {
    hours = hours.toString();
    hours = "0" + hours;
  }
  hours = hours;
  hours = hours.toString();

  let minutes = time.getMinutes(); //minutes
  if(minutes < 10)
  {
    minutes = "0" + minutes;
  }
  minutes.toString();

  let seconds = time.getSeconds(); //seconds
  if(seconds < 10)
  {
    seconds = "0" + seconds;
  }
  seconds.toString();

  return `${hours}:${minutes}:${seconds} ${suffix} @ ${date}/${month}/${year}`;
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function isVowel(str) {
  return str == "a" || str == "e" || str == "i" || str == "o" || str == "u";
}

function numToWord(num) {
  if(num === "0") return "zero";
  else if(num === "1") return "one";
  else if(num === "2") return "two";
  else if(num === "3") return "three";
  else if(num === "4") return "four";
  else if(num === "5") return "five";
  else if(num === "6") return "six";
  else if(num === "7") return "seven";
  else if(num === "8") return "eight";
  else if(num === "9") return "nine";
  else return num;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function isNBS(member)
{
  let kn = bot.guilds.get("183755486628151296").members.get(member.id); //kingdom of nootville
  if(!kn) return false;
  else return kn.roles.has("310319421056876545");
}

function handleCMD(msg)
{
  //msg.channel.startTyping();
  var input = msg.content.toUpperCase();
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //general

  if(input === prefix + "CMDS")
  {
    let res = "# general\n";

    for(var i = 0; i < cmds.length; i++)
    {
      if(cmds[i].type === "general") res = `${res}\n• ${cmds[i].syntax}`;
    }
    res = `${res}\n\n# features\n`;
    for(var i = 0; i < cmds.length; i++)
    {
      if(cmds[i].type === "features") res = `${res}\n• ${cmds[i].syntax}`;
    }
    res = `${res}\n\n# other\n\n• "pingu" for a noot noot!\n• "noot noot" for a random pingu gif\n• "@anyone" makes nootbot mention a random member from the server(good for giveaways!)`;
    res = `${res}\n\n.cmds <cmd> for more info about a cmd; ex: .cmds gif`
    msg.channel.send(res, {code: 'markdown'});
  } else //cmds

  if(input.startsWith(prefix + "CMDS "))
  {
    let index = cmds.findIndex((element) => { return (element.name.includes(msg.content.split(" ")[1]) || prefix + element.name === msg.content.split(" ")[1]); });
    if(index < 0) return msg.reply("cmd not found");
    let res = "showing info for <" + cmds[index].name + ">"
    + "\n\n"
    + "<syntax: " + cmds[index].syntax + ">"
    + "\n<description: " + cmds[index].desc + ">";

    if(cmds[index].example)
    {
      res = res + "\n<example: " + cmds[index].example + ">";
    }
    msg.channel.send(res, {code: 'markdown'});
  } else //cmds <cmd>

  if(input === prefix + "STATS")
  {
    msg.channel.send(`i have access to\n \`${bot.guilds.size}\` servers\n \`${bot.channels.findAll('type', 'text').length}\` text channels\n \`${bot.channels.findAll('type', 'voice').length}\` voice channels\n \`${bot.users.size}\` users\n *soon... the world*`);
  } else //stats

  if(input === prefix + "INVITE")
  {
    msg.channel.send("to add nootbot to your discord click this link: \nhttps://discordapp.com/oauth2/authorize?client_id=195616696055234571&scope=bot&permissions=104320000");
  } else //invite

  if(input.startsWith(prefix + "MOCK "))
  {
    let target = msg.content.slice(6).split("");
    var res = "";

    for(var i = 0; i < target.length; i++)
    {
      var rn = Math.floor(Math.random() * 2) + 1;
      if(rn === 1) res = res + target[i];
      else if(rn === 2) res = res + target[i].toUpperCase();
      else res = res + "0";
    }

    msg.channel.send(res);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //utility


  if(input === prefix + "GRTARGET" && msg.author.id == gtid)
  {
    if(grtarget > -1)
    {
      grtarget = -1;
      console.log(`grtarget reset`);
    }
    else
    {
      grtarget = msg.channel.id;
      console.log(`grtarget set to ${msg.channel.name}`);
    }
  } else //grtarget

  if(input === prefix + "PING")
  {
    msg.channel.send("pong!");
  } else //ping

  if(input === prefix + "SERVERS")
  {
    if(!isNBS(msg.member)) return
    let servers = bot.guilds.array();
    let res = "";

    for(var i = 0; i < servers.length; i++)
    {
      res = `${res}\n[${i}]${servers[i].name} (${servers[i].id})`;
    }
    msg.channel.send("```" + res + "```", {split: {prepend: '```', append: '```'}});
  } else //servers

  if(input.startsWith(prefix + "SERVERINFO ") || input.startsWith(prefix + "SI "))
  {
    if(!isNBS(msg.member)) return
    let guild = msg.content.slice(12);

    if(isNaN(guild)) guild = bot.guilds.find('name', guild); //if it's a name
    else if(guild >= 0 && guild <= bot.guilds.size)
    {
      let indx = guild;
      guild = bot.guilds.array()[indx]; //if it's an index
    }
    else guild = bot.guilds.get(guild);
    if(!guild) return msg.reply("guild not found");

    msg.channel.send(`name: \`${guild.name}\`\nowner: \`${guild.owner.displayName}\` aka \`${guild.owner.user.username}\` \nmember count: \`${guild.memberCount}\`\ncreated on: \`${guild.createdAt.getUTCDate()}/${guild.createdAt.getUTCMonth()+1}/${guild.createdAt.getUTCFullYear()}\`\n`);
    msg.channel.send(guild.iconURL, `${guild.name}_icon.png`);

    let channels = guild.channels.array();
    let ctext = "";
    let cvoice = "";

    for(var i = 0; i < channels.length; i++)
    {
      if(channels[i].type == "text") ctext = `${ctext}\n•${channels[i].name} (${channels[i].id})`;
      else cvoice = `${cvoice}\n•${channels[i].name} (${channels[i].id})`;
    }
    msg.channel.send(`\`\`\`text:\n${ctext}\n\nvoice:\n${cvoice}\`\`\``);
  } else //serverinfo

  if(input.startsWith(prefix + "EVAL "))
  {
    if(msg.author.id !== gtid) return;
    let code = msg.content.slice(6);
    try
    {
      eval(code);
    }
    catch (e)
    {
      msg.channel.send("```" + e + "```");
    }
  } else //eval

  if(input.startsWith(prefix + "SHAREDGUILDS "))
  {
    let target = msg.content.slice(14);
    if(isNaN(target)) target = bot.users.find('username', target); //if it's a username
    else target = bot.users.get(target); //if it's an ID
    if(!target) return console.log("invalid user");

    let guilds = bot.guilds.array();
    let res = "";
    let count = 0;

    for(var i = 0; i < guilds.length; i++)
    {
      if(guilds[i].members.findKey('id', target.id))
      {
        res = `${res}\n${guilds[i].name} (${guilds[i].id})`;
        count++;
      }
    }
    msg.channel.send(`servers that nootbot and \`${target.username}\` share: ${count}\n\`\`\`${res}\`\`\``);
  } else //sharedguilds

  if(input.startsWith(prefix + "SGM"))
  {
    if(msg.author.id !== gtid) return;
    let guilds = bot.guilds.array();
    let target = bot.users.array();
    let count = 0;
    let max = 0;
    let index = 0;

    msg.channel.send("starting count...");

    for(var i = 0; i < target.length; i++)
    {
      if(target[i].bot) continue;

      for(var j = 0; j < guilds.length; j++)
      {
        if(guilds[j].members.findKey('id', target[i].id))
        {
          count++;
        }
      }
      if(count > max)
      {
        max = count;
        index = i;
      }
      count = 0;
    }
    msg.channel.send(`the user that shares the most servers with nootbot is: \`${target[index].username} (${target[index].id})\` with \`${max}\` servers!`);
  } else //SGM

  if(input.startsWith(prefix + "SGM5"))
  {
    if(msg.author.id !== gtid) return;
    let guilds = bot.guilds.array();
    let target = bot.users.array();
    let leaderboard = [];
    let count = 0;
    let max = 0;
    let index = 0;

    msg.channel.send("starting count...");

    for(var i = 0; i < 5; i++)
    {
      for(var j = 0; j < target.length; j++)
      {
        if(target[j].bot) continue;

        for(var k = 0; k < guilds.length; k++)
        {
          if(guilds[k].members.findKey('id', target[j].id))
          {
            count++;
          }
        }
        if(count > max)
        {
          max = count;
          index = j;
        }
        count = 0;
      }
      let temp = {max: count, index: j}
      leaderboard.push(temp);
    }
    msg.channel.send(`the user that shares the most servers with nootbot is: \`${target[index].username} (${target[index].id})\` with \`${max}\` servers!`);
  } else //sharedguilds

  if(input === prefix + "EMOJI")
  {
    if(msg.author.id !== gtid) return;
    var emoji = msg.guild.emojis.array();
    if(emoji.length > 0)
    {
      var result = emoji[0];
      for(var i = 1; i < emoji.length; i++)
      {
        result = result + " " + emoji[i];
      }
      msg.channel.send(result.toString());
    }
    else
    {
      msg.channel.send("no emojis on this discord")
    }
  } else //emoji

  if(input.startsWith(prefix + "SETAVATAR "))
  {
    if(msg.author.id !== gtid) return;

    let target = msg.content.slice(11);
    if(isNaN(target)) target = bot.users.find('username', target); //if it's a username
    else target = bot.users.get(target); //if it's an ID
    if(!target) return console.log("invalid user");

    bot.user.setAvatar(target.displayAvatarURL);
  } else //setavatar

  if(input.startsWith(prefix + "SETAVATARICON "))
  {
    if(msg.author.id !== gtid) return;

    let target = msg.content.slice(15);
    if(isNaN(target)) target = bot.guilds.find('name', target); //if it's a guild name
    else target = bot.guilds.get(target); //if it's an ID
    if(!target) return console.log("invalid guild");
    if(!target.iconURL) return console.log("target.iconURL is null");

    bot.user.setAvatar(target.iconURL);
  } else //setavataricon

  if(input.startsWith(prefix + "SAY|"))
  {
    if(msg.author.id !== gtid) return;
    let schan = msg.content.split("|")[1];
    let smsg = msg.content.split("|")[2];

    try {
      if(isNaN(schan)) schan = bot.channels.find('name', schan); //if it's a channel name
      else schan = bot.channels.get(schan); //if it's an ID
      if(!schan) return console.log("channel not found");
      if(!schan.permissionsFor(schan.guild.members.get(nootbotid)).has('SEND_MESSAGES')) return console.log('invalid perms')
      msg.channel.send(`sent: \`${smsg}\` to \`${schan.name}\` in \`${schan.guild.name}\``)
      schan.startTyping();
      setTimeout(() => schan.send(smsg), 500);
      schan.stopTyping();
    } catch (e) {
      console.log(`error on .say: ${e}`);
    }
  } else //say

  if(input === prefix + "NOU")
  {
    if(msg.channel.type !== "text") return;
    if(isNBS(msg.member))
    {
      msg.delete().then(m => {
        m.channel.send("no u");
      });
    }
  } else //troll nou

  if(input === prefix + "READ")
  {
    fs.readFile(".//cleverbot.txt", 'utf8', function(err, data) {
      if (err) throw err;
      //console.log('OK: ' + filename);
      console.log(data);
    });
  } else //read

  if(input.startsWith(prefix + "WRITE "))
  {
    var out = msg.content.slice((prefix.length) + 6);
    fs.appendFile(".//output.txt", out, function(err) {
      if (err) throw err;
      //console.log('OK: ' + filename);
      console.log("output: " + out);
    });
  } else //write

  //toggles
  if((input === prefix + "LOCKDOWN") && (msg.author.id == gt))
  {
    if(lockdown)
    {
      lockdown = false;
      msg.channel.send("lockdown is now: " + lockdown);
    }
    else
    {
      lockdown = true;
      msg.channel.send("lockdown is now: " + lockdown);
    }
  } else//lockdown toggle

  if((input === prefix + "LOG") && (msg.author.id == gt))
  {
    if(can_log)
    {
      can_log = false;
      msg.channel.send("logging is now: " + can_log);
    }
    else
    {
      can_log = true;
      msg.channel.send("logging is now: " + can_log);
    }
  } else //log toggle

  if(input.startsWith(prefix + "SEARCH "))
  {
    let query = msg.content.slice(8);
    search(query, opts, (err, res) => {
      if(err) return console.log(err);

      msg.channel.send(`top 5 results for \`${query}\``);
      var resl = "";
      for(var i = 0; i < res.length; i++) resl = resl + "\n" + res[i].link;
      msg.channel.send(resl);
      //console.dir(res);
    });
  } else //search

  if(input.startsWith(prefix + "SETCHANCE ") || input.startsWith(prefix + "SC "))
  {
    if(msg.author.id !== gtid) return;
    rrchance = msg.content.split(" ")[1];
    console.log(`rrchance now set to ${rrchance}`);
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //features

  if (input === "AYY")
  {
    msg.channel.send("lmao");
  } else //ayylmao

  if(input.includes("( ͡° ͜ʖ ͡°)"))
  {
    msg.channel.send("( ͡° ͜ʖ ͡°)");
  } else //lenny

  if(input.startsWith(prefix + "NOOT WHO "))
  {
    msg.reply("ur mum");
  }
  else if(input.startsWith(prefix + "NOOT "))
  {
    var response =
    [
    "yes",
    "no",
    "ya",
    "nah",
    "yep",
    "nope",
    "maybe",
    "maybe not",
    "obviously",
    "obviously not",
    "definitely",
    "definitely not",
    "certainly",
    "certainly not",
    "it seems so",
    "it doesn't seem so",
    "i doubt it",
    "i don't doubt it",
    "no idea",
    "you tell me",
    "god knows",
    ":100:",
    "0% chance",
    ":heavy_check_mark:",
    ":x:",
    ":thinking:"
    ];
    var rn = Math.floor(Math.random() * response.length);

    msg.reply(response[rn]);

    //var x = ("nootbot replied `" + response[rn] + "`")
    //log(x);
    //bot.send(nootlog, "nootbot replied `" + response[rn] + "`");
  } else //noot

  if(input.startsWith(prefix + "VAPOR "))
  {
    let vap = msg.content.slice(7).split("");
    let res = "";
    for(var i = 0; i < vap.length; i++)
    {
      res = res + `${vap[i]}    `;
    }
    msg.channel.send(res);
  } else //vapor

  if(input.startsWith(prefix + "VAPORB "))
  {
    let vap = msg.content.slice(8).split("");
    let res = "";
    for(var i = 0; i < vap.length; i++)
    {
      res = res + `${vap[i]}    `;
    }
    msg.channel.send(`**${res}**`);
  } else //vaporb

  if(input.startsWith(prefix + "EMOJIFY "))
  {
    let split = msg.content.slice(9).split("");
    let res = "";
    for(var i = 0; i < split.length; i++)
    {
      if(isLetter(split[i])) res = res + `:regional_indicator_${split[i].toLowerCase()}:`;
      else if(split[i] === " ") res = res + "  ";
      else if(split[i] === "\n") res = res + "\n";
      else if(split[i] >= 0) res = res + `:${numToWord(split[i])}:`;
      else res = res + `${split[i]}`;
    }
    msg.channel.send(res);
  } else //emojify

  if(input.startsWith(prefix + "BIFY ") || input.startsWith(prefix + ":B:IFY "))
  {
    let ini = msg.content.slice(6).split("");
    var res = "";
    var done = false;

    for(var i = 0; i < ini.length; i++)
    {
      if(isVowel(ini[i]) && (i+1) < ini.length && !done) //if its a vowel
      {
        if(ini[i+2] == ini[i+1]) ini[i+2] = ":b:";
        //if(isVowel(ini[i+1])) continue;
        ini[i+1] = ":b:";
        done = true;
      }
      if(ini[i].toUpperCase() == "B")
      {
        ini[i] = ":b:";
        //done = true;
      }
      res = res + ini[i];
    }
    msg.channel.send(res);
  } else //bify
  //TODO: redo this cmd so that it splits words THEN split each word into letters and bify

/*
  if(input.startsWith(prefix + "POLL "))
  {
    if(poll) return msg.reply("a poll is already underway");
    let splits = msg.content.slice(6).split(";");
    //console.log(`splits: ${splits}`);
    votechannel = msg.channel;
    let time = 30;

    if(splits.length < 2) return msg.reply("syntax: `.poll title;option1;option2;option3;...`");
    if(polls.hasOwnProperty(msg.guild.id)) return msg.reply("a poll is already in progress!");
    polls[msg.guild.id] = [options, voted]; //poll[msg.guild.id][0] = options |||| poll[msg.guild.id][1] = voted


    let optionlist = "";
    let temp;

    for(var i = 1; i < splits.length; i++)
    {
      temp = {name: splits[i], votes:0};
      polls[msg.guild.id][0].push(temp);
      optionlist = `${optionlist}\n${splits[i]}`;
    }

    msg.channel.send(`${msg.author} has started a poll: "${splits[0]}" \n${optionlist} \n\ntime: ${time} seconds`);

    const collector = msg.channel.createCollector(
     m => m.content.toUpperCase().startsWith(prefix + "VOTE "),
     { max: msg.guild.members.size, time: time*1000 }
    );
    collector.on('message', m => {
      //console.log(`vote: ${m.content.split("/")}`);
      let vote = m.content.slice(6);
      let index = -1;

      if(polls[msg.guild.id][1].includes(msg.author.id)) return msg.reply("you already voted!");
      for(var i = 0; i < polls[msg.guild.id][0].length; i++)
      {
        if(vote == polls[msg.guild.id][0][i].name)
        {
          index = i;
          //console.log(`index now: ${index}`);
          break;
        }
      }
      if(index < 0) return msg.reply(`invalid vote \`${vote}\``);

      polls[msg.guild.id][0][index].votes++;
      polls[msg.guild.id][1].push(msg.author.id);
      msg.channel.send(`${msg.author} has voted for \`${vote}\`, total votes for it: ${polls[msg.guild.id][0][index].votes}`);
    });
    collector.on('end', collected => {
      let result = "";
      for(var i = 0; i < polls[msg.guild.id][0].length; i++)
      {
        result = `${result}\n${polls[msg.guild.id][0][i].name} - ${polls[msg.guild.id][0][i].votes} vote(s)`;
      }
      votechannel.send(`**${splits[0]} results:**\n${result}`);
      delete polls[msg.guild.id][0];
      delete polls[msg.guild.id][1];
      delete polls[msg.guild.id];
    });
  } else //poll
*/

  if(input.startsWith(prefix + "AVATAR "))
  {
    let target = msg.content.slice(8);

    if(isNaN(target)) target = bot.users.find('username', target); //if it's a username
    else target = bot.users.get(target); //if it's an ID
    if(!target) return console.log("invalid user");

    msg.channel.send(target.avatarURL, `${target.username}-avatar.png`);

  } else //avatar

  if(input.startsWith(prefix + "ICON "))
  {
    let target = msg.content.slice(6);

    if(isNaN(target)) target = bot.guilds.find('name', target); //if it's a username
    else target = bot.guilds.get(target); //if it's an ID
    if(!target) return console.log("invalid guild");

    msg.channel.send(target.iconURL, `${target.name}-icon.png`);
  } else //icon

  if(input.startsWith(prefix + "STATUS "))
  {
    if(msg.author.id !== gtid) return;
    let status = msg.content.slice(8);

    if(status == "reset") return hms();

    bot.user.setGame(status);
  }

  if(input.startsWith(prefix + "GIF "))
  {
    var query = msg.content.slice((prefix.length) + 4);
    msg.channel.send(`:hourglass_flowing_sand: searching for '${query}'`).then(m => {
      // Search for a gif
      gifsearch.random(query).then( gifUrl => {
        if(!gifUrl) return m.edit(`:x: could not find a gif for '${query}'`);
        m.edit(`'${query}'\n${gifUrl}`);
        //console.log(gifUrl);
      });
    });
  } else //gifrandom

  if(input === prefix + "ROLL")
  {
    var rn = (Math.floor(Math.random() * 10 )+ 1);
    var time = 10;
    console.log(rn);
    var out = [];
    msg.channel.send(`i rolled a number between 1-10 you have ${time} secs to guess what it is!`);

    const collector = msg.channel.createMessageCollector(
     m => !isNaN(m.content),
     { time: time*1000 }
    );
    collector.on('collect', m => {
      //if(m.author.id === lp) return;
      if(m.content == -1 && m.author.id === gtid) return collector.stop();
      if(out.includes(m.author.id)) return m.reply("you already answered!");

      if(m.content == rn)
      {
        m.reply(`correct! the number was ${rn}!`);
        collector.stop();
      }
      else
      {
        m.reply("wrong! you're out!");
        out.push(m.author.id);
      }
    });
    collector.on('end', () => {
      msg.channel.send(`timer ended; number was ${rn}`);
      delete out;
    });
  } else //roll

  if(input.startsWith(prefix + "TRANSLATE "))
  {
    let query = msg.content.slice(11);
    translate(query, {to: 'en'}).then(res => {
      msg.channel.send(`Translated from \`${res.from.language.iso}\` \n \`\`\`${res.text}\`\`\``)
      //=> I speak English
      //=> nl
}).catch(err => {
    msg.channel.send(`\`\`\`${err}\`\`\``);
});
  }

  if (input.startsWith(prefix + "PLAY "))
  {
    //msg.reply("unfortunately, due to the UAE :flag_ae: blocking voice chatting, i'm no longer able to properly play music anymore :(");
  //}

    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) return msg.reply(`you need to be in a voice channel m8`);

    var target = msg.content.slice((prefix.length) + 5);
    const msgChannel = msg.channel;

    if(!queues.hasOwnProperty(msg.guild.id)) queues[msg.guild.id] = [false, msgChannel];
    if(target.startsWith("https://www.youtube.com/watch?v="))
    {
      if(!queues[msg.guild.id][0])
      {
        playyt(voiceChannel, queues[msg.guild.id][1], target);
      }
      else
      {
        queues[msg.guild.id].push(target);
        yt.getInfo(target, function(err, info) {
          if(!info) return msg.reply("error fetching info");
          msg.reply("added `" + info.title + "` to the queue (#" + (queues[msg.guild.id].length-2) + ")");
        });
      }
    }
    else
    {
      search(target, opts, (err, res) => {
        if(err) return msg.reply("error: " + err);

        var resl = "";
        var reslist = [];
        for(var i = 0; i < res.length; i++)
        {
          resl = `${resl}\n[${i+1}] ${res[i].title}`;
          reslist.push(res[i].link);
        }
        var toDel = [];
        var author = msg.author.id;
        msg.channel.send(`# results for '${target}'\n${resl}`, {code: 'markdown'}).then(m => toDel.push(m));
        msg.channel.send("say `.choose <1-5>` to pick an option").then(m => toDel.push(m));

        const collector = msg.channel.createCollector(
         m => m.content.toUpperCase().startsWith(prefix),
         { time: 60000 }
        );
        collector.on('message', m => {
          if(m.author.id !== author) return;
          if(m.content.toUpperCase().startsWith(prefix + "PLAY ")) collector.stop();
          if(m.content.toUpperCase().startsWith(prefix + "CHOOSE "))
          {
            let num = m.content.split(" ")[1];
            if(isNaN(num)) return msg.reply("choice must be a number");
            if(num < 1 || num > 5) return msg.reply("number out of bounds");
            target = reslist[num-1];
            //console.log(`target now: ${target}`);
          }
          collector.stop();
        });
        collector.on('end', collected => {
          msg.channel.bulkDelete(toDel);
          if(!target.startsWith("https://www.youtube.com/watch?v=")) return;
          if(!queues[msg.guild.id][0])
          {
            playyt(voiceChannel, queues[msg.guild.id][1], target);
          }
          else
          {
            queues[msg.guild.id].push(target);
            yt.getInfo(target, function(err, info) {
              if(err) return msg.reply(`getInfo error: ${err}`);
              //if(!info) return msg.reply("error fetching info");
              msg.reply("added `" + info.title + "` to the queue (#" + (queues[msg.guild.id].length-2) + ")");
            });
          }
        });
      });
    }
  } else //play yt

  if(input === prefix + "QUEUE")
  {
    const id = msg.guild.id
    if(!queues.hasOwnProperty(id)) return msg.reply("no queue found for this server");
    var res = "";
    for(var i = 2; i < queues[id].length; i++)
    {
      res = res + "\n[" + (i-1) + "] " + queues[id][i];
    }
    msg.channel.send("queue for `" + msg.guild.name + "`\n" + res);
  } else //queue

  if(input === prefix + "PAUSE")
  {
    var connection = bot.voiceConnections.get(msg.guild.id);
    var vc = msg.member.voiceChannel;
    if(!connection) return msg.reply('im not in a voice channel m8');
    if(!vc) return msg.reply('you need to be in a voice channel!');
    if(vc.id !== connection.channel.id) return msg.reply('you need to be in the right voice channel!');


    connection.player.dispatcher.pause();
    msg.reply("pausing");
  } else //pause

  if(input === prefix + "UNPAUSE")
  {
    var connection = bot.voiceConnections.get(msg.guild.id);
    var vc = msg.member.voiceChannel;
    if(!connection) return msg.reply('im not in a voice channel m8');
    if(!vc) return msg.reply('you need to be in a voice channel!');
    if(vc.id !== connection.channel.id) return msg.reply('you need to be in the right voice channel!');

    if(!connection.player.dispatcher.paused) return msg.reply("i'm not playing anything you idiot");
    connection.player.dispatcher.resume();
    msg.reply("unpausing");
  } else //resume

  if(input === prefix + "STOP")
  {
    var connection = bot.voiceConnections.get(msg.guild.id);
    var vc = msg.member.voiceChannel;
    if(!connection) return msg.reply('im not in a voice channel m8');
    if(!vc) return msg.reply('you need to be in a voice channel!');
    if(vc.id !== connection.channel.id) return msg.reply('you need to be in the right voice channel!');

    if(connection.player.dispatcher.paused) return msg.reply("i'm already not playing anything are you deaf");
    connection.player.dispatcher.end();
  } else //stop

  if(input === prefix + "LEAVE")
  {
    var connection = bot.voiceConnections.get(msg.guild.id);
    var vc = msg.member.voiceChannel;
    if(!connection) return msg.reply('im not in a voice channel m8');
    if(!vc) return msg.reply('you need to be in a voice channel!');
    if(vc.id !== connection.channel.id) return msg.reply('you need to be in the right voice channel!');

    vc.leave();
  } else //leave

  if(input.startsWith(prefix + "VOLUME "))
  {
    var connection = bot.voiceConnections.get(msg.guild.id);
    var vc = msg.member.voiceChannel;
    if(!connection) return msg.reply('im not in a voice channel m8');
    if(!vc) return msg.reply('you need to be in a voice channel!');
    if(vc.id !== connection.channel.id) return msg.reply('you need to be in the right voice channel!');

    var newvol = parseInt(msg.content.split(" ")[1]);

    if((msg.author.id == "105026998639812608") || (msg.author.id == "111782598199513088"))
    {
      connection.player.dispatcher.setVolume(newvol/100);
      msg.reply("setting volume to `" + newvol + "`");
    }
    else
    {
      if(((newvol>=0) && (newvol<=200)))
      {
        connection.player.dispatcher.setVolume(newvol/100);
        msg.reply("setting volume to `" + newvol + "`");
      }
    }
  } else //volume

  if(input === prefix + "RUSSIANROULETTE" || input === prefix + "RR")
  {
    let target = msg.author;
    let rng = (Math.floor(Math.random() * rrchance) + 1);

    msg.reply(":gun: pulling the trigger in 5 seconds! (for dramatic purposes)");
    //console.log(`RR: ${rng}`);

    setTimeout(() => {
      if(rng === 1)
       {
         msg.reply(":fire: it's a shot!");
       }
       else msg.reply(":heavy_check_mark: it's not a shot! you live to roulette another day!");
     }, 5000);
  } else //rrg

  if(input.startsWith(prefix + "RUSSIANROULETTE ") || input.startsWith(prefix + "RR "))
  {
    if(msg.channel.type !== 'text') return;
    let target = msg.member;
    let punishment = msg.content.split(" ")[1];
    let rng = (Math.floor(Math.random() * rrchance) + 1);


    if(punishment === 'kick')
    {
      if(!msg.guild.members.get(nootbotid).permissions.has('KICK_MEMBERS')) return msg.reply(":heavy_multiplication_x: i need kick perm to carry out the punishment!"); //if has no ban perm
      if(target.id === msg.guild.owner.id) return msg.reply(":heavy_multiplication_x: i can't kick the server owner!");
      if(!target.kickable) return msg.reply(":heavy_multiplication_x: you can't be kicked");

      msg.reply(":gun: pulling the trigger in 5 seconds! (for dramatic purposes)");
      //console.log(`RR: ${rng}`);

      setTimeout(() => {
        if(rng === 1)
        {
         msg.reply(":fire: it's a shot! you will be kicked!");
         setTimeout(() => {
           try {
             if(bot.users.get(target.id) && msg.guild.members.get(nootbotid).permissions.has('CREATE_INSTANT_INVITE'))
             {
               msg.channel.createInvite().then((inv) => {
                 target.send(inv.url);
               });
             }
             target.kick();
           } catch (e) {
             msg.channel.send(`error: \`${e}\``);
           }
         }, 2000);
        }
        else msg.reply(":heavy_check_mark: it's not a shot! you live to roulette another day");
       }, 5000);
    }
    else if(punishment === 'ban')
    {
      if(!msg.guild.members.get(nootbotid).permissions.has('BAN_MEMBERS')) return msg.reply(":heavy_multiplication_x: i need ban perm to carry out the punishment!"); //if has no ban perm
      if(target.id === msg.guild.owner.id) return msg.reply(":heavy_multiplication_x: i can't ban the server owner!");
      if(!target.bannable) return msg.reply(":heavy_multiplication_x: you can't be banned");

      msg.reply(":gun: pulling the trigger in 5 seconds! (for dramatic purposes)");
      //console.log(`RR: ${rng}`);

      setTimeout(() => {
        if(rng === 1)
         {
           msg.reply(":fire: it's a shot! you will be banned!");
           setTimeout(() => { target.ban(); }, 2000);
         }
         else msg.reply(":heavy_check_mark: it's not a shot! you live to roulette another day");
       }, 5000);
    }
  } else  //rr kick/ban

  if(input === prefix + "COINFLIP" || input === prefix + "CF")
  {
    let rn = Math.floor(Math.random() * 2) + 1;

    if(rn === 1) return msg.reply("heads!");
    else return msg.reply("tails!");
  } else //coinflip

  if(input.startsWith(prefix + "RNG "))
  {
    let num = msg.content.split(" ")[1];
    if(isNaN(num)) return msg.reply(`${num} is invalid`);
    let rn = getRandomIntInclusive(0, num);

    msg.reply(rn);
  } else //rng

  if(input.startsWith(prefix + "CALC "))
  {
    let cal = msg.content.split(" ")[1];
    //console.log(cal)
    try {
      let res = eval(cal);
      msg.channel.send(res);
    } catch (e) {
      msg.channel.send("```" + e + "```");
    }
  } else //calc

  if(input.startsWith(prefix + "PICK "))
  {
    let selections = msg.content.slice(6).split("/");

    if(selections.length < 2) return msg.reply(":x: there needs to be atleast 2 choices");
    var rn = Math.floor(Math.random() * (selections.length) + 0);

    msg.reply(`i choose \`${selections[rn]}\`!`);
  } else //pick

  if(input.startsWith(prefix + "RPS"))
  {
    var player = msg.author.id;
    var playerc;
    var botc;
    msg.reply("rock, paper or scissor?");

    const collector = msg.channel.createCollector(
     m => m.content.toUpperCase() === "ROCK" || m.content.toUpperCase() === "PAPER" || m.content.toUpperCase() === "SCISSOR",
     { time: 60000 }
    );
    collector.on('collect', m => {
      if(m.author.id !== player) return;
      playerc = m.content.toLowerCase();

      var rn = Math.floor(Math.random() * 3 + 1);
      if(rn === 1) botc = "rock";
      else if(rn === 2) botc = "paper";
      else if(rn === 3) botc = "scissor";
      msg.reply(`${botc}!`);
      collector.stop();
    });
    collector.on('end', () => {
      if(playerc === botc) msg.reply("draw!");
      else if(playerc === "rock" && botc === "scissor") msg.reply("you win!");
      else if(playerc === "paper" && botc === "rock") msg.reply("you win!");
      else if(playerc === "scissor" && botc === "paper") msg.reply("you win!");
      else msg.reply("i win!!!");
    });
  } else //rps

  if(input.startsWith(prefix + "RAFFLE"))
  {
    if(msg.author.id !== gtid) return
    var nbs = msg.guild.roles.get("310319421056876545").members.array();
    var res = "";

    function emojiDecision(decision)
    {
      if (decision) return ":heavy_check_mark:";
      else return ":x:";
    }

    for (var i = 0; i < nbs.length; i++)
    {
      let decision = true; //true = stays, false = leaves
      let rng = (Math.floor(Math.random() * rrchance) + 1);
      if(rng === 1) decision = false;
      res = res + nbs[i].displayName + " " + emojiDecision(decision) + "\n";
    }

    msg.channel.send(res);
  }

  if(input === prefix + "STOPGAME")
  {
    if(stop == false) stop = true;
    else stop = false;
    msg.channel.send(`stop set to ${stop}`);
  } else

  if(input.startsWith(prefix + "GAME "))
  {
    let cmd = msg.content.slice(6);

    if(cmd.toUpperCase().startsWith("START "))
    {
      if(!games.hasOwnProperty(msg.guild.id))
      {
        let round = 0;
        let type = cmd.split(" ")[1]; //modes: "rr" = russian roulette | "hg" = hunger games | "got" = game of thrones
        if((!type == "rr")) return msg.channel.send("invalid game type"); //|| (!type == "hg") || (!type == "tt")) return msg.channel.send("invalid game type");
        let players = [];
        players.push(msg.member);
        players.push(msg.guild.members.get(nootbotid));
        msg.channel.send("A new round of russian roulette is about to start! Type `" + prefix + "game join` within `" + joinTimer + "` seconds to join in!");
        // Create a message collector
        const collector = msg.channel.createCollector(
         m => m.content.toUpperCase() == prefix + "GAME JOIN",
         { time: joinTimer*1000 });
        collector.on('collect', m => {
          let player = m.member;
          if(!players.includes(player))
          {
            players.push(player);
            m.channel.send("`" + player.displayName + "`" +  " has joined the game!");
          }
          else m.reply("You're already in the game!");
        });
        collector.on('end', collected => {
          if(players.length < 1) return msg.channel.send("not enough players!");
          msg.channel.send("Timer over, starting game!");
          games[msg.guild.id] = {channel: msg.channel, round, type, players};
          //if(type == "rr")
          playRR(msg.guild.id);
          //else if(type == "hg") playHG(msg.guild.id);
        });
      }
    }
  } else //game

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//events
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.on("ready", () => {
  console.time("ready");
  //hms();
  bot.user.setActivity(`${bot.users.size/1000}K users from their windows`, {type: "WATCHING"});
  getMsgNo();
  console.log(`NOOTBOT READY ${now()}`);
  lastevent = "ready";
  console.timeEnd("ready");
  //bot.setInterval(() => { bot.channels.get("195666499254353920").send("boop"); }, 60000); //1 min = 60000 ms
});//ready

bot.on("disconnect", (err) => {
  console.error(`nootbot disconnected:\n${err.code} - ${err.reason}`);
});

bot.on("reconnecting", () => {
  console.error("nootbot is reconnecting...");
}); //reconnecting

bot.on("resume", num => {
  console.log("nootbot connected");
}); //resume

bot.on("guildCreate", (guild) => {
  bot.channels.get(nootlog).send(`${gt}, I have **joined** a new guild: \`${guild.name}\` owned by \`${guild.owner.user.username}\``);
  hms();
});//guildCreate

bot.on("guildDelete", (guild) => {
  bot.channels.get(nootlog).send(`${gt}, I have been **removed** from guild: \`${guild.name}\` owned by \`${guild.owner.user.username}\``);
	hms();
});

bot.on("channelCreate", (channel) => {
  if(channel.type !== "text") return;
  if(!channel.permissionsFor(channel.guild.members.get(nootbotid)).has('SEND_MESSAGES')) return; //if has no send message perm
  lastevent = `channelCreated: ${channel.name}`;
  channel.send("boop");
});//channel created

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
function log(msg)
{
  if((msg.author.id == nootbotid) && (!can_log)) return;
  if(msgno%10 == 0) bot.channels.get(nootlog).setTopic(msgno);
  let content = msg.content;
  if(content.length>=2000) return;

  try {
    content = msg.attachments.first().message.content + " " + msg.attachments.first().url;
  }
  catch(e){}

  if(!msg.guild)
  { //if it's a PM
    bot.channels.get(nootlog).send(
      "[" + msgno + "]" + `\n${now()}`
      + "\n**PM from:** "
      + msg.author.username
      + " (" + msg.author.id + ")"
      + "\n**content:** "
      + content
      + "\n--------------------------------------------------------------", {disableEveryone: true}
    );
  }
  else
  {
    bot.channels.get(nootlog).send(
      "[" + msgno + "]" + `\n${now()}`
      + "\n**author:** "
      + msg.author.username
      + " (" + msg.author.id + ")"
      + "\n**content:** "
      + content
      + "\n**channel:** "
      + msg.channel.name
      + " (" + msg.channel.id + ")"
      + "\n**server:** "
      + msg.guild.name
      + " (" + msg.guild.id + ")"
      + "\n--------------------------------------------------------------", {disableEveryone: true}
    );
  }
  msgno++;
}
*/

function playyt(vc, mc, link)
{
  vc.join()
  .then(connection => {
    var dispatcher;

    let stream = yt(link, {audioonly: true});
    stream.on('info', (info, format) => {
      mc.send("playing: `" + info.title + "` by `" + info.author.name + "`");
    });

    dispatcher = connection.playStream(stream);
    queues[mc.guild.id][0] = true;

    dispatcher.on('end', () => {
      queues[mc.guild.id][0] = false;

      if(queues[mc.guild.id].length > 2)
      {
        let next = queues[mc.guild.id][2];
        queues[mc.guild.id].shift();
        playyt(vc, mc, next);
      }
      else
      {
        delete queues[mc.guild.id];
        mc.send("queue ended; use `" + prefix + "play <link or search query>` to play some more music!");
      }
    });
  });
}

function playRR(id)
{
  let game = games[id];
  if (!game.type == "rr") return msg.channel.send("invalid game type");

  let selector = 0;
  let playerNum = game.players.length;
  var target;

  game.channel.send(">game starts").then(m => {
    m.channel.send("playing rr internally.....");
    var gameInterval = bot.setInterval(() => {
      if(stop) bot.clearInterval(gameInterval);

      var rng = (Math.floor(Math.random() * 6) + 1);
      target = game.players[selector];
      console.log(`selector: [${selector}/${game.players.length}] - ${target.displayName}`);
      //m.edit(`${m.content}\n>${target.displayName} :gun: pulling the trigger in 5 seconds! (for dramatic purposes)`);

      if(rng === 1)
       {
         //m.edit(`${m.content}\n>${target.displayName} :fire: it's a shot! you're out!`);
         m.channel.send(`${target.displayName}: :fire: it's a shot! you're out!`);
         game.players[selector] = null;
         playerNum--;
         console.log(`${target.displayName}[${selector}] is spliced`);
       }
       else {
         //m.edit(`${m.content}\n>${target.displayName} :heavy_check_mark: it's not a shot! you live to roulette another round!`);
         selector++;
       }

       if(selector === game.players.length) selector = 0;

       while(game.players[selector] === null){
         if(selector === game.players.length) selector = 0;
         else selector++;
       }

       /*if(selector == game.players.length || selector == game.players.length - 1)
       {
         selector = 0;
         death = false;
       }
       else if(death == false) selector++;
       else death = false;*/

      if(playerNum == 1)
      {
        let winner;
        for(var i = 0; i < game.players.length; i++){
          if(game.players[i] != null){
            winner = i;
            break;
          }
        }
        m.channel.send(">game over, `" + game.players[winner].displayName + "` wins!");
        delete games[id];
        bot.clearInterval(gameInterval);
        console.log("---game over---");
      }
    }, eventInterval*1000);
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//on message
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.on("message", msg => {
  if(((msg.author.id == nootbotid)) && ((lockdown == true) || ((lockdown == false) && (msg.author.id !== gt)))) return
  if((msg.guild) && (!msg.channel.guild.members.get(nootbotid).permissions.has('SEND_MESSAGES'))) return //if has no send message perm
  //log(msg);

  let input = msg.content.toUpperCase();

  if(msg.content === "@anyone")
  {
    if(msg.channel.type !== "text") return
    msg.channel.send(msg.guild.members.random().toString());
  } else //@anyone

  if(msg.content === "@me")
  {
    if(msg.channel.type !== "text") return
    msg.channel.send(msg.author.toString());
  } else //@me

  if(msg.content === "@owner")
  {
    if(msg.channel.type !== "text") return
    msg.channel.send(msg.guild.owner.toString());
  } else //@owner

  if(input === "NOOT NOOT")
  {
    giphy.search({q: "pingu"}, function(err, res)
    {
      if(!res) return
        if (res.data.length > 0)
        {
          var rn = (Math.floor(Math.random() * (res.data.length)) + 0);
          msg.channel.send(res.data[rn].images.original.url);
        }
        else
        {
          msg.channel.send("noot noot");
        }
    });
  } else //noot noot

  if((input.includes("U SUCK") || input.includes("YOU SUCK") || input.includes("FUCK U") || input.includes("FUCK YOU") || input.includes("UR GAY") || input.includes("YOUR GAY") || input.includes("YOURE GAY") || input.includes("YOU'RE GAY") || input.includes("KYS") || input.includes("KILL YOURSELF")) && !(input.includes("UP")))
  {
    msg.channel.send("no u");
  } else //u suck

  if(input === ("NO U") || input === ("NO YOU") || input === ("NOU") || input === ("N0U") || input === ("N0 U"))
  {
    msg.channel.send("no u");
  } else //no u

  if(input.toUpperCase() === "K" || input.toUpperCase() === "OOF" ){
    msg.channel.send("oof");
  } else //oof

  if(input.toUpperCase() === "F" || input.toUpperCase() === "RIP"){
    msg.channel.send("F");
  } //F in chat

  if(input.startsWith(prefix + "AAAA "))
  {
    let num = msg.content.split(" ")[1];
    if(isNaN(num) || (num < 1 || num > 10)) return;
    var res = "";
    for(var i = 0; i < num; i++)
    {
      let rn = Math.floor(Math.random() * 10);
      for(var j = 0; j < rn; j++)
      {
        res = res + " ";
      }
      res = res + "AAAAAAAAAA\n";
    }
    msg.channel.send(`\`\`\`${res}\`\`\``);
  } else //aaaa

  if(input.startsWith(prefix + "ECHO "))
  {
    let echo = msg.content.split(" ")[1];
    var res = "";
    for(var i = 0; i < 10; i++)
    {
      let rn = Math.floor(Math.random() * 10);
      for(var j = 0; j < rn; j++)
      {
        res = res + " ";
      }
      res = res + echo + "\n";
    }
    msg.channel.send(`\`\`\`${res}\`\`\``);
  } else //echo

  if(msg.channel.id === grtarget)
  {
    dictionary((err, dict) => {
      let spell = Nspell(dict);

      ["xd", "lol", "jk", "ttyl", "afk", "diy", "imo", "lmao", "lmfao", "skid", "wtf", "wth", "jfc", "omfg", "omg", "jfc", "kys", "ok"].forEach(i => {
        spell.add(i);
      });
      let words = msg.content.split(" ");
      let incorrect;
      let word;

      let done = false;
      words.forEach(i => {
        if (spell.correct(i) == false && done == false) {
          word = i;
          incorrect = spell.suggest(i)[0];
          if(!incorrect) return;
          msg.channel.startTyping();
          setTimeout(() => {
              if(incorrect) {
                  msg.reply(incorrect + "*".repeat(Math.ceil(Math.random()*2)));
                  msg.channel.stopTyping();
              }
          }, 3000);
          console.log(msg.member.displayName + " was an idiot and spelt " + word + " wrong. Was corrected to " + incorrect);
          done = true;
        }
      });
    });
  } else //spell check

  if(input.startsWith("_GAME START"))
  {
    if(msg.channel.id !== nbcontrol) return;
    msg.channel.send("_game join");
  } else //game join

  if(msg.content.startsWith(prefix)) handleCMD(msg);
  lastevent = `message: ${msg.content} by: ${msg.author.username}`;
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

process.on("unhandledRejection", err => {
  if(!err) return console.error("Unknown promise error");
  console.error("Uncaught Promise Error: \n" + err.stack);
  console.log(`last event: ${lastevent}`);
});

bot.login(process.env.BOT_TOKEN);
