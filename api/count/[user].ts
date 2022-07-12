import { VercelRequest, VercelResponse } from '@vercel/node';
import { DynamoDB } from 'aws-sdk';

import { client } from '../../src/count/dynamo';
import { DIGIT } from '../../src/count/constants';
import { generate } from '../../src/count/svg';

import { assets } from './index';

const params = (user: string) => ({
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
	const item = await client.update(params(user as string)).promise();
	res.setHeader('content-type', 'image/svg+xml');
	res.setHeader('cache-control', 'max-age=0, no-cache, no-store, must-revalidate');
	res.status(200).send(await generate(item.Attributes?.count, +digit || DIGIT, assets));
}
