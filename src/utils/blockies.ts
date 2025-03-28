var randseed = new Array(4); // Xorshift: [x, y, z, w] 32 bit values

interface BlockiesOpt {
	seed: string;
	size: number;
	scale: number;
	color?: string;
	bgcolor?: string;
	spotcolor?: string;
}

export function getBlocky(address: string) {
	if (!address || typeof address !== "string" ) {
		return;
	}
    console.log("address", address);
    
	var blockiesData = createIcon({
		seed: address?.toLowerCase(),
		size: 8,
		scale: 4,
	}).toDataURL();

	return blockiesData;
}

function seedrand(seed: string) {
	for (var i = 0; i < randseed.length; i++) {
		randseed[i] = 0;
	}
	for (var i = 0; i < seed.length; i++) {
		randseed[i % 4] = (randseed[i % 4] << 5) - randseed[i % 4] + seed.charCodeAt(i);
	}
}

function rand() {
	// based on Java's String.hashCode(), expanded to 4 32bit values
	var t = randseed[0] ^ (randseed[0] << 11);

	randseed[0] = randseed[1];
	randseed[1] = randseed[2];
	randseed[2] = randseed[3];
	randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);

	return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
}

function createColor() {
	//saturation is the whole color spectrum
	var h = Math.floor(rand() * 360);
	//saturation goes from 40 to 100, it avoids greyish colors
	var s = rand() * 60 + 40 + "%";
	//lightness can be anything from 0 to 100, but probabilities are a bell curve around 50%
	var l = (rand() + rand() + rand() + rand()) * 25 + "%";

	var color = "hsl(" + h + "," + s + "," + l + ")";
	return color;
}

function createImageData(size: number) {
	var width = size; // Only support square icons for now
	var height = size;

	var dataWidth = Math.ceil(width / 2);
	var mirrorWidth = width - dataWidth;

	var data = [];
	for (var y = 0; y < height; y++) {
		var row = [];
		for (var x = 0; x < dataWidth; x++) {
			// this makes foreground and background color to have a 43% (1/2.3) probability
			// spot color has 13% chance
			row[x] = Math.floor(rand() * 2.3);
		}
		var r = row.slice(0, mirrorWidth);
		r.reverse();
		row = row.concat(r);

		for (var i = 0; i < row.length; i++) {
			data.push(row[i]);
		}
	}

	return data;
}

function buildOpts(opts: any) {
	var newOpts: any = {};
	newOpts.seed = opts.seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);

	seedrand(newOpts.seed);

	newOpts.size = opts.size || 8;
	newOpts.scale = opts.scale || 4;
	newOpts.color = opts.color || createColor();
	newOpts.bgcolor = opts.bgcolor || createColor();
	newOpts.spotcolor = opts.spotcolor || createColor();

	return newOpts;
}

function renderIcon(opts: BlockiesOpt, canvas: HTMLCanvasElement) {
	opts = buildOpts(opts || {});
	var imageData = createImageData(opts.size);
	var width = Math.sqrt(imageData.length);

	canvas.width = canvas.height = opts.size * opts.scale;

	var cc = canvas.getContext("2d")!;
	cc.fillStyle = opts.bgcolor!;
	cc.fillRect(0, 0, canvas.width, canvas.height);
	cc.fillStyle = opts.color!;

	for (var i = 0; i < imageData.length; i++) {
		// if data is 0, leave the background
		if (imageData[i]) {
			var row = Math.floor(i / width);
			var col = i % width;

			// if data is 2, choose spot color, if 1 choose foreground
			cc.fillStyle = imageData[i] == 1 ? opts.color! : opts.spotcolor!;

			cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
		}
	}
	return canvas;
}

export function createIcon(opts: BlockiesOpt) {
	var canvas = document.createElement("canvas");

	renderIcon(opts, canvas);

	return canvas;
}
