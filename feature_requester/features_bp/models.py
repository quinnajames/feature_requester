
from datetime import date
import sqlite3
from feature_requester import db
from sqlalchemy import UniqueConstraint


__all__ = ['Feature']

    # Database Models
class Feature(db.Model):
    __tablename__ = 'entries'
    id = db.Column(db.Integer, db.Sequence('user_id_seq'), primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    client = db.Column(db.String(30), nullable=False)
    priority = db.Column(db.Integer, nullable=False)
    client_priority = db.Column(db.String(35), nullable=False)
    target_date = db.Column(db.DateTime, nullable=False)
    product_area = db.Column(db.String(30), nullable=False)
    __table_args__ = (UniqueConstraint('client', 'priority', name="_client_priority_uc"),)

    def __init__(self, title, description, client, priority, client_priority,
        target_date, product_area):
        self.title = title
        self.description = description
        self.client = client
        self.priority = priority
        self.client_priority = client_priority
        self.target_date = target_date
        self.product_area = product_area
    def __repr__(self):
        return "<Feature(title='%s', description='%s', client='%s', priority='%d', \
                client_priority='%s', target_date='%s', product_area='%s')>" % (
                            self.title, self.description, self.client, self.priority,
                            self.client_priority, self.target_date, self.product_area)
    def as_dict(self):
        print('as_dict function called from models.py')
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
