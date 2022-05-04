const { response } = require("express");
const { resolve } = require("path");
const { chain } = require("underscore");

// Classe qui manipule la collection messages de la BD
class Messages {
	constructor(db) {
		this.db = db
	}
  	// Permet de crée un nouveau message dans la BD
	create(userid, author_name, text) {
		return new Promise((resolve, reject) => {
			const m = {
				author_id: userid,
				author_name: author_name,
				date: new Date(),
				text: text
			};
			this.db.messages.insert(m, function (err, newDoc){
				if (newDoc){
					resolve(text);
				}
				else{
					resolve();
				}
			})
		});
	}

  	// Retourne tous les messages de la base de données
	getListMessage() {
		return new Promise((resolve, reject) => {
		this.db.messages.find({}, function (err, docs){
			resolve(docs)
		})
		});
	}

  	// retourne tous les messages d'un user
	getListMessageFromUser(userid) {
		return new Promise((resolve, reject) => {
		this.db.messages.find({author_id:userid}, function (err, docs){
			resolve(docs)
		})
		});
	}

  	// retourne tous les messages de tous les amis
	getListMessageFromAllFriend(friends) {
		return new Promise((resolve, reject) => {
		this.db.messages.find({author_id: { $in: friends}}, function (err, docs){
			if (err) resolve()
			resolve(docs)
		})
		});
	}

  	// Modifie un message prexistant
	setMessage(userid, name, date, new_message, old_message){
		return new Promise((resolve, reject) => {
			this.db.messages.update({author_id:userid, date:date, text:old_message}, {author_id:userid, author_name:name, date:date, text:new_message}, function (err, doc){
				resolve(doc)
			})
		});
	}

  	// Supprime un message de la BD
	removeMessage(message_id){
		return new Promise((resolve, reject) => {
			this.db.messages.remove({_id: message_id}, function (err, doc){
				if (err) resolve()
				resolve(doc)
			})
		});
	}

	// Recherche les messages selon les mots clés
	getFilteredListMessage(keywords, friends=undefined){
		return new Promise((resolve, reject) => {
			var query = {}
			if (keywords.length!=0){
				console.log("\tKeywords: ", keywords)
				var chaine = keywords.map(s => "(?=.*?\\b"+s+"\\b)")
				console.log("\tChaine: ", chaine)
				query.text = new RegExp('^' + chaine.join(""))
			} 
			if (friends) query.author_id = {$in: friends}
			console.log("\tQuery: ", query)
			this.db.messages.find(query, function (err, docs){
				if (err) resolve()
				else resolve(docs)
			})
		});
	}
	// Retourne le nombre de messages d'un user dans la BD
	getInfoMessageUser(userid){
		return new Promise((resolve, reject)=>{
		  	this.db.messages.count({author_id: userid},function(err,val){
			  	resolve(val)
			  })
		  });
	  }

	// Retourne le nombre de messages dans la BD
	getInfoAllMessage(){
		return new Promise((resolve, reject)=>{
			this.db.messages.count({},function(err,val){
				resolve(val)
			})
		});
	}
}
exports.default = Messages;