### 关于用户登陆界面及用户客户端页面的展示

#### 实现步骤：

##### 2019/12/12 

######     1.验证用户登陆界面

​    如果邮箱和密码的字符长度为0，则提示不能登陆，否则ajax向服务端请求登陆，并进入登陆界面。

`$('#loginbtn').on('click', function () {`

​    `// 获取用户输入的邮箱地址`

​    `var email = $('#email').val();`

​    `// 获取用户输入的密码`

​    `var password = $('#password').val();`

​    `// 判断用户是否输入了邮箱地址`

​    `if (email.trim().length == 0) {`

​      `alert('请输入邮箱')`

​      `return;`

​    `}`

​    `// 判断用户是否输入了密码`

​    `if (password.trim().length == 0) {`

​      `alert('请输入密码');`

​      `return;`

​    `}`

`//渲染数据`

​    `$.ajax({`

​      `type: 'post',`

​      `url: '/login',`

​      `data: {`

​        `email: email,`

​        `password: password`

​      `},`

​      `success: function (response) {`

​        `// 登录成功 跳转到数据管理的首页面`

​        `location.href = 'index.html';`

​      `},`

​      `error: function () {`

​        `// 登录失败`

​        `alert('用户名或者密码错误')`

​      `}`

​    `})`

  `})`;

######     2.设定返回登陆界面

在用登陆的html页面，为了防止用户没有登陆就可以访问登陆管理界面，需要进行拦截设置，当用户没有输入账号密码成功的情况下，设定返回登陆界面。

`if (!isLogin){`

`location.herf = "login.html";`

`}`

######    3.设置用户退出功能

然后再设置用户退出功能，给退出按钮添加点击事件，当用户点击之后，询问是否确定退出，如果确定，再ajax请求，执行退出的功能。

`$('#loginout').on('click', function () {`

​    **`var isconfirm = confirm('你确定要退出吗')**`  // 它会返回true和false，true就是确定退出

​    `if (isconfirm) {`

​        `$.ajax({`

​            `type: 'post',`

​            `url: '/logout',`

​            `success: function () {`

​                `location.href = 'login.html'`

​            `},`

​            `error:function(){`

​                `alert('退出失败')`

​            `}`

​        `})`

​    `}`

`})`

###### 4. <增>登陆界面，创建新用户

创建formData表单对象

**注：使用表单提交要设置return false 阻止表单默认提交**

`$('#userForm').on('submit', function () {`

​    `var formdata = $(this).serialize();`//返回的是字符串，将表单中的数据拼接成键值对的字符串形式。

​    `$.ajax({`

​        `type: 'post',`

​        `url: '/users',`

​        `data: formdata,`

​        `success: function () {`

​            `location.reload(); //刷新页面 添加成功`

​            `alert('新用户创建成功')`

​        `},`

​        `error: function (err) {`

​            `var res = JSON.parse(err.responseText);`

​            `alert(res.message)`

​            `// console.log(err);`

​        `}`

​    `})`

​    **`return false //阻止表单默认提交`**

`})`

###### 5.文件（图片）选择控件设置

**modifyBox是包裹form表单的大盒子，它同时包括添加和修改的模板引擎表单**

`$('#modifyBox').on('change', '#avatar', function () { //转变成事件委托，为了在修改界面可以添加图片,这一步是在用户列表模板引擎渲染的，为了让修改界面也可以用，给它们共同的父级元素添加事件委托，这样修改和添加界面都可以用了。`

​    `var formData = new FormData();//创建表单对象`

​    `formData.append('avatar', this.files[0]);//向表单对象中追加属性值`

​    `$.ajax({`

​        `type: 'post',`

​        `url: '/upload',`

​        `data: formData,`

​        `// 告诉$.ajax方法不要解析请求参数`

​        `processData: false,`

​        `// 告诉$.ajax方法不要设置请求参数的类型`

​        `contentType: false,`

​        `success: function (response) {`

​            `// console.log(response);`

​            `$('#preview').attr('src', response[0].avatar);//preview是图片的id，设置图片地址属性`

​            `$('#hiddenAvatar').val(response[0].avatar);//把图片地址放到隐藏域中`

​        `}`

​    `})`

`})`

###### 6.向服务器端发送请求 索要用户列表数据

`$.ajax({`

​    `type: 'get',`

​    `url: '/users',`

​    `success: function (response) {`

​        `var html = template('userTpl', { data: response })`

​        `$('#userBox').html(html)`

​    `}`

`})`

###### 7.<改>编辑修改

通过事件委托的方式为编辑按钮添加点击事件，这一步可以事件点击编辑按钮出现修改界面，但不能进行提交

`$('#userBox').on('click', '.edit', function () { //因为编辑按钮不止一个，所以用事件委托`

​    `var id = $(this).attr('data-id');`

`//获取到编辑按钮上的自定义属性，自定义属性在模板引擎中就是当条信息的id值。`

​    `$.ajax({`

​        `type: 'get',`

​        `url: '/users/' + id,`

​        `success: function (response) {`

​            `var html = template('modifyTpl', response);`

​            `$('#modifyBox').html(html);//展示信息 modifyBox是包裹的大盒子`

​            `console.log(response);`

​        `}`

​    `})`

`})`

`//为修改表单添加表单提交事件`

`$('#modifyBox').on('submit', '#modifyForm', function () {`

​    `//获取用户在表单中输入的内容`

​    `var formData = $(this).serialize();`

​    `var id = $(this).attr('data-id');`

​    `$.ajax({`

​        `type: 'put',`

​        `url: '/users/' + id,`

​        `data: formData,`

​        `success: function (response) {`

​            `location.reload(); //刷新页面`

​        `}`

​    `})`

​    `return false;`

`})`