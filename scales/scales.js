// import * as math from "mathjs"
const { fraction: frac } = math;

const PI = Math.PI;
const TAU = Math.PI * 2;

let primes = [2,3,5,7,9,11];


class Ratio {
    constructor(type, nom_or_step, denom_or_divs) {
        this.type = type;
        this.val1 = Number(nom_or_step);
        this.val2 = Number(denom_or_divs);

        
    }

    frac() {
        return frac(this.val1, this.val2 || 1 );
    }

    mul(by) {
        if (typeof by.d == "bigint" && typeof by.n == "bigint") {
            by = new Ratio("frac", Number(by.n), Number(by.d));
        }

        if (typeof by == "number") {
            by = new Ratio("value", by);
        }

        // display raw number
        // 1. val val
        // 2. step val
        // 3. frac val
        // 4. step step
        // 5. step frac

        // display ratio
        // 6. frac frac

        if (this.type == "frac" && by.type == "frac") {
            let new_ratio = this.frac().mul(by.frac());
            return new Ratio("frac", new_ratio.n, new_ratio.d); 
        }

        let new_val = Number(this) * Number(by);
        return new Ratio("value", new_val);
    }

    valueOf() {
        switch(this.type) {
        case "frac":
            return Number(this.val1)/Number(this.val2);
        case "value":
            return this.val1;
        case "step":
            return Math.pow(2, this.val1/this.val2);
        }
    }

    toString() {
        switch(this.type) {
        case "value":
            return this.val1.toFixed(2) + "";
        case "frac":
            return this.frac().toFraction();
        case "step":
            return this.val1 + "\\" + this.val2;
        }
    }
}

document.addEventListener("readystatechange", e => {
    if (document.readyState == "complete") {
        main()
    }
})

function set_cookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}

function get_cookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

function parse_ratio(str) {
    let num = Number(str);
    if (!Number.isNaN(num)) {
        return new Ratio("value", num);
    }
    let f_slash = str.split("/").filter(s=>(s.length>0));
    if (f_slash.length == 2) {
        let nums = f_slash.map(n => Number(n));
        if (!Number.isNaN(nums[0]) && !Number.isNaN(nums[1])) {
            return new Ratio("frac", nums[0],nums[1]);
        }
    }
    let b_slash = str.split("\\").filter(s=>s.length);
    if (b_slash.length == 2) {
        let nums = b_slash.map(n => Number(n));
        if (!Number.isNaN(nums[0]) && !Number.isNaN(nums[1])) {
            return new Ratio("step", nums[0],nums[1]);
        }
    }
    return undefined;
}

function parse_ratios(a = "") {
    return a.split(" ").filter(s=>s.length)
    .map(s=>s.trim())
    .map(parse_ratio)
    .filter(elm=>elm !== undefined);
}

function rgb(r, g, b) {
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`
}
function rgba(r, g, b, a) {
    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${Math.floor(a)})`
}

function fill_circ(c, x, y, r) {
    c.beginPath();
    c.arc(rx, ry, w/50, 0, 2*PI);
    c.fillStyle = rgb(0, 0, 0);
    c.fill();
}

function atan2(x, y) {
    let res = math.atan2(x,y);
    if (res < 0) {
        res += TAU;
    }
    return res;
}

function circ_ratio(ratio, rad, x, y) {
    ratio = Math.log2(Number(ratio));
    return { 
        x: x + (rad) * Math.cos(PI * 2 * (ratio - 0.25)),
        y: y + (rad) * Math.sin(PI * 2 * (ratio - 0.25))
    };
}

let mouse = {x:0, y:0};
let is_mouse_clicked = false;
window.onclick = () => is_mouse_clicked = true;
window.onmouseup = () => is_mouse_clicked = false;




class App {
    constructor() {

    }
}

