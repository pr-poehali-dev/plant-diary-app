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
    """API для напоминаний: получение активных, создание и отметка выполнения"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    method = event.get('httpMethod', 'GET')
    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute("""
                SELECT r.id, r.type, r.due_date, r.is_done, r.created_at,
                       p.id as plant_id, p.name as plant_name, p.emoji as plant_emoji
                FROM reminders r
                JOIN plants p ON r.plant_id = p.id
                WHERE r.is_done = FALSE
                ORDER BY r.due_date ASC
            """)
            rows = cur.fetchall()
            cols = ['id', 'type', 'due_date', 'is_done', 'created_at', 'plant_id', 'plant_name', 'plant_emoji']
            reminders = []
            today = date.today()
            for row in rows:
                r = dict(zip(cols, row))
                r['urgent'] = r['due_date'] <= today if r['due_date'] else False
                if r['due_date'] == today:
                    r['time_label'] = 'Сегодня'
                elif r['due_date'] and (r['due_date'] - today).days == 1:
                    r['time_label'] = 'Завтра'
                else:
                    r['time_label'] = r['due_date'].strftime('%d %b') if r['due_date'] else ''
                reminders.append(r)
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(reminders, default=json_serial)}

        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action', 'create')

            if action == 'complete':
                reminder_id = body.get('reminder_id')
                cur.execute("UPDATE reminders SET is_done = TRUE WHERE id = %s", (int(reminder_id),))
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True})}

            plant_id = body.get('plant_id')
            rtype = body.get('type', 'Полив')
            due_date = body.get('due_date')
            cur.execute(
                "INSERT INTO reminders (plant_id, type, due_date) VALUES (%s, %s, %s) RETURNING id",
                (int(plant_id), rtype, due_date)
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'id': new_id, 'success': True})}

        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        cur.close()
        conn.close()
