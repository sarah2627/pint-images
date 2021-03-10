const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()

exports.getStats = functions.https.onCall((data, context) => { 
    const ref = db.collection('stats').doc('pictures')
    return ref.get().then((snapshot) => snapshot.data())
})