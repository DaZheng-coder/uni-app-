const db = uniCloud.database()

exports.remove = async (data) => {
	const collection = db.collection('folder')
	
	let folders = await collection.where({
		_id: data._id
	}).remove()
	
	if (folders.deleted < 1) {
		return {
			code: 403,
			msg: '删除失败'
		}
	} else {
		return {
			code: 200,
			msg:'success'
		}
	}
}