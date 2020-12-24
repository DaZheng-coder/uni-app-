const db = uniCloud.database()

// 更新标题
exports.update = async (data) => {
	const collection = db.collection('article')
	
	let articles = await collection.doc(data._id).update({
		title: data.title
	})
	
	if (articles.updated < 1) {
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

// 更新内容
exports.updateContent = async (data) => {
	const collection = db.collection('article')
	
	let articles = await collection.doc(data._id).update({
		content: data.content,
		introduction: data.introduction,
		updateTime: data.updateTime
	})
	
	if (articles.updated < 1) {
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

// 更新是否可视
exports.updateIsPublic = async (data) => {
	const collection = db.collection('article')
	
	let articles = await collection.doc(data._id).update({
		isPublic: data.isPublic
	})
	
	if (articles.updated < 1) {
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