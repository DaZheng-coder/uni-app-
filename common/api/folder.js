import $http from '../http.js'

// 获取文件夹列表
export const get_folder_list = (data) => {
	return $http({
		url: 'folder',
		data: Object.assign({}, data, {
			type: 'get'
		})
	})
}

// 添加文件夹
export const add_folder = (data) =>  {
	return $http({
		url: 'folder',
		data: Object.assign({}, data, {
			type: 'add'
		})
	})
}

// 删除文件夹
export const remove_folder = data => {
	return $http({
		url: 'folder',
		data: Object.assign({}, data, {
			type: 'remove'
		})
	})
}

// 获取文件夹及其对应的文章信息
export const get_all_folders_and_all_articles = data => {
	return $http({
		url: 'folder',
		data: Object.assign({}, data, {
			type: 'getAllFoldersAndAllArticles'
		})
	})
}