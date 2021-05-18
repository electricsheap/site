


document.addEventListener('readystatechange', e => {
	if (document.readyState == 'complete') {
		init();
	}
})


function init() {
	let header = document.querySelector<HTMLDivElement>(".header");
	let nav_btn = document.querySelector<HTMLButtonElement>(".drop-down-btn");
	let nav_btn_inner = document.querySelector<HTMLDivElement>(".btn-inner");

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


}