from flask import Flask, request, jsonify
from flask_cors import CORS
import zeep
import random

app = Flask(__name__)
CORS(app)

WSDL_URL = 'http://localhost:8000/auth?wsdl'

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    try:
        client = zeep.Client(wsdl=WSDL_URL)
        result = client.service.login(username, password)
        return jsonify({'success': True, 'data': zeep.helpers.serialize_object(result)})
    except Exception as e:
        return jsonify({'error': 'Auth failed', 'detail': str(e)}), 401

@app.route('/api/book', methods=['POST'])
def book():
    payload = request.json or {}
    print('Stub /api/book got:', payload)
    return jsonify({'success': True, 'bookingId': f'stub-{random.randrange(1_000_000)}'})

@app.route('/api/checkConflict', methods=['POST'])
def check_conflict():
    payload = request.json or {}
    print('Stub /api/checkConflict got:', payload)
    return jsonify({'conflict': False})

@app.route('/api/status', methods=['GET'])
def status():
    rooms = ['karaoke', 'sauna', 'band', 'meeting', 'pingpong']
    data = [{'room': r, 'occupied': random.choice([True, False])} for r in rooms]
    print('Stub /api/status →', data)
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=3000, debug=True)
