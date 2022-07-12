/// assume every image in a theme has identical dimension and extension
interface Theme{
	/// width in px
	width: number,
	/// height in px
	height: number,
	/// file extension (includes '.')
	ext: string,
	/// mime type
	mime: string,
}

/// available themes
export const THEMES: { [id: string]: Theme } = {
	th1: {
		width: 50,
		height: 100,
		ext: '.jpg',
		mime: 'image/jpeg',
	},
	th2: {
		width: 36,
		height: 42,
		ext: '.webp',
		mime: 'image/webp',
	},
	th3: {
		width: 35,
		height: 70,
		ext: '.webp',
		mime: 'image/webp',
	},
};

/// min number of digits to display (not for preview)
export const DIGIT = 7;
