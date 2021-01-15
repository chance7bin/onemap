<template>
	<view class="top-nav">
		<view style="margin: 0 20rpx; color: #0090FF;font-weight: bold;">公路移动一张图系统</view>
		<view v-model="currentMenu" v-for="(item,index) in menuList" @click="changeMenu" class="nav-button" :class="[index==currentMenu?'nav-button-active':'']"
		 :key="index" :id="index" >
			<view class="iconfont nav-button-icon" :class="item.icon"></view>
			<view class="nav-button-text">{{item.text}}</view>
		</view>
		<view class="iconfont icon-user" style="font-size: 28rpx; color: #8199ab; position: absolute; right: 20rpx;" @click="toUser"></view>
	</view>
</template>

<script>
	
	import home from '../../common/home.js'
	
	export default{
		
		data(){
			return{
				menuList:home.menuList,
				// currentMenu:0
			}
		},
		computed:{
			currentMenu: function(){return this.$store.state.home.currentMenu}
		},
		methods:{
			changeMenu(e){
				if (this.currentMenu !== e.currentTarget.id) {
					this.$store.commit('setCurrentMenu',e.currentTarget.id);
				}
				
				// console.log("this.currentMenu:",this.currentMenu)
			},
			toUser(){
				uni.navigateTo({
				    url: '../user/user'
				});
			},
		}
		
	}
	
</script>
	
<style>
	/* 顶部导航栏 */
	.top-nav{
		width: 100%;
		height: 50rpx;
		/* background-color: #F0AD4E; */
		display: flex;
		align-items: center;
		position: relative;
	}
	.nav-button{
		/* line-height: 1; */
		margin: 0 20rpx;
		display: flex;
		flex-direction: column;
		/* font-size: 22rpx; */
		justify-content: center;
		align-items: center;
		color: #8199ab;
	}
	.nav-button-icon{
		font-size: 22rpx; 
		line-height: 1.2;
	}
	.nav-button-text{
		font-size: 12rpx; 
		line-height: 1.2;
	}
	.nav-button-active{
		color: #1584ff;
		font-weight: bold;
	}
</style>
