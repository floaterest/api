import * as fs from 'fs';
import * as path from 'path';
import { THEMES } from './constants';

/// read file as base64 and return as xhref string
function read64(file: string, mime: string): string{
	return `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
}

/// return number of digits
function ndigits(n: number): number{
	return ~~Math.log10(n) + 1;
}

/// choose a random theme
function randtheme(themes: string[]): string{
	themes = themes.length ? themes : Object.keys(THEMES);
	return themes[~~(Math.random() * themes.length)];
}

export async function generate(num: number, digit: number, assets: string): Promise<string>{
	digit = Math.max(digit, ndigits(num));
	// choose random theme
	const theme = randtheme([]);
	// get image for each needed digit
	const { width, height, ext, mime } = THEMES[theme];
	// abs path to theme folder
	const dir = path.resolve(__dirname, assets, theme);
	// store digit -> image data
	const base64 = Array(10);
	// generate svg by digit rtl
	let x = width * digit;
	let svg = `<svg width="${x}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;

	// each digit rtl
	for(let d, n = num; (d = n % 10) || n; n = ~~(n / 10)){
		if(!base64[d]) base64[d] = read64(path.resolve(dir, d + ext), mime);
		svg += `<image x="${x -= width}" width="${width}" height="${height}" xlink:href="${base64[d]}"/>`;
	}

	// pad 0 if needed
	if(x > 0){
		if(!base64[0]) base64[0] = read64(path.resolve(dir, `0${ext}`), mime);
		while(x > 0){
			svg += `<image x="${x -= width}" width="${width}" height="${height}" xlink:href="${base64[0]}"/>`;
		}
	}
	return svg + '</svg>';
}