const { response } = require("express");
const { resolve } = require("path");

// Classe qui manipule la collection users de la BD
class Users {
  constructor(db) {
	this.db = db
  }
  // Creer un nouveau user dans BD
  create(login, password, lastname, firstname) {
	return new Promise((resolve, reject) => {
			const user = {
				login: login,
				password: password,
				lastname: lastname,
				firstname: firstname
			};
			this.db.users.insert(user, function (err, newDoc){
				if (newDoc) resolve(newDoc._id);
				else resolve();
			})
	});
  }
  // Retourne user avec le userid correspondant
  get(userid) {
	return new Promise((resolve, reject) => {
	  	this.db.users.findOne({_id: userid}, function (err, doc){
		if (doc) resolve(doc)
		else resolve()
		})
	});
  }
  // Retourne le userid, si le login existe
  async exists(login) {
	return new Promise((resolve, reject) => {
	  this.db.users.findOne({login: login}, function (err, doc){
		if (doc) resolve(doc._id)
		else resolve()
		})
	});
  }
  // Verifie si le login et le password est correcte
  async checkpassword(login, password) {
	return new Promise((resolve, reject) => {
	  this.db.users.findOne({login: login, password:password}, function (err, doc){
		  if (doc) resolve(doc._id)
		  else resolve()
	  })
	});
  }

  // Supprime le user dans la BD
  deleteUser(userid) {
	return new Promise((resolve, reject) => {
	  this.db.users.remove({_id: userid}, function (err, doc){
		if (doc){
			resolve(userid)
		} 
		else resolve()
		})
	});
  }

  // Retourne le nombre d'users dans la BD
  getUserInfo(){
	return new Promise((resolve,reject)=>{
	  this.db.users.count({},function(err,val){
	  	resolve(val)
	  })
  });
  }
}
exports.default = Users;

