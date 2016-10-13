var config = require('./config'),
		cloudant = require('cloudant');

var initDBConnection = function (){
  var cloudant;
  var dbCredentials = {
  	dbName : config.db.name
  };
	if(process.env.VCAP_SERVICES) {
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
    var db;
		// Pattern match to find the first instance of a Cloudant service in
		// VCAP_SERVICES. If you know your service key, you can access the
		// service credentials directly by using the vcapServices object.
		for(var vcapService in vcapServices){
			if(vcapService.match(/cloudant/i)){
				dbCredentials.host = vcapServices[vcapService][0].credentials.host;
				dbCredentials.port = vcapServices[vcapService][0].credentials.port;
				dbCredentials.user = vcapServices[vcapService][0].credentials.username;
				dbCredentials.password = vcapServices[vcapService][0].credentials.password;
				dbCredentials.url = vcapServices[vcapService][0].credentials.url;

				cloudant = require('cloudant')(dbCredentials.url);

				// check if DB exists if not create
				cloudant.db.create(dbCredentials.dbName, function (err, res) {
					if (err) { /*console.log('[db] initDBConnection db already exists');*/ }
				});

				db = cloudant.use(dbCredentials.dbName);
				break;
			}
		}
		if(db==null){
      console.log('[db] initDBConnection could not find Cloudant credentials');
		}
	} else{
      /* console.log('[db] initDBConnection runing local'); */
		  dbCredentials = { dbName: config.db.name,
				    username: config.db.username,
				    password: config.db.password,
						localConf: false,
				    host: config.db.host,
				    port: config.db.port,
				    url: config.db.url}
		  cloudant = require('cloudant')(dbCredentials.url);
		  // check if DB exists if not create
		  cloudant.db.create(dbCredentials.dbName, function (err, res) {
					if (err) { /*console.log('[db] initDBConnection db already exists');*/ }
		  });
		 db = cloudant.use(dbCredentials.dbName);
	}
  return db;
};

//insert new doc
function insereDoc(db, doc, callback) {
	db.insert(doc, function(err, data) {
		if(err) {
			console.log('[db] [insereDoc] error inserting document');
			callback(err);
		} else {
			console.log('[db] [insereDoc] success');
			callback(null);
		}
	});
}

//check if doc exists before insert, if exists update it.
function gravaDoc(db, doc, callback) {
	var documentId = doc._id;
  //try read
  readDocument(db, doc._id, function(err, document) {
    if(document==null) {
      // document not found: let's try to save
      db.insert(doc, function(err, data) {
        if(err) {
          console.log('[', documentId, '] [db][gravaDoc] error inserting document');
					callback(err);
        } else {
					console.log('[', documentId, '] [db] inserted');
					callback(null);
        }
      });
    } else {
      // document already exists let's update it
      doc._rev = document._rev;
      doc._id = document._id;
      db.insert(doc, function(err, data) {
        if(err) {
					console.log('[', documentId, '] [db][gravaDoc] error updating document');
					callback(err);
        }
        else {
					console.log('[', documentId, '] [db] updated');
					callback(null);
        }
      });
    }
  });
};



function readDocument(db, doc_id, callback) {
  db.get(doc_id, function(err, data) {
    if(err) {
      callback(err, null);
    }else {
      callback(null, data);
    }
  });
};

module.exports = {
  initDBConnection: initDBConnection,
	insereDoc: insereDoc,
	readDocument: readDocument
};
