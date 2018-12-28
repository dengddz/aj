import os

# 基础路径
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# static 路径
STATIC_PATH = os.path.join(BASE_DIR, 'static')
# templates 路径
TEMPLATE_PATH = os.path.join(BASE_DIR, 'templates')
# media 路径
MEDIA_PATH = os.path.join(STATIC_PATH, 'media')

# 数据库 配置
DATABASE = {
    # 'mysql+pymysql://root:123456@127.0.0.1:3306/flask7'
    'NAME': 'aj',
    'PORT': 3306,
    'HOST': '127.0.0.1',
    'USER': 'root',
    'ENGINE': 'mysql',
    'DRIVER': 'pymysql',
    'PASSWORD': '123456'
}