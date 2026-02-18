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
    """API для управления растениями: получение списка, добавление, обновление и полив"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == 'GET':
            plant_id = params.get('id')
            if plant_id:
                cur.execute("SELECT id, name, species, emoji, water_frequency_days, light, humidity, health, notes, last_watered, created_at FROM plants WHERE id = %s", (int(plant_id),))
                row = cur.fetchone()
                if not row:
                    return {'statusCode': 404, 'headers': headers, 'body': json.dumps({'error': 'Растение не найдено'})}
                cols = ['id', 'name', 'species', 'emoji', 'water_frequency_days', 'light', 'humidity', 'health', 'notes', 'last_watered', 'created_at']
                plant = dict(zip(cols, row))
                next_water = None
                if plant['last_watered'] and plant['water_frequency_days']:
                    from datetime import timedelta
                    next_water = (plant['last_watered'] + timedelta(days=plant['water_frequency_days'])).isoformat()
                plant['next_water'] = next_water
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps(plant, default=json_serial)}
            else:
                cur.execute("SELECT id, name, species, emoji, water_frequency_days, light, humidity, health, notes, last_watered, created_at FROM plants ORDER BY created_at DESC")
                rows = cur.fetchall()
                cols = ['id', 'name', 'species', 'emoji', 'water_frequency_days', 'light', 'humidity', 'health', 'notes', 'last_watered', 'created_at']
                plants = []
                for row in rows:
                    p = dict(zip(cols, row))
                    if p['last_watered'] and p['water_frequency_days']:
                        from datetime import timedelta
                        p['next_water'] = (p['last_watered'] + timedelta(days=p['water_frequency_days'])).isoformat()
                    else:
                        p['next_water'] = None
                    plants.append(p)
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps(plants, default=json_serial)}

        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action', 'create')

            if action == 'water':
                plant_id = body.get('plant_id')
                cur.execute("UPDATE plants SET last_watered = CURRENT_DATE WHERE id = %s", (int(plant_id),))
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True})}

            name = body.get('name', '')
            species = body.get('species', '')
            emoji = body.get('emoji', '🌱')
            water_freq = body.get('water_frequency_days', 7)
            light = body.get('light', '')
            humidity = body.get('humidity', 50)
            notes = body.get('notes', '')

            cur.execute(
                "INSERT INTO plants (name, species, emoji, water_frequency_days, light, humidity, notes, last_watered) VALUES (%s, %s, %s, %s, %s, %s, %s, CURRENT_DATE) RETURNING id",
                (name, species, emoji, int(water_freq), light, int(humidity), notes)
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {'statusCode': 201, 'headers': headers, 'body': json.dumps({'id': new_id, 'success': True})}

        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            plant_id = body.get('id')
            fields = []
            values = []
            for key in ['name', 'species', 'emoji', 'water_frequency_days', 'light', 'humidity', 'health', 'notes']:
                if key in body:
                    fields.append(f"{key} = %s")
                    values.append(body[key])
            if fields:
                values.append(int(plant_id))
                cur.execute(f"UPDATE plants SET {', '.join(fields)} WHERE id = %s", values)
                conn.commit()
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'success': True})}

        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        cur.close()
        conn.close()
