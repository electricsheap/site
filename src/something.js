

var spect_scale = 10;
window.scalefunc = bin => 
                        (bin+30) * 10 - innerHeight/5

document.onreadystatechange = () => {
    if (document.readyState === "interactive")
    {
        var str = "";
        file_names.files.forEach(path=>{
            str = `${str}\n${create_list_elm("./files/"+path, path)}`
        })
        document.getElementById("list").innerHTML = str;

        let ac = new AudioContext;
        window. analyser = ac.createAnalyser();
        analyser
        analyser.fftSize = 128 * 2
        analyser.smoothingTimeConstant = 0.5;
        // analyser.connect(ac.destination);

        
        Array.from(document.getElementsByTagName("audio"))
        .forEach(audio=>{
            let node = ac.createMediaElementSource(audio);
            node.connect(analyser);
            node.connect(ac.destination);
        })

        
        let canvas = document.querySelector("canvas#fft");
        /**
         * @type {CanvasRenderingContext2D}
         */
        let c = canvas.getContext("2d");
        c.globalCompositeOperation = "darken";
        resize_canvas(canvas);
        window.addEventListener("resize", ()=>resize_canvas(canvas));

        setInterval(()=>{

            let bin_count = Math.floor(analyser.frequencyBinCount * 0.5) - 1;
            let data = new Float32Array(analyser.frequencyBinCount);
            analyser.getFloatFrequencyData(data);
            window.temp_data = data;
            
            // window.sum = window.sum * 0.5 + 0.5 * data.map(num=>Math.pow(1.1, num)).reduce((prev, cur) => prev+cur);
            for ( var i = 0; i < bin_count; i++) {
                let r = i;
                r = r/bin_count;
                r = 1 - Math.pow( 1 - r, 0.5 );
                r = Math.floor(r * analyser.frequencyBinCount);
                let bin = data.at( r );
                c.fillStyle = "rgba(150,150,150,1.0)";
                 // 1.1 * (1-Math.pow(0.1, bin))

                bin_scaled = scalefunc(bin);

                let p = Math.ceil(innerWidth/bin_count);

                c.fillRect( i*p, -bin_scaled, p, p );
            }
            // c.globalAlpha = 0.1;
            c.globalCompositeOperation =  "xor";
            c.fillStyle = "rgba(5, 5, 5, 0.5)";
            c.fillRect( 0, 0, innerWidth, innerHeight );
        }, 50)
    }
};




function create_list_elm( link, name = link ) 
{
    return `<li>
    <a href="${link}">${name}</a>
    <audio controls>
        <source src="${link}" />
    </audio>
    </li>`
}