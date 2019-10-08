function canvasForDPR(canvas = document.getElementById('canvas'),
					  width = window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,
					  height = window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight){
	const context = canvas.getContext('2d');
	let backingStore = context.backingStorePixelRatio ||
		context.webkitBackingStorePixelRatio ||
		context.mozBackingStorePixelRatio ||
		context.msBackingStorePixelRatio ||
		context.oBackingStorePixelRatio ||
		context.backingStorePixelRatio || 1;
	const ratio =  (window.devicePixelRatio || 1) / backingStore;
	canvas.style.width = width + 'px';
	canvas.style.height = height + 'px';
	canvas.width = width * ratio;
	canvas.height = height * ratio;
	context.scale(ratio, ratio);
	return context;
}

function createPoint(option){
	if(option.analyser !== null) {
		option.dataArray = new Uint8Array(option.analyser.fftSize);
		option.analyser.getByteFrequencyData(option.dataArray);
	}
	option.outSideArr = [];
	option.inSideArr = [];
	for(let i = 0; i < option.pointNum; i++){
		if(option.dataArray[i * 12] === undefined) option.dataArray[i * 12] = 0;
		let deg = Math.PI / 180 * i * (360 / option.pointNum);
		let outsideX = -Math.cos(deg) * (option.R + option.dataArray[i * 12] * option.range) + option.x();
		let outsideY = -Math.sin(deg) * (option.R + option.dataArray[i * 12] * option.range) + option.y();
		let insideX = -Math.cos(deg) * (option.R - option.dataArray[i * 12] * option.range) + option.x();
		let insideY = -Math.sin(deg) * (option.R - option.dataArray[i * 12] * option.range) + option.y();
		option.outSideArr.push({x: outsideX, y: outsideY});
		option.inSideArr.push({x: insideX, y: insideY});
	}
	switch (option.style) {
		case 1:
			style1(option, option.outSideArr, option.inSideArr);
			break;
		case 2:
			style2(option, option.outSideArr, option.inSideArr);
			break;
		case 3:
			style3(option, option.outSideArr, option.inSideArr);
			break;
	}
}

function style1(option, outSideArr, inSideArr){
	// 内外圆连线
	for(let i = 0; i < option.pointNum; i++){
		option.ctx.beginPath();
		option.ctx.moveTo(outSideArr[i].x, outSideArr[i].y);
		option.ctx.lineTo(inSideArr[i].x, inSideArr[i].y);
		option.ctx.closePath();
		option.ctx.stroke();
	}
}
function style2(option, outSideArr, inSideArr){
	// 外圆
	option.ctx.beginPath();
	option.ctx.moveTo(outSideArr[0].x, outSideArr[0].y);
	for(let i=0; i < option.pointNum; i++){
		option.ctx.lineTo(outSideArr[i].x, outSideArr[i].y);
	}
	option.ctx.closePath();
	option.ctx.stroke();
	// 内圆
	option.ctx.beginPath();
	option.ctx.moveTo(inSideArr[0].x, inSideArr[0].y);
	for(let i = 0; i < option.pointNum; i++){
		option.ctx.lineTo(inSideArr[i].x, inSideArr[i].y);
	}
	option.ctx.closePath();
	option.ctx.stroke();
	// 内外圆连线
	option.ctx.beginPath();
	for(let i = 0; i < option.pointNum; i++){
		option.ctx.moveTo(outSideArr[i].x, outSideArr[i].y);
		option.ctx.lineTo(inSideArr[i].x, inSideArr[i].y);
	}
	option.ctx.closePath();
	option.ctx.stroke();
}
function style3(option, outSideArr, inSideArr){
	// 外圆
	option.ctx.beginPath();
	option.ctx.moveTo(outSideArr[0].x, outSideArr[0].y);
	for(let i = 0; i < option.pointNum; i++){
		option.ctx.lineTo(outSideArr[i].x, outSideArr[i].y);
	}
	option.ctx.closePath();
	option.ctx.stroke();
	// 内圆
	option.ctx.beginPath();
	option.ctx.moveTo(inSideArr[0].x, inSideArr[0].y);
	for(let i = 0; i < option.pointNum; i++){
		option.ctx.lineTo(inSideArr[i].x, inSideArr[i].y);
	}
	option.ctx.closePath();
	option.ctx.stroke();
}
function initDraw(option){
	option.ctx.clearRect(0, 0, option.width, option.height);
	option.ctx.lineWidth = option.lineWidth;
	option.ctx.strokeStyle = option.strokeStyle;
	option.ctx.shadowColor = option.shadowColor;
	option.ctx.shadowBlur = option.shadowBlur;
	option.ctx.lineCap= option.lineCap;
	createPoint(option);
	window.requestAnimationFrame((e) => {
		initDraw(option)
	});
}
