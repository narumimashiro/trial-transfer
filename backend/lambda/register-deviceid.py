import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DeviceConnections')  # 作成したテーブル名に合わせてください

def lambda_handler(event, context):
    # WebSocketの接続ID（AWSが自動で付与する）
    connection_id = event['requestContext']['connectionId']
    
    # クエリパラメータから deviceId を取得（例: ?deviceId=xxx）
    params = event.get('queryStringParameters') or {}
    device_id = params.get('deviceId')

    if not device_id:
        return {
            "statusCode": 400,
            "body": "Missing deviceId"
        }

    # DynamoDB に保存
    table.put_item(Item={
        'deviceId': device_id,
        'connectionId': connection_id
    })

    print(f"✅ 接続: deviceId={device_id}, connectionId={connection_id}")

    return {
        "statusCode": 200,
        "body": "Connected"
    }
