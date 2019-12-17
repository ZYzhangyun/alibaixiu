// 热门推荐数据获取，首页和文章详情页都有
$.ajax({
    type: "get",
    url: "/posts/recommend",

    success: function (response) {
        console.log(response);

        var recommendTpl = `
        {{each data}}
        <li>
          <a href="detail.html?id={{$value._id}}">
            <img src="{{$value.thumbnail}}" alt="">
            <span>{{$value.title}}</span>
          </a>
        </li>
        {{/each}}
    `;
        var html = template.render(recommendTpl, { data: response })
        $('#recommendBox').html(html);
    }

});