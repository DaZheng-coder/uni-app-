<template>
	<view class="content">
		<uni-collapse 
			v-if="isShowAll && isShowFolderList"
			accordion="true"
			class="uni-collapse"
			@change="handleIsCollapse"
		>
			<uni-swipe-action>
				<view>
					<uni-swipe-action-item class="uni-action-item" :disabled="showingCollapseIndex === index" v-for="(folder,index) in folderList" :key="folder._id">
						<view class="action-item">
							<uni-collapse-item
								class="uni-collapse-item"
								showAnimation :title="folder.name"
								:thumb="folder.article_list.length > 0 ? folder_img : empty_folder_img"
							>
								<view>
									<view v-if="folder.article_list.length">
										<uni-card
											v-for="article in folder.article_list"
											:key="article._id"
											:thumbnail="article.isPublic ? (article.isPublic == 1 ? public_img : not_public_img) : not_public_img"
											:title="article.title"
											:extra="article.addTime"
											@click="showUpdateTitleModel(article._id)"
										>
											<view v-if="article.introduction" @click.stop="gotoArticlePage(article._id)">
												{{article.introduction}}
											</view>
											<view v-else @click.stop="gotoArticlePage(article._id)">
												暂无内容，点击编辑 ->
											</view>
											<view v-if="article.updateTime" class="item-handle" style="color: #999">
												<text>最近更新时间：</text>
												<text>{{article.updateTime}}</text>
											</view>
											<view class="item-handle">
												<button @click.stop="gotoArticlePage(article._id)" class="item-handle-button">编辑</button>
												<view class="item-handle-right">
													<button @click.stop="isDeleteArticle(article._id)" type="warn" class="item-handle-button">删除</button>
													<button @click.stop="showSetting(article._id)" type="warn" class="item-handle-button">设置</button>
												</view>
											</view>
										</uni-card>
									</view>
									<view class="without-view" style="flex-direction: column;" v-else>
										<image class="without-view-img" style="width: 50%;" :src="without_article_img" mode=""></image>
										<view  class="without-view-text"style="text-align: center;">空空如也，快创建笔记吧！</view>
									</view>
									<view class="create-note-btn">
										<button @click="createNote(folder._id)">创建新笔记</button>
									</view>
								</view>
							</uni-collapse-item>
						</view>
						<template v-slot:right>
							<view class="delete" @click="isDeleteFolder(folder._id)"><text>删除</text></view>
						</template>
					</uni-swipe-action-item>
				</view>
			</uni-swipe-action>
		</uni-collapse>
		<view class="without-view" v-else>
			<view v-if="isShowAll">
				<image class="without-view-img" :src="without_folder_img" mode=""></image>
				<text class="without-view-text">暂无文件夹，快创建一个吧！</text>
			</view>
			<view v-else>
				<image class="without-view-img" :src="without_user_img" mode=""></image>
				<text class="without-view-text">还未登录，快去登录吧！</text>
				<button @click="goto('/pages/login/login')">登录</button>
			</view>
		</view>
		<button v-if="isShowAll" @click="createFolder">
			<uni-icons
				class="my-icon" 
				style="font-size: 40rpx;margin-right: 10rpx;" 
				type="plus"
				color="white"
			></uni-icons>
			添加文件夹
		</button>
		<!-- 创建文件夹 -->
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog 
				mode="input"
				placeholder="请输入文件夹名称" 
				:duration="2000" 
				:before-close="true" 
				@close="close" 
				@confirm="confirm"
			/>
		</uni-popup>
		<!-- 创建笔记 -->
		<uni-popup ref="popupNote" type="dialog">
			<uni-popup-dialog 
				mode="input"
				placeholder="请输入笔记名称" 
				:duration="2000" 
				:before-close="true" 
				@close="close" 
				@confirm="confirmNote"
			/>
		</uni-popup>
		<!-- 修改笔记标题 -->
		<uni-popup ref="popupNoteTitle" type="dialog">
			<uni-popup-dialog 
				mode="input"
				placeholder="请修改笔记标题" 
				:duration="2000" 
				:before-close="true" 
				@close="close" 
				@confirm="confirmUpdateNote"
			/>
		</uni-popup>
		<!-- 文章设置选项 -->
		<uni-popup ref="popupSetting" type="bottom">
			<view class="popup-bottom content">
				<view class="popup-bottom-content">
					<form @submit="settingFormSubmit">
						<view class="uni-form-item uni-column">
							<view class="title">
								<uni-icons type="gear-filled" style="font-size: 40rpx;margin-right: 10rpx;"></uni-icons>
								隐私设置
							</view>
								<radio-group class="form-item" name="isPublic">
									<label>
										<radio value="1" /><text>公开</text>
									</label>
									<label>
										<radio value="0" /><text>仅自己可见</text>
									</label>
								</radio-group>
						</view>
						<view class="uni-btn-v flex">
							<button form-type="submit" class="item-handle-button">确认</button>
							<button @click="closeSetting" type="default" class="item-handle-button">取消</button>
						</view>
					</form>
				</view>
			</view>
		</uni-popup>
	</view>
	</view>
