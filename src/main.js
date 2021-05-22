document.addEventListener('readystatechange', e => {
    if (document.readyState == 'complete') {
        init();
    }
});
function init() {
    console.log("yes");
    let header = document.querySelector(".header");
    let nav_btn = document.querySelector(".drop-down-btn");
    let nav_btn_inner = document.querySelector(".drop-down-btn-inner");
    nav_btn.addEventListener("click", e => {
        ;
        let collapse_anim = header.animate([
            { top: "-100%" },
            { top: "0%" },
        ], {
            duration: 200,
            easing: "ease-in"
        });
        let btn_anim = nav_btn_inner.animate([
            { rotate: "0deg" },
            { rotate: "135deg" },
        ], 300);
        if (header.classList.contains("collapsed")) {
            header.classList.remove("collapsed");
            collapse_anim.play();
            btn_anim.play();
        }
        else {
            collapse_anim.reverse();
            header.classList.add("collapsed");
            btn_anim.reverse();
        }
    });
    let btns = document.querySelectorAll(".sp-btn");
    btns.forEach(elm => {
        let active_color = "#ddd2bd";
        let default_color = "#b6a991";
        elm.addEventListener("mouseover", e => {
            let anim = elm.animate([
                { background_color: default_color },
                { background_color: active_color },
            ], 2000);
            console.log(elm, anim);
            anim.play();
        });
    });
    let imgs = document.querySelectorAll(".img-container");
    imgs.forEach(elm => {
        console.log(elm);
        elm.addEventListener("click", () => {
            console.log("clicked");
            elm.classList.toggle(".img-popup-closed");
        });
    });
}
