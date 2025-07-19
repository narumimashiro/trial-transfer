import boto3
import json
import os

s3_client = boto3.client('s3')
BUCKET_NAME = os.environ['BUCKET_NAME']

def lambda_handler(event, context):
    try:
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        contents = response.get('Contents', [])
        file_names = [obj['Key'] for obj in contents]

        return {
            'statusCode': 200,
            'body': json.dumps({'files': file_names}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
