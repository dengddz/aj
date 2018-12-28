from datetime import datetime

from flask import Blueprint, redirect, render_template, url_for, request, jsonify

from app.models import House, Area, Facility
from utils.functions import search_sort

blue_home = Blueprint('home', __name__)


@blue_home.route('/index/', methods=['GET'])
def index():

    return render_template('index.html')


@blue_home.route('/search/', methods=['GET'])
def search():
    return render_template('search.html')


@blue_home.route('/my_search/', methods=['POST'])
def search_s():
    # {'aid': url_data.aid, 'aname': url_data.aname, 'sd': url_data.sd, 'ed': url_data.ed},
    aid = request.form.get('aid')
    aname = request.form.get('aname')
    if not aid and aname and aname != '位置区域':
        aid = Area.query.filter(Area.name == aname).first().id
    sd = request.form.get('sd')
    ed = request.form.get('ed')

    sort = request.form.get('sort')

    if sd:
        sd = datetime.strptime(sd, '%Y-%m-%d')  # datetime， striptime, strftime
    if ed:
        ed = datetime.strptime(ed, '%Y-%m-%d')
        days = (ed - sd).days + 1
    # 获取
    if aid:
        houses = House.query.filter(House.area_id == aid)
        if sd:
            houses = houses.filter(House.create_time >= sd)
            if ed:
                houses = houses.filter(House.min_days <= days).filter(House.max_days >= days)
        search_sort(sort, houses)
        return jsonify({'code': 200, 'msg': '请求成功', 'houses': [h.to_full_dict() for h in houses]})
    if sd:
        houses = House.query.filter(House.create_time >= sd)
        if ed:
            houses = houses.filter(House.min_days <= days).filter(House.max_days >= days)
        search_sort(sort, houses)
        return jsonify({'code': 200, 'msg': '请求成功', 'houses': [h.to_full_dict() for h in houses]})

    houses = House.query.filter()
    search_sort(sort, houses)
    return jsonify({'code': 200, 'msg': '请求成功', 'houses': [h.to_full_dict() for h in houses]})


@blue_home.route('/detail', methods=['GET'])
def detail():

    return render_template('detail.html')


@blue_home.route('/detail/<int:id>/', methods=['GET'])
def detail_id(id):
    house = House.query.get(id)
    house_new = house.to_full_dict()
    avatar = house.user.avatar
    return jsonify({'code': 200, 'msg': '请求成功', 'house': house_new, 'avatar': avatar})


@blue_home.route('/area_facility/', methods=['POST'])
def area_facility():
    facilitys = Facility.query.all()
    areas = Area.query.all()
    #  推导式
    facilitys_new = [i.to_dict() for i in facilitys]
    areas_new = [i.to_dict() for i in areas]

    return jsonify({'code': 200, 'msg': '请求成功', 'facilitys': facilitys_new, 'areas': areas_new})