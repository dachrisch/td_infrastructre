from __future__ import annotations

import logging
import os
import platform
from abc import ABC, abstractmethod
from argparse import ArgumentParser
from logging import basicConfig
from os import path
from os.path import expanduser
from pathlib import Path
from typing import Dict

import browser_cookie3
from bs4 import BeautifulSoup
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


class GoogleProjectNameRetriever(object):
    def __init__(self, cookies):
        self.cookies = cookies

    def for_script_id(self, script_id):
        with Session() as s:
            script = BeautifulSoup(s.get(f'https://script.google.com/d/{script_id}/edit', cookies=self.cookies).content,
                                   'html.parser')
            title_parts = script.title.text.split(' - ')
            assert len(title_parts) > 2, title_parts
            assert title_parts[1] == 'Project Editor', title_parts
            assert title_parts[2] == 'Apps Script', title_parts
            return title_parts[0]


class GoogleProjectFileDownloader(object):
    script_endpoint = 'https://script.google.com/feeds/download/export'

    def __init__(self, cookies):
        self.cookies = cookies
        self.log = logging.getLogger(self.__class__.__name__).info

    def for_script_id(self, script_id):
        with Session() as s:
            script_url = f'{self.script_endpoint}?format=json&id={script_id}'
            self.log(f'downloading script from [{script_url}]...')
            scripts = s.get(script_url, cookies=self.cookies)
            assert scripts.status_code == 200, scripts.status_code
            for script_file in map(lambda file: ScriptFactory.from_file(file), scripts.json()['files']):
                yield script_file


class GoogleAppScriptProjectDownloader(object):

    def __init__(self, profile='Profile 1'):
        self.log = logging.getLogger(self.__class__.__name__).info
        chrome_path = {'macOs': '~/Library/Application Support/Google/Chrome',
                       'Linux': '~/.config/google-chrome'}
        self.cookies = browser_cookie3.chrome(domain_name='.google.com',
                                              cookie_file=expanduser(path.join(
                                                  chrome_path[platform.system()],
                                                  profile,
                                                  'Cookies')))

        self.name_retriever = GoogleProjectNameRetriever(self.cookies)
        self.file_downloader = GoogleProjectFileDownloader(self.cookies)

    def download_project(self, script_id, directory):
        script_name = self.name_retriever.for_script_id(script_id)
        assert script_name == directory, f'expected [{directory}] but was [{script_name}] - have you renamed the project?'
        directory_path = Path(script_name).expanduser()
        directory_path.mkdir(parents=True, exist_ok=True)
        self.log(f'updating sources in {directory_path}...')

        for script_file in self.file_downloader.for_script_id(script_id):
            self.log(f'updating file [{script_file.filename}] of type [{script_file.type}]...')
            with open(directory_path / script_file.filename, 'w') as _fp:
                _fp.write(script_file.source)


def main(arguments_parser):
    arguments = arguments_parser.parse_args()
    GoogleAppScriptProjectDownloader('Profile 5').download_project(arguments.project_id, arguments.directory)


if __name__ == '__main__':
    basicConfig(level=logging.INFO)
    parser = ArgumentParser()
    parser.add_argument('project_id', help='id of project to download')
    parser.add_argument('directory', help='directory to updates sources', default=Path(os.getcwd()) / 'src')
    main(parser)
