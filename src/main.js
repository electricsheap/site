
const cursors = ["alias","all-scroll","auto","cell","context-menu","col-resize","copy","crosshair","default","e-resize","ew-resize","grab","grabbing","help","move","n-resize","ne-resize","nesw-resize","ns-resize","nw-resize","nwse-resize","no-drop","none","not-allowed","pointer","progress","row-resize","s-resize","se-resize","sw-resize","text","vertical-text","w-resize","wait","zoom-in","zoom-o"];

document.addEventListener('readystatechange', ()=>{
	switch (document.readyState) {
		case 'interactive': {
			// console.clear();
			init_canvas();
			init_document();
			console.log("interative"); 
			document.body.style.visibility = "visible";
		} break;
	}
})



let str = `<li>
<a href="{album-url}">
progshit
</a>

<div class="bc-container">
	<iframe class="bc-embed" src="https://bandcamp.com/EmbeddedPlayer/album={album-code}/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/transparent=true/" seamless><a href="{album-url}">progshit by AJCW, SkylarDB</a></iframe>
	
	<div class="bc-desc">
	{album-desc}
	</div>
</div>
</li>`


let imgs = {
	"roots": "/site/src/roots.png"
}


let n1 = new SimplexNoise(0);
let n2 = new SimplexNoise(1);
let aspect;
let canvas;
let c;


function init_document() {

	const cursor_elms = document.querySelectorAll(".cursor-spam");
	let cursor_change = () => {
		cursor_elms.forEach( elm => {
			elm.style.cursor = cursors[ Math.floor( Math.random() * cursors.length ) ];
		})
	}
	const interval = setInterval(cursor_change, 150);


	let content_bodies = Array.from(document.querySelectorAll(".content-body-list > li"))
	let body_dict = {};
	content_bodies.forEach( elm => body_dict[elm.dataset.content] = elm );

	let nav_btns = Array.from(document.querySelectorAll(".navbar > ul > li"));

	nav_btns.forEach(elm=>{
		const body = body_dict[elm.dataset.content];
		elm.onclick = () => {
			nav_btns.forEach( elm => elm.classList.remove("selected"));
			elm.classList.add("selected");
			content_bodies.forEach( elm => elm.classList.add("hidden"));
			body.classList.remove("hidden");
		}
	})

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
	canvas = document.querySelector("canvas#bg");
	c = canvas.getContext("2d");
	resize_canvas(canvas);
	window.addEventListener("resize", ()=>{resize_canvas(canvas); frame()});
	// canvas.style.backgroundColor = "rgba(0, 0, 0)";
	// canvas.style.opacity = "5%";
	

	frame();
	function frame() {
		// if ( Math.random() < 0.9 ) return;
		c.clearRect(0, 0, innerWidth, innerHeight);
		let w = innerHeight/imgs.roots.height * imgs.roots.width;
		const numpix = 2500

		
		let p = Math.floor(Math.sqrt( innerWidth*innerHeight / numpix ));
		window.img_scale = 10 // + Number(window.sum) * 10; 
		let t = 0.1
		for (let y = 0; y < innerWidth / p; y++) {
			for (let x = 0; x < innerHeight / p; x++) {
				// if ( Math.random() < 0.1 ) continue;
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


	setInterval( frame, 110 );



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

function resize_canvas(canvas) {
	canvas.width = innerWidth;
	canvas.height = innerHeight;
	aspect = innerWidth/innerHeight;
}