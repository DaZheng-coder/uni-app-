const db = uniCloud.database()

exports.get = async (data) => {
	const collection = db.collection('folder')
	
	let folders = await collection.where({
		user_id: data.user_id
	}).get()
	
	if (folders.affectedDocs < 1) {
		return {
			code: 403,
			msg: '查询失败'
		}
	} else {
		return {
			code: 200,
			msg:'success',
			data: folders.data
		}
	}
}

// 获取文件夹和对应的文章列表
exports.getAllFoldersAndAllArticles = async (data) => {
	// 获取文件夹列表
	const getResponse = await exports.get(data)
	const folders = getResponse.data
	// 遍历获取文件夹
	const result = await Promise.all(folders.map(async (item)=> {
		const articles = await getArticlesByFolderId({
			folder_id: item._id
		})
		
		if (articles.affectedDocs < 1) {
			return {
				code: 403,
				msg: '根据文件夹获取文章信息失败'
			}
		} else {
			return {
				name: item.name,
				_id: item._id,
				article_list: articles
			}
		}
	}))
	return {
		code: 200,
		msg: '查询成功',
		data: result
	}
}

// 根据文件夹id获取文章
const articleCollection = db.collection('article')
const getArticlesByFolderId = async (data) => {
	let articles = await articleCollection.where({
		folder_id: data.folder_id
	}).get()
	
	if (articles.affectedDocs < 1) {
		return {
			code: 403,
			msg: '根据文件夹获取文章失败'
		}
	} else {
		return articles.data
	}
}
