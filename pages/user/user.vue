<template>
	<view class="user-container">
		<view v-if="isShowUserInfo">
			<view class="user-info">
				<view class="user-avatar b-shadow" @click="uploadAvatar(user._id)">
					<view class="avatar-text" v-if="!user.avatar">
						{{user.username.substring(0,3)}}
					</view>
					<image class="avatar-image" :src="user.avatar" mode="" v-else></image>
				</view>
				<view @click="updateUsername" class="item b-shadow">
					<view class="item-left">
						<!-- <uni-icons 
							class="my-icon" 
							style="font-size: 40rpx;margin-right: 10rpx;" 
							type="contact"
							color="#666"
						></uni-icons> -->
						<text class="item-left">用户名:</text>
					</view>
					<text>{{user.username}}</text>
				</view>
				<!-- <view class="item">
					<view class="item-left">
						<uni-icons 
							class="my-icon" 
							style="font-size: 40rpx;margin-right: 10rpx;" 
							type="contact"
							color="#666"
						></uni-icons>
						<text class="item-left">笔记数:</text>
					</view>
					<text>666</text>
				</view> -->
			</view>
			<view class="user-handle">
				<button type="default" class="button b-shadow" @click="updatePassword">
					修改密码
				</button>
				<button type="warn" class="button b-shadow" @click="outLogin">退出登录</button>
			</view>
		</view>
		<view v-else class="without-view">
			<image class="without-view-img" :src="without_user_img" mode=""></image>
			<text class="without-view-text">还未登录，快去登录吧！</text>
			<button class="without-view-btn" @click="goto('/pages/login/login')">登录</button>
		</view>
		<!-- 确认密码 -->
		<uni-popup ref="popupPassword" type="dialog">
			<uni-popup-dialog
				class="popup-password"
				mode="input"
				placeholder="请输入当前密码"
				inputType="password"
				:duration="2000" 
				:before-close="true" 
				@close="close" 
				@confirm="confirmPasssword"
			/>
		</uni-popup>
		<!-- 新用户名 -->
		<uni-popup ref="popupUsername" type="dialog">
			<uni-popup-dialog 
				mode="input"
				placeholder="请输入新用户名" 
				:duration="2000" 
				:before-close="true" 
				@close="close" 
				@confirm="confirmUsername"
			/>
		</uni-popup>
		<!-- 修改密码 -->
		<uni-popup ref="popupNewPassword" type="dialog">
			<uni-popup-dialog 
				mode="input"
				inputType="password"
				placeholder="请输入新密码" 
				:duration="2000" 
				:before-close="true" 
				@close="close" 
				@confirm="confirmNewPassword"
			/>
		</uni-popup>
	</view>
</template>

