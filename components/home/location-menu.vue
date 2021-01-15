<template>
	<view class="side-menu">
		<view class="menu-top">
			<view class="menu-top-title">地点定位</view>
			<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="$store.commit('setCurrentMenu',-1)"></view>
		</view>
		<view class="menu-padding" style="margin-top: 10rpx;">
			<view class="location-item" @click="$store.commit('setToCurrentLocationTrigger')">定位当前位置</view>
			<view class="location-item" @click="() => isInputLocation = !isInputLocation">输入坐标定位</view>
			<view v-show="isInputLocation">
				<view style="font-size: 12rpx;">X(经度)</view>
				<input class="search-input" @input="lonInput" placeholder="请输入..." />
				<view style="font-size: 12rpx;margin-top: 10rpx;">Y(纬度)</view>
				<input class="search-input"  @input="latInput" placeholder="请输入..." />
				<view style="color: #939393; margin: 10rpx 0;">
					<view style="font-size: 12rpx;">坐标输入示例</view>
					<view style="font-size: 12rpx;">119.194313 , 26.057133</view>
				</view>
				<view style="display: flex; justify-content: space-between;">
					<button type="default" size="mini" @click="showNavigation">导航</button>
					<button type="primary" size="mini" style=" float: right;" @click="$store.commit('setToLocationTrigger')">定位</button>
				</view>
			</view>
		</view>
		<view class="show-strategy"  v-show="showStrategy">
			<view class="menu-top">
				<view class="menu-top-title">方案选择</view>
				<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="() => showStrategy = false"></view>
			</view>
			<view class="strategy-btn">
				<button size="mini" @click="driving">驾车</button>
				<button size="mini" @click="walking">步行</button>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default{
		
		data(){
			return{
				isInputLocation:false,
				showStrategy:false
			}
		},
		
		
		methods:{
			//手动输入经纬度坐标定位
			lonInput(e){
				console.log("lon:",e.detail)
				plus.storage.setItem("lonVal",e.detail.value)
			},
			latInput(e){
				// console.log("lat:",e.detail)
				plus.storage.setItem("latVal",e.detail.value)
			},
			
			showNavigation(){
				this.showStrategy = true;
				// this.$store.commit('setNavigationTrigger')
			},
			
			driving(){
				this.$store.commit('setNavigationTrigger',{
					strategy:'driving'
				});
				this.showStrategy = false;
			},
			walking(){
				this.$store.commit('setNavigationTrigger',{
					strategy:'walking'
				});
				this.showStrategy = false;
			}
		}
		
	}
	
</script>
	
<style>
	/* 定位模块样式 */
	.location-item{
		color: #868686;
		font-size: 14rpx;
		font-weight: bold;
		margin-top: 10rpx;
	}
	.search-input{
		/* background-color: #49dddd; */
		border-bottom: 1rpx solid #8a8a8a;
		height: 12rpx;
		font-size: 12rpx;
	}
	.show-strategy{
		width: 200rpx;
		position: absolute;
		bottom: 20rpx;
		left: 220rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
	}
	.strategy-btn{
		padding: 20rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
</style>
