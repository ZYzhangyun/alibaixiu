// 创建新用户
$('#userForm').on('submit', function () {
    var formdata = $(this).serialize();
    $.ajax({
        type: 'post',
        url: '/users',
        data: formdata,
        success: function () {
            location.reload(); //刷新页面 添加成功
            alert('新用户创建成功')
        },
        error: function (err) {
            var res = JSON.parse(err.responseText);
            alert(res.message)
            // console.log(err);

        }
    })
    return false //阻止表单默认提交
})

//文件选择控件
$('#modifyBox').on('change', '#avatar', function () { //转变成事件委托，为了在修改界面可以添加图片,这一步是在用户列表模板引擎渲染的，为了让修改界面也可以用，给它们共同的父级元素添加事件委托，这样修改和添加界面都可以用了。
    var formData = new FormData();//创建表单对象
    formData.append('avatar', this.files[0]);//向表单对象中追加属性值
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        // 告诉$.ajax方法不要解析请求参数
        processData: false,
        // 告诉$.ajax方法不要设置请求参数的类型
        contentType: false,
        success: function (response) {
            // console.log(response);
            $('#preview').attr('src', response[0].avatar);//preview图片的id，设置图片地址属性
            $('#hiddenAvatar').val(response[0].avatar);//把图片地址放到隐藏域中
        }
    })

})

// 向服务器端发送请求 索要用户列表数据
$.ajax({
    type: 'get',
    url: '/users',
    success: function (response) {
        var html = template('userTpl', { data: response })
        $('#userBox').html(html)
    }
})

// 通过事件委托的方式为编辑按钮添加点击事件
// 当前编辑按钮获取到当条信息的id
$('#userBox').on('click', '.edit', function () { //因为编辑按钮不止一个，所以用事件委托
    var id = $(this).attr('data-id');
//获取到编辑按钮上的自定义属性，自定义属性在模板引擎中就是当条信息的id值。
    $.ajax({
        type: 'get',
        url: '/users/' + id,
        success: function (response) {
            var html = template('modifyTpl', response);
            $('#modifyBox').html(html);//展示信息 modifyBox是包裹的大盒子
            console.log(response);
        }
    })
})

//为修改表单添加表单提交事件
$('#modifyBox').on('submit', '#modifyForm', function () {
    //获取用户在表单中输入的内容
    var formData = $(this).serialize();
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'put',
        url: '/users/' + id,
        data: formData,
        success: function (response) {
            location.reload(); //刷新页面
        }
    })
    return false;
})
