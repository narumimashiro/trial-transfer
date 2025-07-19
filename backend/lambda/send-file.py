import json
import boto3
import os
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('narumikr-connection-device-table')

s3 = boto3.client('s3')
BUCKET_NAME = os.environ['BUCKET_NAME']

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body') or '{}')
        device_id = body.get('device_id')
        file_name = body.get('file_name')

        if not device_id or not file_name:
            return response(400, { "error": "Missing device_id or file_name" })

        # DynamoDB から connectionId を取得
        result = table.get_item(Key={ 'device_id': device_id })
        item = result.get('Item')
        if not item:
            return response(404, { "error": "Device not found" })

        connection_id = item['connectionId']

        # Presigned URL を生成
        try:
            presigned_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET_NAME, 'Key': file_name},
                ExpiresIn=60  # URL の有効期限（秒）
            )
        except ClientError as e:
            print("❌ Failed to generate presigned URL:", e)
            return response(500, { "error": "Could not generate presigned URL" })

        # API Gateway からメッセージ送信
        gw = boto3.client(
            'apigatewaymanagementapi',
            endpoint_url="https://2mho65l0y6.execute-api.ap-northeast-1.amazonaws.com/production"
        )

        gw.post_to_connection(
            ConnectionId=connection_id,
            Data=json.dumps({
                "type": "file_download",
                "file_name": file_name,
                "url": presigned_url
            }).encode('utf-8')
        )

        return response(200, { "message": "Download URL sent successfully" })

    except Exception as e:
        print("❌ Unexpected error:", e)
        return response(500, { "error": "Internal Server Error" })

def response(status, body):
    return {
        "statusCode": status,
        "body": json.dumps(body),
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    }
