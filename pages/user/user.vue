<template>
	<view style="display: flex;">
		<!-- 侧边栏 -->
		<view style="width: 20vw; height: 100vh; border-right: 3rpx solid #aaaaaa;">
			<view v-for="(item,index) in userList" @click="changeMenu" class="nav-button" :class="[index==currentMenu?'nav-button-active':'']"
			 :key="index" :id="index">
				<view class="nav-button-text">{{item.text}}</view>
			</view>
			<view class="nav-button nav-button-text" @click="logout">退出登录</view>
		</view>
		<!-- 主容器 -->
		<view style="width: 80vw; ">
			<view class="info-layout" v-show="currentMenu==0">
				<view class="info-container">
					<form style="display: flex; justify-content: center; align-items: center;">
						<view class="form-item">
							<view>旧密码:</view>
							<input class="form-input" type="password" id="oldPwd"  value=""  />
						</view>
						<view class="form-item">
							<view>新密码:</view>
							<input class="form-input" type="password" id="newPwd" value=""  />
						</view>
						<view class="form-item">
							<view>确认密码: </view>
							<input class="form-input" type="password" id="confirmPwd" value=""  />
						</view>
						<view style="margin-top: 10rpx; display: flex; justify-content: center;">
							<button type="primary" size="mini"  form-type="submit">确定</button>
						</view>
					</form>
				</view>
			</view>
			<view class="info-layout" v-show="currentMenu==1">
				<view class="info-container">
					<button  type="primary" style="margin-bottom: 20rpx;" >检查更新</button>
					<view style="font-size: 22rpx; color: #ababab;">已是最新版本</view>
					<view style="font-size: 18rpx; color: #ababab;">版本号: V1.0.0</view>
				</view>
			</view>
			<view class="info-layout" v-show="currentMenu==2">
				<view class="info-container">
					<view>
						<view style="font-size: 24rpx;">意见</view>
						<textarea class="opinion" placeholder="请输入您的意见..."/>
						<button type="primary" size="mini" style="margin-top: 10rpx; float: right;">提交</button>
					</view>
				</view>
			</view>
			<view class="info-layout" v-show="currentMenu==3">
				<view class="info-container">
					<view style="font-size: 24rpx;">缓存大小 : 188KB</view>
					<button type="primary" style="margin-top: 10rpx;">清理</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	export default{
		data(){
			return{
				currentMenu:0,
				userList:[
					{"text":"用户信息"},
					{"text":"检查更新"},
					{"text":"意见反馈"},
					{"text":"清理缓存"}
				],
			}
		},
		
		methods:{
			changeMenu(e){
				// console.log("e.currentTarget:",e.currentTarget)
				if (this.currentMenu !== e.currentTarget.id) {
					this.currentMenu = e.currentTarget.id;
				}
			},
			
			logout(){
				uni.redirectTo({
				    url: '../login/login'
				});
				this.$store.commit('setCurrentMenu',0);
			}
		}
		
	}
	
</script>
	
<style>
	.nav-button{
		/* line-height: 1; */
		/* font-size: 22rpx; */
		
		/* margin: 0 20rpx; */
		display: flex;
		flex-direction: column;
		/* justify-content: center; */
		align-items: center;
		color: #8199ab;
	}
	
	.nav-button-text{
		margin: 10rpx 0;
		font-size: 22rpx;
		line-height: 1.2;
	}
	.nav-button-active{
		color: #1584ff;
		font-weight: bold;
	}
	
	.info-layout{
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		/* margin: 50rpx 0 0 50rpx; */
	}
	.info-container{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 280rpx;
		height: 220rpx;
		background-color: #ffffff;
	}
	
	.form-item{
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.form-item view{
		font-size:20rpx; 
	}
	
	.form-input{
		/* display: flex; */
		/* margin-left: 10rpx; */
		border: 1rpx solid #afafaf;
		border-radius: 10rpx;
		height: 30rpx;
		width: 90rpx;
		margin-left: 10rpx;
		padding: 0 10rpx;
	}
	
	.opinion{
		width: 220rpx;
		height: 90rpx;
		border: 1rpx solid #c7c7c7;
		border-radius: 10rpx;
		padding: 10rpx;
		margin: 10rpx 0;
	}
	
</style>
