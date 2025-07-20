const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');
require('dotenv').config();

// ESTA É A LINHA QUE ESTAVA FALTANDO OU INCORRETA
exports.handler = async (event) => {
  const isValid = await verifyKeyMiddleware(process.env.DISCORD_PUBLIC_KEY)(event);
  if (!isValid) {
    console.error('Invalid Request Signature');
    return { statusCode: 401, body: 'Bad request signature' };
  }

  const body = JSON.parse(event.body);

  if (body.type === InteractionType.PING) {
    return {
      statusCode: 200,
      body: JSON.stringify({ type: InteractionResponseType.PONG }),
    };
  }

  if (body.type === InteractionType.APPLICATION_COMMAND) {
    const commandName = body.data.name;

    switch (commandName) {
      case 'ola':
        return {
          statusCode: 200,
          body: JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Olá, ${body.member.user.username}! Eu sou o Minitron, pronto para servir.`,
            },
          }),
        };
      default:
        return { statusCode: 400, body: JSON.stringify({ error: 'Comando não encontrado.' }) };
    }
  }
  
  return { statusCode: 404, body: 'Not Found' };
};