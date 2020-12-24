import $http from '../http.js'

// 确认用户登录
export const check_user = (data) => {
	return $http({
		url: 'user',
		data: Object.assign({}, data, {
			type: 'check'
		})
	})
}

// 注册添加用户
export const add_user = (data) => {
	return $http({
		url: 'user',
		data: Object.assign({}, data, {
			type: 'add'
		})
	})
}

// 更改用户名
export const update_username = (data) => {
	return $http({
		url: 'user',
		data: Object.assign({}, data, {
			type: 'updateUsername'
		})
	})
}

// 更新头像
export const update_avatar = (data) => {
	return $http({
		url: 'user',
		data: Object.assign({}, data, {
			type: 'updateAvatar'
		})
	})
}

// 更新密码
export const update_password = (data) => {
	return $http({
		url: 'user',
		data: Object.assign({}, data, {
			type: 'updatePassword'
		})
	})
}

// 获取用户信息
export const get_user = (data) => {
	return $http({
		url: 'user',
		data: Object.assign({}, data, {
			type: 'get'
		})
	})
}