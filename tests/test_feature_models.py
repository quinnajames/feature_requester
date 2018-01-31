from feature_requester.features_bp import models
from datetime import date, datetime

def test_create_feature_instance(session):
    """Create and save feature."""

    title = 'Test Feature'
    description = 'This is a test feature.'
    client = 'Client C'
    priority = 1
    target_date = date(2018, 2, 1)
    product_area = 'Billing'

    feature = models.Feature(title, description,
    client, priority, target_date,
    product_area)
    session.add(feature)
    session.commit()

    assert feature.id is not None
    assert feature.title == 'Test Feature'
    assert isinstance(feature.as_dict(), dict)
    assert feature.as_dict()['target_date'] == datetime(2018, 2, 1, 0, 0)
    assert session.query(models.Feature).count() == 1
