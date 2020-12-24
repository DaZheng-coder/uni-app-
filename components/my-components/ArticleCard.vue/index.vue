<template>
	<view class="card__con">
		<!-- 个人信息 -->
		<view class="card__con__user">
			<!-- 头像 -->
			<view class="card__con__user__avatar">
				<view class="card__con__user__avatar__img"  v-if="isHaveAvatar">
					<image :src="item.user.avatar" mode=""></image>
				</view>
				<view class="card__con__user__avatar__no" v-else>{{item.user.username.substring(0, 3)}}</view>
			</view>
			<!-- 姓名和文章发表日期 -->
			<view class="card__con__user__info">
				<text class="card__con__user__info__name">{{item.user.username}}</text>
				<text class="card__con__user__info__date">{{item.article.addTime}}</text>
			</view>
		</view>
		<!-- 文章简介 -->
		<view class="card__con__article">
			<view class="card__con__article__introduction">
				{{item.article.introduction}}
			</view>
		</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		data () {
			return {
			}
		},
		computed:{
			isHaveAvatar () {
				this.item.user.avatar !== '' ? false : true
			}
		},
		props: {
			item: {
				type: Object
			}
		},
		onLoad () {
			
		},
		onShow () {
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.card__con {
		background-color: white;
		padding: 20rpx;
		margin-bottom: 20rpx;
		.card__con__user {
			display: flex;
			.card__con__user__avatar {
				margin: 20rpx 20rpx 20rpx 0;
				width: 100rpx;
				height: 100rpx;
				background-color: $main-color;
				border-radius: 50%;
				overflow: hidden;
				color: white;
				display: flex;
				justify-content: center;
				align-items: center;
				.card__con__user__avatar__img {
					width: 100%;
					height: 100%;
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
			.card__con__user__info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				text {
					display: block;
				}
				.card__con__user__info__date {
					color: #666;
				}
			}
		}
		.card__con__article {
			padding-left: 120rpx;
		}
	}
</style>

<!-- <template>
	<view></view>
</template>

<script>
	export default {
		data () {
			return {
				
			}
		},
		props: {
			
		},
		onLoad () {
			
		},
		onShow () {
			
		},
		methods: {
			
		}
	}
</script>

<style>
</style> -->
