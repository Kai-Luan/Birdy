import ReactDOM from 'react-dom';
import React from 'react';
import { MainPage } from './Composant/MainPage';

// Importation des fichiers CSS
import './css/NavigationPanel.css';
import './css/App.css';
import './css/Message.css';
import './css/Utils.css';
import './css/Profile.css'


const App = () => {
	return (
		<MainPage/>
	);
}
ReactDOM.render(<App />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

