'use strict';
const { add } = require('./add/index.js')
const { get, getAllFoldersAndAllArticles } = require('./get/index.js')
const { remove } = require('./remove/index.js')

const db = uniCloud.database()

exports.main = async (event, context) => {
	switch(event.type) {
		case 'add':
			return add(event)
		case 'get': 
			return get(event)
		case 'remove':
			return remove(event)
		case 'getAllFoldersAndAllArticles':
			return getAllFoldersAndAllArticles(event)
	}
};
