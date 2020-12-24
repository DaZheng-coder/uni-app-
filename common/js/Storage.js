var Str = {};
/*
 * 判断字符串是否为空
 */
Str.isNull = function(str) {
	if (str === undefined) return true;
	if (str === 'undefined') return true;
	if (str === null) return true;
	if (typeof str == 'string') str = str.replace(/^\s*|\s*$/g, "");
	if (str === '') return true;
	return false;
};
/*
 * 判断字符串是否为非空
 */
Str.isNotNull = function(str) {
	return !this.isNull(str);
};
/**
 * localStorage操作
 */
Str.localStorage = {
	/**
	 * 保存
	 * @param {Object} key 键名
	 * @param {Object} value 键值
	 * @param int second 缓存时间（单位：秒)
	 * @param string ctag 组名
	 */
	set: function(key, value, second = null, ctag = null) {
		if (Str.isNull(second) || second == 0) second = 86400 * 365 * 10;
		var data = {
			value: value,
			expire: parseInt((new Date()).getTime() / 1000) + second
		};
		if (Str.isNotNull(ctag)) {
			// 如果存在组主键名，则保存在组主键下
			let baseVal = this.get(ctag) || {};
			baseVal[key] = data;
			data = {
				value: baseVal,
				expire: parseInt(new Date().getTime() / 1000) + 86400 * 365 * 10
			};
			key = ctag;
		}
		if (localStorage != undefined) {
			localStorage.setItem(key, JSON.stringify(data));
		} else if (uni.setStorageSync != undefined) {
			uni.setStorageSync(key, JSON.stringify(data));
		} else if (wx.setStorageSync != undefined) {
			wx.setStorageSync(key, JSON.stringify(data));
		}
	},
	/**
	 * 读取
	 * @param {Object} key 键名
	 */
	get: function(key, ctag) {
		let _key = key;
		if (Str.isNotNull(ctag)) {
			key = ctag; // 如果存在组主键名，则读取组主键内容
		}
		var data = null;
		if (localStorage != undefined) {
			data = localStorage.getItem(key);
		} else if (uni.getStorageSync != undefined) {
			data = uni.getStorageSync(key);
		} else if (wx.getStorageSync != undefined) {
			data = wx.getStorageSync(key);
		}
		if (Str.isNotNull(data)) {
			if (typeof data == 'string') data = JSON.parse(data);
			if (Str.isNotNull(ctag)) {
				if (data.expire != null && data.expire * 1000 < new Date().getTime()) {
					this.remove(ctag);
					return null;
				}
				data = data.value[_key]; // 重新赋值
				if (Str.isNull(data)) return null;
			}
			if (data.expire != null && data.expire * 1000 < new Date().getTime()) {
				this.remove(_key, ctag);
				return null;
			}
			return data.value;
		}
		return null;
	},
	/**
	 * 删除指定键
	 * @param key       键名
	 * @param ctag      组主键名
	 */
	remove: function(key, ctag) {
		if (Str.isNotNull(ctag)) {
			if (Str.isNull(key)) {
				key = ctag;
			} else {
				let baseVal = this.get(ctag) || {};
				delete baseVal[key];
				if (JSON.stringify(baseVal) == '{}') key = ctag;
				else this.set(ctag, baseVal, null);
			}
		}
		if (localStorage != undefined) {
			localStorage.removeItem(key);
		} else if (uni.removeStorageSync != undefined) {
			uni.removeStorageSync(key);
		} else if (wx.removeStorageSync != undefined) {
			wx.removeStorageSync(key);
		}
	},
	/**
	 * 清空
	 */
	clear: function() {
		if (localStorage != undefined) {
			localStorage.clear();
		} else if (uni.clearStorageSync != undefined) {
			uni.clearStorageSync();
		} else if (wx.clearStorageSync != undefined) {
			wx.clearStorageSync();
		}
	}
};
 
if (typeof module != 'undefined') module.exports = Str;