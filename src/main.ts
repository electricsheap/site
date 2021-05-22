


document.addEventListener('readystatechange', e => {
	if (document.readyState == 'complete') {
		init();
	}
})


function init() {

	

	let header = document.querySelector<HTMLDivElement>(".header");
	let nav_btn = document.querySelector<HTMLButtonElement>(".drop-down-btn");
	let nav_btn_inner = document.querySelector<HTMLDivElement>(".drop-down-btn-inner");

	nav_btn.addEventListener("click", e=> {;
		let collapse_anim = header.animate([
			{ top: "-100%" },
			{ top: "0%" },
		], {
			duration: 200,
			easing: "ease-in"
		} );

		let btn_anim = nav_btn_inner.animate([
			{ rotate: "0deg" },
			{ rotate: "135deg" },
		], 300 );

		if (header.classList.contains("collapsed")) { 
			header.classList.remove("collapsed");
			collapse_anim.play();
			btn_anim.play();
		} else {
			collapse_anim.reverse();
			header.classList.add("collapsed");
			btn_anim.reverse();
		}
	});


	let btns = document.querySelectorAll<HTMLButtonElement>(".sp-btn");

	btns.forEach( elm =>  {
		let active_color = "#ddd2bd";
		let default_color = "#b6a991";
		elm.addEventListener("mouseover", e=> {
			let anim = elm.animate([
				{background_color: default_color},
				{background_color: active_color},
			], 2000 );
			
			anim.play();
		});
	});

	let imgs = document.querySelectorAll<HTMLDivElement>(".img-container");
	let img_overlays = document.querySelectorAll<HTMLDivElement>(".img-overlay-container");
	console.log(img_overlays);
	
	imgs.forEach( elm => {

		let overlay = elm.querySelector(".img-overlay-container") as HTMLDivElement;
		let img = elm.querySelector(".img-small") as HTMLImageElement;
		
		let anim = overlay.animate([
			{opacity: "100%"},
			{opacity: "0%"},
		], 50);

		img.addEventListener("click", () => {
			anim.reverse();
			anim.onfinish = undefined;
			setTimeout(()=>overlay.hidden=false, 10);
		});


		overlay.addEventListener("click", ()=>{
			overlay.getAnimations().forEach(overlay=>overlay.cancel());
			anim.onfinish = () => overlay.hidden = true;
			anim.reverse();
		})
	});

	img_overlays.forEach( elm=>elm );
}