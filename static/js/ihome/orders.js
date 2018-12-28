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
    url: '/order/order/my_order/',
    type: 'POST',
    dataType: 'json',
    success: function(data){
       // alert('yes');
        if (data.code == '200'){
           // alert('200');
            my_orders = data.my_orders;
//                <li id=''>
//                    <div class="order-title">
//                        <h3>订单编号：11111111111</h3>
//                        <div class="fr order-operate">
//                            <button type="button" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">发表评价</button>
//                        </div>
//
//                    </div>
//                    <div class="order-content">
//                        <img src="">
//                        <div class="order-text">
//                            <h3>订单</h3>
//                            <ul>
//                                <li>创建时间：</li>
//                                <li>入住日期：</li>
//                                <li>离开日期：</li>
//                                <li>合计金额：100元(共1晚)
//                                <li>订单状态：
//                                    <span>已拒单</span>
//                                </li>
//                                <li>我的评价：</li>
//                            </ul>
//                        </div>
//                    </div>
//                </li>
            for (i in my_orders){
                // console.log(my_orders[i].order_id, my_orders[i].amount, my_orders[i].begin_date)
                var s = '<li order-id="' + my_orders[i].order_id + '"><div class="order-title"><h3>订单编号：'
                s += my_orders[i].order_id
                s += '</h3><div class="fr order-operate"><button type="button" id="comment' + my_orders[i].order_id + '" class="btn btn-success order-comment" data-toggle="modal" data-target="#comment-modal">发表评价</button></div></div><div class="order-content"><div class="order-text"><h3>订单</h3><ul><li>创建时间：'
                s += my_orders[i].create_date
                s += '</li><li>入住日期：'
                s += my_orders[i].begin_date
                s += '</li><li>离开日期：'
                s += my_orders[i].end_date
                s += '</li><li>合计金额：'
                s += my_orders[i].amount + '(共' + my_orders[i].days + '晚)'
                s += '</li><li>订单状态：<span>'
                s += my_orders[i].status
                s += '</span></li><li>我的评价或者拒单理由：'
                s += my_orders[i].comment
                s += '</li></ul></div></div></li>'

                $('.orders-list').append(s);
            }

            $(".order-comment").on("click", function(){
                var orderId = $(this).parents("li").attr("order-id");
                $(".modal-comment").attr("order-id", orderId);

                $('.modal-comment').click(function(){
                    $.ajax({
                        url: '/order/order/my_comment/',
                        type: 'POST',
                        data: {'orderId': orderId, 'comment': $('#comment').val()},
                        dataType: 'json',
                        success: function(data){
                            alert('yes');
                            if (data.code == '200'){
                                alert('200');
                                $('#comment' + data.id).hide();
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