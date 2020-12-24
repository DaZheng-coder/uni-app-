const util = require('../utils/index.js')

const db = uniCloud.database()

exports.add = async (data) => {
	const collection = db.collection('user')
	
	let user = await collection.where({
		username: data.username
	}).get()
	
	if (user.affectedDocs < 1) {
		const res = await collection.add({
			username: data.username,
			// 头像
			avatar: '',
			// 加密密码
			password: util.sha1(data.password)
		})
		return {
			code: 200,
			msg: 'success'
		}
	} else {
		return {
			code: 403,
			msg: '用户名重复，请重新输入'
		}
	}
}