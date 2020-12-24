const db = uniCloud.database()

exports.get = async (data) => {
	const collection = db.collection('article')
	
	let articles = await collection.where({
		user_id: data.user_id,
		folder_id: data.folder_id
	}).get()
	return {
		code: 200,
		msg:'success',
		data: articles.data
	}
}

exports.getArticleById = async (data) => {
	let articles = await db.collection('article').where({
		_id: data._id
	}).get()
	
	if (articles.affectedDocs < 1) {
		return {
			code: 403,
			msg: '查询失败',
			data: ''
		}
	} else {
		return {
			code: 200,
			msg:'success',
			data: articles.data
		}
	}
}

// 根据是否可视化获取文章
exports.getArticleByIsPublic = async (data) => {
	let articles = await db.collection('article').where({
		isPublic: '1'
	}).get()
	
	if (articles.affectedDocs < 1) {
		return {
			code: 403,
			msg: '查询文章失败',
			data: ''
		}
	} else {
		// 如果有文章的话，查询文章对应的用户id
		const result = await Promise.all(articles.data.map(async (item) => {
			const user = await getUser({
				_id: item.user_id
			})
			return {
				user: user,
				article: item
			}
		}))
		return {
			code: 200,
			msg: '查询成功',
			data: result
		}
	}
}

// 根据用户id获取用户
const getUser = async (data) => {
	const collection = db.collection('user')
	let user = await collection.where({
		_id: data._id
	}).get()
	
	if (user.affectedDocs < 1) {
		return {
			code: 403,
			msg: '根据文章获取用户信息失败'
		}
	} else {
		return {
			_id: user.data[0]._id,
			username: user.data[0].username,
			avatar: user.data[0].avatar
		}
	}
}