from flask import Flask, session, request, jsonify, redirect, url_for

from app.models import db
from app.views_home import blue_home
from app.views_orders import blue_order
from app.views_user import blue_user
from utils.config import Conf
from utils.settings import TEMPLATE_PATH, STATIC_PATH

from app.views_my import blue_my

import re

def create_app():
    # 建立 一个Flask 对象， 并改变 static和templates 目录地址
    app = Flask(__name__, static_folder=STATIC_PATH, template_folder=TEMPLATE_PATH)
    # 绑定app和蓝图的关联关系，注册蓝图
    app.register_blueprint(blueprint=blue_my, url_prefix='/my')
    app.register_blueprint(blueprint=blue_user, url_prefix='/user')
    app.register_blueprint(blueprint=blue_home, url_prefix='/home')
    app.register_blueprint(blueprint=blue_order, url_prefix='/order')

    # 通过flask 自带的 config.from_object() 函数配置 app
    app.config.from_object(Conf)
    # 初始化 db 和 app 对象
    db.init_app(app)

    @app.before_request
    def before_req():
        user_name = session.get('user_name')

        if user_name:
            return None

        if re.match('/my/my/', request.path):
            return redirect(url_for('user.login'))

        need_check = ['/my/', '/order/order/']
        for check in need_check:
            if re.match(check, request.path):
                return jsonify({'code': 0, 'msg': '请求失败，未登录'})

    return app