function main() {
    // let cookie_str = document.cookie;
    // let cookie = {
    //     scale: undefined,
    //     phant: undefined,
    // };
    
    // catch

    let ratios = [];
    let ratio_locations = [];
    let phants = [];
    let selected = [];
    
    const canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener("mousemove", (e) => {
        mouse.x = e.offsetX
        mouse.y = e.offsetY;
    });
    
    
    const ratios_input = document.querySelector("input#ratios");
    const phants_input = document.querySelector("input#phants");
    const parse_btn = document.querySelector("button#parse");
    const selected_checkbox = document.querySelector("input#selected");
    
    let cookie = document.cookie;
    ratios_input.value = get_cookie("ratios") || "10/9 8/7 14/11 4/3 16/11 3/2 22/13 12/7 7/4 56/29";
    phants_input.value = get_cookie("phants") || "3/2 4/3"

    function update_ratios() {
        ratios = parse_ratios(ratios_input.value);
        if (ratios.every(v => v != 1)) {
            ratios.unshift(new Ratio("frac", 1, 1));
        }
        phants = parse_ratios(phants_input.value);
        selected = (selected_checkbox.checked) ? ratios.map((_,i)=>i) : []


        console.log("ratios: ", ratios.map(n=>n.toString()))
        set_cookie("ratios", ratios_input.value);
        set_cookie("phants", phants_input.value);
    }   
    
    parse_btn.onclick = update_ratios;
    update_ratios();
    let w = canvas.width;
    let h = canvas.height;
    let big_rad = w/3




    const c = canvas.getContext("2d");
    window.c = c;

    function draw_text(text, font_size, x, y, h_align, v_align) {
        c.font = `${font_size.toFixed(0)}px monospace`;
        let text_size = c.measureText(text);
        const h = text_size.fontBoundingBoxAscent;
        y += 
        (v_align == -1) ? 0 :
        (v_align == 1) ? h : h/2;
        
        c.textAlign = 
        (h_align == -1) ? "left" : 
        (h_align == 1) ? "right" : "center";
        
        c.fillText(text, x, y);

    }


    function get_ratio_pos(ratio, rad_offset = 0) {
        return circ_ratio(ratio, big_rad + rad_offset, w/2, h/2);
    } 


    function render() {
        w = canvas.width;
        h = canvas.height;
        big_rad = w/3;
        let small_rad = w/50;

        ratio_locations = ratios.map(get_ratio_pos);

        let hovered = -1;
        let dist = Infinity;
        for (let i = 0; i < ratio_locations.length; i++) {
            const {x, y} = ratio_locations[i];
            let new_dist = Math.sqrt(Math.pow(mouse.x - x, 2) + Math.pow(mouse.y - y, 2)) 
            if (new_dist < dist && new_dist <= small_rad) {
                dist = new_dist;
                hovered = i;
            }
        }
        let hovered_ratio;

        if (is_mouse_clicked) {
            if (hovered >= 0) {
                if (selected.includes(hovered)) {
                    selected = selected.filter(n => n != hovered);
                } else {
                    selected.push(hovered);
                }
            }
            
            console.log(selected);
            is_mouse_clicked = false;
        }


        // clear
        c.fillStyle = rgb(0, 26, 18)
        c.fillRect(0, 0, w, h);



        c.beginPath();
        c.arc(w/2, h/2, big_rad, 0, 2 * PI);
        c.strokeStyle = rgb(91, 73, 210);
        c.stroke();

        for (let i = 0; i < ratios.length; i++) {
            const is_on_hovered = hovered == i;
            if (!selected.includes(i) && !is_on_hovered) {
                continue
            }

            const ratio = ratios[i];
            let ratio_pos = get_ratio_pos(ratio);

            for (let j = 0; j < phants.length; j++) {
                const phant = phants[j];
                let scaled_ratio = ratio.mul(phant);


                while (Number(scaled_ratio) >= 2) {
                    scaled_ratio = scaled_ratio.mul(frac(1,2));
                }
                


                let new_ratio_pos = get_ratio_pos(scaled_ratio);
                
                c.beginPath();
                c.moveTo(ratio_pos.x, ratio_pos.y);
                c.lineTo(new_ratio_pos.x, new_ratio_pos.y);
                c.strokeStyle = (is_on_hovered) ? rgb(255, 255, 255) : rgb(82, 65, 90);
                c.stroke()
                
                if (!is_on_hovered)
                    continue;

                let text_pos = get_ratio_pos(scaled_ratio, -50);
                c.textAlign = "center";
                c.font = "20px monospace";
                c.fillStyle = rgb(98, 153, 153);
                c.fillText(scaled_ratio.toString(), 
                    text_pos.x, 
                    (text_pos.y + 16/2)
                );
                
                text = phant.toString();
                text_pos = get_ratio_pos(scaled_ratio, -50);
                c.textAlign = "center";
                c.font = "15px monospace";
                c.fillStyle = rgb(70, 117, 117);
                c.fillText(text, 
                    text_pos.x, 
                    (text_pos.y + 12/2 + 20)
                );
            }
        }
        



        for (let i = 0; i < ratios.length; i++) {
            const ratio = ratios[i];
            let pos = get_ratio_pos(ratio)

            c.beginPath();
            c.arc(pos.x, pos.y, small_rad, 0, 2*PI);
            
            let color = rgb(149, 99, 149);
            if (selected.includes(i)) {
                if (i == hovered) {
                    color = rgb(61, 157, 109); 
                    if (ratio == 1) {
                        color = rgb(96, 212, 156); 
                    }
                } else if (ratio == 1) {
                    color = rgb(200, 200, 200); 
                }
            } else if (i == hovered) {
                color = rgb(61, 157, 109); 
                if (ratio == 1) {
                    color = rgb(96, 212, 156); 
                }
            } else if (ratio == 1) {
                color = rgb(200, 200, 200); 
            }

            c.fillStyle = color;
            c.fill();
            // each char is 17 x 24

            // c.beginPath()
            // c.textAlign = "center";
            // c.font = "30px monospace";
            // c.fillStyle = rgb(200, 250, 250);
            

            // c.fillText(ratio_text, 
            //     text_pos.x + text_size.width * 0.5 * math.sin(2 * Number(ratio) * PI), 
            //     (text_pos.y + text_size.emHeightDescent)
            // );

            let ratio_text = ratio.toString();
            let text_pos = get_ratio_pos(ratio, 30);

            function dt(n1, n2, d) {
                return Math.abs(n1-n2) <= d;
            }

            let rval = Math.log2(Number(ratio));
            let [h_align, v_align] = 
                (rval < 1/16)   ? [0,  -1] :
                (rval < 3/16)   ? [-1, -1] :
                (rval < 5/16)   ? [-1,  0] :
                (rval < 7/16)   ? [-1,  1] :
                (rval < 9/16)   ? [0,   1] :
                (rval < 11/16)  ? [1,   1] :
                (rval < 13/16)  ? [1,   0] : 
                (rval < 15/16)  ? [1,  -1] :
                                  [0,  -1];
            
            draw_text(ratio_text, (i == hovered) ? 30 : 15, text_pos.x, text_pos.y, h_align, v_align);
        }




        
    }

    function loop() {
        try {
            render();
        } catch (e) {
            console.error(e);
        }
        requestAnimationFrame(loop);
    }
    loop();
}

