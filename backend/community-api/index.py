import json
import os
import psycopg2
from datetime import date, datetime, timedelta

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def json_serial(obj):
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def time_ago(dt):
    if not dt:
        return ''
    now = datetime.now()
    diff = now - dt
    if diff < timedelta(hours=1):
        mins = max(1, int(diff.total_seconds() / 60))
        return f"{mins} мин назад"
    elif diff < timedelta(days=1):
        hours = int(diff.total_seconds() / 3600)
        return f"{hours} ч назад"
    elif diff < timedelta(days=2):
        return "Вчера"
    else:
        return dt.strftime('%d.%m.%Y')

def handler(event, context):
    """API для сообщества: получение постов, создание и лайки"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    method = event.get('httpMethod', 'GET')
    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute("SELECT id, author_name, text, tags, likes, comments, created_at FROM community_posts ORDER BY created_at DESC")
            rows = cur.fetchall()
            posts = []
            for row in rows:
                name = row[1]
                parts = name.split()
                initials = ''.join([p[0] for p in parts[:2]]).upper() if parts else 'U'
                posts.append({
                    'id': row[0],
                    'author_name': name,
                    'initials': initials,
                    'text': row[2],
                    'tags': row[3] if row[3] else [],
                    'likes': row[4],
                    'comments': row[5],
                    'time_ago': time_ago(row[6]),
                    'created_at': row[6]
                })
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(posts, default=json_serial)}

        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action', 'create')

            if action == 'like':
                post_id = body.get('post_id')
                cur.execute("UPDATE community_posts SET likes = likes + 1 WHERE id = %s", (int(post_id),))
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True})}

            author_name = body.get('author_name', 'Аноним')
            text = body.get('text', '')
            tags = body.get('tags', [])
            cur.execute(
                "INSERT INTO community_posts (author_name, text, tags) VALUES (%s, %s, %s) RETURNING id",
                (author_name, text, tags)
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'id': new_id, 'success': True})}

        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        cur.close()
        conn.close()
