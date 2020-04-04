const bgColor1 = "#224885";
const bgColor2 = "#4287f5";
const bgColor3 = "#164591";
var iiii = 0;
function showDesc(){
	alert("This piece of artwork is meant to symbolize the fact that within every Jew there is a connection to HaShem or G-d, whether they know it or not. This is symbolized by the fact that the Star of David repeats continuously at every level of the fractal. The Jewish star Fractal, which is formed through two overlapping Sierpinsky triangles, is completely computer generated through recursion, and the slider at the top left can be used to increase the levels of recursion to make the fractal more complex. Warning: Higher levels of complexity may lag older computer systems. Finally, the artwork will react and distort based on sound inputs to signify the fact that beyond the written history of Judaism, there is also an oral tradition that must be preserved through passing it down between the generations.        -Max Lewis UChicago Class of 2023");
}
window.onload = function () {
	
	const canvas = document.getElementById("canvas");
	/** @type {CanvasRenderingContext2D} */
	const context = canvas.getContext("2d");
	let width = canvas.width = window.innerWidth;
	let height = canvas.height = window.innerHeight;


	const slider = document.getElementById('slider');
var soundAllowed = function (stream){
	window.persistAudioStream = stream;
	var audioContent = new AudioContext();
	var audioStream = audioContent.createMediaStreamSource( stream );
	var analyser = audioContent.createAnalyser();
	audioStream.connect(analyser);
	analyser.fftSize = 2048;
	var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
	analyser.getByteFrequencyData(frequencyArray);
	var adjustedLength;

	window.onresize = function (ev, ui) {
		width = canvas.width = window.innerWidth;
		height = canvas.height = window.innerHeight;
		drawPage();
	};

	slider.oninput = function (ev, ui) {
        context.scale(4,4);
        context.clearRect(-width / 2, -height / 2, width, height);

        drawPage();
	};
	function drawPage() {
		analyser.getByteFrequencyData(frequencyArray);
		var audioSpin = Math.floor(frequencyArray[100]) - (Math.floor(frequencyArray[100]) % 1);
		var audioScale = -(Math.floor(frequencyArray[200]) - (Math.floor(frequencyArray[200]) % 1))/700;
		requestAnimationFrame(drawPage);
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.translate(width / 2, height / 2);

		const p0 = {
			x: 0,
			y: -321*(1.4+audioScale)
		},
			p1 = {
				x: 278*(1.4+audioScale),
				y: 160*(1.4+audioScale)
			},
			p2 = {
				x: -278*(1.4+audioScale),
				y: 160*(1.4+audioScale)
			};

		function bgFill(bgColor1, bgColor2, bgColor3) {
			const bgGrd = context.createRadialGradient(0, 0, 50, 0, 0, 700);
			bgGrd.addColorStop(0, bgColor1);
			bgGrd.addColorStop(0.5, bgColor2);
			bgGrd.addColorStop(1, bgColor3);

			context.fillStyle = bgGrd;
			context.fillRect(-width / 2, -height / 2, width, height);
		}

		bgFill(bgColor1, bgColor2, bgColor3);

		const triGrd = context.createLinearGradient(p0.x, p0.y, p2.x, p2.y);
		triGrd.addColorStop(0, "#F2657B");
		triGrd.addColorStop(0.25+audioSpin/700, "#fadc19");
		triGrd.addColorStop(1, "#B9C482");

		sierpinski(p0, p1, p2, slider.value);

		// drawTriangle(p0, p1, p2);

		function sierpinski(p0, p1, p2, limit) {
			if (limit > 0) {
				const pA = {
					x: (p0.x + p1.x) / 2,
					y: (p0.y + p1.y) / 2
				},
					pB = {
						x: (p1.x + p2.x) / 2,
						y: (p1.y + p2.y) / 2
					},
					pC = {
						x: (p2.x + p0.x) / 2,
						y: (p2.y + p0.y) / 2
					};


				sierpinski(p0, pA, pC, limit - 1);
				sierpinski(pA, p1, pB, limit - 1);
				sierpinski(pC, pB, p2, limit - 1);

			}
			else {
				drawTriangle(p0, p1, p2);
				context.rotate(Math.PI-audioSpin/1000);
       	        drawTriangle(p0, p1, p2);
                context.rotate(-Math.PI);

       
			}
		}


		function drawTriangle(p0, p1, p2) {

			context.fillStyle = triGrd;

			context.beginPath();
			context.moveTo(p0.x, p0.y);
			context.lineTo(p1.x, p1.y);
			context.lineTo(p2.x, p2.y);

			context.fill();
      


			if (slider.value <= 4) {
				context.lineJoin = "round";
				context.lineWidth = 20;
				context.strokeStyle = "#C9CC95";
				context.lineWidth = 3;
				context.closePath();
				context.stroke();
			}
		}

	}

	drawPage();
	}
	var soundNotAllowed = function (error) {
        h.innerHTML = "You must allow your microphone.";
        console.log(error);
	}
	navigator.getUserMedia({audio:true}, soundAllowed, soundNotAllowed);

};
