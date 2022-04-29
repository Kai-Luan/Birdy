const { response } = require("express");
const { resolve } = require("path");

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
			resolve(docs)
		})
		});
	}

  	// Modifie un message prexistant
	setMessage(userid, name, date, new_message, old_message){
		return new Promise((resolve, reject) => {
			this.db.messages.update({author_id:userid, date:date, text:old_message}, {author_id:userid, author_name:name, date:date, text:new_message}, function (err, docs){
				resolve(docs)
			})
		});
	}

  	// Supprime un message de la BD
	removeMessage(message_id){
		return new Promise((resolve, reject) => {
			this.db.messages.remove({_id: message_id}, function (err, docs){
				if (err) resolve()
				resolve(1)
			})
		});
	}
	}
exports.default = Messages;

