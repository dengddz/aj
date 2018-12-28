function hrefBack() {
    history.go(-1);
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

function showErrorMsg() {
    $('.popup_con').fadeIn('fast', function() {
        setTimeout(function(){
            $('.popup_con').fadeOut('fast',function(){}); 
        },1000) 
    });
}

url_for = decodeQuery()
$.ajax({
    url: '/order/booking/' + url_for.house_id + '/',
    type: 'POST',
    dadaType: 'json',
    success: function(data){
        //alert('yes');
        if (data.code == '200'){
            //alert('200');

            $('.house-info img').attr('src', '/static/media/' + data.house['image']);
            $('.house-text h3').text(data.house['title']);
            $('.house-text span').text(data.house['price']);

        }
    },
    error: function(data){
        alert('no');
    }

})

$(document).ready(function(){
    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    $(".input-daterange").on("changeDate", function(){
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();

        if (startDate && endDate && startDate > endDate) {
            showErrorMsg();
        } else {
            var sd = new Date(startDate);
            var ed = new Date(endDate);
            days = (ed - sd)/(1000*3600*24) + 1;
            var price = $(".house-text>p>span").html();
            var amount = days * parseFloat(price);
            $(".order-amount>span").html(amount.toFixed(2) + "(共"+ days +"晚)");
        }
    });

    $('.submit-btn').click(function(){
        var sd = $('#start-date').val();
        var ed = $('#end-date').val();
        var money = $('.order-amount span').text();
        var house_price = $('.house-text span').text();

        $.ajax({
            url: '/order/order/my/',
            type: 'POST',
            data: {'sd': sd, 'ed': ed, 'money': money, 'house_id': url_for.house_id, 'house_price': house_price},
            dadaType: 'json',
            success: function(data){
                //alert('yes');
                if (data.code == '0'){
                    alert('0');
                    location.href= '/user/login/';
                }
                 if (data.code == '201'){
                    alert('201');
                    $('.popup_con').attr('style', 'display:block')

                }
                if (data.code == '200'){
                    alert('200');

                    $('.submit-btn').attr('style', 'display:none')

                }
            },
            error: function(data){
                alert('no');
            }
        })

    })
})
