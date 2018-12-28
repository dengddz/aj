function hrefBack() {
    history.go(-1);
}

function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}



$(document).ready(function(){
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination',
        paginationType: 'fraction'
    })
    $(".book-house").show();

    url_for = location.search;
    url_id = url_for.split('=')[1];
    // console.log(url_id, url_for)
    $.ajax({
        url: '/home/detail/' + url_id,
        type: 'GET',
        dataType: 'json',
        success: function(data){
//            alert('yes');
            if (data.code == '200'){
//                alert('200');
//                <li class="swiper-slide"><img src="/static/images/home01.jpg"></li>
//{'id': 15, 'user_avatar': 'tx5.jpg', 'user_name': 'deng', 'title': '早上号123', 'price': 12,
//'address': '锦江区12', 'room_count': 1, 'acreage': 2, 'unit': '1', 'capacity': 1, 'beds': '1',
//'deposit': 1, 'min_days': 1, 'max_days': 12, 'order_count': 0, 'images': ['11.jpg', '12.jpg', '12.jpg'],
//'facilities': [{'id': 5, 'name': '允许吸烟', 'css': 'smoke-ico'}, {'id': 7, 'name': '牙具', 'css': 'brush-ico'}]}
                var house = data.house
                for(img in house['images']){
//                    console.log(house['images'][img])
                    $('.swiper-wrapper').append('<li class="swiper-slide"><img src="/static/media/'+ house['images'][img] + '"></li>')
                };
                $('.house-price span').text(house['price']);
                $('.house-title').text(house['titile']);
                // 屋主 头像 未加
                $('.landlord-pic img').attr('src', '/static/media/' + data.avatar);

                $('.landlord-name').text(house['user_name']);
                $('.text-center li').text(house['address']);
                $('.icon-text-1').append('<h3>出租' + house['room_count'] + '间</h3>');
                $('.icon-text-1').append('<p>房屋面积: ' + house['acreage'] + '平米</p>');
                $('.icon-text-1').append('<p>房屋户型: ' + house['unit'] + '</p>');

                $('.icon-text-2 h3').text('宜住' + house['capacity'] + '人');

                $('.icon-text-3 p').text(house['beds']);

                 $('.house-info-list').append('<li>收取押金<span>' + house['deposit'] + '</span></li>');
                 $('.house-info-list').append('<li>最少入住天数<span>' + house['min_days'] + '</span></li>');
                 if (house['max_days'] == 0){
                    $('.house-info-list').append('<li>最多入住天数<span>无限制</span></li>');
                 }else{
                    $('.house-info-list').append('<li>最多入住天数<span>' + house['max_days'] + '</span></li>');
                 }
//                 <li><span class="wirelessnetwork-ico"></span>无线网络</li>
                 for(f in house['facilities']){
//                 console.log(f, house['facilities'][f]['css'], house['facilities'][f]['name'])
                    $('.clearfix').append('<li><span class="' + house['facilities'][f]['css'] + '"></span>' + house['facilities'][f]['name'] + '</li>');
                 }
            }
        },
        error: function(data){
            alert('no');
        }
    })

    // 预定 点击事件
    $(".book-house").click(function(){
        alert('book');  // url_id
        var url = "/order/booking?house_id=" + url_id;
        location.href = url;
    })

})