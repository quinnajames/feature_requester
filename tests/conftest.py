import pytest
from feature_requester import create_app

@pytest.fixture
def app():
    app = create_app('config.TestingConfig')
    return app
