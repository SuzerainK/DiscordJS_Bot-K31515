module.exports = {
    name: 'say',
    description: "this is a say command!",
    execute(message, args){
        if(!args[1]) return message.channel.send('Say what?');
            let say = args.splice(1).join(" ")
            message.channel.bulkDelete(1);
            message.channel.send(say)
    }
}