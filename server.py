#!/usr/bin/env python3
from pprint import pprint
from http.server import HTTPServer, BaseHTTPRequestHandler
from http import HTTPStatus
from urllib.parse import urlparse
from urllib.parse import parse_qs
import requests
import json
import time

convert_service_url = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=XRP&tsyms=EUR'


class _RequestHandler(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(HTTPStatus.OK.value)
        self.send_header('Content-type', 'application/json')
        # Allow requests from any origin, so CORS policies don't
        # prevent local development.
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        self._set_headers()
        if (self.path.startswith('/convert')):
            try:
                parsed_path = urlparse(self.path)
                queryObj = parse_qs(parsed_path.query)
                fruitUnitPriceEUR = int(queryObj['fruitUnitPriceEUR'][0])
                fruitQuantity = int(queryObj['fruitQuantity'][0])
                r = requests.get(convert_service_url)
                xrpEur = r.json()['RAW']['XRP']['EUR']['PRICE']
                respObj = {
                    'fruitUnitPriceXPR': round(fruitUnitPriceEUR * xrpEur, 2),
                    'totalPrice': round(fruitUnitPriceEUR * xrpEur * fruitQuantity, 2)
                }
                self.wfile.write(json.dumps(respObj).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.wfile.write(json.dumps({ 'error': str(e.args[0]) }).encode('utf-8'))
        else:
            self.send_error(404, 'Not found')


def run_server():
    server_address = ('', 8001)
    httpd = HTTPServer(server_address, _RequestHandler)
    print('serving at %s:%d' % server_address)
    httpd.serve_forever()


if __name__ == '__main__':
    run_server()
