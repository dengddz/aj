function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

// <option value="1">东城区</option>
//     <li>
//        <div class="checkbox">
//             <label>
//                  <input type="checkbox" name="facility" value="1">无线网络
//             </label>
//        </div>
//    </li>
$.ajax({
    url: '/home/area_facility/',
    type: 'POST',
    dataType: 'json',
    success: function(data){
        //alert('yes');
        for(a in data.areas){
            var option = $('<option>').attr('value', data.areas[a].id).text(data.areas[a].name);
            // console.log(option);
            $('#area-id').append(option);
        };
        for (f in data.facilitys){
//            var li = $('<li>');
//            var div = $('<div>').attr('class', 'checkbox');
//            var label = $('<label>');
//            var input = $('<input>').attr({'type': 'checkbox', 'name': 'facility', 'value': data.facilitys[f].id}).text(data.facilitys[f].name);
//            // console.log(data.facilitys[f].name, input);
            $('#clearfix').append('<li>'+ '<div class="checkbox">' + '<label>' + '<input type="checkbox" name="facility" value="' + data.facilitys[f].id + '">' + data.facilitys[f].name + '</label>' + '</div>' + '</li>');
        }
    },
    error: function(data){
        alert('no');
    }
})


$(document).ready(function(){
    // $('.popup_con').fadeIn('fast');
    // $('.popup_con').fadeOut('fast');
    $('#form-house-info').submit(function(e){
        e.preventDefault();
//        var house_title = $('#house-title').val();
//        var house_price = $('#house-price').val();
//        var area_id = $('#area-id').val();
//        var address = $('#address').val();
//
//        var room_count = $('#room_count').val();
//        var unit = $('#unit').val();
//        var capacity = $('#capacity').val();
//        var beds = $('#beds').val();
//        var deposit = $('#deposit').val();
//        var min_days = $('#min_days').val();
//        var max_days = $('#max_days').val();
//
//        var facility = $('#facility').val();

        //  $(this).ajaxSubmit 直接获取整个 表单数据
        $(this).ajaxSubmit({
            url: '/my/newhouse/',
            type: 'POST',
            dataType: 'json',
            success: function(data){
                //alert('yes');
                if (data.code == '0'){
                    alert('0');
                    location.href= '/user/login/';
                }
                $('#house-id').val(data.house_id);
                $('#form-house-info').attr('style', 'display:none');
                $('#form-house-image').attr('style', 'display:block');

            },
            error: function(data){
                alert('no');
            }
        })
    });


    $('#form-house-image').submit(function(e){
        e.preventDefault();

        $(this).ajaxSubmit({
            url: '/my/newhouse_icon/',
            type: 'POST',
            dataType: 'json',
            success: function(data){
                //alert('yes info');
                if (data.code == 200){
                    //alert('200')
                    for (i in data.imgs){
                        // console.log(i);
                        $('#form-house-image').prepend('<img src="' + '/static/media/' + data.imgs[i] +'">');
                    }
                }
            },
            error: function(data){
                alert('no');
            }
        })
    });
})