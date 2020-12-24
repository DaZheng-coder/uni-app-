<script>
	import Storage from '@/common/js/Storage.js'
	export default {
		onLaunch: function() {
			console.log('App Launch')
			const user = Storage.localStorage.get('user')
			if (user) {
				this.$store.dispatch('set_user', user)
			}
			Date.prototype.Format = function(fmt)   
			{ //author: meizz   
			  var o = {   
			    "M+" : this.getMonth()+1,                 //月份   
			    "d+" : this.getDate(),                    //日   
			    "h+" : this.getHours(),                   //小时   
			    "m+" : this.getMinutes(),                 //分   
			    "s+" : this.getSeconds(),                 //秒   
			    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
			    "S"  : this.getMilliseconds()             //毫秒   
			  };   
			  if(/(y+)/.test(fmt))   
			    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
			  for(var k in o)   
			    if(new RegExp("("+ k +")").test(fmt))   
			  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
			  return fmt;   
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import './common/uni.css';
	
	page {
	  background-color: $main-bg-color;
	  height: 100%;
	  font-size: 28rpx;
	  line-height: 1.8;
	}
	
	button {
		background-color: $main-color;
		color: $main-text-color;
	}
		
	.b-shadow {
		box-shadow: 0 0 10rpx #e5e5e5;
	}
	
	.content {
		padding-bottom: calc(var(--window-bottom) + 20rpx);
	}
	
	.flex {
		display: flex;
	}
	
	.flex-1 {
		flex: 1
	}
	
	.without-view {
		display: flex;
		justify-content: center;
		.without-view-img {
			margin: 0 auto;
		}
		.without-view-text {
			font-size: 35rpx;
			display: block;
			margin: 20rpx 0;
			text-align: center;
		}
		.without-view-btn {	
		}
	}
	
</style>
