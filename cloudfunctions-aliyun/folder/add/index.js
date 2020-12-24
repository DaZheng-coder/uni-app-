const db = uniCloud.database()

exports.add = async (data) => {
	const collection = db.collection('folder')
	
	let folder = await collection.add(data)
	
	if (folder.id) {
		// 插入成功
		return {
			code: 200,
			msg: '添加数据成功'
		}
	} else {
		return {
			code: 403,
			msg: '添加数据失败'
		}
	}
}