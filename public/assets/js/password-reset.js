// 当修改密码表单发生提交行为的时候
$('#modifyForm').on('submit', function () {
	alert('1');
	// 获取用户在表单中输入的内容
	var formData = $(this).serialize();
	console.log(formData);
	
	// 调用接口 密码修改功能
	$.ajax({
		url: '/users/password',
		type: 'put',
		data: formData,
		success: function (response) {
			location.href = '/admin/login.html'
			// location.reload();
		}
	})
	// 阻止表单默认提交
	return false;
});
