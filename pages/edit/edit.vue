<template>
	<view class="container">
		<view class="page-body">
			<view class='wrapper'>
				<view class="center">
					<view :style="[{height: setToolBarHeight }]" class='toolbar' @tap="format">
						<view :class="formats.bold ? 'ql-active' : ''" class="iconfont icon-zitijiacu" data-name="bold"></view>
						<view :class="formats.italic ? 'ql-active' : ''" class="iconfont icon-zitixieti" data-name="italic"></view>
						<view :class="formats.underline ? 'ql-active' : ''" class="iconfont icon-zitixiahuaxian" data-name="underline"></view>
						<view :class="formats.strike ? 'ql-active' : ''" class="iconfont icon-zitishanchuxian" data-name="strike"></view>
						<view :class="formats.align === 'left' ? 'ql-active' : ''" class="iconfont icon-zuoduiqi" data-name="align"
						 data-value="left"></view>
						<view :class="formats.align === 'center' ? 'ql-active' : ''" class="iconfont icon-juzhongduiqi" data-name="align"
						 data-value="center"></view>
						<view :class="formats.align === 'right' ? 'ql-active' : ''" class="iconfont icon-youduiqi" data-name="align"
						 data-value="right"></view>
						<view :class="formats.align === 'justify' ? 'ql-active' : ''" class="iconfont icon-zuoyouduiqi" data-name="align"
						 data-value="justify"></view>
						<view :class="formats.lineHeight ? 'ql-active' : ''" class="iconfont icon-line-height" data-name="lineHeight"
						 data-value="2"></view>
						<view :class="formats.letterSpacing ? 'ql-active' : ''" class="iconfont icon-Character-Spacing" data-name="letterSpacing"
						 data-value="2em"></view>
						<view :class="formats.marginTop ? 'ql-active' : ''" class="iconfont icon-722bianjiqi_duanqianju" data-name="marginTop"
						 data-value="20px"></view>
						<view :class="formats.previewarginBottom ? 'ql-active' : ''" class="iconfont icon-723bianjiqi_duanhouju"
						 data-name="marginBottom" data-value="20px"></view>
						<view class="iconfont icon-clearedformat" @tap="removeFormat"></view>
						<view :class="formats.fontFamily ? 'ql-active' : ''" class="iconfont icon-font" data-name="fontFamily" data-value="Pacifico"></view>
						<view :class="formats.fontSize === '24px' ? 'ql-active' : ''" class="iconfont icon-fontsize" data-name="fontSize"
						 data-value="24px"></view>

						<view :class="formats.color === '#0000ff' ? 'ql-active' : ''" class="iconfont icon-text_color" data-name="color"
						 data-value="#0000ff"></view>
						<view :class="formats.backgroundColor === '#00ff00' ? 'ql-active' : ''" class="iconfont icon-fontbgcolor"
						 data-name="backgroundColor" data-value="#00ff00"></view>

						<view class="iconfont icon-date" @tap="insertDate"></view>
						<view class="iconfont icon--checklist" data-name="list" data-value="check"></view>
						<view :class="formats.list === 'ordered' ? 'ql-active' : ''" class="iconfont icon-youxupailie" data-name="list"
						 data-value="ordered"></view>
						<view :class="formats.list === 'bullet' ? 'ql-active' : ''" class="iconfont icon-wuxupailie" data-name="list"
						 data-value="bullet"></view>
						<view class="iconfont icon-undo" @tap="undo"></view>
						<view class="iconfont icon-redo" @tap="redo"></view>

						<view class="iconfont icon-outdent" data-name="indent" data-value="-1"></view>
						<view class="iconfont icon-indent" data-name="indent" data-value="+1"></view>
						<view class="iconfont icon-fengexian" @tap="insertDivider"></view>
						<view class="iconfont icon-charutupian" @tap="insertImage"></view>
						<view :class="formats.header === 1 ? 'ql-active' : ''" class="iconfont icon-format-header-1" data-name="header"
						 :data-value="1"></view>
						<view :class="formats.script === 'sub' ? 'ql-active' : ''" class="iconfont icon-zitixiabiao" data-name="script"
						 data-value="sub"></view>
						<view :class="formats.script === 'super' ? 'ql-active' : ''" class="iconfont icon-zitishangbiao" data-name="script"
						 data-value="super"></view>
						<view class="iconfont icon-shanchu" @tap="clear"></view>
						<view :class="formats.direction === 'rtl' ? 'ql-active' : ''" class="iconfont icon-direction-rtl" data-name="direction"
						 data-value="rtl"></view>
					</view>
					<view class="is-show-all-tools" @click="changeIsShowAllTools">{{isShowAllTools ? '收起' : '展开'}}</view>
				</view>
				<editor :style="[{marginTop: editorMTop}]" id="editor" class="ql-container" placeholder="开始输入..." showImgSize showImgToolbar showImgResize
				 @statuschange="onStatusChange" :read-only="readOnly" @ready="onEditorReady"
				 @input="contentChange"
				 @blur="loseFocus"
				>
				</editor>
				<button class="submit-btn" @click="submitEdit">提交</button>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				_id: 0,
				readOnly: false,
				formats: {},
				isShowAllTools: true,
				centerMaxHeight: 0,
				setToolBarHeight: 'auto',
				editorMTop: 0,
				isShowBtnHeight: 0,
				editorContent: ''
			}
		},
		mounted() {
			this.$nextTick(function(){
				// this.centerMaxHeight = 
				uni.createSelectorQuery().select('.center').boundingClientRect(data => {
					this.centerMaxHeight = data.height
					this.editorMTop = this.centerMaxHeight + 'px' 
					console.log('高度', this.centerMaxHeight)
				}).exec()
				uni.createSelectorQuery().select('.is-show-all-tools').boundingClientRect(data => {
					this.isShowBtnHeight = data.height
				}).exec()
				// this.centerMaxHeight = document.querySelector('.center').offsetHeight
				// this.centerMaxHeight = this.$refs.center.$el.offsetHeight
				// this.$refs.editor.$el.style = "margin-top:" + this.centerMaxHeight + 'px;'
			})
		},
		methods: {
			// 保存笔记
			saveEdit(isHidden){
					// 修改内容
					this.editorCtx.getContents({
						success: (res) => {
							console.log('获取数据成功--->', res)
							// 如果编辑器内容没有变化
							if (this.editorContent === res.html) {
								console.log('编辑器内容没有变化')
								uni.showModal({
									title: '提交失败',
									content: '编辑器内容没有变化',
									showCancel: false
								})
								return 
							}
							this.editorContent = res.html
							let introduction = ''
							if (res.text.length > 50) {
								introduction = res.text.substring(0, 50) + '...'
							} else {
								introduction = res.text
							}
							console.log('简介:', introduction)
							const date = new Date().Format("yyyy-MM-dd hh:mm:ss");     
							this.$api.update_content({
								_id: this._id,
								content: res.html,
								updateTime: date,
								introduction: introduction
							}, isHidden).then(res => {
								console.log('修改成功--->')
							}).catch(res => {
								uni.showModal({
									title: '修改失败',
									content: res.msg,
									showCancel:	false
								})
							})
						},
						fail: () => {
							console.log('获取编辑器数据失败--->', res)
						}
					})
			},
			// 当点击提交按钮时
			submitEdit() {
				console.log('已点击提交按钮')
				uni.showModal({
					title: '提交成功',
					content: '正在跳转...',
					showCancel: false
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			},
			// 获得笔记
			getArticle() {
				this.$api.get_article_by_id({
					_id: this._id
				}).then(res => {
					console.log('获得笔记成功--->', res)
					const content = res.data[0].content
					console.log('笔记的内容', content)
					if (content) {
						// 如果不是第一次编辑笔记
						console.log('获得笔记内容')
						this.editorCtx.setContents({
							html: content
						})
					}
				}).catch(res => {
					console.log('获得笔记失败--->', res)
					uni.showModal({
						title: '警告',
						content: res.msg ? res.msg : '获得笔记失败',
						 showCancel: false
					})
				})
			},
			// 编辑器失去焦点
			loseFocus(e) {
				console.log('编辑器失去焦点,内容--->', e)
				if (this.editorContent !== e.detail.html) {
					if (!this.timer) {
						this.saveEdit(true)
					}
				}
			},
			// 编辑器内容改变时触发
			contentChange(e) {
				console.log('编辑器内容改变了')
				this.timer && clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.saveEdit(true)
				}, 1000)
			},
			// 是否显示全部工具栏
			changeIsShowAllTools() {
				// this.toolbarDom = document.querySelector('.toolbar')
				// this.editorDom = document.querySelector('#editor')
				if (this.isShowAllTools) {
					this.setToolBarHeight = '40px'
					this.editorMTop = 40 + this.isShowBtnHeight + 'px'
					// this.toolbarDom.style = "height: 40px;"
					// this.editorDom.style = "margin-top:" + document.querySelector('.center').offsetHeight + 'px;'
				} else {
					this.setToolBarHeight = 'auto'
					this.editorMTop = this.centerMaxHeight + 'px'
					// this.toolbarDom.style = ""
					// this.editorDom.style = "margin-top:" + this.centerMaxHeight + 'px;'
				}
				this.isShowAllTools = !this.isShowAllTools
			},
			readOnlyChange() {
				this.readOnly = !this.readOnly
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					this.editorCtx = res.context
				}).exec()
			},
			undo() {
				this.editorCtx.undo()
			},
			redo() {
				this.editorCtx.redo()
			},
			format(e) {
				let {
					name,
					value
				} = e.target.dataset
				if (!name) return
				// console.log('format', name, value)
				this.editorCtx.format(name, value)

			},
			onStatusChange(e) {
				const formats = e.detail
				this.formats = formats
			},
			insertDivider() {
				this.editorCtx.insertDivider({
					success: function() {
						console.log('insert divider success')
					}
				})
			},
			clear() {
				this.editorCtx.clear({
					success: function(res) {
						console.log("clear success")
					}
				})
			},
			removeFormat() {
				this.editorCtx.removeFormat()
			},
			insertDate() {
				const date = new Date()
				const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
				this.editorCtx.insertText({
					text: formatDate
				})
			},
			insertImage() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						this.editorCtx.insertImage({
							src: res.tempFilePaths[0],
							alt: '图像',
							success: function() {
								console.log('insert image success')
							}
						})
					}
				})
			}
		},
		onLoad(option) {
			console.log('当前编辑的笔记_id', option._id)
			this._id = option._id
			uni.loadFontFace({
				family: 'Pacifico',
				source: 'url("https://sungd.github.io/Pacifico.ttf")'
			})
			this.getArticle()
		}
	}
</script>

<style lang="scss">
	@import "./editor-icon.css";

	.wrapper {
		padding: 5px 0;
	}

	.iconfont {
		display: inline-block;
		padding: 8px 8px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		font-size: 20px;
	}

	.toolbar {
		box-sizing: border-box;
		border-bottom: 0;
		font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
		overflow: hidden;
	}

	.center {
		position: fixed;
		z-index: 999;
		background-color: $main-bg-color;
		margin-top: -10rpx;
	}

	.is-show-all-tools {
		text-align: center;
		color: white;
		background-color: $main-color;
	}

	.ql-container {
		box-sizing: border-box;
		padding: 12px 15px;
		width: 100%;
		min-height: 100vh;
		height: auto;
		background: #fff;
		margin-top: 20px;
		font-size: 16px;
		line-height: 1.5;
	}

	.ql-active {
		color: #06c;
	}

	.submit-btn {
		position: fixed;
		bottom: 30rpx;
		right: 20rpx;
	}
</style>
