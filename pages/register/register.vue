<template>
	<view>
		<view>
			<form @submit="register">
				<view class="uni-form-item uni-column">
					<view class="title">账号：</view>
					<input class="uni-input" v-model="model.username" placeholder="请输入账号" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">密码：</view>
					<input class="uni-input" v-model="model.password" password type="text" placeholder="请输入密码" />
				</view>
				<view class="uni-form-item uni-column">
					<view class="title">确认密码：</view>
					<input class="uni-input" v-model="model.passwordConfirm" password type="text" placeholder="请输入密码" />
				</view>
				<view class="uni-btn-v">
				  <button form-type="submit">注册</button>
				</view>
			</form>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				model: {
					username: '',
					password: '',
					passwordConfirm: ''
				},
				isConfirm: false
			}
		},
		watch: {
			'model.passwordConfirm' (val) {
				if (val && val !== this.model.password) {
					this.isConfirm = true
				} else if (val && val === this.model.password) {
					this.isConfirm = false
				}
			}
		},
		methods: {
			async register() {
				if (!this.model.username || !this.model.password || !this.model.passwordConfirm) {
					uni.showModal({
						title: '警告',
						content: '请输入正确信息！',
						showCancel: false
					})
					return 
				}
				if (this.model.password !== this.model.passwordConfirm) {
					uni.showModal({
						title: '警告',
						content: '两次密码不相同！',
						showCancel: false
					})
					return
				}
				
				this.$api.add_user(
					this.model
				).then(res => {
					uni.showModal({
						title: '注册成功',
						content: '正在跳转',
						showCancel: false
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}).catch(res => {
					uni.showModal({
						title: '注册失败',
						content: res.msg,
						showCancel: false
					})
				})
			}
		}
	}
</script>

<style>
</style>
