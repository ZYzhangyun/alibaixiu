// 获取到浏览器地址栏中的搜索关键字
var key = getUrlParams('key');
// 根据搜索关键字调用搜索接口 获取搜索结果
$.ajax({
	type: 'get',
	url: '/posts/search/' + key,
	success: function (response) {
		var html = template('searchTpl', {data: response});
        $('#listBox').html(html);
        
	}
})


// 根据分类id获取分类信息

// $.ajax({
// 	type: 'get',
// 	url: '/categories/'+ key,
// 	success: function (response) {
// 		$('#categoryTitle').html(response.title)
// 	}
// })