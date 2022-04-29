import React, { Component, useState } from 'react';
import {RechercheMessage} from "./Message";
import Register from './Register';

const NavigationPanel = ({isConnected, toHome, toProfil, logout, login, register}) => {
    const [change, setChange] = useState(true)

    if (isConnected) return <div className="NavigationPanel">
            <header>
                <img className="Logo" src={require('../images/birdy.png')} alt="Logo oiseau" />
                <label className="LogoText">Birdy</label>
                <RechercheMessage/>
                <div className="NavButton" onClick={() => toHome()}>Accueil</div>
                <div className="NavButton" onClick={() => toProfil()}>Profil</div>
                <Logout logout = {logout}/>
            </header>
            </div>
    else return <div className="NavigationPanel_Connection">
            <div className='form'>
                <div className="head">
                    <img className="Logo" src={require('../images/birdy.png')} alt="Logo oiseau" />
                    <h1>  Birdy </h1> 
                </div>

                <div className="select">
                    <div className={change && "selected"} onClick={()=> setChange(true)}>  Login </div>
                    <div className={!change && "selected"} onClick={()=> setChange(false)}> Sign up</div>
                </div>
                { change ?
                    <Login login= {login}/>
                    :
                    <Register register={register}/>
                }
            </div>
        </div>

}
export default NavigationPanel;

const Login = ({login}) => {
    const [log, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [text, setText] = useState('')

	async function submit(){
        // On verifie si les champs sont tous remplis
        if (log==='' || password ===''){
            setText("Veuillez complétez les champs")
            return
        }
        else{
            const res =  await login(log, password)
            if (res) setText(res) // si erreur
            else setText('') // efface les messages si succès
        }
        setLogin('')
        setPassword('')
	}
    
    return <div className="Login">
        {text!=='' && <label className='ErrorMessage'> {text} </label>}
                <input type="text" placeholder="Login" value={log} onChange={evt => setLogin(evt.target.value)}/>
                <input type="password" placeholder="Mot de passe" value={password} onChange={evt => setPassword(evt.target.value)}/>
                <button className="MyButtons" value={password} onClick={submit}> login </button>
        </div>;
}

const Logout = ({logout}) => {
        return <div className="Logout" onClick={() => logout()}  > logout </div>
}
