import firebase from 'firebase/app'
import 'firebase/auth'
import { createProfile, getFavorites, getProfileData } from './profile'

// Authentication
export const authentication = (state) => {
  const auth = firebase.auth()

  // Firebase API handling
  const authenticate = (email, password) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        console.log(errorCode, errorMessage)
      })
  }
  // Sign out of Firebase
  const signOut = (e) => {
    auth.signOut().then(function (e) {
      e.preventDefault()
      // window.location.reload()
    })
  }
  // Password recovery
  const forgotPassword = (email) => {
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        window.alert('email sent')
      })
      .catch(function (error) {
        console.log(error, 'invalid email or bad network connection')
      })
  }
  // Register into Firebase
  const register = () => {
    const name = document.querySelector('#registration-name').value
    const email = document.querySelector('#registration-email').value
    const reemail = document.querySelector('#registration-confirm-email').value
    const password = document.querySelector('#registration-password').value

    if (email.trim() === '') {
      window.alert('Enter Email')
    } else if (password.trim().length < 7) {
      window.alert('Password must be at least 7 characters')
    } else if (email !== reemail) {
      window.alert('emails do not match')
    } else {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((data) => {
          // insert user profile into Database user collection
          createProfile({ ...data, name })
        })
        .catch(function (error) {
          // Handle Errors here.
          const errorCode = error.code
          const errorMessage = error.message
          window.alert(errorCode, errorMessage)
        })
    }
  }

  // Login into Firebase
  const login = () => {
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value
    if (email.trim() === '') {
      window.alert('Enter Email')
    } else if (password.trim() === '') {
      window.alert('Enter Password')
    } else {
      authenticate(email, password)
    }
  }

  // DOM handling
  const showRegistration = () => {
    document.querySelector('#registrationForm').classList.remove('hide')
    document.querySelector('#loginForm').classList.add('hide')
    document.querySelector('#profileContent').classList.add('hide')
  }

  const showLogin = () => {
    document.querySelector('#registrationForm').classList.add('hide')
    document.querySelector('#loginForm').classList.remove('hide')
    document.querySelector('#profileContent').classList.add('hide')
  }

  const showProfile = () => {
    document.querySelector('#registrationForm').classList.add('hide')
    document.querySelector('#loginForm').classList.add('hide')
    document.querySelector('#profileContent').classList.remove('hide')
  }

  // Event handling
  document.querySelector('#show-register').addEventListener('click', (e) => {
    e.preventDefault()
    showRegistration()
  })
  document.querySelector('#show-login').addEventListener('click', (e) => {
    e.preventDefault()
    showLogin()
  })
  document.querySelector('#signout').addEventListener('click', (e) => {
    e.preventDefault()
    signOut()
    showLogin()
  })
  document.querySelector('#register').addEventListener('click', (e) => {
    e.preventDefault()
    register()
  })
  // register when you hit the enter key
  document
    .querySelector('#registration-password')
    .addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault()
        register()
      }
    })
  document.querySelector('#login').addEventListener('click', (e) => {
    e.preventDefault()
    login()
  })
  // sign in when you hit enter
  document.querySelector('#login-password').addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault()
      login()
    }
  })
  document.querySelector('#forgot-password').addEventListener('click', () => {
    const email = document.querySelector('#login-email').value
    if (email.trim() === '') {
      window.alert('Enter Email')
    } else {
      forgotPassword(email)
    }
  })
  auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      showProfile()
      state.profile = { uid: firebaseUser.uid }
      getFavorites(state)
      getProfileData(state)
    }
  })
}