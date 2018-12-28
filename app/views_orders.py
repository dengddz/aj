from datetime import datetime

from flask import Blueprint, render_template, jsonify, session, request

from app.models import House, Order, User, db

blue_order = Blueprint('order', __name__)


@blue_order.route('/booking/', methods=['GET'])
def booking():
    return render_template('booking.html')


@blue_order.route('/order/my_order/', methods=['GET'])
def my_order():
    return render_template('orders.html')


@blue_order.route('/order/my_lorders/', methods=['GET'])
def my_lorders():
    return render_template('lorders.html')


@blue_order.route('/booking/<int:id>/', methods=['POST'])
def booking_id(id):
    house = House.query.get(id)

    return jsonify({'code': 200, 'msg': '请求成功', 'house': house.to_dict()})


# {'sd': sd, 'ed': ed, 'money': money, 'house_id': url_for.house_id},
@blue_order.route('/order/my/', methods=['POST'])
def order_my():
    sd = request.form.get('sd')
    if not sd:
        return jsonify({'code': 201, 'msg': '请求失败'})
    user_name = session['user_name']
    user_id = User.query.filter(User.name == user_name).first().id
    sd = datetime.strptime(sd, '%Y-%m-%d')
    ed = datetime.strptime(request.form.get('ed'), '%Y-%m-%d')
    days = (ed - sd).days + 1
    money = int(request.form.get('money').split('.')[0])
    house_price = int(request.form.get('house_price'))
    house_id = int(request.form.get('house_id'))

    order_my = Order()
    order_my.user_id = user_id
    order_my.house_id = house_id
    order_my.begin_date = sd
    order_my.end_date = ed
    order_my.days = days
    order_my.house_price = house_price
    order_my.amount = money
    db.session.add(order_my)
    db.session.commit()

    return jsonify({'code': 200, 'msg': '请求成功'})


@blue_order.route('/order/my_order/', methods=['POST'])
def my_order_p():
    user_id = User.query.filter(User.name == session['user_name']).first().id
    my_orders = Order.query.filter(Order.user_id == user_id)

    return jsonify({'code': 200, 'msg': '请求成功', 'my_orders': [o.to_dict() for o in my_orders]})


@blue_order.route('/order/my_lorders/', methods=['POST'])
def my_lorders_p():
    user = User.query.filter(User.name == session['user_name']).first()
    house_ids = []
    for h in user.houses:
        house_ids.append(h.id)
    my_lorders = []
    for id in house_ids:
        oders = Order.query.filter(Order.house_id == id).all()
        my_lorders += oders

    return jsonify({'code': 200, 'msg': '请求成功', 'my_lorders': [o.to_dict() for o in my_lorders]})


@blue_order.route('/order/modal_reject', methods=['POST'])
def modal_reject():
    orderId = request.form.get('orderId')
    reject_txt = request.form.get('reject_txt')
    order = Order.query.get(orderId)
    order.status = 'REJECTED'
    order.comment = reject_txt
    db.session.add(order)
    db.session.commit()
    return jsonify({'code': 200, 'msg': '请求成功'})


@blue_order.route('/order/modal_accept', methods=['POST'])
def modal_accept():
    orderId = request.form.get('orderId')
    order = Order.query.get(orderId)
    order.status = 'WAIT_PAYMENT'
    db.session.add(order)
    db.session.commit()
    return jsonify({'code': 200, 'msg': '请求成功'})


@blue_order.route('/order/my_comment/', methods=['POST'])
def my_comment():
    orderId = request.form.get('orderId')
    comment = request.form.get('comment')
    order = Order.query.get(orderId)
    order.status = 'REJECTED'
    order.comment = comment
    db.session.add(order)
    db.session.commit()
    return jsonify({'code': 200, 'msg': '请求成功', 'id': orderId})