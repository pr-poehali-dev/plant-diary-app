import json
import os
import psycopg2
from datetime import date, datetime

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def json_serial(obj):
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

def handler(event, context):
    """API для дневника наблюдений: получение записей и создание новых"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    method = event.get('httpMethod', 'GET')
    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute("""
                SELECT j.id, j.entry_date, j.tag, j.text, j.created_at,
                       p.id as plant_id, p.name as plant_name, p.emoji as plant_emoji
                FROM journal_entries j
                JOIN plants p ON j.plant_id = p.id
                ORDER BY j.entry_date DESC, j.created_at DESC
            """)
            rows = cur.fetchall()
            cols = ['id', 'entry_date', 'tag', 'text', 'created_at', 'plant_id', 'plant_name', 'plant_emoji']
            entries = [dict(zip(cols, row)) for row in rows]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(entries, default=json_serial)}

        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            plant_id = body.get('plant_id')
            tag = body.get('tag', '')
            text = body.get('text', '')
            entry_date = body.get('entry_date')

            if entry_date:
                cur.execute(
                    "INSERT INTO journal_entries (plant_id, entry_date, tag, text) VALUES (%s, %s, %s, %s) RETURNING id",
                    (int(plant_id), entry_date, tag, text)
                )
            else:
                cur.execute(
                    "INSERT INTO journal_entries (plant_id, tag, text) VALUES (%s, %s, %s) RETURNING id",
                    (int(plant_id), tag, text)
                )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'id': new_id, 'success': True})}

        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        cur.close()
        conn.close()
