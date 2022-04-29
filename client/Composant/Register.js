import React, {useState } from 'react';

const Register = ({register}) => {
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [text, setText] = useState('')
    const [success, setSucces] = useState(false)

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