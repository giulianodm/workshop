/** Template Configuration File */
/* rename to config.js after adding your project data */
var config = {};

// configuration to run application locally
config.db =
{
  "name" : /* USE YOUR CREDENTIALS HERE */,
  "username": /* USE YOUR CREDENTIALS HERE */,
  "password": /* USE YOUR CREDENTIALS HERE */,
  "host": /* USE YOUR CLOUDANT HOST HERE */,
  "port": 443,
  "url": /* USE YOUR URL HERE */,
  "designdocument" : "design_participants"
}

config.workshop =
{
  "nome_evento" : /* ADD EVENT NAME HERE, EXAMPLE: 'workshopintegracao' */,
  "data_evento" : new Date(YYYY, MM, DD) //atenção mês (MM) vai de 0 a 11
}

config.email =
{
  "sendgridkey" : /* ADD YOUR SENDGRID KEY HERE */,
  "subject" : "Inscrição Workshop IBM",
  "from_email": /* ADD YOUR FROM ADDRESS HERE */,
  "from_name": "Equipe IBM",
  "notification_list": [/* EMAIL1 */, /* EMAIL2 */],
  "conteudo": /* ADD YOUR CONTENT HERE */
}

module.exports = config;
