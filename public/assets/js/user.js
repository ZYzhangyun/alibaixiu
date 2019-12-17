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
    console.log(this.files);

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
            //response返回的是一个数组，数组当中又对象，对象的属性是avatar
            $('#preview').attr('src', response[0].avatar);//preview图片的id，设置图片地址属性 用于预览，此时图片数据还没有提交到数据库
            $('#hiddenAvatar').val(response[0].avatar);//把图片地址放到隐藏域中 连同其他的信息以及图片地址一起提交到数据库由服务器存到数据库。。。
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
            $('#modifyBox').html(html);// 展示信息 modifyBox是包裹的大盒子
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
        success: function () {
            location.reload(); //刷新页面
        }
    })
    return false;
})


//点击删除按钮，删除用户，事件委托
$('#userBox').on('click', '.delete', function () {
    if (confirm('你真的确定要删除吗')) {
        var id = $(this).attr('data-id');//获取自定义属性值
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function (response) {
                location.reload();
            }
        })
    }
})


//选择全选框时，其他的input框全部被选中，给全选框添加点击change事件
$('#selectAll').on('change', function () {
    var status = $(this).prop('checked');
    if (status) { //如果全选框被选中，显示批量删除按钮
        $('#deleteMany').show();
    } else {
        $('#deleteMany').hide();
    }
    //获取到所有用户并将用户的状态和全选框保持一致
    $('#userBox').find('input').prop('checked', status)

})

//设置下方的小复选框，如果所有的小复选框全部被选中，上面的全选按钮也被选中
//实现思路，如果所有的小复选框的数量和所有的用户数量保持一致，那么就让全选按钮选中
$('#userBox').on('change', '#userStatus', function () { //设置事件委托
    var inputs = $('#userBox').find('input');
    //过滤小复选框的选中状态
    if (inputs.length == inputs.filter(':checked').length) {
        $('#selectAll').prop('checked', true)
    } else {
        $('#selectAll').prop('checked', false)
    }
    if (inputs.filter(':checked').length > 0) {
        $('#deleteMany').show();
    } else {
        $('#deleteMany').hide();
    }
})

//为批量删除按钮添加点击事件

$('#deleteMany').on('click', function () {
    var ids = [];
    //获取选中的用户
    var checkedUser = $('#userBox').find('input').filter(':checked'); //userBox是tbody
    checkedUser.each(function (index, element) { //对选中的复选框做循环
        ids.push($(element).attr('data-id')); //把选中的复选框的id获取到，追加到数组ids中
        if (confirm('你真的进行批量删除吗')) {
            $.ajax({
                type: 'delete',
                url: '/users/' + ids.join('-'),  //数组里的数字用-分开，并转成字符串
                success: function (response) {
                    // console.log(response);
                    location.reload();
                }
            })
        }
    })
});

