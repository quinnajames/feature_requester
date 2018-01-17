import os
from setuptools import setup

# Utility function to read the README file
def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

setup(
    name = "feature_requester",
    version = "0.0.0",
    author = "Quinn James",
    author_email = "quinn@quinnjames.net",
    description = ("A program that allows a business client to create "
                                   "project feature requests."),
    license = "MIT",
    url = "http://www.quinnjames.net",
    packages=['feature_requester', 'tests'],
    install_requires=[
        'flask', 'flask_sqlalchemy', 'flask_bower', 'jasmine'
    ],
    setup_requires=[
        'pytest_runner',
    ],
    tests_require=[
        'pytest'
    ],
    long_description=read('README'),
    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Topic :: Office/Business",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.6"
    ],
)
