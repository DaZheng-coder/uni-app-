'use strict';
const { add } = require('./add/index.js')
const { get, getArticleById, getArticleByIsPublic } = require('./get/index.js')
const { update, updateContent, updateIsPublic } = require('./update/index.js')
const { remove } = require('./remove/index.js')

const db = uniCloud.database()

exports.main = async (event, context) => {
	switch(event.type) {
		case 'add':
			return add(event)
		case 'get': 
			return get(event)
		case 'update': 
			return update(event)
		case 'getArticleById':
			return getArticleById(event)
		case 'updateContent': 
			return updateContent(event)
		case 'remove':
			return remove(event)
		case 'updateIsPublic': 
			return updateIsPublic(event)
		case 'getArticleByIsPublic':
			return getArticleByIsPublic(event)
	}
};
