from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bower import Bower
import os, sqlite3


db = SQLAlchemy()
bower = Bower()

def create_app(config=None):
    app = Flask(__name__)

    if config is not None:
        app.config.from_object(config)

    db.init_app(app)
    app.engine = db.create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    Bower(app)

    from .features_bp.views import features_bp
    app.register_blueprint(features_bp, url_prefix='')


    @app.cli.command('initdb')
    def initdb_command():
        """Initializes the database."""
        db.create_all()
        print('Initialized the database.')

    @app.cli.command('secretkey')
    def secretkey_command():
        """Print the secret key."""
        print(app.config['SECRET_KEY'])

    return app

app = create_app('config.DevelopmentConfig')
