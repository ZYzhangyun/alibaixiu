// 当管理员选择文件的时候
$('#file').on('change', function () {
    // alert('1')
    // 用户选择到的文件
    var file = this.files[0];
    // 创建formData对象实现二进制文件上传
    var formData = new FormData();
    // 将管理员选择到的文件添加到formData对象中
    formData.append('image', file);
    // 向服务器端发送请求 实现图片上传
    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log(response);
            console.log(response[0].image)
            $('#image').val(response[0].image); //图片存储在隐藏域中，以便随着提交按钮传入数据库
            $('#preview').attr("src", response[0].image).show();
        }
    })
});

// 当轮播图表单发生提交行为时
$('#slidesForm').on('submit', function () {
    // 获取管理员在表单中输入的内容
    var formData = $(this).serialize();
    // 向服务器端发送请求 添加轮播图数据
    $.ajax({
        type: 'post',
        url: '/slides',
        data: formData,
        success: function () {
            location.reload();
        }
    })
    // 阻止表单默认提交行为
    return false;
})

// 向服务器端发送请求 索要图片轮播列表数据
$.ajax({
    type: "get",
    url: "/slides",
    success: function (response) {
        var html = template('slidesTpl', { data: response });
        $('#slidesBox').html(html);
    }
});

//当删除按钮被点击时
$('#slidesBox').on('click', '.delete',function () {
    if (confirm('are you sure?')) {
        // 获取管理员要删除的轮播图数据id
        var id = $(this).attr('data-id');
        $.ajax({
            type: "delete",
            url: "/slides/" + id,
            success: function (response) {
                location.reload();
            }
        });
    }

});
