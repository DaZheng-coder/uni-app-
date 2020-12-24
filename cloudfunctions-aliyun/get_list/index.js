'use strict'

const db = uniCloud.database()
exports.main = async (event, context) = {
	const list = await db.collection('article').get()
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
}