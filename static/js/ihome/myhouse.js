$(document).ready(function(){
    $(".auth-warn").show();
})

$.ajax({
    url: '/my/if_real/',
    type: 'POST',
    dataType: 'json',
    success: function(data){
        //alert('yes1');
        if (data.code == '0'){
                    alert('0');
                    location.href= '/user/login/';
                }
        if (data.code == '200'){
            if (data.user_id_card){
                $('.auth-warn').attr('style', 'display:none');
                $.ajax({
                    url: '/my/my_list/',
                    type: 'POST',
                    dataType: 'json',
//              <li>
//                    <a href="/detail.html">
//                        <div class="house-title">
//                            <h3>房屋ID:1 —— 房屋标题1</h3>
//                        </div>
//                        <div class="house-content">
//                            <img src="/static/images/home01.jpg">
//                            <div class="house-text">
//                                <ul>
//                                    <li>位于：西城区</li>
//                                    <li>价格：￥200/晚</li>
//                                    <li>发布时间：2016-11-11 20:00:00</li>
//                                </ul>
//                            </div>
//                        </div>
//                    </a>
//                </li>
                    success: function(data){
                       // alert('yes1');
                        for(info in data.detail_info){
                            console.log(info, data.detail_info[info].id)
                            str = '<li><a href="/home/detail?house_id='+ data.detail_info[info].id + '"><div class="house-title"><h3>房屋ID:';
                            str += data.detail_info[info].id;
                            str += ' —— ';
                            str += data.detail_info[info].title;
                            str += '</h3></div><div class="house-content"><img alt="" src="/static/media/';
                            str += data.detail_info[info].image;
                            str += '"><div class="house-text"><ul><li>位于：';
                            str += data.detail_info[info].area;
                            str += '</li><li>价格：￥';
                            str += data.detail_info[info].price;
                            str += '/晚</li><li>发布时间：';
                            str += data.detail_info[info].create_time;
                            str += '</li></ul></div></div></a></li>';
                            $('#houses-list').append(str);
                        }

                    },
                    error: function(data){
                        alert('no')
                    }
                })
            }else{
                $('#houses-list').attr('style', 'display:none');
            }
        }
    },
    error: function(data){
        alert('no');
    }
})


