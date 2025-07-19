import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('narumikr-connection-device-table')

def lambda_handler(event, context):
    print("Received event:", event)

    # クエリパラメータから device_id を取得
    params = event.get('queryStringParameters') or {}
    device_id = params.get('device_id')

    if not device_id:
        return {
            "statusCode": 400,
            "body": json.dumps({ "error": "Missing device_id" })
        }

    try:
        response = table.get_item(Key={ 'device_id': device_id })
        item = response.get('Item')

        if not item:
            return {
                "statusCode": 404,
                "body": json.dumps({ "error": "device_id not found" })
            }

        return {
            "statusCode": 200,
            "body": json.dumps({
                "device_id": device_id,
                "connectionId": item['connectionId']
            }),
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"  # CORS対応必要なら
            }
        }

    except Exception as e:
        print("Error:", str(e))
        return {
            "statusCode": 500,
            "body": json.dumps({ "error": "Internal server error" })
        }
