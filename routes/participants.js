var express = require('express')
  , router = express.Router()
  , db = require('../helpers/db')
  , request = require('sync-request')
  , json2csv = require('json2csv')
  , config = require('../helpers/config');

  router.post('/add', function(request, response) {
      var database = db.initDBConnection();
      var doc = request.body;
      doc.nome_evento = config.workshop.nome_evento;
      doc.data_evento = config.workshop.data_evento;
      doc.data_inscricao = new Date();
      db.insereDoc(database, doc, function(erro){
        if (erro != null){
          console.log('[api][participants add] error: ' + JSON.stringify(erro));
          console.log(doc);
          response.writeHead(400, "NOK", {'Content-Type': 'text/plain'});
          response.end();
        }else{
          console.log('[new participant]:');
          sendemail(doc.email, doc.nome);
          response.writeHead(200, "OK", {'Content-Type': 'text/plain'});
          response.end();
        };
      });
  });



 var sendemail = function (email, nome){
 //envia e-mail para participante
 var helper = require('sendgrid').mail;
 var from_email = new helper.Email(config.email.from_email, config.email.from_name);
 var to_email = new helper.Email(email, nome);
 var subject = config.email.subject;
 var content = new helper.Content('text/plain', config.email.conteudo);
 var mail = new helper.Mail(from_email, subject, to_email, content);

 var sg = require('sendgrid')(config.email.sendgridkey);
 var request = sg.emptyRequest({
   method: 'POST',
   path: '/v3/mail/send',
   body: mail.toJSON(),
 });
 sg.API(request, function(error, response) {
   console.log("[api][participants add] sendmail participante: " + response.statusCode);
   //console.log(response.body);
   //console.log(response.headers);
 });

 //envia e-mail notificacao
 subject = config.email.subject;
 content = new helper.Content('text/plain', 'inscricao no evento: ' + nome + ' - ' + email);
 for (var j in config.email.notification_list){
   to_email = new helper.Email(config.email.notification_list[j]);
   var notification = new helper.Mail(from_email, subject, to_email, content);
   var request = sg.emptyRequest({
     method: 'POST',
     path: '/v3/mail/send',
     body: notification.toJSON(),
   });
   sg.API(request, function(error, response) {
     console.log("[api][participants add] sendmail notificacao: " + response.statusCode);
   });
 };

};


  router.post('/list', function(request, response) {

    //validação do token no arquivo de configuração
    if (config.workshop.token == request.body.token) {
      erro = 0;
    } else{
      erro = 1; mensagem = 'token não confere'
    }

    /* validação do token no db
    var database = db.initDBConnection();
    db.readDocument(database, 'idtoken', function(err, data){
      //error handling
      var mensagem = '';
      var erro = 0;
      if (err != null){
        erro = 1; mensagem = JSON.stringify(err);
      } else if (data == 'Error: missing'){
        erro = 1; mensagem = 'tokenid não encontrado no cloudant';
      } else{
        if (data.token == request.body.token) {
          erro = 0;
        } else{
          erro = 1; mensagem = 'token não confere'
        }
      };
      */

      //return the list or the error
      if (erro == 0){
        //response.writeHead(200, obtemLista(), {'Content-Type': 'text/csv'});
        response.send(obtemLista());
        response.end();
      } else {
        console.log('[api][participants list] error: ' + mensagem + '.');
        response.writeHead(400, mensagem, {'Content-Type': 'text/plain'});
        response.end();
      }
    });
  });

  var obtemLista =  function() {
    var key = 'nome_evento:\"' + encodeURIComponent(config.workshop.nome_evento) +  '\"';
    var parameters = 'include_docs=true&q='+ key;
    var urlConsulta = config.db.url + '/' + config.db.name + '/_design/' +
                     config.db.designdocument + '/_search/participants?' + parameters;
    var res = request('GET', urlConsulta);
    data = JSON.parse(res.getBody('utf8'));

    var values = [];
    for (var i in data.rows){
      values.push(data.rows[i].doc);
    }
    var fields = ['nome', 'email', 'telefone', 'empresa', 'data_inscricao', 'expectativa'];
    var csv = json2csv({ data: values, fields: fields });
    return csv;
  };

  module.exports = router;
