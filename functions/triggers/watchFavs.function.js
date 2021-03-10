const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()

exports.watchFavs = functions.firestore.document('users/{userId}').onWrite((change, context) => {
    console.log('test')
    const document = change.before.data().favs
    const newDocument = change.after.exists ? change.after.data().favs : null

    const result = newDocument.filter((item) => !document.some((other) => item.id === other.id))

    // recuperation de l'id de l'image
    const itemId = result[0].id
    console.log("itemId : ", itemId)

    const ref = db.collection('stats').doc('pictures')
    ref.get().then((snapshot) => {
        if(snapshot.exists && itemId in snapshot.data()) {
            ref.update({ [itemId] : admin.firestore.FieldValue.increment(1) })
        } else {
            ref.update({ [itemId] : 1 })
        }
    })
})

