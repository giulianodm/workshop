# Aplicação para inscrição de participantes em Workshops

Esta aplicação utiliza Node.js e Cloudant para inscrição de pessoas em workshops.

# Como utilizar?

* Bluemix Services e Runtimes

Crie os seguintes serviços e runtimes no Bluemix:

Node.js: SDK for Node.js Cloud Foundry application

Cloudant: crie um serviço Cloudant com o nome workshop-cloudant e o associe à aplicação Node.js

Sendgrid: crie um serviço no Sendgrid para envio de e-mail

* Git

Clone o repositório

```
  git clone https://github.com/placerda/workshop.git
```

Em seguida:

renomeie config.template.js para config.js.

renomeie manifest.template.yml para manifest.template.yml.

Atualize o conteúdo dos dois arquivos renomeados com seus dados.


* Instruções Cloudant:

O serviço cloudant deve ter um database com o nome de sua preferência e
com um search index em um design document chamado design_participants, com a seguinte função:

*participants*
```javascript
function (doc) {
  index("nome_evento", doc.nome_evento);
}
```

Pronto! Agora é só dar o push da aplicação no Bluemix.
