import React, { useEffect, useState, useContext} from 'react';
import {UserContext, api, Popup, MessagesContext} from './Utils';


// Barre de Recherche pour les messages
export const RechercheMessage = () => {
	const [text, setText] = useState('')
	const [option, setOption] = useState('All')
	const setMessages = useContext(MessagesContext)
	// Recherche les messages avec les mots-clés donnés
	function submit(){
		if (text==="") return 
		let path = ""
		if (option==="All") path = "apimessages/messages/filter/"+text
		else path = "apimessages/messages/filter/friends/"+text
		api.get(path)
		.then((response) => {
			console.log("Filtered Messages: ", response.data.messages)
			setMessages(response.data.messages)
			setText('')
		})
		.catch((error) => {
			setText('')
			console.log(error.response.data.message)
		})
	}
    return (
            <div className="BarreRecherche">
				<select value={option} onChange={(e) => setOption(e.target.value)}>
					<option value="All">All</option>
					<option value="only friends">Friends</option>
				</select>
                <input id="zone de recherche" placeholder="Rechercher messages / amis " values={text} onChange={evt => setText(evt.target.value) }/>
                <div className="Button" onClick={submit}>OK</div>
            </div>)
}

// Classe qui gère l'affichage des messages et de la saisie de nouveau message
export const MessagePage = ({saisie, userid, toUserProfile, filteredMessages}) => {
	const [messages, setMessages] = useState([])
	const me = useContext(UserContext)
	const [popup, setPopup] = useState()
	const setFilteredMessages = useContext(MessagesContext)

	useEffect(() => {
		console.log("MessagePage: ",userid)
		getMessageList()
	}, [userid])
	// Recupere les messages à afficher au serveur
	function getMessageList(){
		let path = "apimessages/messages"
		if (userid) path =`apimessages/user/${userid}/messages`
		api.get(path)
		.then((response) => {
			console.log("Messages: ", response.data)
			setFilteredMessages()
			let list = response.data
			list = list.sort(function(a, b){return new Date(b.date) - new Date(a.date)})
			list  = list.map(({_id, author_name, author_id, date, text}) =>{ 
				return <Message key={_id} _id={_id} userid={author_id} name={author_name} date={date} text={text} toProfile={toUserProfile} remove={userid===me && setPopup}/>
			})
			setMessages(list)
		})
		.catch((error) => {
				console.log(error.response.data.message)
		})
	}
	// Demande la suppression d'un message, au serveur, et recharge la page
	function remove(message_id){
		setPopup()
		api.delete(`apimessages/user/${userid}/messages/${message_id}`)
		.then((response) => {
			console.log("Message posted")
			getMessageList()
		})
		.catch((error) => {
			console.log("error: ", error.response.data.message)
		})
	}
	// Demande la création d'un nouveau message, et recharge la page
	function push(text){
		api.post('apimessages/user/messages', {text: text})
		.then((response) => {
			console.log("Message posted")
			setFilteredMessages()
			getMessageList()
		})
		.catch((error) => {
			console.log(error.response.data.message)
		})
	}
	return(<div className="MessagePage">
				{ saisie && <SaisieMessage push={push}/> }
				{ popup && <Popup title="Supprimer le message" text="Tu es sûr(e) de vouloir supprimer ce message ?" confirm={() => remove(popup)} annuler={()=>setPopup()} />}
				<label> Tweets </label>
				<div className="ListMessage">{
					filteredMessages ? filteredMessages.map(({_id, author_name, author_id, date, text}) =>{ return <Message key={_id} _id={_id} userid={author_id} name={author_name} date={date} text={text} toProfile={toUserProfile} remove={userid===me && setPopup}/>})
					:
					messages
				}
				</div>
			</div>)
}

// Saisie de nouveau message
export const SaisieMessage = ({push}) => {
	const [text, setText] = useState('')
	function submit(){
		if (text==='') return;
		push(text)
		setText('')
	}
	return(<div className="SaisieMessage">
	    	<input type="text" id="New Messages" value={text} placeholder="Nouveau message" onChange={evt => setText(evt.target.value)}/>
	        <div className="Button" onClick={() => submit()}>OK</div>
	    </div>)
}

// Message à afficher
export const Message = ({_id, userid, name, date, text, toProfile, remove}) =>{
	return (<div className='Message'>
				<div>
					<label className="pseudo" onClick={() => {toProfile && toProfile(userid, name)}} >{name}</label>
					<label className="date">{dateToString(date)}</label>
				</div>
				<label className="MessageText">{text}</label>
				{remove && <img className="removeMessageImage" src={require('../images/bin.png')} alt="Remove Message Logo (bin)" onClick={() => remove(_id)}/>}
			</div>)
}

// Donne le temps de création du message
function dateToString(date){
	const now = new Date()
	date = new Date(date)
	const d = now.getDate()
	const h = now.getHours()
	const m = now.getMinutes()
	const s = now.getSeconds()
	if (date.getDate() < d) return d - date.getDate() + " days ago"
	if (date.getHours() < h) return h - date.getHours() + " hours ago"
	if (date.getMinutes() < m) return m - date.getMinutes() + " minutes ago"
	if (date.getSeconds() < s) return s - date.getSeconds() + " seconds ago"
	return 'now'
}