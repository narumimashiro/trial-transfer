import base64
import boto3
import os
import json

s3 = boto3.client('s3')
BUCKET_NAME = os.environ['BUCKET_NAME']

def lambda_handler(event, context):
    # Base64でエンコードされた動画データを取得（API Gatewayの binary media types 有効時は body がBase64）
    is_base64_encoded = event.get('isBase64Encoded', False)
    file_data = base64.b64decode(event['body']) if is_base64_encoded else event['body']
    
    file_key = f"uploads/video_{context.aws_request_id}.mp4"
    
    s3.put_object(
        Bucket=BUCKET_NAME,
        Key=file_key,
        Body=file_data,
        ContentType='video/mp4'
    )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "動画アップロード成功",
            "fileKey": file_key,
            "url": f"https://{BUCKET_NAME}.s3.amazonaws.com/{file_key}"
        })
    }
