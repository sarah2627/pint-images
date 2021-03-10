import {firebaseConfig} from './env.conf'
import firebase from 'firebase/app'
import {getPixList} from './scripts/common/api.js'
import {navHandling} from './scripts/common/navigation.js'
import tinybind from 'tinybind'
import {authentication} from './scripts/common/authentication'
import './stylesheets/pixterest-icons.scss'
import './stylesheets/main.scss'
import { addFavorite, profile } from './scripts/common/profile'

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let state = {
    list:[],
    profile:{},
    favs:[]
}

// on lui passe l'URL de ce que l'on veut consommer
getPixList('https://picsum.photos/v2/list?limit=99', state)
// ça appelle la méthode bind de la libraire tinybind auquel on passe un noeud du DOM et notre state
tinybind.bind(document.querySelector('#pixFeed'), { state: state })

authentication(state)

document.querySelector('header nav').addEventListener('click', navHandling)

document.querySelector('.gallery').addEventListener('click', (e) => addFavorite(e, state))

profile(state)

  