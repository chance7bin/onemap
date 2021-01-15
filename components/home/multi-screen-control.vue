<template>
	<view>
		<view class="layer-control-icon-item iconfont icon-layer" @click="() => showLayers = !showLayers"></view>
		<view class="layer-list"  v-show="showLayers">
			<view class="menu-top">
				<view class="menu-top-title">图层选择</view>
				<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="() => showLayers = false"></view>
			</view>
			<scroll-view class="layer-checkbox" scroll-x="true" scroll-y="true">
				<uni-data-checkbox 
					v-model="selectedLayers"
					multiple
					mode="tag" 
					wrap
					:localdata="multiScreenLayers" 
					@change="change"
					style="width: 70rpx;"
				></uni-data-checkbox>
			</scroll-view>
		</view>
		<!-- <view class="layer-control-icon-item iconfont icon-weixingtu" ></view> -->
	</view>
</template>

<script>
	
	import home from '../../common/home.js'
	
	export default{
		
		data(){
			return{
				showLayers:false,
				selectedLayers:[]
			} 
		},
		/**
		 * selectedDefault:默认展示图层(Array),
		 * screenId:分屏id(twoMap1,twoMap2,fourMap1,fourMap2,fourMap3,fourMap4),
		 * screenIndex:屏幕索引(双屏:0,1;四屏:0,1,2,3)
		 * layersControl:图层控制对象(双屏:twoScreenLayers;四屏:fourScreenLayers) 
		 */
		props:['selectedDefault','screenId','screenIndex','layersControl'],
		computed:{
			multiScreenLayers: function(){
				// console.log("home.multiScreenLayers:",home.multiScreenLayers);
				var tempMultiScreenLayers = JSON.parse(JSON.stringify(home.multiScreenLayers));
				// console.log("screenId:" + this.screenId + "screenIndex:" + this.screenIndex + "==selectedDefault:",this.selectedDefault);
				for (var i = 0; i < this.selectedDefault.length; i++) {
					for (var j = 0; j < tempMultiScreenLayers.length; j++) {
						if(this.selectedDefault[i] == tempMultiScreenLayers[j].value){
							tempMultiScreenLayers[j].selected = true;
							break;
						}
					} 
				}
				return tempMultiScreenLayers;
			}
		},
		methods:{
			change(e){
				console.log("change:",e.detail.value)
				this.$emit('updateDisplayLayer',{
					selectedLayers:e.detail.value,
					screenId:this.screenId,
					screenIndex:this.screenIndex,
					layersControl:this.layersControl
				})
				
			}
		}
		
	}
	 
</script>
	
<style>
	
	.layer-control-icon-item{
		margin-bottom: 20rpx;
		border-radius: 5rpx;
		background-color: #ffffff;
		color: #1584ff;
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 25rpx;
		/* box-shadow: 0px 0px 2px #b5b5b5; */
		box-shadow: 2px 4px 6px #595959;
	}
	.layer-list{
		width: 120rpx;
		position: absolute;
		top: 0;
		left: 50rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
	}
	.layer-checkbox{
		padding: 10rpx;
		height: 130rpx;
		width: 100rpx;
	}
</style>
