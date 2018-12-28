from io import BytesIO

from flask import Blueprint, render_template, request, jsonify, make_response, session

from app.captcha import Captcha
from app.models import User

blue_user = Blueprint('user', __name__)


@blue_user.route('/register/', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('register.html')
    if request.method == 'POST':
        mobile = request.form.get('mobile')
        imagecode = request.form.get('imagecode')

        passwd = request.form.get('passwd')
        passwd2 = request.form.get('passwd2')
        if passwd == passwd2 and imagecode == session['captcha_text']:
            user = User()
            user.password = passwd
            user.phone = mobile
            user.name = mobile[-4:]
            user.add_update()
            return jsonify({'code': 200, 'msg': '请求成功'})

        return render_template('register.html')


@blue_user.route('/login/', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    if request.method == 'POST':
        mobile = request.form.get('mobile')
        passwd = request.form.get('passwd')
        user = User.query.filter(User.phone == mobile).first()
        if not user:
            return jsonify({'code':1001, 'msg': '请求失败，此号未注册'})
        if not user.check_pwd(passwd):
            return jsonify({'code': 1002, 'msg': '请求失败，密码错误'})

        session['user_name'] = user.name
        session['user_phone'] = mobile
        session['user_pwd_hash'] = user.pwd_hash
        return jsonify({'code': 200, 'msg': '请求成功'})


@blue_user.route('/captcha/')
def graph_captcha():
   text, image = Captcha.gen_graph_captcha()
   out = BytesIO()
   image.save(out, 'png')
   out.seek(0)
   resp = make_response(out.read())
   resp.content_type = 'image/png'

   session['captcha_text'] = text

   return resp
