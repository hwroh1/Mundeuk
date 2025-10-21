#!/usr/bin/env python3
import os
import json
import http.server
import socketserver
import urllib.request
import urllib.parse
import urllib.error
from http.server import BaseHTTPRequestHandler
import cgi

class ProxyHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/analyze':
            self.handle_analyze()
        else:
            self.send_error(404)

    def handle_analyze(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            text = data.get('text', '')
            topic = data.get('topic', '')
            
            if not text or not topic:
                self.send_json_response(400, {'error': 'text and topic are required'})
                return

            api_key = os.environ.get('OPENAI_API_KEY')
            if not api_key:
                self.send_json_response(500, {'error': 'Missing OPENAI_API_KEY on server'})
                return

            prompt = f"""다음은 사용자가 작성한 글입니다. 이 글을 분석하여 다음 항목들을 평가해주세요:

주제: {topic}
작성한 글: {text}

다음 형식으로 JSON 응답을 해주세요:
{{
  "vocabulary_score": 85,
  "structure_score": 78,
  "logic_score": 92,
  "creativity_score": 80,
  "overall_score": 84,
  "strengths": ["구체적인 예시 사용", "논리적 전개", "적절한 어휘 선택"],
  "improvements": ["문장 연결성 강화", "더 다양한 표현 사용"],
  "detailed_analysis": "…",
  "percentile": 75,
  "rewritten_text": "개선된 버전의 글…"
}}"""

            openai_data = {
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "당신은 한국어 글쓰기 전문가입니다."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 1000,
                "temperature": 0.7
            }

            req = urllib.request.Request(
                'https://api.openai.com/v1/chat/completions',
                data=json.dumps(openai_data).encode('utf-8'),
                headers={
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {api_key}'
                }
            )

            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                content = result.get('choices', [{}])[0].get('message', {}).get('content', '')
                
                try:
                    parsed = json.loads(content)
                    self.send_json_response(200, parsed)
                except json.JSONDecodeError:
                    self.send_json_response(200, {'error': 'Failed to parse model output as JSON', 'raw': content})

        except Exception as e:
            self.send_json_response(500, {'error': 'Server error', 'details': str(e)})

    def send_json_response(self, status, data):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))

if __name__ == '__main__':
    PORT = 8787
    with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
        print(f"Local proxy running on http://localhost:{PORT}")
        httpd.serve_forever()

