
# app 的配置
from utils.functions import get_sqlalchemy_uri
from utils.settings import DATABASE


class Conf():
    # 数据库 uri
    SQLALCHEMY_DATABASE_URI = get_sqlalchemy_uri(DATABASE)
    # 忽略 一个 warning 问题
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # 钩子函数 @blue.teardown_request，能正常运行
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    # RuntimeError: The session is unavailable because no secret key was set.
    # Set the secret_key on the application to something unique and secret.
    SECRET_KEY = 'dkjfhai23j445'
