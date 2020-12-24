export default function $http(options, hiddenLoading) {
	const {
		url,
		data
	} = options
	if (!hiddenLoading) {
		console.log('不隐藏加载')
		uni.showLoading({
				title: '加载中'
		});
	} else {
		console.log('隐藏加载')
	}
	
	return new Promise((reslove, reject) => {
		uniCloud.callFunction({
			name: url,
			data
		}).then((res) => {
			uni.hideLoading();
			if (res.result.code === 200) {
				reslove(res.result)
			} else {
				reject(res.result)
			}
		}).catch((err) => {
			uni.hideLoading();
			reject(err)
		})
	})
}