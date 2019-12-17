$.ajax({
    type: "get",
    url: "/comments",
    success: function (response) {
        // console.log(response);
        var html = template('commentsTpl', response);
        $('#commentsBox').html(html);
        
        // var pageHTML = template('pageTpl', response);
        // $('#pageBox').html(pageHTML);

        $('#pageBox').twbsPagination({
            totalPages: response.pages, //总页数
            visiblePages: 5,//显示的按钮个数
            first: '首页',
            prev: '上一页',
            next: '下一页',
            last: '尾页',

            onPageClick: function (event, page) {
            //   $('#page-content').text('Page ' + page);
            changePage (page);
            }
          });
    }
});

// 实现分页功能
function changePage (page) {
	$.ajax({
		type: 'get',
		url: '/comments',
		data: {
			page: page
		},
		success: function (response) {
			console.log(response)
			var html = template('commentsTpl', response);
			$('#commentsBox').html(html);
			// var pageHTML = template('pageTpl', response);
			// $('#pageBox').html(pageHTML)
		}
	})
}
// 当审核按钮被点击的时候
$('#commentsBox').on('click', '.status', function () {
	// 获取当前评论的状态
	var status = $(this).attr('data-status');
	// 获取当前要修改的评论id
	var id = $(this).attr('data-id');
	// 向服务器端发送请求 更改评论状态
	$.ajax({
		type: 'put',
		url: '/comments/' + id,
		data: {
			state: status == 0 ? 1 : 0
		},
		success: function () {
			location.reload();
		}
	})
});

// 当删除按钮被点击时
$('#commentsBox').on('click', '.delete', function () {
	if (confirm('您真的要执行删除操作吗')) {
		// 获取管理员要删除的评论的id
		var id = $(this).attr('data-id');
		// 向服务器端发送请求 执行删除操作
		$.ajax({
			type: 'delete',
			url: '/comments/' + id,
			success: function () {
				location.reload();
			}
		})
	}
});
