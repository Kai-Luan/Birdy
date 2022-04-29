import React, {useEffect, useState, useContext} from 'react';
import {MessagePage} from "./Message";
import {api, UserContext} from './Utils'
import '../css/Profile.css'

export const ProfilePage = ({userid, username}) =>{
	const me = useContext(UserContext)
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
				<button className='removeFriend' onClick={() => addFriend(userid)}> + </button>
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

export const User = ({username}) =>{
	return (<div className='User'>
			<img className="ProfileIcon" src={require('../images/bird_profile.png')} alt="Profile Icon" />
			<label className="username">{username}</label>
		</div>)
}

export const ListAmi = ({userid}) => {
	const [listAmi, setListAmi] = useState([])
	useEffect(() => {
		console.log("ListAmi: ", userid)
		getListAmi()
	}, [userid])

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
		<div className="ListAmi"> {listAmi.map(({_id, friend_id, friendname}) => <Ami key={_id} userid={friend_id} username={friendname} remove={removeFriend}/>)} </div> 
	)
}

export const Ami = ({username, userid, remove}) => {
	return (<div className='Ami'>
			<label className='username'>{username}</label>
			<button className='removeFriend' onClick={() => remove(userid)}> - </button>
		</div>)
}
