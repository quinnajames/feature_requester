import pytest
from feature_requester import create_app, db as database

@pytest.fixture(scope='session')
def app():
    app = create_app('config.TestingConfig')
    return app

@pytest.fixture(scope='session')
def db(app, request):
    database.app = app
    database.create_all()

    def teardown():
        database.drop_all()

    request.addfinalizer(teardown)
    return database

@pytest.fixture(scope='function')
def session(db, request):

    session = db.create_scoped_session()
    db.session = session

    def teardown():
        session.remove()

    request.addfinalizer(teardown)
    return session
