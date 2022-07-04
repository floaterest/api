import { DynamoDB } from 'aws-sdk';

export const client = new DynamoDB.DocumentClient({
	credentials: {
		accessKeyId: process.env.AWS_ID,
		secretAccessKey: process.env.AWS_SECRET,
	},
	apiVersion: '2012-08-10',
	region: process.env.AWS_REG,
});