<script>
	import Storage from '@/common/js/Storage.js'
	import { mapState } from 'vuex'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	
	export default {
		data () {
			return {
					isShowUserInfo: false,
					avatar: '',
					// 当前修改类型, -1 为无， 0 为修改用户名， 1位为修改密码
					type: -1,
					// 没有用户时的图片
					without_user_img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-zldpp8ywxmdte2d2c7/fddf5b60-4453-11eb-bf0a-894cbc80c40a.png'
			}
		},
		computed: {
			...mapState(['user']),
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		onLoad () {
			this.getUserInfo()
		},
		methods: {
			// 修改密码
			updatePassword() {
				this.$refs.popupPassword.open(),
				this.type = 1
			},
			// 修改用户名
			updateUsername() {
				// 确认密码
				this.$refs.popupPassword.open()
				this.type = 0
			},
			// 确认新密码
			confirmNewPassword(done, value) {
				done()
				this.$api.update_password({
					_id: this.user._id,
					password: value
				}).then(res => {
					console.log('密码修改成功')
					this.$store.dispatch('set_user', null)
					this.isShowUserInfo = false
					uni.showModal({
						title: '修改成功',
						content: '正在跳转...',
						showCancel:false
					})
					setTimeout(() => {
						this.goto('/pages/login/login')
					}, 1000)
				}).catch(res => {
					uni.showModal({
						title: '错误',
						content: '密码修改失败',
						showCancel: false
					})
				})
			},
			// 确认密码
			confirmPasssword (done, value) {
				done()
				this.$api.check_user({
					username: this.user.username,
					password: value
				}).then(res => {
					console.log('密码正确', res)
					if (this.type === 0) {
						this.$refs.popupUsername.open()
					} else if (this.type === 1) {
						console.log('修改密码')
						this.$refs.popupNewPassword.open()
					}
				}).catch(res => {
					console.log('密码错误', res)
					uni.showModal({
						title: '错误',
						content: '密码错误',
						showCancel: false
					})
				})
			},
			// 确认新用户名
			confirmUsername(done, value) {
				done()
				this.$api.update_username({
					_id: this.user._id,
					username: value
				}).then(res => {
					this.getUserInfo()
					console.log('修改成功')
				}).catch(res => {
					console.log('修改失败')
				})
			},
			// 关闭弹出层
			close(done) {
				done()
			},
			// 上传头像
			uploadAvatar (id) {
				const that = this
				uni.chooseImage({
					count: 1,
					success(res) {
						if (res.tempFilePaths.length > 0) {
							let filePath = res.tempFilePaths[0]
							
							// 进行上传操作
							uniCloud.uploadFile({
								filePath: filePath,
								cloudPath: id + '.jpg',
								onUploadProgress: progressEvent => {
									console.log(progressEvent)
									var percentCompleted = Math.round(
										(progressEvent.loaded * 100) / progressEvent.total
									)
								},
								success(res) {
									console.log('头像上传成功', res.fileID)
									// 向服务器发送修改头像请求)
									that.updateAvatar(res.fileID)
								},
								fail(res) {
									console.log('头像上传失败', res)
								},
								complete() {}
							})
						}
					}
				})
			},
			// 向服务器发送修改头像请求
			updateAvatar(fileId) {
				this.$api.update_avatar({
					_id: this.user._id,
					avatar: fileId
				}).then(res => {
					console.log('头像修改成功')
					this.getUserInfo()
				}).catch(res => {
					console.log('头像修改失败')
					console.log('失败当前头像路径', this.user.avatar)
				})
			},
			// 获取用户信息
			getUserInfo () {
				if (this.user._id) {
					// 如果本地有用户id
					this.$api.get_user({
						_id: this.user._id
					}).then(res => {
						console.log('获取用户信息成功==>', res)
						// 在缓存中写入新的用户信息
						this.$store.dispatch('set_user', res.data)
						this.isShowUserInfo = true
					}).catch(res => {
						console.log('获取用户信息失败')
					})
				} else {
					// 如果没有用户id
					this.isShowUserInfo = false
				}
			},
			outLogin () {
				this.$store.dispatch('set_user', null)
				this.goto('pages/user/user')
				this.isShowUserInfo = false
			},
			goto (url) {
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss">
	.user-container {
		padding: 20rpx;
	}
	.user-info {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-bottom: 150rpx;
		.user-avatar {
			width: 200rpx;
			height: 200rpx;
			background-color: white;
			text-align: center;
			line-height: 200rpx;
			margin: 50rpx 0;
			border-radius: 50%;
			overflow: hidden;
			.avatar-image {
				width: 100%;
				height: 100%;
			}
			.avatar-text {
				width: 100%;
				height: 100%;
				color: $main-color;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 50rpx;
				font-weight: bloder;
			}
		}
	}
	.user-handle {
		.button {
			margin-bottom: 20rpx;
		}
	}
	.item {
		margin-bottom: 20rpx;
		padding: 20rpx;
		background-color: white;
		width: calc(100% - 20rpx * 2);
		border-radius: 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.item-left {
			color: #8F8F94;
		}
	}
	.without-view {
		flex-direction:  column;
	}
	.without-view-btn {
		width: 80%;
	}
</style>
