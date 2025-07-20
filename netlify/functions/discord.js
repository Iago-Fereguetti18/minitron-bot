const { InteractionType, InteractionResponseType, verifyKey } = require('discord-interactions');
require('dotenv').config();

exports.handler = async (event) => {
  // A verificação de segurança agora é mais explícita
  const signature = event.headers['x-signature-ed25519'];
  const timestamp = event.headers['x-signature-timestamp'];
  const rawBody = event.body;
  const isValidRequest = verifyKey(rawBody, signature, timestamp, process.env.DISCORD_PUBLIC_KEY);

  if (!isValidRequest) {
    console.error('Invalid Request Signature');
    return { statusCode: 401, body: 'Bad request signature' };
  }

  const body = JSON.parse(rawBody);

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