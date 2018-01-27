import os

    # Tell SQLAlchemy how to find the local DB and initialize it
file_path = os.path.abspath(os.getcwd())+"/feature.db"
dev_uri = 'sqlite:///'+file_path

class Config(object):
    DEBUG = False
    TESTING = False
    SECRET_KEY = 'dev'
    SQLALCHEMY_DATABASE_URI = dev_uri

class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'mysql://user@localhost/foo'
    SECRET_KEY = 'foo'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite://'
