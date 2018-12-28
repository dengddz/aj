function logout() {
    $.get("/api/logout", function(data){
        if (0 == data.errno) {
            location.href = "/";
        }
    })
}

$.ajax({
        url: '/my/my_info/',
        type: 'POST',
        dataType: 'json',
        success: function(data){
            pwd = '/static/media/' + data.user_avatar;
            if (data.code == '0'){
                    alert('0');
                    location.href= '/user/login/';
                }
            if (data.code == '200'){
                $('#user-name').text(data.user_name);
                $('#user-mobile').text(data.user_phone);
                $('#user-avatar').attr("src", pwd);
            }
        },
        error: function(data){
            alert('no')
        }
    })

$(document).ready(function(){


})