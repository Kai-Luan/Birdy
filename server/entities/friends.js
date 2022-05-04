const { response } = require("express");
const { resolve } = require("path");

// Classe qui manipule la collection friends de la BD
class Friends {
  constructor(db) {
	this.db = db
  }
  // Cree une relation d'ami dans la BD
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
  // Get All Friends from user
  getListFriend(userid) {
	return new Promise((resolve, reject) => {
		this.db.friends.find({userid: userid}, function (err, list){
			if (list){
                let res = list.map(({_id, friendname, friend_id}) => {return {_id: _id, friend_id: friend_id, friendname: friendname}})
                resolve(res)
            }
			else resolve();
		})
	});
  }
  // Retourne la realtion entre user et friend
  getFriendRelationship(userid, friend_id) {
	return new Promise((resolve, reject) => {
	  this.db.friends.findOne({userid: userid, friend_id:friend_id}, function (err, docs){
		if (docs) resolve(docs.userid)
		else resolve()
		})
	});
  }
  // Supprime la relation dans la BD
  deleteFriend(userid, friend_id) {
	return new Promise((resolve, reject) => {
	  this.db.friends.remove({userid: userid, friend_id:friend_id}, function (err, doc){
		if (doc) resolve(userid)
		else resolve()
		})
	});
  }
  // Donne le nombre d'amis d'un user
  getFriendInfo(userid){
	return new Promise((resolve,reject)=>{
			  this.db.friends.count({userid: userid},function(err,val){
			  if(val) resolve(val)
			  else resolve()
		  })
	  });
  }
}
exports.default = Friends;