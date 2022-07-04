import * as path from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { DynamoDB } from 'aws-sdk/clients/browser_default';

import { client } from '../../src/count/dynamo';
import { DIGIT, PREVIEW } from '../../src/count/constants';
import { generate } from '../../src/count/svg';

const assets = path.resolve(__dirname, '../../assets/count');

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
	const { user, digit } = req.query;
	const count = user === PREVIEW
		? 1234567890
		: (await client.update(params(user)).promise()).Attributes.count;
	res.setHeader('content-type', 'image/svg+xml');
	res.setHeader('cache-control', 'max-age=0, no-cache, no-store, must-revalidate');
	res.status(200).send(await generate(count, +digit || DIGIT, assets));
}
