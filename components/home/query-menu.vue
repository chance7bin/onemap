<template>
	<view class="side-menu">
		<!-- 查询界面 -->
		<view v-show="!showSearchList">
			<view class="menu-top">
				<view class="menu-top-title">数据查询</view>
				<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="$store.commit('setCurrentMenu',-1)"></view>
			</view>
			<view class="menu-padding">
				<!-- 查询方式 -->
				<scroll-view class="method-scroll" scroll-x="true">
					<view v-model="currentMethod" v-for="(item,index) in methodList" @click="changeMethod" class="method-item" :class="[index==currentMethod?'active':'']"
					 :key="index" :id="index">
						{{item.text}}  
					</view>
				</scroll-view> 
				<!-- 查询图层选择 -->
				<view style="display: flex;align-items: center;">
					<uni-combox label="图层名" :candidates="searchLayers" placeholder="请选择" v-model="searchLayer" ></uni-combox>
				</view>
				<!-- 模糊查询 -->
				<view class="input-div" v-show="currentMethod == 0">
					<view>
						<view style="display: flex; color: #686868; font-weight: bold;">
							<view style="font-size: 14rpx; width: 80rpx;">属性名</view>
							<view style="font-size: 14rpx; width: 80rpx;">属性值</view>
						</view>
						<view style="display: flex; align-items: center;">
							<uni-combox @input="inputSearchProp" :candidates="searchProps" placeholder="请选择" v-model="searchProp1" style="width: 80rpx;"></uni-combox>
							<input v-model="searchText" @input="inputSearchText" placeholder="请输入" style="width: 80rpx;height: 40rpx; font-size: 14rpx;"/>
						</view>
					</view>
					<view style="display: flex; justify-content: space-between;">
						<button type="default" size="mini" @click="() => isAdvancedQuery = !isAdvancedQuery">更多</button>
						<button  class="iconfont icon-icon-chaxun" type="primary" size="mini"  @click="$store.commit('setQueryFeatureTrigger')">查询</button>
					</view>
				</view>
				<!-- 空间查询 -->
				<view v-show="currentMethod == 1">
					<view style="display: flex;margin: 10rpx 0;">
						<view class="draw-icon iconfont icon-map-circle" @click="$store.commit('setDrawPolygonTrigger')"></view>
						<view class="draw-icon iconfont icon-duobianxing" @click="$store.commit('setDrawPolygonTrigger')"></view>
						<view class="draw-icon iconfont icon-juxing" @click="$store.commit('setDrawPolygonTrigger')"></view>
					</view>
					<view style="display: flex; justify-content: space-between;">
						<button type="default" size="mini" @click="$store.commit('setClearDrawPolygonTrigger')">取消</button>
						<button class="iconfont icon-icon-chaxun" type="primary" size="mini"  @click="$store.commit('setPolygonQueryTrigger')">查询</button>
					</view>
				</view>
			</view>
		</view>
		<!-- 高级查询 -->
		<view class="advanced-query" v-show="isAdvancedQuery">
			<view class="menu-top">
				<view class="menu-top-title">高级查询</view>
				<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="() => isAdvancedQuery = false"></view>
			</view>
			<view class="menu-padding">
				<scroll-view style="display: flex; white-space: nowrap;" scroll-x="true" >
					<view @click="selectProp(item)" v-for="(item,index) in queryProps" :key="index" class="query-props">{{item}}</view>
				</scroll-view>
				<scroll-view style="display: flex; white-space: nowrap;" scroll-x="true">
					<view @click="selectOperator(item)" v-for="(item,index) in operatorItem" :key="index" class="operator-item">{{item.name}}</view>
				</scroll-view>
				<input  v-model="advancedQueryText" @input="advancedQueryInput" placeholder="请输入条件表达式..." style="font-size: 16rpx; border: 1rpx solid #c8c8c8; border-radius: 10rpx; margin-top: 10rpx;"/>
				<view style="display: flex; justify-content: space-between; align-items: center; margin: 10rpx 0;">
					<view @click="clearInput" class="iconfont icon-lajitong " style="font-size: 12rpx; border: 1rpx solid #c8c8c8; padding: 2rpx 5rpx; border-radius: 5rpx;">清除</view>
					<button @click="$store.commit('setAdvancedQueryTrigger')" class="iconfont icon-icon-chaxun" type="primary" size="mini"  style="margin: 0;">查询</button>
				</view>
			</view>
		</view>
		<!-- 结果界面 -->
		<view v-show="showSearchList">
			<view class="menu-top">
				<view class="iconfont icon-jiantouarrowhead7 menu-top-icon" @click="$store.commit('setShowSearchList',false)"></view>
				<view class="menu-top-title">查询结果</view>
				<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="$store.commit('setCurrentMenu',-1)"></view>
			</view>
			<view v-show="isNotData" style="margin-top: 20rpx;">
				<view class="iconfont icon-shuju3" style="font-size: 60rpx;text-align: center;color: #5a5a5a;"></view>
				<view style="font-size: 18rpx;text-align: center;color: #5a5a5a;">暂未查到相关数据</view>
			</view>
			<view style="padding: 10rpx;">
				<scroll-view  class="feature-list"  scroll-x="true" scroll-y="true">
					<view class="feature-list-view" @click="showFeature(item)" v-for="(item, index) in searchList" :key="index" >
						<view class="feature-list-title">{{item.values_[displayValue[0]]}}</view>
						<view class="feature-list-auxiliary">{{item.values_[displayValue[1]]}}</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import home from '../../common/home.js'
	import uniCombox from "@/components/uni-combox/uni-combox"
	import { mapState } from 'vuex'
	
	export default{
		
		data(){
			return{
				methodList: [{"text": "模糊查询","id": 0},{"text": "空间查询","id": 1}],
				currentMethod: 0,
				searchLayers: [],
				searchLayer:'',
				searchPropsGroup: [],
				searchProps: [],
				searchProp1:'',
				isAdvancedQuery:false,
				advancedQueryText:'',
				searchText:'',
				queryProps:home.queryProps,
				operatorItem:home.operatorItem,
				//显示弹窗的前两个属性到查询结果上
				displayValue:[]
			}
		},
		components:{
			uniCombox
		},
		computed:mapState({
			currentMenu: state => state.query.currentMenu,
			// selectedFeature: state => state.query.selectedFeature,
			showSearchList:state => state.query.showSearchList,
			isNotData:state => state.query.isNotData,
			searchList: state => state.query.searchList,
		}),
		created() {
			for (var i = 0; i < home.layerItemsDisplay.length; i++) {
				var child = home.layerItemsDisplay[i].child;
				if(child != ''){
					for (var j = 0; j < child.length; j++) {
						var item = {
							name:child[j].name,
							value:child[j].value,
							layerName:child[j].layerName,
							displayProps:child[j].displayProps,
							type:child[j].type
						}
						this.searchLayers.push(child[j].name);
						this.searchPropsGroup.push(item)
					}
				}
			}
		},
		watch:{
			searchLayer: function(newVal){
				// console.log("watch searchLayer:",newVal)
				this.searchProp1 = '';
				this.searchText = '';
				for (var i = 0; i < this.searchLayers.length; i++) {
					if(newVal == this.searchLayers[i]){
						var dp = this.searchPropsGroup[i].displayProps;
						var arr = [];
						this.displayValue = [];
						for (var j = 0; j < dp.length; j++) {
							arr.push(dp[j].name);
							this.displayValue.push(dp[j].value)
						}
						this.searchProps = arr;
						this.queryProps = arr;
						plus.storage.setItem("searchLayer",this.searchPropsGroup[i].layerName)
						plus.storage.setItem("currentLayerValue",this.searchPropsGroup[i].value)
						plus.storage.setItem("currentLayerType",this.searchPropsGroup[i].type)
						console.log("this.displayValue:",this.displayValue)
						break;
					}
				}
			}
		},
		methods:{
			//改变查询方式
			changeMethod(e) {
				if (this.currentMethod !== e.currentTarget.id) {
					this.currentMethod = e.currentTarget.id;
				}
			},
			//查询信息
			inputSearchProp(e){
				// console.log("inputSearchProp:",e)
				plus.storage.setItem("searchProp",e)
			},
			inputSearchText(e){
				// console.log("inputSearchText:",e.detail)
				this.searchText = e.detail.value; 
				plus.storage.setItem("searchText",e.detail.value)
			},
			
			//高级查询
			selectProp(e){
				console.log("selectProp:",e)
				this.advancedQueryText += e;
				plus.storage.setItem("advancedQueryText",this.advancedQueryText);
			},
			
			selectOperator(e){
				console.log("selectOperator:",e)
				this.advancedQueryText += e.name;
				plus.storage.setItem("advancedQueryText",this.advancedQueryText);
			},
			
			advancedQueryInput(e){
				var str = e.detail.value
				console.log("advancedQueryInput:",str)
				
				plus.storage.setItem("advancedQueryText",this.advancedQueryText);
			},
			clearInput(){
				this.advancedQueryText = '';
			},
			
			//改变查询结果列表中选中的要素
			showFeature(item){
				// console.log("show feature:",item);
				// this.selectedFeature = item;
				this.$store.commit('setSelectedFeature',{
					selectedFeature:item
				})
			},
			
			
		}
		
	}
	
