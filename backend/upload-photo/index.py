import json
import os
import base64
import uuid
import boto3

def handler(event, context):
    """Загрузка фото растения в S3 хранилище"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '86400'}, 'body': ''}

    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}

    raw_body = event.get('body') or '{}'
    if isinstance(raw_body, dict):
        body = raw_body
    else:
        body = json.loads(raw_body) if raw_body.strip() else {}
    image_data = body.get('image')
    content_type = body.get('content_type', 'image/jpeg')

    if not image_data:
        return {'statusCode': 400, 'headers': headers, 'body': json.dumps({'error': 'No image data'})}

    if ',' in image_data:
        image_data = image_data.split(',', 1)[1]

    file_bytes = base64.b64decode(image_data)

    ext = 'jpg'
    if 'png' in content_type:
        ext = 'png'
    elif 'webp' in content_type:
        ext = 'webp'

    file_name = f"plants/{uuid.uuid4().hex}.{ext}"

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )

    s3.put_object(
        Bucket='files',
        Key=file_name,
        Body=file_bytes,
        ContentType=content_type
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{file_name}"

    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'url': cdn_url, 'success': True})}