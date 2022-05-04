import React, {useEffect, useState, useContext} from 'react';
import {MessagePage} from "./Message";
import {api, UserContext} from './Utils'


// Page de profil, affiche le profil de l'utilisateur 
// avec le userid correspondant
export const ProfilePage = ({userid, username}) =>{
	const me = useContext(UserContext)
	const [nbFriend, setNbFriend] = useState()
	const [nbMessage, setNbMessage] = useState()

	useEffect(()=>{
		// Recupère le nombre d'amis
		api.get(`apifriends/user/${userid}/infos`)
		.then((response) => {
			console.log("Nombre d' Amis: ", response.data.count)
			setNbFriend(response.data.count)
		})
		.catch((error) => {
			console.log("Echec getFriendInfo")
			console.log(error.response.data.message)
		})
		// Recupère le nombre de messages
		api.get(`apimessages/user/${userid}/infos`)
		.then((response) => {
			console.log("Nombre de messages: ", response.data.count)
			setNbMessage(response.data.count)
		})
		.catch((error) => {
			console.log("Echec getInfoMessageUser")
			console.log(error.response.data.message)
		})
	}, [userid])
	// Enregistre la suivie d'une personne, au serveur
	function addFriend(userid){
		api.post(`apifriends/user/${me}/friends/${userid}`)
		.then((response) => {
			console.log("Friends: ", response.data)
		})
		.catch((error) => {
			console.log("Echec addFriend")
				console.log(error.response.data.message)
		})
	}

	return <section className='ProfilePage'>
		<div className='Profile'>
			<div>
				<label> Profil </label>
				<hr/>
					<User username={username}/>
				<hr/>
					<div className='Stats'>Follows: {nbFriend}</div>
					<div className='Stats'>Messages: {nbMessage}</div>
				{me!==userid && <button className='addFriend' onClick={() => addFriend(userid)}> + </button>}
			</div>
			<div className='Amies'>
				Liste des amis
				<hr/>
				<ListAmi userid={userid}/>
			</div>
		</div>
		<MessagePage saisie={false} userid={userid} />
	</section>
}

// Nom et l'image de profil
export const User = ({username}) =>{
	return (<div className='User'>
			<img className="ProfileIcon" src={require('../images/bird_profile.png')} alt="Profile Icon" />
			<label className="username">{username}</label>
		</div>)
}

// Liste des amis, de user (userid)
export const ListAmi = ({userid}) => {
	const [listAmi, setListAmi] = useState([])
	const me = useContext(UserContext)
	useEffect(() => {
		console.log("ListAmi: ", userid)
		getListAmi()
	}, [userid])
	// Recupère la liste des amis de l'user, au serveur
	function getListAmi(){
		api.get(`apifriends/user/${userid}/friends`)
		.then((response) => {
			console.log("Friends: ", response.data)
			setListAmi(response.data.friends)
		})
		.catch((error) => {
				console.log(error.response.data.message)
		})
	}
	// Enregistre la suppression d'un ami, au serveur
	function removeFriend(friendid){
		api.delete(`apifriends/user/${userid}/friends/${friendid}`)
		.then((response) => {
			console.log("Friends: ", response.data)
			getListAmi()
		})
		.catch((error) => {
			console.log("Echec removeFriend")
				console.log(error.response.data.message)
		})
	}
	return(
		<div className="ListAmi"> {listAmi.map(({_id, friend_id, friendname}) => <Ami key={_id} userid={friend_id} username={friendname} remove={me===userid && removeFriend}/>)} </div> 
	)
}

// Ami
export const Ami = ({username, userid, remove}) => {
	return (<div className='Ami'>
			<label className='username'>{username}</label>
			{remove && <button className='removeFriend' onClick={() => remove(userid)}> - </button>}
		</div>)
}
