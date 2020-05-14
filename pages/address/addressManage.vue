<template>
	<view class="content">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input class="input" type="text" v-model="addressData.receivername" placeholder="收货人姓名" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input class="input" type="number" v-model="addressData.mobile" placeholder="收货人手机号码" placeholder-class="placeholder" />
		</view>
		<view class="row b-b">
			<text class="tit">地址</text>
			<text class="input">
				{{addressData.address}}
			</text>
			<text class="yticon icon-shouhuodizhi" @click="chooseLocation"></text>
		</view>
		<view class="row b-b">
			<text class="tit">门牌号</text>
			<input class="input" type="text" v-model="addressData.area" placeholder="楼号、门牌" placeholder-class="placeholder" />
		</view>

		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch :checked="addressData.default_" color="#fa436a" @change="switchChange" />
		</view>
		<button class="add-btn" @click="confirm">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addressData: {
					receivername: '',
					mobile: '',
					addressName: '在地图选择',
					address: '',
					area: '',
					default_: false
				}
			}
		},
		onLoad(option) {
			let title = '新增收货地址';
			if (option.type === 'edit') {
				title = '编辑收货地址'

				this.addressData = JSON.parse(option.data)
			}
			this.manageType = option.type;
			uni.setNavigationBarTitle({
				title
			})
		},
		methods: {
			switchChange(e) {
				//设置为默认地址的方法
				//首先判断当前是不是默认地址，如果是那么就把 其置为非默认
				//如果不是默认地址那么就是把其置为默认地址

				if (e.detail.value) {
					this.addressData.default_ = 1
				} else {
					this.addressData.default_ = 0;
				}
				// console.log("switchChange....")
				// console.log(this.addressData.default_)
				// console.log("switchChange....addressData")
				// console.log(this.addressData)
			},

			//地图选择地址
			chooseLocation() {
				console.log("chooseLocation")
				uni.chooseLocation({
					success: (data) => {
						this.addressData.addressName = data.name;
						this.addressData.address = data.name;
					}
				})
			},

			//提交
			confirm() {
				let data = this.addressData;
				if (!data.receivername) {
					this.$api.msg('请填写收货人姓名');
					return;
				}
				if (!(/^1[3456789]\d{9}$/.test(data.mobile))) {
					this.$api.msg('请输入正确的手机号码');
					return;
				}
				if (!data.address) {
					this.$api.msg('请在地图选择所在位置');
					return;
				}
				if (!data.area) {
					this.$api.msg('请填写门牌号信息');
					return;
				}
				try {
					var c_id = uni.getStorageSync("userInfo").id;
					data.c_id = c_id;
				} catch (e) {

				}

				//console.log("......data........")
				//console.log(data);
				//this.$api.prePage()获取上一页实例，可直接调用上页所有数据和方法，在App.vue定义
				//	this.$api.prePage().refreshList(data, this.manageType);
				var url = (this.manageType == 'edit') ? this.myroot + "updateAddress" : this.myroot + "insertAddress";
				uni.request({
					url: url,
					data: data,
					dataType: "json",
					method: "POST",
					success: (res) => {
						if (res.data.code == 0) {
							this.$api.msg(`地址${this.manageType=='edit' ? '修改': '添加'}成功`);
							setTimeout(() => {
								uni.navigateBack()
							}, 800)
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-top: 16upx;
	}

	.row {
		display: flex;
		align-items: center;
		position: relative;
		padding: 0 30upx;
		height: 110upx;
		background: #fff;

		.tit {
			flex-shrink: 0;
			width: 120upx;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.input {
			flex: 1;
			font-size: 30upx;
			color: $font-color-dark;
		}

		.icon-shouhuodizhi {
			font-size: 36upx;
			color: $font-color-light;
		}
	}

	.default-row {
		margin-top: 16upx;

		.tit {
			flex: 1;
		}

		switch {
			transform: translateX(16upx) scale(.9);
		}
	}

	.add-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		margin: 60upx auto;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}
</style>
