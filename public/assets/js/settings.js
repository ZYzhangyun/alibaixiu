// 网站配置上传图片时
$('#logo').on('change', function () {
    var file = this.files[0];
    var formData = new FormData();
    formData.append('logo', file)
    $.ajax({
        type: "post",
        url: '/upload',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            $('#hiddenLogo').val(response[0].logo)
            $('#preview').attr('src', response[0].logo)
        }
    });

});


//网站配置提交时
$('#settingsForm').on('submit', function () {
    var formData = $(this).serialize()
    $.ajax({
        type: "post",
        url: "/settings",
        data: formData,
        success: function (response) {
            location.reload()
        }
    });
return false;
});



////
// 向服务器端发送请求 索要网站设置数据
$.ajax({
	type: 'get',
	url: '/settings',
	success: function (response) {
		console.log(response)
		if (response) {
			// 将logo地址存储在隐藏域中
			$('#hiddenLogo').val(response.logo)
			// 将logo显示在页面中 
			$('#preview').attr('src', response.logo)
			// 将网站标题显示在页面中
			$('input[name="title"]').val(response.title);
			// 将是否开启评论功能显示在页面中
			$('input[name="comment"]').prop('checked', response.comment)
			// 将评论是否经过人工审核显示在页面中
			$('input[name="review"]').prop('checked', response.review)
		}
	}
})
