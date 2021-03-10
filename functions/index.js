const admin = require('firebase-admin')

admin.initializeApp()

// triggers

const watchers = require('./triggers/watchFavs.function')

exports.watchFavs = watchers.watchFavs

// callables

const stats = require('./callables/stats.function')

exports.getStats = stats.getStats