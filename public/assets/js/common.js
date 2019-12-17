$('#loginout').on('click', function () {
    var isconfirm = confirm('你确定要退出吗')
    if (isconfirm) {
        $.ajax({
            type: 'post',
            url: '/logout',
            success: function () {
                location.href = 'login.html'
            },
            error: function () {
                alert('退出失败')
            }
        })
    }
})

// 向服务器端发送请求 索要登录用户信息
$.ajax({
    type: 'get',
    url: '/users/' + userId,
    success: function (response) {
        $('.avatar').attr('src', response.avatar)//登陆用户图片
        $('.profile .name').html(response.nickName) //登陆用户昵称
    }
})