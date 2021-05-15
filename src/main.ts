


document.addEventListener('readystatechange', e => {
	if (document.readyState == 'complete') {
		init();
	}
})


function init() {
	document.querySelectorAll(".navbar.drop-down").forEach(elm => {
		elm.firstChild
	})
}