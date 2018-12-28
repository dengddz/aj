

def get_sqlalchemy_uri(DATABASE):
    # 'mysql+pymysql://root:123456@127.0.0.1:3306/flask7'
    user = DATABASE['USER']
    password = DATABASE['PASSWORD']
    host = DATABASE['HOST']
    port = DATABASE['PORT']
    engine = DATABASE['ENGINE']
    driver = DATABASE['DRIVER']
    name = DATABASE['NAME']

    return '%s+%s://%s:%s@%s:%s/%s' % (engine, driver, user, password, host, port, name)



def search_sort(sort, houses):
    if sort == '入住最多':
        houses = houses.order_by('order_count')
    if sort == '价格 低-高':
        houses= houses.order_by('-price')
    if sort == '价格 高-低':
        houses = houses.order_by('price')
    return houses


