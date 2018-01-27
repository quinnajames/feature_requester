import pytest
from feature_requester import create_app
from flask_bower import Bower

@pytest.fixture
def app():
    app = create_app('Config.TestingConfig')
    return app
