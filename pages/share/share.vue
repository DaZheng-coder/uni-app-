<template>
	<view>
		<article-card
			v-for="(item, index) in articleList"
			:key="index"
			:item="item"
		></article-card>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import ArticleCard from '@/components/my-components/ArticleCard.vue/index.vue'
	export default {
		data () {
			return {
				articleList: []
			}
		},
		computed: {
			...mapState(['user']),
		},
		components: {
			ArticleCard
		},
		onLoad () {
		},
		onShow () {
			this.getArticleByIsPublic()
		},
		methods: {
			getArticleByIsPublic() {
				this.$api.get_article_by_isPublic({}).then(res => {
					console.log('获取成功--->', res)
					this.articleList = res.data
				}).catch(res => {
					console.log('获取失败， 数据为空--->', res)
				})
			}
		}
	}
</script>

<style>
</style>
