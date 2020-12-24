const db = uniCloud.database()

exports.get = async (data) => {
	const collection = db.collection('user')
	
	let user = await collection.where({
		_id: data._id
	}).get()
	
	if (user.affectedDocs < 1) {
		return {
			code: 403,
			msg: '获取用户信息失败'
		}
	} else {
		return {
			code: 200,
			msg:'success',
			data: {
				_id: user.data[0]._id,
				username: user.data[0].username,
				avatar: user.data[0].avatar
			}
		}
	}
}