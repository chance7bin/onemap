<template>
	<view>hello world</view>
</template>

<script>
	
	export default{
		
		data(){
			return{
				
			}
		},
		
		
		methods:{
			if(this.currentLayer != 'baseMap'){
				//判断当前图层是地图服务还是要素服务
				//当图层等级大于11.5的时候点击地图点要素才有弹窗
				if(this.currentLayer == 'wfsVectorLayer' && map.getView().getZoom() > 11.5){
					// 添加一个用于选择Feature的交互方式
					map.addInteraction(selectInteraction);
					//要素服务
					var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
						return feature;
					}); 
					console.log("feature:",feature)
					if(feature != null){
						// console.log("feature getId:",feature.getId())
						// console.log("feature getKeys:",feature.getKeys())
						// console.log("feature getProperties:",feature.getProperties())
						let prop = feature.getProperties();
						content.innerHTML = 
						'<div><p>stopID:</p>' + '<p>' + prop.stopid + '</p></div>' +
						'<div><p>name:</p>' + '<p>' + prop.name + '</p></div>';
						// 设置overlay的位置，从而显示在鼠标点击处
						overlay.setPosition(evt.coordinate);
					}
				}
				else if(this.currentLayer == 'lineWfsLayer'){ 
					// 添加一个用于选择Feature的交互方式
					map.addInteraction(roadInteraction);
					//要素服务
					var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
						return feature;
					}); 
					if(feature != null){
						console.log("line feature prop:",feature.getProperties())
						var coorArr = feature.getProperties().geometry.flatCoordinates;
						let prop = feature.getProperties();
						content.innerHTML = 
							'<div><p>道路名:</p>' + '<p>' + prop.name + '</p></div>' +
							'<div><p>道路类型:</p>' + '<p>' + prop.type + '</p></div>' +
							'<div><p>长度:</p>' + '<p>' + prop.distance + '</p></div>' +
							'<div><p>宽度:</p>' + '<p>' + prop.width + '</p></div>' +
							'<div><p>路面类型:</p>' + '<p>' + prop.roadtype + '</p></div>' +
							'<div><p>厚度:</p>' + '<p>' + prop.thickness + '</p></div>';
						// 设置overlay的位置，从而显示在鼠标点击处
						overlay.setPosition(evt.coordinate);
					}
				}
				else if(this.currentLayer == 'polygonWmsLayer'){
					//地图服务
					var view = map.getView();
					var viewResolution = view.getResolution();
					var source = eval(this.currentLayer).getSource();
					var url = source.getFeatureInfoUrl(
						evt.coordinate, viewResolution, view.getProjection(), {
							'INFO_FORMAT': 'application/json',
							'FEATURE_COUNT': 50
						});
					if (url) {
						console.log("url:",url)
			 			$.ajax({
							url: url,
							type: 'GET',
							async: true,
							contentType: 'application/json;charset=utf-8',
							success: data => {
								console.log("data:",data)
								console.log("length:",data.features.length)
								if(data.features.length != 0){
									let prop = data.features[0].properties;
									if(this.currentLayer == 'polygonWmsLayer'){
										console.log("polygonWmsLayer")
										content.innerHTML =
										'<div><p>name:</p>' + '<p>' + prop.name + '</p></div>';
										// 设置overlay的位置，从而显示在鼠标点击处
										overlay.setPosition(evt.coordinate);
									}
								}
							}
						})
					}
				}
			}
		}
		
	}
	
</script>
	
<style>
</style>
