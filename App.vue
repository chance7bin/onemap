<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			plus.screen.lockOrientation('landscape-primary'); //锁定
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import '/node_modules/ol/ol.css';
	@import '/static/css/uni.css';
	@import '/static/css/iconfont.css';
	@import '/common/commonStyle.css';
	
</style>
