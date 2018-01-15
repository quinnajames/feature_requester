import os
import sqlite3
from datetime import date
from flask import Flask, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bower import Bower

# Create Flask app instance
app = Flask(__name__)
app.config.from_object(__name__)

# Tell SQLAlchemy how to find the local DB and initialize it
# This can be overriden later in production
file_path = os.path.abspath(os.getcwd())+"/feature.db"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///'+file_path

# Override config with instance config if present
app.config.from_pyfile('config.py')
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

db = SQLAlchemy(app)
engine = db.create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

# Create Bower
Bower(app)

# Database Models
class Feature(db.Model):
    __tablename__ = 'entries'
    id = db.Column(db.Integer, db.Sequence('user_id_seq'), primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    client = db.Column(db.String(30), nullable=False)
    client_priority = db.Column(db.Integer, nullable=False, unique=True)
    target_date = db.Column(db.DateTime, nullable=False)
    product_area = db.Column(db.String(30), nullable=False)

    def __init__(self, title, description, client, client_priority,
        target_date, product_area):
        self.title = title
        self.description = description
        self.client = client
        self.client_priority = client_priority
        self.target_date = target_date
        self.product_area = product_area
    def __repr__(self):
        return "<Feature(title='%s', description='%s', client='%s', client_priority='%d', \
                target_date='%s', product_area='%s')>" % (
                            self.title, self.description, self.client, self.client_priority,
                            self.target_date.isoformat(), self.product_area)
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

# CLI to initialize database locally
# Run this before running the app.

@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    db.create_all()
    print('Initialized the database.')

@app.cli.command('secretkey')
def secretkey_command():
    """Print the secret key."""
    print(app.config['SECRET_KEY'])

# Routes
@app.route('/')
def show_features():
    features = Feature.query.order_by(-Feature.id).all()
    for row in features:
        print(row.target_date)
        row.target_date = str(row.target_date.month) + '/' + str(row.target_date.day) + '/' + str(row.target_date.year)
    return render_template('show_features.html', features=features)

@app.route('/features')
def features():
    features = [Feature.as_dict(x) for x in Feature.query.order_by(-Feature.id).all()]
    return jsonify(features=features)


@app.route('/add', methods=['POST'])
def add_feature():
    json = request.get_json();
    date_array = [int(x) for x in json['target_date'].split('/')];
    python_date = date(date_array[2], date_array[0], date_array[1]);
    input = Feature(json['title'], json['description'], json['client'],
            json['client_priority'], python_date, json['product_area'])
    db.session.add(input)
    db.session.commit()
    id = Feature.query.order_by(-Feature.id).first().id
    return jsonify({"title": json['title'],
                    "description": json['description'],
                    "client": json['client'],
                    "client_priority": json['client_priority'],
                    "target_date": json['target_date'],
                    "product_area": json['product_area'],
                    "id": id})
