<template>
	<view class="login-form">
		<form @submit="login">
			<view class="uni-form-item uni-column">
				<view class="title">账号：</view>
				<input class="uni-input" v-model="model.username" placeholder="请输入账号" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="title">密码：</view>
				<input class="uni-input" v-model="model.password" password type="text" placeholder="请输入密码" />
			</view>
			<view class="uni-btn-v">
			  <button form-type="submit">登录</button>
			  <button type="default" @click="toRegister">注册</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default {
		data () {
			return {
					model: {},
			}
		},
		methods: {
			// 注册
			toRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				})
			},
			// 登录
			async login () {
				if (!this.model.openid) {
					// 不是微信登录，判断输入是否正确
					if (!this.model.username || !this.model.password) {
						uni.showModal({
							title: '警告',
							content: '请输入正确信息！',
							showCancel: false
						})
						return 
					}
				} else {
					this.form.username = ''
					this.form.password = ''
				}
				
				this.$api.check_user(
					this.model
				).then(res => {
					uni.showModal({
						title: '登录成功',
						content: '正在跳转',
						showCancel: false
					})
					this.$store.dispatch('set_user', res.data)
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/index/index',
							success: (res) => {
								console.log('跳转成功', res)
							},
							fail: (res) => {
								console.log('跳转失败', res)
							}
						})
					}, 1500)
				}).catch(res => {
					uni.showModal({
						title: '登陆失败',
						content: res.msg,
						showCancel: false
					})
				})
			},
			// 提交表单
			formSubmit (e) {
				console.log('提交表格数据----->', JSON.stringify(this.model))
				var formdata = e.detail.value
				uni.showModal({
					content: '表单数据内容：' + JSON.stringify(this.model),
					showCancel: false
				})
			},
			// 重置表单
			formReset (e) {
				this.model = {}
			}
		}
	}
</script>

<style lang="scss">
	.login-form {
		padding: 0 20rpx;
	}
	.uni-form-item .title {
		padding: 20rpx 0;
	}
</style>
