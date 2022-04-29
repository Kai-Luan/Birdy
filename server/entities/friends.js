const { response } = require("express");
const { resolve } = require("path");

// Classe qui manipule la collection friends de la BD
class Friends {
	constructor(db) {
		this.db = db
	}
  	// Permet de suivre un user
	create(userid, username, friend_id, friendname) {
		return new Promise((resolve, reject) => {
			const f= {
				userid: userid,
				username: username,
				friendid: friend_id,
				friendname: friendname
			}
			this.db.friends.insert(f, function (err, newDoc){
				if (newDoc) resolve(userid);
				else resolve();
			})
		});
	}

	// Retourne la liste des amis d'un utilisateur (userid)
	getListFriend(userid) {
		return new Promise((resolve, reject) => {
			this.db.friends.find({userid: userid}, function (err, list){
				if (list){
					let res = list.map(({_id, friendname, friend_id}) => {return {_id:_id, friend_id: friend_id, friendname: friendname}})
					resolve(res)
				}
				else resolve();
			})
		});
	}

	// Retourne la relation entre userid et friend_id
	getFriendRelationship(userid, friend_id) {
		return new Promise((resolve, reject) => {
		this.db.friends.findOne({userid: userid, friend_id:friend_id}, function (err, docs){
			if (docs) resolve(docs.userid)
			else resolve()
			})
		});
	}

	// Permet d'arrêter de suivre un user
	deleteFriend(userid, friend_id) {
		return new Promise((resolve, reject) => {
		this.db.friends.remove({userid: userid, friend_id:friend_id}, function (err, doc){
			if (doc){
				resolve(userid)
			} 
			else resolve()
			})
		});
	}
}
exports.default = Friends;