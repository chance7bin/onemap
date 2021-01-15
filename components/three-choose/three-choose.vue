<template>
	<view class="class_mulu">
		<view class="tree_mulu">
			<view v-for="(index,ind) in mulunum">
				<view class="mulu_frist" @click="fristZhankai(ind)">
					<image v-if="fatherToInfo.firstImg!=''" class="fristImg" :src="fatherToInfo.firstImg" mode=""></image>
					<text :style="[{fontSize:fatherToInfo.firstfontsize+'rpx',color:fatherToInfo.firstcolor}]">{{index.courseTitle}}</text>
					<image v-if='index.open==false' class="fristjiantou"  :src="fatherToInfo.defaultIcon" mode=""></image>
					<image v-if='index.open' class="fristjiantou" :src="fatherToInfo.currentIcon" mode=""></image>
				</view>
				<view v-if='index.open'>
					<view class="mulu_second" v-for="(index2,ind2) in mulunum[ind].courseChapterList">
						<view class="mulu_second_view" @click="muluSecond(ind,ind2)">
							<image v-if="fatherToInfo.secondImg!=''" class="fristImg" :src="fatherToInfo.secondImg" mode=""></image>
							<text :style="[{fontSize:fatherToInfo.secondfontsize+'rpx',color:fatherToInfo.secondcolor}]">{{index2.ccName}}</text>
							<image v-if="index2.secondOpen==false" class="fristjiantou" :src="fatherToInfo.defaultIcon" mode=""></image>
							<image v-if="index2.secondOpen==true" class="fristjiantou" :src="fatherToInfo.currentIcon" mode=""></image>
						</view>
						<view v-if="index2.secondOpen==true" class="mulu_third" v-for="(index3,ind3) in index2.courseVideosList" @click="choosedVideofn(ind,ind2,ind3)">
							<image v-if="index3.thirdOpen==true" class="playIngImg" :src="fatherToInfo.thirdImg" mode=""></image>
							<view class="third_title" v-if="index3.thirdOpen==false" :style="[{fontSize:fatherToInfo.thirdfontsize+'rpx',color:fatherToInfo.thirdcolor}]">{{index3.vTitle}}</view>
							<view class="third_title" v-if="index3.thirdOpen==true"  :style="[{fontSize:fatherToInfo.thirdfontsize+'rpx',color:fatherToInfo.choosedcolor}]">{{index3.vTitle}}</view>
							<text class="third_time" v-if="index3.thirdOpen==false" :style="[{fontSize:fatherToInfo.thirdrightfontsize+'rpx',color:fatherToInfo.thirdrightcolor}]">{{index3.duration}}</text>
							<text class="third_time" v-if="index3.thirdOpen==true" :style="[{fontSize:fatherToInfo.thirdrightfontsize+'rpx',color:fatherToInfo.thirdrightchoosed}]">{{index3.duration}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// mulunum:[]
			}
		},
		onLoad() {

		},
		methods: {
			// 下拉
			fristZhankai(ind) {
				if(this.fatherToInfo.shoufenq){
					this.mulunum.forEach((index,xb)=>{
						if(ind==xb){
							this.$set(index, 'open', true)
						}else{
							this.$set(index, 'open', false)
						}
					})
				}else{
					if (this.mulunum[ind].open == true) {
						this.$set(this.mulunum[ind], 'open', false)
					} else {
						this.$set(this.mulunum[ind], 'open', true)
					}
				}
					
				
				
			},
			// 二级下拉
			muluSecond(ind, ind2) {
				if(this.fatherToInfo.twoshoufenq){
					this.mulunum[ind].courseChapterList.forEach((index2,xb2)=>{
						if(ind2==xb2){
							this.$set(index2, 'secondOpen', true)
						}else{
							this.$set(index2, 'secondOpen', false)
						}
					})
				}else{
					if (this.mulunum[ind].courseChapterList[ind2].secondOpen == true) {
						this.mulunum[ind].courseChapterList[ind2].secondOpen = false;
					} else {
						this.mulunum[ind].courseChapterList[ind2].secondOpen = true;
					}
				}
				
			},
			choosedVideofn(ind, ind2, ind3) {
				let that = this;
				that.mulunum.forEach((arr, xiab) => {
					arr.courseChapterList.forEach((arr2, xiab2) => {
						arr2.courseVideosList.forEach((arr3, xiab3) => {
							that.$set(arr3, 'thirdOpen', false)
						})
					})
				});
				that.$set(that.mulunum[ind].courseChapterList[ind2].courseVideosList[ind3], 'thirdOpen', true);
				console.log('标志代码', that.mulunum[ind].courseChapterList[ind2].courseVideosList[ind3].vTitle);
				
			}
		},
		 props:["mulunum","fatherToInfo"],
	}
</script>

<style lang="scss">
	.class_mulu {
		width: 100%;

		.jieshao_class {
			width: 100%;
			height: 84rpx;
			line-height: 84rpx;
			padding: 0 20rpx;
			box-sizing: border-box;

			.jieshao_title {
				font-size: 26rpx;
				color: #333333;
				font-weight: bold;
				margin-left: 75rpx;
			}

			.jieshao_time {
				font-size: 24rpx;
				color: #333333;
				float: right;
			}

			.choosedcolor {
				color: #3c87ca;
			}
		}

		.tree_mulu {
			width: 100%;
			padding: 20rpx 0;

			.mulu_frist {
				width: 100%;
				padding: 0 20rpx;
				box-sizing: border-box;
				position: relative;
				height: 80rpx;

				text {
					font-size: 30rpx;
					color: #000;
					font-weight: bold;
					margin-left: 55rpx;
					line-height: 80rpx;
				}

				.fristImg {
					width: 24rpx;
					height: 24rpx;
					position: absolute;
					top: 0;
					bottom: 0;
					left: 36rpx;
					margin: auto;
				}

				.fristjiantou {
					width: 20rpx;
					height: 20rpx;
					position: absolute;
					top: 0;
					bottom: 0;
					right: 44rpx;
					margin: auto;
				}
			}

			.mulu_second {
				width: 100%;

				.mulu_second_view {
					width: 100%;
					padding: 20rpx 20rpx 20rpx 40rpx;
					box-sizing: border-box;
					position: relative;
				}
				.fristImg {
					width: 24rpx;
					height: 24rpx;
					position: absolute;
					top: 0;
					bottom: 0;
					left: 50rpx;
					margin: auto;
				}

				text {
					font-size: 28rpx;
					font-weight: bold;
					color: #333333;
					margin-left: 55rpx;
				}

				.fristjiantou {
					width: 20rpx;
					height: 20rpx;
					position: absolute;
					top: 0;
					bottom: 0;
					right: 44rpx;
					margin: auto;
				}
			}

			.mulu_third {
				width: 100%;
				// padding: 0 40rpx;
				padding: 0 20rpx 0 84rpx;
				box-sizing: border-box;
				position: relative;
				height: 80rpx;

				.playIngImg {
					width: 20rpx;
					height: 20rpx;
					// margin: auto;
					margin-right: 20rpx;
				}

				.third_title {
					font-size: 26rpx;
					color: #666;
					width: 60%;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					display: inline-flex;
					margin-left: 0;
					line-height: 80rpx;
				}

				.third_time {
					font-size: 24rpx;
					color: #666;
					line-height: 70rpx;
					float: right;
				}

				.choosedvideo {
					color: #3c87ca;
				}
			}
		}
	}
</style>
