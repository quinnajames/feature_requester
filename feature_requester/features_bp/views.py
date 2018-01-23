import os
import sqlite3
from datetime import date
from flask import Blueprint, Flask, request, session, g, redirect, url_for, abort, \
    render_template, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bower import Bower

from feature_requester.features_bp.models import Feature
from feature_requester import db

features_bp = Blueprint('features_bp', __name__)




# Routes
@features_bp.route('/')
def show_features():
    print('show_features function called from views.py')
    features = Feature.query.order_by(-Feature.id).all()
    for row in features:
        row.target_date = str(row.target_date.month) + '/' + str(row.target_date.day) + '/' + str(row.target_date.year)
    print('features:')
    print(features)
    return render_template('show_features.html', features=features)

@features_bp.route('/features')
def features_query():
    print('features_query function called from views.py')
    features = [Feature.as_dict(x) for x in Feature.query.order_by(-Feature.id).all()]
    return jsonify(features=features)


@features_bp.route('/add', methods=['POST'])
def add_feature():
    print('add_feature function called from views.py')
    json = request.get_json();
    date_array = [int(x) for x in json['target_date'].split('/')];
    python_date = date(date_array[2], date_array[0], date_array[1]);
    json_input = Feature(json['title'], json['description'], json['client'],
            json['priority'], json['client_priority'], python_date, json['product_area'])
    db.session.add(json_input)
    db.session.commit()
    feature_id = Feature.query.order_by(-Feature.id).first().id
    return jsonify({"title": json['title'],
                    "description": json['description'],
                    "client": json['client'],
                    "priority": json['priority'],
                    "client_priority": json['client_priority'],
                    "target_date": json['target_date'],
                    "product_area": json['product_area'],
                    "id": feature_id})

@features_bp.before_request
def before_request():
    print(url_for('features_bp.features_query'))
