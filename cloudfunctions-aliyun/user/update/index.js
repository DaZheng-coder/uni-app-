const db = uniCloud.database()
const util = require('../utils/index.js')

// 更新用户名
exports.updateUsername = async (data) => {
	const collection = db.collection('user')
	
	let user = await collection.doc(data._id).update({
		username: data.username
	})
	
	if (user.updated < 1) {
		return {
			code: 403,
			msg: '更新失败',
			data: ''
		}
	} else {
		return {
			code: 200,
			msg:'success'
		}
	}
}

// 更新头像
exports.updateAvatar = async (data) => {
	const collection = db.collection('user')
	
	let user = await collection.where({
		_id: data._id
	}).update({
		avatar: data.avatar
	})
	
	if (user.updated < 1) {
		return {
			code: 403,
			msg: '更新失败',
		}
	} else {
		return {
			code: 200,
			msg:'success'
		}
	}
}

// 更新密码
exports.updatePassword = async (data) => {
	const collection = db.collection('user')
	
	let user = await collection.doc(data._id).update({
		password: util.sha1(data.password)
	})
	
	if (user.updated < 1) {
		return {
			code: 403,
			msg: '更新失败',
		}
	} else {
		return {
			code: 200,
			msg:'success'
		}
	}
}