</template>

<script>
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse-item/uni-collapse-item.vue'
	import uniCard from '@/components/uni-card/uni-card.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import { mapState } from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello',
				isShowFolderList: false,
				folderList: [],
				// 当前folder的id
				curFolderId: 0,
				// 
				curArticleId: 0,
				showingCollapseIndex: -1,
				// 笔记公开时的图标
				public_img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-zldpp8ywxmdte2d2c7/45dfe440-4452-11eb-bc56-c9cea619f663.png',
				// 笔记仅自己可见时的图标
				not_public_img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-zldpp8ywxmdte2d2c7/f6fe05c0-444f-11eb-b680-7980c8a877b8.png',
				// 文件夹图标
				folder_img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-zldpp8ywxmdte2d2c7/fd18b000-4453-11eb-8a36-ebb87efcf8c0.png',
				// 文件夹为空时的图标
				empty_folder_img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-zldpp8ywxmdte2d2c7/fc658ca0-4453-11eb-8a36-ebb87efcf8c0.png',
				// 没有文件夹时的图片
				without_folder_img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-zldpp8ywxmdte2d2c7/ee6d31c0-4453-11eb-8ff1-d5dcf8779628.png',
				// 没有笔记/文章时的图片
				without_article_img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-zldpp8ywxmdte2d2c7/fb9d81b0-4453-11eb-bf0a-894cbc80c40a.png',
				// 没有用户时的图片
				without_user_img: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-zldpp8ywxmdte2d2c7/fddf5b60-4453-11eb-bf0a-894cbc80c40a.png'
			}
		},
		computed: {
			...mapState(['user']),
			isShowAll () {
				return this.user ? (this.user._id ? true : false) : false
			}
		},
		onShow () {
			console.log('显示首页')
			if (this.user) {
				this.getFolderList()
			} 
		},
		components:{
			uniCollapse,
			uniCollapseItem,
			uniCard,
			uniPopup,
			uniPopupMessage,
			uniPopupDialog,
			uniIcons
		},
		onLoad () {
		},
		methods: {
			// 设置表单确认
			settingFormSubmit(e) {
				this.closeSetting()
				console.log('设置表单选项--->', e.detail.value)
				if (e.detail.value.isPublic) {
					this.$api.update_isPublic({
						_id: this.curArticleId,
						isPublic: e.detail.value.isPublic
					}).then(res => {
						console.log('更新成功')
						this.getAllArticleList()
					}).catch(res => {
						console.log('更新失败')
					})
				}
			},
			// 关闭设置表单
			closeSetting() {
				this.$refs.popupSetting.close()
			},
			// 显示设置
			showSetting (id) {
				console.log('当前设置的id', id)
				this.curArticleId = id
				this.$refs.popupSetting.open()
			},
			deleteArticle(id) {
				console.log('删除文章')
				this.$api.remove_article({
					_id: id
				}).then(res => {
					console.log('删除成功')
					this.getAllArticleList()
				}).catch(res => {
					uni.showModal({
						title: '删除失败',
						content: res.msg,
						showCancel: false
					})
				})
			},
			// 是否删除文章
			isDeleteArticle (id) {
				uni.showModal({
					title: '警告',
					content: '是否删除该文章？此操作无法撤销',
					success: res => {
						if (res.confirm) {
								console.log('用户点击确定');
								this.deleteArticle(id)
						} else if (res.cancel) {
								console.log('用户点击取消');
						}
					}
				})
			},
			// 是否显示文件夹详细信息
			handleIsCollapse (activeNames) {
				console.log('触发')
				console.log('传入的数组', activeNames)
				// this.showingCollapseIndex = activeNames.length
				console.log('当前索引', this.showingCollapseIndex)
				if (activeNames.length > 0) {
					this.showingCollapseIndex = activeNames[0]
				} else {
					this.showingCollapseIndex = -1
				}
			},
			// 是否删除文件夹
			isDeleteFolder(id) {
				uni.showModal({
					title: '警告',
					content: '是否删除该文件夹？此操作无法撤销',
					success: res => {
						if (res.confirm) {
								console.log('用户点击确定');
								this.deleteFolder(id)
						} else if (res.cancel) {
								console.log('用户点击取消');
						}
					}
				})
			},
			// 删除文件夹
			deleteFolder(id) {
				console.log('删除文件夹')
				this.$api.remove_folder({
					_id: id
				}).then(res => {
					console.log('删除成功')
					this.getFolderList()
				}).catch(res => {
					console.log('删除失败')
				})
			},
			// 显示修改笔记标题窗口
			showUpdateTitleModel(id) {
				this.curArticleId = id
				this.$refs.popupNoteTitle.open()
				console.log('当前修改的笔记标题--->', id)
			},
			// 确认修改标题
			confirmUpdateNote(done, value) {
				const data = {
					_id: this.curArticleId,
					title: value
				}
				this.$api.update_article_title(data).then(res => {
					console.log('修改成功--->', res)
					uni.showModal({
						title: '修改成功',
						content: '文章已修改成功',
						showCancel: false
					})
					this.getAllArticleList()
				}).catch(res => {
					console.log('修改失败--->', res)
					uni.showModal({
						title: '修改失败',
						content: res.msg,
						showCancel: false
					})
				})
				done()
			},
			// 跳转到编辑笔记页面
			gotoArticlePage(_id) {
				this.goto('/pages/edit/edit?_id=' + _id)
			},
			// 添加笔记
			addArticle(title) {
				const date = new Date().Format("yyyy-MM-dd hh:mm:ss");     
				this.$api.add_article({
					title: title,
					addTime: date,
					// addTime: (new Date().toLocaleDateString()) + ' ' + (new Date)(_)),
					content: null,
					user_id: this.user._id,
					updateTime: '',
					folder_id: this.curFolderId,
					introduction: '',
					isPublic: 0,
				}).then(res => {
					this.getAllArticleList()
					console.log('添加笔记成功结果', res)
				}).catch(res => {
					uni.showModal({
						title: '添加笔记失败',
						content: res.msg,
						showCancel: false
					})
				})
			},
			// 根据文件夹id获得笔记
			getArticleList(folder) {
				const data = {
					folder_id: folder._id,
					user_id: this.user._id
				}
				
				this.$api.get_article_list(data).then(res => {
					console.log('获得笔记数据成功结果', res.data)
					folder.article_list = res.data
					// folder.articleList = res.data
				}).catch(res => {
					console.log('获得笔记数据失败结果', res.data)
					folder.article_list = res.data
					// folder.articleList = res.data
				})
			},
			// 获得文件夹对应的笔记
			getAllArticleList() {
				this.folderList.forEach((item) => {
					this.getArticleList(item)
				})
			},
			// 添加文件夹
			addFolder(name) {
				this.$api.add_folder({
					name: name,
					user_id: this.user._id,
					article_list: []
				}).then(res => {
					this.getFolderList()
					console.log('添加成功--->', res)
				}).catch(res => {
					uni.showModal({
						title: '添加失败',
						content: res.msg,
						showCancel: false
					})
				})
			},
			// 获得文件夹列表
			getFolderList() {
				this.$api.get_folder_list({
					user_id: this.user._id
				}).then(res => {
					this.folderList = res.data
					// 查询文件夹对应笔记
					this.getAllArticleList()
					console.log('查询完成后--->', this.folderList)
					this.isShowFolderList = true
				}).catch(res => {
					this.isShowFolderList = false
				})
			},
			// 获得所有文件夹和对应的文章信息
			
			// 弹出层关闭
			close(done) {
				done()
			},
			confirm(done, value) {
				const folder = {}
				// 向服务器发送创建文件夹请求
				this.addFolder(value)
				done()
			},
			confirmNote(done, value) {		
				console.log('指定文件夹id--->', this.curFolderId)
				// 向服务器发送在指定文件夹添加笔记的请求
				this.addArticle(value)
				done()
			},
			goto(url) {
				uni.navigateTo({
					url: url
				})
			},
			// 添加文件夹
			createFolder () {
				this.$refs.popup.open()
			},
			// 创建新笔记
			createNote (folderId) {
				this.curFolderId = folderId
				console.log('当前笔记id--->', this.curFolderId)
				this.$refs.popupNote.open()
			}
		}
	}
</script>

<style lang="scss">
	.create-note-btn {
		margin: 0 20rpx 20rpx;
	}
	.uni-collapse {
		background-color: $main-bg-color;
	}
	.uni-action-item {
		margin: 20rpx 0;
		box-shadow: 0 0 10rpx #e5e5e5;
	}
	.uni-collapse-item {
		// margin-top: 20rpx;
		background-color: white;
		border-bottom: none;
		box-shadow: 0 0 10rpx #e5e5e5;
	}
	.delete {
		width: 150rpx;
		background-color: rgb(221, 82, 77);
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 35rpx;
	}
	.item-handle {
		margin-top: 20rpx;
		display: flex;
	}
	.item-handle-button {
		flex: 1;
		&:first-child {
			margin-right: 20rpx;
		}
	}
	.action-item {
		width: 100%;
	}
	.item-handle-right {
		display: flex;
		&:first-child {
			margin-right: 10rpx;
		}
	}
	.popup-bottom {
		background-color: white;
	}
	.popup-bottom-content {
		padding: 20rpx 20rpx 0 20rpx;
	}
	.form-item {
		padding-left: 40rpx;
	}
</style>
