import React, { useState } from 'react';

import NavigationPanel from './NavigationPanel';
import {MessagePage} from "./Message";

import '../css/NavigationPanel.css';
import '../css/App.css';
import '../css/Message.css';
import { ProfilePage } from './User';
import {api, UserContext} from './Utils';

export const MainPage = () => {
    const [isConnected, setConnected] = useState(false)
    const [currentPage, setPage] = useState('Home')
    const [me, setMe] = useState([])
    const [user, setUser] = useState([])
    
    function getConnected(login, password){
        return new Promise(resolve =>{
            api.post('api/user/login', 
                {login: login, password: password}
            ).then((response) => {
                setMe([response.data.userid, login])
                setConnected(true)
                resolve()
            })
            .catch((error) => {
                console.log(error.response.data.message)
                resolve(error.response.data.message)
            })
         });
    }

    function register(login, password, nom, prenom){
        return new Promise(resolve =>{
            api.put('api/user', 
                {login: login, password: password, firstname: prenom, lastname: nom}
            ).then((response) => {
                resolve()
            })
            .catch((error) => {
                resolve(error.response.data.message)
            })
         });
    }

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
    
    function toHome(){
        setPage("Home")
    }

    function toProfil(){
        setUser(me)
        setPage("Profil")
    }

    function toUserProfile(id, name){
        setUser([id, name])
        setPage("Profil")
    }

    const nav = <NavigationPanel login={getConnected} logout={setLogout} isConnected={isConnected} toHome={toHome} toProfil={toProfil} register={register} />
    if (!isConnected) return <div className="MainPage"> {nav} </div>
    return <div className="MainPage">      
                    {nav}
                    <UserContext.Provider value={me[0]}>
                    {currentPage==="Home" ?
                        <section>
                            <MessagePage saisie={true} toUserProfile={toUserProfile} />
                            <div className="Stats">
                                <label className="StatsTitle">Statistiques</label>
                                <hr/>
                            </div>
			            </section>
                        :
                        <ProfilePage username={user[1]} userid={user[0]}/>
                    }
                     </UserContext.Provider>
        </div>;
}
