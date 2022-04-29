import React, { useEffect, useState, useContext} from 'react';
import {UserContext, api} from './Utils';

export const RechercheMessage = () => {
    return (
            <div className="BarreRecherche">
                <input type="search" id="zone de recherche" placeholder="Rechercher messages / amis "/>
                <div className="Button" type="search">OK</div>
            </div>)
}

export const MessagePage = ({saisie, userid, toUserProfile}) => {
	const [messages, setMessages] = useState([])
	const me = useContext(UserContext)

	useEffect(() => {
		console.log("MessagePage: ",userid)
		getMessageList()
	}, [userid])

	function getMessageList(){
		let path = "apimessages/messages"
		if (userid) path =`apimessages/user/${userid}/messages`
		api.get(path)
		.then((response) => {
			console.log("Messages: ", response.data)
			let list = response.data
			list = list.sort(function(a, b){return new Date(b.date) - new Date(a.date)})
			list  = list.map(({_id, author_name, author_id, date, text}) =>{ 
				return <Message key={_id} _id={_id} userid={author_id} name={author_name} date={date} text={text} toProfile={toUserProfile} remove={userid===me &&remove}/>
			})
			setMessages(list)
		})
		.catch((error) => {
				console.log(error.response.data.message)
		})
	}

	function remove(message_id){
		api.delete(`apimessages/user/${userid}/messages/${message_id}`)
		.then((response) => {
			console.log("Message posted")
			getMessageList()
		})
		.catch((error) => {
			console.log(error.response.data.message)
		})
	}
	
	function push(text){
		api.post('apimessages/user/messages', {text: text})
		.then((response) => {
			console.log("Message posted")
			getMessageList()
		})
		.catch((error) => {
			console.log(error.response.data.message)
		})
	}
	return(<div className="MessagePage">
				{saisie && <SaisieMessage push={push}/>}
				<label> Tweets </label>
				<div className="ListMessage">{messages}</div>
			</div>)
}

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


export const Message = ({_id, userid, name, date, text, toProfile, remove}) =>{
	return (<div className='Message'>
				<div>
					<label className="pseudo" onClick={() => {toProfile && toProfile(userid, name)}} >{name}</label>
					<label className="date">{dateToString(date)}</label>
					{remove && <Menu remove={() => remove(_id)}/>}
				</div>
				<label className="MessageText">{text}</label>
			</div>)
}

const Menu = ({remove}) => {
	const [change, setChange] = useState(false)
	return (<div className='Menu'>
		<button className="dropbutton" onClick={() => setChange(!change)}> ... </button>
		{ 	change && 
			<div className="Dropdown">
				<div className="removeMessage" onClick={remove}> Supprimer </div>
			</div>
		}

	</div>)
}


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