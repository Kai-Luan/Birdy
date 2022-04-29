const { response } = require("express");
const { resolve } = require("path");

// Classe qui manipule la collection users de la BD
class Users {
	constructor(db) {
		this.db = db
	}
	// Cree un nouveau utilisateur dans la BD
	create(login, password, lastname, firstname) {
		return new Promise((resolve, reject) => {
				const user = {
					login: login,
					password: password,
					lastname: lastname,
					firstname: firstname
				};
				this.db.users.insert(user, function (err, newDoc){
					if (newDoc){
						resolve(newDoc._id);
					}
					else{
						resolve();
					}
				})
		});
	}

  	// Retourne toutes les informations d'un user
	get(userid) {
		return new Promise((resolve, reject) => {
			this.db.users.findOne({_id: userid}, function (err, docs){
			if (docs){
				resolve(docs)
			}
			else resolve()
			})
		});
	}

  	// Verifie si un user exists
	async exists(login) {
		return new Promise((resolve, reject) => {
		this.db.users.findOne({login: login}, function (err, docs){
			if (docs){
				resolve(docs._id)
			}
			else{
				resolve()
			}
			})
		});
	}

	// Verifie si le login et password sont correctes 
	async checkpassword(login, password) {
		return new Promise((resolve, reject) => {
		this.db.users.findOne({login: login, password:password}, function (err, docs){
			if (docs) resolve(docs._id)
			else resolve()
		})
		return
		});
	}
}
exports.default = Users;

