//模态框居中的控制
function centerModals(){
    $('.modal').each(function(i){   //遍历每一个模态框
        var $clone = $(this).clone().css('display', 'block').appendTo('body');    
        var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
        top = top > 0 ? top : 0;
        $clone.remove();
        $(this).find('.modal-content').css("margin-top", top-30);  //修正原先已经有的30个像素
    });
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}


$.ajax({
    url: '/order/order/my_lorders/',
    type: 'POST',
    dataType: 'json',
    success: function(data){
       // alert('yes');
        if (data.code == '200'){
          //  alert('200');
//                            <li>
//                    <div class="order-title">
//                        <h3>订单编号：123</h3>
//                        <div class="fr order-operate">
//                            <button type="button" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal">接单</button>
//                            <button type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button>
//                        </div>
//                    </div>
//                    <div class="order-content">
//                        <img src="">
//                        <div class="order-text">
//                            <h3>房屋标题</h3>
//                            <ul>
//                                <li>创建时间：2016-11-11</li>
//                                <li>入住日期：2016-11-11</li>
//                                <li>离开日期：2016-11-11</li>
//                                <li>合计金额：￥1000(共1晚)</li>
//                                <li>订单状态：
//                                    <span>待接单</span>
//                                </li>
//                                <li>客户评价： 挺好的</li>
//                            </ul>
//                        </div>
//                    </div>
//                </li>
         my_lorders = data.my_lorders;
         for (i in my_lorders){
                // console.log(my_orders[i].order_id, my_orders[i].amount, my_orders[i].begin_date)
                var s = '<li order-id="' + my_lorders[i].order_id + '"><div class="order-title"><h3>订单编号：'
                s += my_lorders[i].order_id
                s += '</h3><div class="fr order-operate"><button type="button" class="btn btn-success order-accept" data-toggle="modal" data-target="#accept-modal">接单</button>'
                s += '<button type="button" class="btn btn-danger order-reject" data-toggle="modal" data-target="#reject-modal">拒单</button></div></div><div class="order-content"><div class="order-text"><h3>订单</h3><ul><li>创建时间：'
                s += my_lorders[i].create_date
                s += '</li><li>入住日期：'
                s += my_lorders[i].begin_date
                s += '</li><li>离开日期：'
                s += my_lorders[i].end_date
                s += '</li><li>合计金额：'
                s += my_lorders[i].amount + '(共' + my_lorders[i].days + '晚)'
                s += '</li><li>订单状态：<span>'
                s += my_lorders[i].status
                s += '</span></li><li>客户评价： '
                s += my_lorders[i].comment
                s += '</li></ul></div></div></li>'

                $('.orders-list').append(s);
        }
       // order-accept  order-reject
    $(".order-accept").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-accept").attr("order-id", orderId);
        $('.modal-accept').click(function(){
            $.ajax({
                url: '/order/order/modal_accept',
                type: 'POST',
                data: {'orderId': orderId},
                dataType: 'json',
                success: function(data){
                    alert('yes');
                    if (data.code == '200'){
                        alert('200');
                        $('.order-accept').hide();
                        $('.order-reject').hide();
                    }
                },
                error: function(data){
                    alert('no');
                }
            })

        })
    });

     $(".order-reject").on("click", function(){
        var orderId = $(this).parents("li").attr("order-id");
        $(".modal-reject").attr("order-id", orderId);

         $('.modal-reject').click(function(){
            $.ajax({
                url: '/order/order/modal_reject',
                type: 'POST',
                data: {'orderId': orderId, 'reject_txt': $('#reject-reason').val()},
                dataType: 'json',
                success: function(data){
                    alert('yes');
                    if (data.code == '200'){
                        alert('200');
                        $('.order-accept').hide();
                        $('.order-reject').hide();
                    }
                },
                error: function(data){
                    alert('no');
                }
            })

        })
    });

     }
    },
    error: function(dadta){
        alert('no');
    }

})

$(document).ready(function(){
    $('.modal').on('show.bs.modal', centerModals);      //当模态框出现的时候
    $(window).on('resize', centerModals);



});