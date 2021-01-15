<template>
	<view class=" con-v">
		<checkbox-group @change="checkboxChange">
			<view class="con-v" v-for="(item1, j) in list" :key="j" style="position: relative;">
				<view class="con-h">
					<image v-show="item1.child!= ''" style="width: 20upx;height: 20upx; position: absolute;left: 0upx;top: 20upx;" :src="img_src(item1.showChild)" @tap="s_oneTap(j)"></image>
					<checkbox :value="item1.value" :checked="false" class="checkbox-frame">{{ item1.name }}</checkbox>
				</view>
				<view v-show="item1.showChild == true" class="con-v" v-for="(item2, k) in list[j].child" :key="k" style="position: relative;margin-left: 30upx;">
					<view class="con-h">
						<image v-show="item2.grandchild!= ''" style="width: 20upx;height: 20upx; position: absolute;left: 0upx;top: 20upx;" :src="img_src(item2.showChild)" @tap="s_twoTap(j,k)"></image>
						<checkbox :value="item2.value" :checked="false" style="font-size: 13upx;margin-left: 30upx;position: relative;">{{ item2.name }}</checkbox>
					</view>
					<view v-show="item2.showChild == true" class="con-h" v-for="(item3, l) in list[j].child[k].grandchild" :key="l" style="position: relative;margin-left: 30upx;">
						<checkbox :checked="false" :value="item3.value" style="font-size: 13upx;margin-left: 30upx;position: relative;">{{ item3.name }}</checkbox>
					</view>
				</view>
			</view>
		</checkbox-group>
	</view>
</template>

<script>

var value = [ 
	{
		name: 'test1',
		value: '1111111',
		showChild: false,
		child:[
			{
				name: 'testc1',
				value: '1111111',
				showChild: false,
				grandchild:[
					{
						name: 'test1',
						value: '1111111',
					},
					{
						name: 'test2',
						value: '1111111',
					}
				]
			},
			{	
				name: 'testc2',
				value: '1111111',
				showChild: false,
				grandchild:[
					{
						name: 'test3',
						value: '1111111',
					},
					{
						name: 'test4',
						value: '1111111',
					}
					
				]
			}
			
		]
	},
	{
		name: 'test2',
		value: '2222222',
        showChild: false,
		child:[
			{
				name: 'c2222',
				value: 'v1',
				showChild: false,
				grandchild:[
					{
						name: 'test5',
						value: 'v2',
					},
					{
						name: 'test6',
						value: '1',
					},
				]
			},
			{	
				name: 'c22222',
				value: 'v3',
				showChild: false,
				grandchild:[]
			}
			
		]
	},
	{
		showChild: false,
		name: 'test3',
		value: 'v4',
		child:[
			{
				name: 'c3333',
				value: 'v5',
				showChild: false,
				grandchild:[
					{
						name: 'test7',
						value: 'v5',
					},
					{
						name: 'test8',
						value: 'v6',
					},
				]
			},
			{	
				name: 'c33333',
				value: 'v7',
				showChild: false,
				grandchild:[]
			}
			
		]
	}
];
export default {
	data() {
		return {
			j: true,
			list: [],
			s_one: false,
			s_two: false
		}
	},
	mounted(){
		this.setValue(value)
	},
	methods: {
		setValue(data){
			this.list = data
		},
		s_oneTap(index) {
			console.log('=======================oneTap===index=========' + index);
			this.list[index].showChild = !this.list[index].showChild;
		},
		s_twoTap(j,k) {
			this.list[j].child[k].showChild = !this.list[j].child[k].showChild;
		},
		img_src(tag) {
			if (tag) {
				return '../../static/image/down.png';
			} else {
				return  '../../static/image/right.png';
			}
		},
		checkboxChange: function(e) {
			var items = this.items;
			let value = JSON.stringify(e);
			console.log('===============================box=value==' + e.detail.value[0]);
			this.$emit('choose',{
				value:e.detail.value
			})
			
		}
	}
};
</script>

<style>
	.checkbox-frame{
		font-size: 13upx;
		margin-left: 30upx;
		position: relative;
		/* transform:scale(0.7) */
	}
</style>

