import os
import re

from flask import Blueprint, redirect, render_template, url_for, request, session, jsonify

from app.models import User, Facility, Area, House, db, HouseImage
from utils.settings import MEDIA_PATH

blue_my = Blueprint('my', __name__)


@blue_my.route('/my/', methods=['GET'])
def my():
    return render_template('my.html')

# shift + F5 强制刷新
@blue_my.route('/my_info/', methods=['POST'])
def my_info():
    user = User.query.filter(User.name == session['user_name']).first()
    return jsonify({'code': 200, 'msg': '请求成功', 'user_name': user.name,
                    'user_phone': user.phone, 'user_avatar': user.avatar})


@blue_my.route('/if_real/', methods=['POST'])
def if_real():
    user = User.query.filter(User.name == session['user_name']).first()
    return jsonify({'code': 200, 'msg': '请求成功', 'user_id_card': user.id_card})


@blue_my.route('/profile/', methods=['GET'])
def profile():
    if request.method == 'GET':
        return render_template('profile.html')


@blue_my.route('/profile_name/', methods=['POST'])
def profile_name():
    if request.method == 'POST':
        name = request.form.get('name')
        user = User.query.filter(User.name == name).first()
        if user:
            return render_template('profile.html')
        user = User.query.filter(User.name == session['user_name']).first()
        user.name = name
        user.add_update()

        session['user_name'] = name
        return redirect(url_for('my.my'))


@blue_my.route('/profile_icon/', methods=['POST'])
def profile_icon():
    user = User.query.filter(User.name == session['user_name']).first()
    # 1, 修改图片
    icon = request.files.get('avatar')
    if icon:
    # 2，保存图片  path 为 绝对路径
        path = os.path.join(MEDIA_PATH, icon.filename)
        icon.save(path)
        # 3, 修改字段 icon 为 相对路径
        user.avatar = icon.filename
        user.add_update()

        return redirect(url_for('my.my'))
    return render_template('profile.html')


@blue_my.route('/newhouse_icon/', methods=['POST'])
def newhouse_icon():
    house_id = request.form.get('house_id')
    icon = request.files.get('house_image')
    if icon and house_id:
        # 2，保存图片  path 为 绝对路径
        path = os.path.join(MEDIA_PATH, icon.filename)
        icon.save(path)
        # 3, 修改字段 icon 为 相对路径

        house = House.query.get(house_id)
        if not house.index_image_url:
            house.index_image_url = icon.filename
            db.session.add(house)
            db.session.commit()
        house_image = HouseImage()
        house_image.house_id = house_id
        house_image.url = icon.filename
        db.session.add(house_image)
        db.session.commit()

        imgs = HouseImage.query.filter(HouseImage.house_id == house_id).all()
        imgs_list = []
        for i in imgs:
            imgs_list.append(i.url)

        return jsonify({'code': 200, 'msg': '请求成功', 'imgs': imgs_list})

    return jsonify({'code': 1001, 'msg': '请求失败'})


@blue_my.route('/auth/', methods=['GET', 'POST'])
def auth():
    if request.method == 'GET':
        return render_template('auth.html')
    if request.method == 'POST':
        real_name = request.form.get('real_name')
        id_card = request.form.get('id_card')

        r = r'^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$|^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$'

        if re.fullmatch(r, id_card):
            user = User.query.filter(User.name == session['user_name']).first()
            user.id_card = id_card
            user.id_name = real_name
            user.add_update()

            return redirect(url_for('my.my'))

        return render_template('auth.html')


@blue_my.route('/myhouse/', methods=['GET'])
def myhouse():
    return render_template('myhouse.html')


@blue_my.route('/newhouse/', methods=['GET', 'POST'])
def newhouse():
    if request.method == 'GET':
        return render_template('newhouse.html')
    if request.method == 'POST':
        house_title = request.form.get('title')
        house_price = request.form.get('price')
        area_id = request.form.get('area_id')
        address = request.form.get('address')

        room_count = request.form.get('room_count')
        unit = request.form.get('unit')
        acreage = request.form.get('acreage')
        capacity = request.form.get('capacity')
        beds = request.form.get('beds')
        deposit = request.form.get('deposit')
        min_days = request.form.get('min_days')
        max_days = request.form.get('max_days')

        facilitys = request.form.getlist('facility')

        # 应该验证下， 但算了...
        user = User.query.filter(User.name == session['user_name']).first()
        hose = House()

        # 房屋主人的用户编号
        hose.user_id = user.id
        # 归属地的区域编号
        hose.area_id = area_id
        hose.title = house_title  # 标题
        hose.price =  house_price  # 单价，单位：分
        hose.address = address  # 地址
        hose. room_count = room_count  # 房间数目
        hose.acreage = acreage   # 房屋面积
        hose.unit = unit  # 房屋单元， 如几室几厅
        hose.capacity = capacity  # 房屋容纳的人数
        hose.beds = beds  # 房屋床铺的配置
        hose.deposit = deposit  # 房屋押金
        hose.min_days = min_days  # 最少入住天数
        hose.max_days = max_days  # 最多入住天数，0表示不限制

        # hose.order_count = db.Column(db.Integer, default=0)  # 预订完成的该房屋的订单数
        # hose.index_image_url = db.Column(db.String(256), default="")  # 房屋主图片的路径

        # 房屋的设施
        for i in facilitys:
            f = Facility.query.get(int(i))
            hose.facilities.append(f)
        # hose.images = db.relationship("HouseImage")  # 房屋的图片
        # hose.orders = db.relationship('Order', backref='house')
        db.session.add(hose)
        db.session.commit()

        return jsonify({'code': 200, 'msg': '请求成功', 'house_id': hose.id})


@blue_my.route('/my_list/', methods=['POST'])
def my_list():
    user = User.query.filter(User.name == session['user_name']).first()
    houses = user.houses
    info = []
    for h in houses:
        info.append(h.to_dict())

    return jsonify({'code': 200, 'msg': '请求成功', 'detail_info': info})



@blue_my.route('/my_logout/', methods=['GET'])
def my_logout():
    session.clear()
    return redirect(url_for('home.index'))

