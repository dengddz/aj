var cur_page = 1; // 当前页
var next_page = 1; // 下一页
var total_page = 1;  // 总页数
var house_data_querying = true;   // 是否正在向后台获取数据

// 解析url中的查询字符串
function decodeQuery(){
    var search = decodeURI(document.location.search);
    return search.replace(/(^\?)/, '').split('&').reduce(function(result, item){
        values = item.split('=');
        result[values[0]] = values[1];
        return result;
    }, {});
}

// 更新用户点选的筛选条件
function updateFilterDateDisplay() {
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var $filterDateTitle = $(".filter-title-bar>.filter-title").eq(0).children("span").eq(0);
    if (startDate) {
        var text = startDate.substr(5) + "/" + endDate.substr(5);
        $filterDateTitle.html(text);
    } else {
        $filterDateTitle.html("入住日期");
    }



}


// 更新房源列表信息
// action表示从后端请求的数据在前端的展示方式
// 默认采用追加方式
// action=renew 代表页面数据清空从新展示
function updateHouseData(action) {
    var areaId = $(".filter-area>li.active").attr("area-id");
    if (undefined == areaId) areaId = "";
    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();
    var sortKey = $(".filter-sort>li.active").attr("sort-key");
    var params = {
        aid:areaId,
        sd:startDate,
        ed:endDate,
        sk:sortKey,
        p:next_page
    };
    //发起ajax请求，获取数据，并显示在模板中
}

function append_house(house){
//            <li class="house-item">
//                <a href="/detail.html?id=1"><img src="/static/images/home01.jpg"></a>
//                <div class="house-desc">
//                    <div class="landlord-pic"><img src="/static/images/landlord01.jpg"></div>
//                    <div class="house-price">￥<span>200</span>/晚</div>
//                    <div class="house-intro">
//                        <span class="house-title">房屋标题1</span>
//                        <em>出租6间 - 1次入住 - 中关村软件园</em>
//                    </div>
//                </div>
//            </li>
     $('.house-list').html('');;
     for (h in house){
                // console.log(h, house[h].images[0], house[h].price, house[h].user_avatar)
                s = '<li class="house-item"><a href="/home/detail?house_id='+ house[h].id + '"><img src="/static/media/'
                s += house[h].images[0]
                s += '"></a><div class="house-desc"><div class="landlord-pic"><img src="/static/media/'
                s += house[h].user_avatar
                s += '"></div><div class="house-price">￥<span>'
                s += house[h].price
                s += '</span>/晚</div><div class="house-intro"><span class="house-title">'
                s += house[h].title
                s += '</span>em>出租'
                s += house[h].room_count
                s += '间 - '
                s += house[h].order_count
                s += '次入住 - '
                s += house[h].address
                s += '</em></div></div></li>'
                $('.house-list').append(s);
            }
}

//url_for = location.search;
url_data = decodeQuery();
console.log(url_data);
// 从 index 页面 search 过来
$.ajax({
    url: '/home/my_search/',
    type: 'POST',
    data: {'aid': url_data.aid, 'aname': url_data.aname, 'sd': url_data.sd, 'ed': url_data.ed, 'sort': ''},
    dataType: 'json',
    success: function(data){
        //alert('yes');
        if (data.code == '200'){
            //alert('200');
            var house = data.houses;
           append_house(house);
        }
    },
    error: function(data){
        alert('no');
    }
})

$.ajax({
    url: '/home/area_facility/',
    type: 'POST',
    dataType: 'json',
    success: function(data){
        //alert('yes');
        for(a in data.areas){
//            <li area-id="2">西城区</li>
            $('.filter-area').append('<li area-id="' + data.areas[a].id + '">' + data.areas[a].name + '</li>');
        };

        $(".filter-item-bar>.filter-area").on("click", "li", function(e) {
            if (!$(this).hasClass("active")) {
                $(this).addClass("active");
                $(this).siblings("li").removeClass("active");
                $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html($(this).html());
            } else {
                $(this).removeClass("active");
                $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html("位置区域");
            }
        });

    }
})

$(document).ready(function(){
    var queryData = decodeQuery();
    var startDate = queryData["sd"];
    var endDate = queryData["ed"];
    $("#start-date").val(startDate);
    $("#end-date").val(endDate);
    updateFilterDateDisplay();
    var areaName = queryData["aname"];
    if (!areaName) areaName = "位置区域";
    $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html(areaName);

    $(".input-daterange").datepicker({
        format: "yyyy-mm-dd",
        startDate: "today",
        language: "zh-CN",
        autoclose: true
    });
    var $filterItem = $(".filter-item-bar>.filter-item");
    $(".filter-title-bar").on("click", ".filter-title", function(e){
        var index = $(this).index();
        if (!$filterItem.eq(index).hasClass("active")) {
            $(this).children("span").children("i").removeClass("fa-angle-down").addClass("fa-angle-up");
            $(this).siblings(".filter-title").children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).addClass("active").siblings(".filter-item").removeClass("active");
            $(".display-mask").show();

        } else {
            $(this).children("span").children("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            $filterItem.eq(index).removeClass('active');
            $(".display-mask").hide();
            updateFilterDateDisplay();
        }


    });
    $(".display-mask").on("click", function(e) {
        $(this).hide();
        $filterItem.removeClass('active');
        updateFilterDateDisplay();
        cur_page = 1;
        next_page = 1;
        total_page = 1;
        updateHouseData("renew");
        //  search 页面 加载  2018-12-26 2018-12-28 双流县 价格 低-高
        var sd1 = $('#start-date').val();
        var ed1 = $('#end-date').val();
        var area1 = $(".filter-title-bar>.filter-title").eq(1).children("span").eq(0).html();
        var sort = $('#sort').text();
        console.log(sd1, ed1, area1, sort);
        $.ajax({
            url: '/home/my_search/',
            type: 'POST',
            data: {'aid': '', 'aname': area1, 'sd': sd1, 'ed': ed1, 'sort': sort},
            dataType: 'json',
            success: function(data){
                alert('yes');
                if (data.code == '200'){
                    alert('200');
                    var house = data.houses;
                    append_house(house);
                }
            },
            error: function(data){
                alert('no');
            }
        })

    });

    $(".filter-item-bar>.filter-sort").on("click", "li", function(e) {
        if (!$(this).hasClass("active")) {
            $(this).addClass("active");
            $(this).siblings("li").removeClass("active");
            $(".filter-title-bar>.filter-title").eq(2).children("span").eq(0).html($(this).html());
        }

    })
})