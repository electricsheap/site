


document.addEventListener('readystatechange', e => {
	if (document.readyState == 'complete') {
		init();
	}
})

let imgs = {
	"roots": "./src/roots.png"
}


async function init() {


	for (key in imgs) {
		let img = document.createElement("img");
		let canvas = document.createElement("canvas");
		img.src = imgs[key];
		let prom = new Promise((res, rej) => img.onload = res);
		await prom;
		imgs[key] = img;
		canvas.width = img.width;
		canvas.height = img.height;
		canvas.getContext("2d").drawImage(img, 0, 0);
		imgs[key+"_data"] = canvas.getContext('2d').getImageData(0, 0, img.width, img.height);
	}


	let aspect;
	let canvas = document.querySelector("canvas");
	let c = canvas.getContext("2d");
	resize_canvas(canvas);
	window.onresize = resize_canvas;

	

	frame();

	function frame() {
		c.clearRect(0, 0, innerWidth, innerHeight);
		let w = innerHeight/imgs.roots.height * imgs.roots.width;
		
		// c.drawImage( imgs.roots, innerWidth/2 - w/2, 0, w, innerHeight );
	}

	function resize_canvas() {
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		aspect = innerWidth/innerHeight;

		frame();
	}

	/** @param {HTMLImageElement} img */ 
	function sample(img) {
		img.getImg
	}

}
