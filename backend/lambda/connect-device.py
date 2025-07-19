import boto3
import json
import os

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DeviceConnections')

apigateway = boto3.client(
    'apigatewaymanagementapi',
    endpoint_url='https://xxx.execute-api.ap-northeast-1.amazonaws.com/dev'
)

def lambda_handler(event, context):
    body = json.loads(event['body'])
    device_id = body['deviceId']
    message = body['message']

    # 接続IDをDynamoDBから取得
    response = table.get_item(Key={'deviceId': device_id})
    if 'Item' not in response:
        return {'statusCode': 404, 'body': 'Device not found'}

    connection_id = response['Item']['connectionId']

    try:
        apigateway.post_to_connection(
            ConnectionId=connection_id,
            Data=message.encode('utf-8')
        )
    except apigateway.exceptions.GoneException:
        # 接続切れてたら削除
        table.delete_item(Key={'deviceId': device_id})
        return {'statusCode': 410, 'body': 'Connection gone'}

    return {'statusCode': 200, 'body': 'Message sent'}
