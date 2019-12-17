//添加分类功能
$('#addCategories').on('submit', function () {
    var formData = $(this).serialize();
    $.ajax({
        type: 'post',
        url: '/categories',
        data: formData,
        success: function (response) {
            console.log(response);
            location.reload();
        }  //fa-glass
    })
    return false;
})

// 发送ajax请求 向服务器端所有分类列表数据 查询分类列表
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (response) {
        // console.log(response);
        var html = template('categoryListTpl', { data: response });
        // 将拼接好的内容放到页面中
        $('#categoryBox').html(html);
    }

})

//为编辑按钮添加点击事件 根据id查询分类
$('#categoryBox').on('click', '.edit', function () {
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'get',
        url: '/categories/' + id,
        success: function (response) {
            console.log(response);
            var html = template('modifyCategoryTpl', response)
            $('#formBox').html(html);
        }
    });
})

// 当修改表单发生提交事件

$('#formBox').on('submit', '#modifyCategory', function () {
    var formData = $(this).serialize();
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'put',
        url: '/categories/' + id,
        data: formData,
        success: function () {
            location.reload();
        }
    });
    return false;
})

// 当删除按钮被点击的时候 可以考虑封装成函数的形式，每次调用就行
$('#categoryBox').on('click', '.delete', function () {
    if (confirm('您真的确定要删除吗')) {
        var id = $(this).attr('data-id')
        $.ajax({
            type: "delete",
            url: "/categories/" + id,
            success: function (response) {
                location.reload();
            }
        });     
    }

})

