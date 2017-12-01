# Aplicação para inscrição de participantes em Workshops

Esta aplicação utiliza Node.js e Cloudant para inscrição de pessoas em workshops.

url para usuário se inscrever:

https://\<sua app\>/inicio

url para baixar a lista de participantes:

https://\<sua app\>/list (necessário informar o token, indicado em config.js)

# Como utilizar?

* Bluemix Services e Runtimes

Crie os seguintes serviços e runtimes no Bluemix:

Node.js: SDK for Node.js Cloud Foundry application

Cloudant: crie um serviço Cloudant com o nome **workshop-cloudant** e o associe à aplicação Node.js

Sendgrid: crie um serviço no Sendgrid para envio de e-mail

* Git

Clone o repositório

```
  git clone https://github.com/placerda/workshop.git
```

Em seguida:

renomeie helpers/config.template.js para helpers/config.js.

renomeie manifest.yml.template para manifest.template.yml.

renomeie angular/templates/confirmacao.template.html para angular/templates/confirmacao.html.

renomeie angular/templates/inicio.template.html para angular/templates/inicio.html.

Atualize o conteúdo dos dois arquivos renomeados com seus dados.


* Instruções Cloudant:

O serviço cloudant deve ter um database com o nome de sua preferência e
com um search index em um design document chamado **design_participants**,
com a seguinte implementação:

```javascript
{
  "_id": "_design/design_participants",
  "_rev": "3-b049119d5e89deeda5633a6055783017",
  "views": {},
  "language": "javascript",
  "indexes": {
    "participants": {
      "analyzer": "standard",
      "index": "function (doc) {\n  index(\"nome_evento\", doc.nome_evento);\n}"
    }
  }
}
```

Pronto! Agora é só dar o push da aplicação no Bluemix.
