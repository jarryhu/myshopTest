function httpRequest(url, type, param) {



	return new Promise((resolve, reject) => {
			if (type == "POST") {
				uni.request({
					url: url,
					data: param,
					dataType: "json",
					method: type,
					success: (res) => {
						return res;
					},
					fail: (err) => {
						reject('err')
					}
				});
			} else {
				uni.request({
					url: url + "/" + param,
					success: (res) => {
						return res;
					},
					fail: (err) => {
						reject('err')
					}
				})
			}
		})
	}

	export default {
		
		httpRequest
	}
