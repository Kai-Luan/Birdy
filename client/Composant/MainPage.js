import React, { useEffect, useState } from 'react';

import NavigationPanel from './NavigationPanel';
import {MessagePage} from "./Message";
import { ProfilePage } from './User';
import {api, UserContext, MessagesContext} from './Utils';

// Page Principale
export const MainPage = () => {
    const [isConnected, setConnected] = useState(false)
    const [currentPage, setPage] = useState('Home')
    const [me, setMe] = useState({})
    const [user, setUser] = useState({})
	const [messages, setMessages] = useState(undefined)
    const [nbUser, setNbUser] = useState()
    const [nbMessage, setNbMessage] = useState()
    
    useEffect(() => {
        if (currentPage==='Home' && isConnected){
            // Get user count
            api.get("api/user/infos")
            .then((response)=>{
                console.log("Nombre d'utilisateurs: ", response.data.count)
                setNbUser(response.data.count)
            })
            .catch((error)=>{
                console.log(error.data)
            });
            // Get messages count
            api.get(`apimessages/messages/infos`)
            .then((response) => {
                console.log("Nombre de messages: ", response.data.count)
                setNbMessage(response.data.count)
            })
            .catch((error) => {
                    console.log(error.response.data.message)
            });
        }
    }, [isConnected, currentPage])
    
    // Login
    function getConnected(login, password){
        return new Promise(resolve =>{
            api.post('api/user/login', 
                {login: login, password: password}
            ).then((response) => {
                setMe({id:response.data.userid, name:login})
                setUser(me)
                setPage("Home")
                setConnected(true)
                resolve()
            })
            .catch((error) => {
                if (error.response){
                    console.log(error.response.data.message)
                    resolve(error.response.data.message)
                }
                else{
                    console.log(error)
                    resolve(error)
                }
            })
         });
    }
    // Logout
    function setLogout(){
        api.delete('api/user/logout')
        .then((response) => {
            console.log(response.data)
            setConnected(false)
        })
        .catch((error) => {
            console.log(error.response.data.message)
        })
    }
    // Retourne à la page d'accueil
    function toHome(){
        setMessages()
        setPage("Home")
    }
    // Retourne sur la page avec les messages des personnes suivies
    function toFollows(){
        api.get(`apimessages/user/${me.id}/messages/friends`)
		.then((response) => {
			console.log("Follows: ", response.data.messages)
			setMessages(response.data.messages)
            setPage("Home")
		})
		.catch((error) => {
			console.log(error.response.data.message)
		})
    }
    // Retourne sur la page de profil de user
    function toProfil(){
        setUser(me)
        setMessages()
        setPage("Profil")
    }
    // Retourne sur la page de profil d'un autre utilisateur
    function toUserProfile(id, name){
        setUser({id:id, name:name})
        setMessages()
        setPage("Profil")
    }

    const nav = <NavigationPanel login={getConnected} logout={setLogout} isConnected={isConnected} toHome={toHome} toProfil={toProfil} toFollows={toFollows}/>
    if (!isConnected) return <div className="MainPage"> {nav} </div>
    return <div className="MainPage">      
                    <UserContext.Provider value={me.id}>
                    <MessagesContext.Provider value={setMessages}>
                    {nav}
                    {currentPage==="Home" ?
                        <section>
                            <MessagePage saisie={true} toUserProfile={toUserProfile } filteredMessages={messages}/>
                            <div className="Stats">
                                <label className="StatsTitle">Statistiques</label>
                                <hr/>
                                <div className='StatsNumber'>nombre d'users: {nbUser}</div>
					            <div className='StatsNumber'>nombre de tweets: {nbMessage}</div>
                            </div>
			            </section>
                        :
                        <ProfilePage username={user.name} userid={user.id}/>
                    }
                    </MessagesContext.Provider>
                    </UserContext.Provider>
        </div>;
}
