from __future__ import annotations
import logging
import os
import platform
from abc import ABC, abstractmethod
from argparse import ArgumentParser

from logging import basicConfig
from optparse import OptionParser
from os import path
from os.path import expanduser
from pathlib import Path
from typing import Dict

import browser_cookie3
from requests import Session

basicConfig(level=logging.INFO)


class Script(ABC):
    def __init__(self, script_file):
        self.name = script_file['name']
        self.type = script_file['type']
        self.source = script_file['source']

    @property
    @abstractmethod
    def filename(self):
        raise NotImplementedError


class JsonScript(Script):
    @property
    def filename(self):
        return f'{self.name}.json'


class ServerJsScript(Script):

    @property
    def filename(self):
        return f'{self.name}.gs'


class HtmlScript(Script):

    @property
    def filename(self):
        return f'{self.name}.html'


class ScriptFactory:
    cls_factories: Dict[str, Script.__class__] = {'json': JsonScript, 'server_js': ServerJsScript, 'html': HtmlScript}

    @classmethod
    def from_file(cls, script_file) -> Script:
        return ScriptFactory.cls_factories[script_file['type']](script_file)


class GoogleAppScriptProjectDownloader(object):
    script_endpoint = 'https://script.google.com/feeds/download/export'

    def __init__(self, profile='Profile 1'):
        self.log = logging.getLogger(self.__class__.__name__).info
        chrome_path = {'macOs': '~/Library/Application Support/Google/Chrome',
                       'Linux': '~/.config/google-chrome'}
        self.cookies = browser_cookie3.chrome(domain_name='.google.com',
                                              cookie_file=expanduser(path.join(
                                                  chrome_path[platform.system()],
                                                  profile,
                                                  'Cookies')))

    def download_project(self, script_id, directory):
        directory_path = Path(directory).expanduser()
        directory_path.mkdir(parents=True, exist_ok=True)
        self.log(f'updating sources in {directory_path}...')
        with Session() as s:
            script_url = f'{GoogleAppScriptProjectDownloader.script_endpoint}?format=json&id={script_id}'
            self.log(f'downloading script from [{script_url}]...')
            scripts = s.get(script_url, cookies=self.cookies)
            assert scripts.status_code == 200, scripts.status_code
            for script_file in map(lambda file: ScriptFactory.from_file(file), scripts.json()['files']):
                self.log(f'updating file [{script_file.filename}] of type [{script_file.type}]...')
                with open(directory_path / script_file.filename, 'w') as _fp:
                    _fp.write(script_file.source)


def main(arguments_parser):
    arguments = arguments_parser.parse_args()
    GoogleAppScriptProjectDownloader('Profile 2').download_project(arguments.project_id, arguments.directory)


if __name__ == '__main__':
    basicConfig(level=logging.INFO)
    parser = ArgumentParser()
    parser.add_argument('project_id', help='id of project to download')
    parser.add_argument('directory', help='directory to updates sources', default=Path(os.getcwd()) / 'src')
    main(parser)
