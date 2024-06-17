
const cursors = ["alias","all-scroll","auto","cell","context-menu","col-resize","copy","crosshair","default","e-resize","ew-resize","grab","grabbing","help","move","n-resize","ne-resize","nesw-resize","ns-resize","nw-resize","nwse-resize","no-drop","none","not-allowed","pointer","progress","row-resize","s-resize","se-resize","sw-resize","text","vertical-text","w-resize","wait","zoom-in","zoom-o"];

document.addEventListener("readystatechange", () => {
	if (document.readyState == "interactive") {
		init_document();
		console.log("interative"); 
		document.body.style.visibility = "visible";
	}
});



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
	/** @type {HTMLAnchorElement[]} */
	const links = Array.from(document.querySelectorAll(".links-list a"))
	links.forEach(async link => {
		let ico = link.innerHTML;
		let img = new Image()
		img.src = "src/ico/" + ico.trim().toLowerCase() + ".ico"
		link.innerHTML = img.outerHTML
		// fetch("https://favicongrabber.com/api/grab/" + new URL(link.href).host)
		// .then(resp=> resp.json())
		// .then(json=> window.open(json.icons[0].src))
	})


	const cursor_elms = document.querySelectorAll(".cursor-spam");
	let cursor_change = () => {
		cursor_elms.forEach( elm => {
			elm.style.cursor = cursors[ Math.floor( Math.random() * cursors.length ) ];
		})
	}
	const interval = setInterval(cursor_change, 150);

	for ( let navBar of document.querySelectorAll("nav.navbar[data-nav-id]")) {
		let navId = navBar.dataset.navId
		let navBody = document.querySelector(`ul.nav-body[data-nav-id="${navId}"]`)
		if (!navBody) {
			console.warn(`nav-bar with id ${navId} has no pair.`)
			continue
		}

		let navTabs = navBar.querySelectorAll("li.nav-btn")
		for ( let tab of navTabs ) {
			tab.onclick = ()=>{
				for ( let otherTab of navTabs )
					otherTab.classList.remove("selected")
				tab.classList.add("selected")
				for ( let child of navBody.children ) {
					if ( child.dataset.content == tab.dataset.content ) {
						child.classList.remove("hidden")
					} else child.classList.add("hidden")
				}
			}
		}
	}


}


async function init_canvas() {
	for (key in imgs) {
		let img = document.createElement("img");
		let canvas = document.createElement("canvas");
		let prom = new Promise((res, rej) => img.onload = res);
		img.src = imgs[key];
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext("2d").drawImage(img, 0, 0);
			imgs[key]["data"] = canvas.getContext('2d').getImageData(0, 0, img.width, img.height);
		}
		imgs[key] = img;
	}


	aspect;
	debugger
	canvas = document.querySelector("canvas#bg");
	c = canvas.getContext("2d");
	// resize_canvas(canvas);
	// window.addEventListener("resize", ()=>{resize_canvas(canvas); frame()});
	// canvas.style.backgroundColor = "rgba(0, 0, 0)";
	// canvas.style.opacity = "5%";
	

	frame();
	function frame() {
		resize_canvas(canvas)
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

				let img_x = (noise + 1.) * 0.5;
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
		x = Math.abs(x % 1.0);
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