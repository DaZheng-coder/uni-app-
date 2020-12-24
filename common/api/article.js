import $http from '../http.js'

// 获取文章或笔记列表
export const get_article_list = (data) => {
	return $http({
		url: 'article',
		data: Object.assign({}, data, {
			type: 'get'
		})
	})
}

// 添加文章或笔记
export const add_article = (data) =>  {
	return $http({
		url: 'article',
		data: Object.assign({}, data, {
			type: 'add'
		})
	})
}

// 修改文章或笔记的标题
export const update_article_title = (data) => {
	return $http({
		url: 'article',
		data: Object.assign({}, data, {
			type: 'update'
		})
	})
}

// 根据笔记的id获取对应的笔记
export const get_article_by_id = (data) => {
	return $http({
		url: 'article',
		data: Object.assign({}, data, {
			type: 'getArticleById'
		})
	})
}

// 根据笔记的id修改笔记
export const update_content = (data, isHidden) => {
	return $http({
		url: 'article',
		data: Object.assign({}, data, {
			type: 'updateContent'
		})
	}, isHidden)
}

// 删除文章
export const remove_article = data => {
	return $http({
		url: 'article',
		data: Object.assign({}, data, {
			type: 'remove'
		})
	})
}

// 更新文章是否可视
export const update_isPublic = data => {
	return $http({
		url: 'article',
		data: Object.assign({}, data, {
			type: 'updateIsPublic'
		})
	})
}

// 根据是否可视化获取文章
export const get_article_by_isPublic = data => {
	return $http({
		url: 'article',
		data: Object.assign({}, data, {
			type: 'getArticleByIsPublic'
		})
	})
}