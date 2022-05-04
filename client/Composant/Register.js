import React, {useState } from 'react';
import {api} from './Utils'

// Page d'inscription
const Register = () => {
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [text, setText] = useState('')
    const [success, setSucces] = useState(false)
    // Confirme l'inscription
    async function submit(){
        let m = ''
        let s = false
        if (nom==='' || prenom==='' || login==='' || password==='') m = 'Veuillez compléter tous les champs'
        else if (password!==confirm) m = "Mot de passe de confirmation différent"
        else{
            let res = await register(login, password, nom, prenom)
            if (!res){
                m = "Succès de l'inscription"
                s = true
            }
            else m = res
        }
        setSucces(s)
        setText(m)
    }
    // Demande au serveur, la création d'un nouveau user
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

    return (<div className="Register">    
        {text!=='' && <label className={success ? 'SuccesMessage':'ErrorMessage'} > {text} </label>}
        <div>
            <input type="text" placeholder="Nom" id="nom" onChange={evt => setNom(evt.target.value) }/>
            <input type="prenom" placeholder="Prenom" onChange={evt => setPrenom(evt.target.value)}/>
        </div>
        <input type="text" placeholder="Login" onChange={evt => setLogin(evt.target.value)}/>
        <input type="password" placeholder="Mot de passe" onChange={evt => setPassword(evt.target.value)}/>
        <input type="password" placeholder="Confirmer mot de passe" onChange={evt => setConfirm(evt.target.value)}/>
        <div>
            <button className="MyButtons" onClick={() => submit()}>Enregistrer</button>
            <button className="MyButtons">Annuler</button>
        </div>
    </div>);
}
export default Register;