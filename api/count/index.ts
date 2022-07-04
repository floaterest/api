import * as path from 'path';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { generate } from '../../src/count/svg';

export const assets = path.resolve(__dirname, '../../assets/count');

export default async function(req: VercelRequest, res: VercelResponse){
	const count = 1234567890;
	res.setHeader('content-type', 'image/svg+xml');
	res.setHeader('cache-control', 'max-age=0, no-cache, no-store, must-revalidate');
	res.status(200).send(await generate(count, 10, assets));
}