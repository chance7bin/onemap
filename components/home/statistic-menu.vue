<template>
	<view class="side-menu">
		<!-- 条件选择界面 -->
		<view>
			<!-- 初始界面 -->
			<view v-show="statStep == 0">
				<view class="menu-top">
					<view class="menu-top-title">统计分析</view>
					<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="$store.commit('setCurrentMenu',-1)"></view>
				</view>
				<view class="stat-menu-padding">
					<form @submit="initNextStep">
						<radio-group name="radio">
							<view style="display: flex;justify-content: space-between; align-items: center;">
								<label for="statMethod1" style="font-size: 16rpx;">常规统计</label>
								<radio style="transform:scale(0.7)" value="0" checked="true" id="statMethod1"></radio>
							</view>
							<view style="margin-top: 10rpx; display: flex;justify-content: space-between; align-items: center;">
								<label for="statMethod2" style="font-size: 16rpx;">自定义统计</label>
								<radio style="transform:scale(0.7)" value="1" id="statMethod2"></radio>
							</view>
						</radio-group>
						<button formType="submit" type="primary" class="next-step">下一步</button>
					</form>
				</view>
			</view>
			<!-- 常规统计 -->
			<view>
				<view v-show="statMethod == 0 && statStep == 1">
					<view class="menu-top">
						<view class="iconfont icon-jiantouarrowhead7 menu-top-icon" @click="() => statStep--"></view>
						<view class="menu-top-title">图层选择</view>
						<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="$store.commit('setCurrentMenu',-1)"></view>
					</view>
					<view class="stat-menu-padding">
						<form @submit="generalChooseLayers">
							<scroll-view scroll-y="true" scroll-x="true" style="height: 180rpx;">
								<checkbox-group name="checkbox">
									<view v-for="(item,index) in generalStatLayer" :key="index" style="line-height: 1.2; display: flex;justify-content: space-between; align-items: center;">
										<label :for="item.labelId" style="font-size: 16rpx;">{{item.name}}</label>
										<checkbox style="transform:scale(0.6)" :value="item.value" :id="item.labelId"></checkbox>
									</view>
								</checkbox-group>
							</scroll-view>
							<button formType="submit" type="primary" class="next-step">下一步</button>
						</form>
					</view>
				</view>
				<view  v-show="statMethod == 0 && statStep == 2">
					<view class="menu-top">
						<view class="iconfont icon-jiantouarrowhead7 menu-top-icon" @click="() => statStep--"></view>
						<view class="menu-top-title">统计范围</view>
						<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="$store.commit('setCurrentMenu',-1)"></view>
					</view>
					<view class="stat-menu-padding">
						<radio-group name="radio">
							<view style="display: flex;justify-content: space-between; align-items: center;">
								<label for="statArea1" style="font-size: 16rpx;">全部统计</label>
								<radio style="transform:scale(0.7)" value="0" checked="true" id="statArea1"></radio>
							</view>
							<view style="margin-top: 10rpx; display: flex;justify-content: space-between; align-items: center;">
								<label for="statArea2" style="font-size: 16rpx;">绘制范围</label>
								<radio style="transform:scale(0.7)" value="1" id="statArea2"></radio>
							</view>
						</radio-group>
						<button  type="primary" class="next-step" @click="showStatColumn">统计</button>
					</view>
				</view>
			</view>
			<!-- 自定义统计 -->
			<view>
				<view v-show="statMethod == 1 && statStep == 1">
					<view class="menu-top">
						<view class="iconfont icon-jiantouarrowhead7 menu-top-icon" @click="() => statStep--"></view>
						<view class="menu-top-title">图层选择</view>
						<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="$store.commit('setCurrentMenu',-1)"></view>
					</view>
					<view class="stat-menu-padding">
						<scroll-view scroll-y="true" scroll-x="true" class="layer-scroll" style="height: 180rpx;">
							<y-treebox :layers="layerItemsDefault" @chooseLayer="chooseLayerStat"></y-treebox>
						</scroll-view>
						<button formType="submit" type="primary" class="next-step" @click="customNext">下一步</button>
					</view>
				</view>
				<view v-show="statMethod == 1 && statStep == 2">
					<view class="menu-top">
						<view class="iconfont icon-jiantouarrowhead7 menu-top-icon" @click="() => statStep--"></view>
						<view class="menu-top-title">自定义统计</view>
						<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="$store.commit('setCurrentMenu',-1)"></view>
					</view>
					<view class="menu-padding">
						<uni-combox label="图层名" :candidates="statProps.layerProps.layerCandidate" placeholder="请选择" v-model="statProps.layerProps.layerBindVal" style="margin-top: 10rpx;"></uni-combox>
						<uni-combox label="分类字段" :candidates="statProps.fieldProps.fieldCandidate" placeholder="请选择" v-model="statProps.fieldProps.fieldBindVal" style="margin-top: 10rpx;"></uni-combox>
						<uni-combox label="统计字段" :candidates="statProps.attrProps.attrCandidate" placeholder="请选择" v-model="statProps.attrProps.attrBindVal" style="margin-top: 10rpx;"></uni-combox>
						<uni-combox label="统计方式" :candidates="statProps.methodProps.methodCandidate" placeholder="请选择" v-model="statProps.methodProps.methodBindVal" style="margin-top: 10rpx;"></uni-combox>
						<view style="display: flex; justify-content: space-between; margin-top: 10rpx;">
							<button type="default" size="mini" @click="clearStatProps">清除</button>
							<button type="primary" size="mini" @click="showStatColumn">统计</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 统计图表 -->
		<view class="static-result" v-show="showStatChart">
			<view class="menu-top">
				<view class="menu-top-title">统计结果</view>
				<view class="iconfont icon-xianshi_quxiaotianchong menu-top-icon" @click="() => showStatChart = false"></view>
			</view>
			<view style="padding: 10rpx;">
				<scroll-view class="qiun-charts" scroll-y="true">
					<canvas canvas-id="canvasColumn" id="canvasColumn" class="charts" @touchstart="touchColumn"></canvas>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import uCharts from '@/components/u-charts/u-charts.js';
	import home from '../../common/home.js'
	import { mapState } from 'vuex'
	import uniCombox from "@/components/uni-combox/uni-combox"
	
	var canvaColumn = null;
	
	export default{
		data(){
			return{
				// 统计模块
				layerItemsDefault:home.layerItemsDisplay,
				generalStatLayer:home.generalStatLayer,
				statArea:['A县','B县','C县','D县'],
				roadType:['高速干道','快速干道','主干道','次干道','支路'],
				showStatChart:false,
				//柱状图
				cWidth: uni.upx2px(250),
				cHeight: uni.upx2px(250),
				pixelRatio: 1, 
				serverData: '',
				chartData: home.chartData,
				statProps:home.statProps,
				statData:home.statData,
				statMethod:0,
				statStep:0,
			}
		},
		components:{uniCombox},
		methods:{
			//统计功能模块
			initNextStep(e){
				console.log("initNextStep:",e.detail);
				this.statStep++; 
				this.statMethod = e.detail.value.radio;
			},
			
			//常规统计
			generalChooseLayers(e){
				console.log("generalChooseLayers:",e.detail.value.checkbox);
				this.statStep++; 
			},
			
			//自定义统计
			chooseLayerStat(e){
				console.log("chooseLayerStat:",e.value);
			},
			customNext(){
				this.statStep++;
			},
			
			//构造统计图数据
			constructData(){
				var tempData = this.statData.construction;
				var categories = [];
				var tempSeries = [];
				var series = [];
				// if(this.statProps.fieldProps.fieldBindVal == '道路类型'){
				// 	tempData = this.statData.type;
				// } else {
				// 	tempData = this.statData.roadtype;
				// }
				
				if(this.statProps.attrProps.attrBindVal == "车道里程"){
					for (var i = 0; i < tempData.length; i++) {
						categories.push(tempData[i].name);
						tempSeries.push(tempData[i].total);
					}
					series = [{"name":"车道里程","data":tempSeries}];
				}
				else if(this.statProps.attrProps.attrBindVal == "四车道"){
					for (var i = 0; i < tempData.length; i++) {
						categories.push(tempData[i].name);
						tempSeries.push(tempData[i].four);
					}
					series = [{"name":"四车道","data":tempSeries}];
				}
				else if(this.statProps.attrProps.attrBindVal == "六车道"){
					for (var i = 0; i < tempData.length; i++) {
						categories.push(tempData[i].name);
						tempSeries.push(tempData[i].six);
					}
					series = [{"name":"六车道","data":tempSeries}];
				}
				else if(this.statProps.attrProps.attrBindVal == "八车道"){
					for (var i = 0; i < tempData.length; i++) {
						categories.push(tempData[i].name);
						tempSeries.push(tempData[i].eight);
					}
					series = [{"name":"八车道","data":tempSeries}];
				} 
				else{
					categories = ["规划高速","建成高速","在建高速"];
					series = [
						{
							"name":"车道里程",
							"data":[29,19,14]
						},
						{
							"name":"四车道",
							"data":[14,9,6]
						},
						{
							"name":"六车道",
							"data":[12,8,5]
						},
						{
							"name":"八车道",
							"data":[11,7,5]
						}
					]
				}
				
				this.chartData = {
					"categories": categories,
					"series": series
				}
				
				console.log("this.chartData:",this.chartData)
			},
			clearStatProps(){
				this.statProps.fieldProps.fieldBindVal = '';
				this.statProps.attrProps.attrBindVal = '';
				this.statProps.methodProps.methodBindVal = '';
			},
			// 绘制柱状图方法
			showStatColumn(){
				var flag1 = this.statProps.fieldProps.fieldBindVal;
				var flag2 = this.statProps.attrProps.attrBindVal;
				var flag3 = this.statProps.methodProps.methodBindVal;
				console.log("flag1:",flag1);
				console.log("flag2:",flag2);
				/* if(flag1 == '' || flag2 == ''){
					uni.showToast({
						title:'请补全统计信息',
						duration:2000,
						icon:'none'
					})
				} else{
					this.showStatChart = !this.showStatChart;
					
					this.constructData();
					
					this.getServerData();
				} */
				
				this.showStatChart = true;
				
				this.constructData();
				
				this.getServerData();
			},
			getServerData() {
				this.serverData = this.chartData;
				let Column = {
					categories: [],
					series: []
				};
				Column.categories = this.serverData.categories;
				Column.series = this.serverData.series;
				this.showColumn("canvasColumn", Column);
			},
			showColumn(canvasId, chartData) {
				canvaColumn = new uCharts({
					$this: this,
					canvasId: canvasId,
					type: 'column',
					legend: {
						show: true
					},
					fontSize: 11,
					background: '#FFFFFF',
					pixelRatio: this.pixelRatio,
					animation: true,
					categories: chartData.categories,
					series: chartData.series,
					xAxis: {
						disableGrid: true,
						rotateLabel: true
					},
					yAxis: {
						//disabled:true
						min:0,
						disableGrid: true,
						format:val=>{return val.toFixed(0)} // 格式化Y轴，不显示小数点
					},
					dataLabel: false,
					width: this.cWidth * this.pixelRatio,
					height: this.cHeight * this.pixelRatio,
					extra: {
						column: {
							type: 'group',
							width: this.cWidth * this.pixelRatio * 0.45 / chartData.categories.length
						}
					}
				});
			
			},
			touchColumn(e) {
				canvaColumn.showToolTip(e, {
					format: function(item, category) {
						if (typeof item.data === 'object') {
							return item.name + ' : ' + item.data.value
						} else {
							return item.name + ' : ' + item.data
						}
					}
				});
			},
		}
		
	}
	
</script>
	
<style>
	/* 统计样式 */
	.stat-menu-padding{
		padding:10rpx;
		position: relative;
		height: 230rpx;
	}
	.static-result{
		width: 300rpx;
		/* height: 230rpx; */
		position: absolute;
		top: 20rpx;
		left: 220rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
	}
	.next-step{
		position: absolute; 
		bottom: 0;
		font-size: 16rpx;
		width: 160rpx;
	}
	.qiun-charts {
		/* margin-top: 10rpx; */
		width: 250rpx;
		height: 150rpx;
		background-color: #eeeeee;
		margin: 0 auto;
	}
	
	.charts {
		width: 250rpx;
		height: 250rpx;
		background-color: #eeeeee;
	}
</style>
