<template>
	<view>
		<checkbox-group @change="checkboxChange">
			<view v-for="(item1, j) in list" :key="j" style="position: relative;">
				<view style="display: flex; align-items: center;">
					<image v-show="item1.child!= ''" class="icon-div" :src="img_src(item1.showChild)" @tap="s_oneTap(j)"></image>
					<view style="font-size: 16upx; margin-left: 10upx;">{{ item1.name }}</view>
				</view>
				<view v-show="item1.showChild == true" v-for="(item2, k) in list[j].child" :key="k" style="margin-left:10upx; font-size: 20upx;">
					<checkbox :value="item2.value" :checked="item2.isChecked" style="transform:scale(0.7)">{{ item2.name }}</checkbox>
				</view>
			</view>
		</checkbox-group>
	</view>
</template>

<script>


export default {
	data() {
		return {
			list: [],
		}
	},
	props:{
		layers:Array
	},
	created(){
		this.setValue(this.layers)
	},
	methods: {
		setValue(data){
			this.list = data
		},
		s_oneTap(index) {
			// console.log('unfold index:' + index);
			this.list[index].showChild = !this.list[index].showChild;
		},
		s_twoTap(j,k) {
			this.list[j].child[k].showChild = !this.list[j].child[k].showChild;
		},
		img_src(tag) {
			if (tag) {
				return '../../static/image/currentIcon.png';
			} else {
				return  '../../static/image/defaultIcon.png';
			}
		},
		checkboxChange: function(e) {
			// var items = this.items;
			let value = JSON.stringify(e.detail);
			console.log('selected value:',value);
			// plus.storage.setItem("layersItems",JSON.stringify(e.detail.value))
			this.$emit('chooseLayer',{
				value:e.detail.value
			}) 
			
		}
	}
};
</script>

<style>
	.icon-div{
		width: 15upx;
		height: 15upx; 
		/* position: absolute;
		left: 0upx;
		top: 20upx; */
	}
	.checkbox-frame{
	}
</style>