</script>
	
<style>
	/* 查询模块样式 */
	.input-div{
		/* display: flex; */
		/* align-items: center; */
		margin: 10rpx 0;
	}
	.draw-icon{
		font-size: 18rpx;
		line-height: 18rpx;
		color: #757575;
		margin-right: 10rpx;
	}
	
	.feature-list{
		margin: 0 auto;
		/* padding: 20rpx; */
		/* width: 20vw; */
		/* width: 150rpx; */
		height: 200rpx;
		/* background-color: #818181; */
		/* position: absolute;
		top: 38vh;
		right: 30rpx; */
		white-space: nowrap;
	}
	.feature-list-view{
		/* background-color: #afafaf; */
		/* margin: 5rpx 0; */
		display: flex;
		align-items: center;
		/* border-bottom: 1rpx solid #afafaf; */
	}
	.feature-list-title{
		font-size: 16rpx;
		/* margin: 0 20rpx; */
	}
	.feature-list-auxiliary{
		margin-left: 10rpx;
		font-size: 14rpx;
		color: #4b4b4b;
		/* margin: 0 20rpx; */
	}
	/* 查询方式样式 */
	.method-scroll {
		width: 100%;
		/* padding: 10rpx; */
		display: flex;
		white-space: nowrap;
		/* margin-bottom: 10rpx; */
		/* height: 60rpx; */
		/* background-color: #09BB07; */
	}
	.method-item {
		padding-right: 20rpx;
		font-size: 16rpx;
		display: inline-block;
	}
	.method-item.active {
		color: #1584ff;
		font-weight: bold;
	}
	.advanced-query{
		width: 250rpx;
		/* height: 230rpx; */
		position: absolute;
		top: 20rpx;
		left: 220rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
	}
	.query-props{
		margin: 0 5rpx; 
		font-size: 14rpx;
		border: 1rpx solid #c8c8c8;
		padding: 3rpx 5rpx; 
		border-radius: 5rpx; 
		display: inline-block;
	}
	.operator-item{
		width: 24rpx; 
		height: 24rpx;
		text-align: center; 
		line-height: 24rpx; 
		margin: 0 5rpx; 
		font-size: 14rpx;
		border: 1rpx solid #c8c8c8; 
		border-radius: 50%; 
		display: inline-block;
	}
</style>
