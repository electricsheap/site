


document.addEventListener('readystatechange', ()=>{
	switch (document.readyState) {
		case 'complete': console.log("complete"); 
			document.body.style.visibility = "visible";

			init_document();

			break;
		case 'interactive': console.log("interative"); 
			init_canvas();

			break;
	}
})



let imgs = {
	"roots": "./src/roots.png"
}


let n1 = new SimplexNoise(0);
let n2 = new SimplexNoise(1);
let aspect;
let canvas;
let c;


function init_document() {
	let list_elms_header = Array.from(document.querySelectorAll(".main > li > span"));

	list_elms_header.forEach(elm=>{
		let par = elm.parentElement;
		let body = elm.nextElementSibling;
		console.log(elm);
		elm.onclick = ()=>{
			console.log("hello");
			toggle_collapse(body)
		}
	})

}

function toggle_collapse(elm = document.createElement("div")) {
	let reversed = !elm.classList.toggle("collapsed");
	console.log(reversed);
	let anim = new Animation();
	if (!elm.anim) {
		elm.anim = elm.animate([
			{ 
				"height": `${elm.clientHeight}px`,
				"scale": "100% 100%"
			},
			{ 
				"height": "0px",
				"scale": "100% 0%" 
			}
		],
		{
		"duration": 100,
		})
		elm.anim.child_anims = Array.from(elm.children)
		.map(child=> {
			child.animate()
		})
	}
	
	anim = elm.anim;

	if (reversed) {
		anim.playbackRate = -1;
		anim.play();
	} else {
		anim.playbackRate = 1;
		anim.play();
	}

}


async function init_canvas() {


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
		imgs[key]["data"] = canvas.getContext('2d').getImageData(0, 0, img.width, img.height);
	}


	aspect;
	canvas = document.querySelector("canvas");
	c = canvas.getContext("2d");
	resize_canvas(canvas);
	window.onresize = resize_canvas;

	

	frame();
	function frame() {
		c.clearRect(0, 0, innerWidth, innerHeight);
		let w = innerHeight/imgs.roots.height * imgs.roots.width;
		

		let p = Math.floor(innerWidth/75)
		let img_scale = 10; 
		let t = 0.1
		for (let y = 0; y < innerWidth / p; y++) {
			for (let x = 0; x < innerHeight / p; x++) {
				let UV = {x: img_scale * x/innerWidth, y: img_scale * y/(aspect*innerHeight)}
				let noise = n1.noise3D( UV.x * 1, UV.y * 1, t*Date.now()/1500 ) + n1.noise3D( UV.x * 4, UV.y * 4, t*Date.now()/500 )/6;

				let img_x = noise;
				let img_y = Math.sin(UV.y);
				c.fillStyle = sample(imgs.roots, img_x, img_y);
				c.fillRect(y*p, x*p, p, p);
			}
		}
		c.fillStyle = "rgba(5, 5, 5, 0.85)";
		c.fillRect(0, 0, innerWidth, innerHeight);
	}
	setInterval( frame, 100);

	function resize_canvas() {
		canvas.width = innerWidth;
		canvas.height = innerHeight;
		aspect = innerWidth/innerHeight;

		frame();
	}

	/** @param {HTMLImageElement} img */
	function sample(img, x, y) {
		x = Math.abs(x % aspect- 0.03);
		y = Math.abs(y % 1.0);

		x = Math.floor(x * img.width);
		y = Math.floor(y * img.height);

		let ix = 4 * ( x * img.data.width + y )
		return `rgba(${img.data.data[ix]},${img.data.data[ix+1]},${img.data.data[ix+2]},255)`
	}

	window.sample = sample;

}

