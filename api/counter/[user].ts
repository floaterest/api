import { client } from '../../src/counter/dynamo';
// import * as path from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { DynamoDB } from 'aws-sdk/clients/browser_default';

const params = user => ({
	TableName: 'count',
	Key: { user },
	UpdateExpression: 'set #count = if_not_exists(#count, :zero) + :one',
	ExpressionAttributeNames: { '#count': 'count' },
	ExpressionAttributeValues: {
		':one': 1,
		':zero': 0,
	},
	ReturnValues: 'UPDATED_NEW',
} as DynamoDB.DocumentClient.UpdateItemInput);

export default async function(req: VercelRequest, res: VercelResponse){
	const { user } = req.query;
	const r = await client.update(params(user)).promise();
	// res.setHeader('content-type', 'image/svg+xml');
	// res.setHeader('cache-control', 'max-age=0, no-cache, no-store, must-revalidate');
	res.status(200).send(r);
}
