import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/firestore'
import tinybind from 'tinybind'

export const createProfile = async (data) => {
    const db = firebase.firestore()
    const docRef = db.collection('users')
    docRef.doc(data.user.uid).set({
        uid: data.user.uid,
        name: data.name,
        email: data.user.email,
        photoUrl: data.user.photoURL,
        creationTime: data.user.metadata.creationTime,
        favs: [],
    }).then().catch((error) => {
        console.log(error)
    })
}

export const getProfileData = (state) => {
    const uid = firebase.auth().currentUser.uid
    return firebase
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(function (doc) {
        // update the state object with the user data
        if (doc.exists) {
          state.profile = {
            avatarPath: doc.data().avatarPath,
            name: doc.data().name,
            ...state.profile,
          }
          tinybind.bind(document.querySelector('#profileContent'), { state })
        }
      })
}

export const getFavorites = (state) => {
    const uid = firebase.auth().currentUser.uid
    return firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .onSnapshot(function (doc) {
        // update the state object with the user favorites data...
        state.favs = doc.data().favs
        // ... and bind it to the DOM via tinybind
        tinybind.bind(document.querySelector('#favoriteFeed'), { state })
        })  
}

// Add a new entry in the favorite picture feed of the user in the realtime DB
export const addFavorite = async (e, state) => {
    e.preventDefault()
  
    if (e.target.classList.contains('likeButton')) {
      const uid = firebase.auth().currentUser.uid // get user ID from the auth object
      const index = e.target.dataset.index // get the picture ID from the DOM
      const pictureObject = state.list[index] // get the picture object from the main feed list
      const db = firebase.firestore() // select database
      const docRef = db.collection('users').doc(uid) // reference which document
      await docRef.update({
        // update document
        favs: firebase.firestore.FieldValue.arrayUnion(pictureObject),
      })
    }
  }
  

export const profile = (state) => {
    console.log('profile')

    const inputElement = document.getElementById('avatarImage')
    const buttonElement = document.getElementById('fileSelect')
  
    const avatarhandling = (e, state) => {
      // const avatarPlaceholder = document.querySelector('#avatarPlaceholder')
      const file = inputElement.files[0]
      console.log('avatarFile', file)
      setAvatar(file)
    }
  
    const handleButton = (e) => {
      e.preventDefault()
      if (inputElement) {
        inputElement.click()
      }
    }
  
    const setAvatar = (file) => {
      const uid = firebase.auth().currentUser.uid
      const ref = firebase.storage().ref().child(`avatars/${uid}.jpg`)
      ref.put(file).then((snapshot) => {
        ref.getDownloadURL().then((url) => {
          console.log(url)
          firebase.firestore().collection('users').doc(uid).update({
            // update document
            avatarPath: url,
          })
          document
            .querySelector('#avatarPlaceholder figure img')
            .setAttribute('src', url)
        })
      })
    }
    // DOM events handling
    buttonElement.addEventListener('click', handleButton, false)
    inputElement.addEventListener('change', avatarhandling, false)
}