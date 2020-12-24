const db =uniCloud.database()
const util = require('../utils/index.js')

exports.check = async (data) => {
	const collection = db.collection('user')
	let user
	user = await collection.where({
		username: data.username,
		// 解密密码
		password: util.sha1(data.password)
	}).get()
	if (user.affectedDocs < 1) {
		// 没有找到
		return {
			code: 403,
			msg: '用户名或密码错误'
		}
	} else {
		return {
			code: 200,
			msg: 'success',
			data: {
				_id: user.data[0]._id,
				username: user.data[0].username
			}
		}
	}
	//返回数据给客户端
	// return data
}

	