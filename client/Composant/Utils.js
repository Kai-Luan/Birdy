import React from 'react';
import axios from 'axios'

export const api = axios.create({baseURL: 'http://localhost:4000', withCredentials: true})
export const UserContext = React.createContext();
export const MessagesContext = React.createContext();

// Popup, demande la confirmation, confirme ou annule l'action
export const Popup = ({title, text, confirm, annuler}) => {
    return <div className='Popup'>
        <div className='PopupTitle'>{title}</div>
        <hr/>
        <div className='PopupText'>{text}</div>
        <div className='PopupButtonMenu'>
            <div className='PopupConfirm' onClick={confirm}> Confirmer</div>
            <div className='PopupAnnuler' onClick={annuler}> Annuler </div>
        </div>
    </div>
} 