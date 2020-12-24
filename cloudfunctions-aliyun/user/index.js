'use strict';
const { add } = require('./add/index.js')
const { check } = require('./check/index.js')
const { get } = require('./get/index.js')
const {
	updateUsername,
	updateAvatar,
	updatePassword
} = require('./update/index.js')

exports.main = async (event, context) => {
	switch(event.type) {
		case 'get': 
			return get(event)
		case 'add':
			return add(event)
		case 'check': 
			return check(event)
		case 'updateUsername':
			return updateUsername(event)
		case 'updateAvatar':
			return updateAvatar(event)
		case 'updatePassword':
			return updatePassword(event)
	}
}
