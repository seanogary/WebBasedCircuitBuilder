export const viewport = {
	width: null,
	height: null,
    canvasContext: null,
    resizeNow: null,
    resize: null,
}

export const initResize = () => {
	const canvas = document.getElementById('app-canvas');
	const ctx = canvas.getContext('2d');
    viewport.canvasContext = ctx;
    viewport.width = window.innerWidth;
	viewport.height = window.innerHeight;
	function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
		const cssWidth = window.innerWidth;
		const cssHeight = window.innerHeight;
		canvas.style.width = cssWidth + 'px';
		canvas.style.height = cssHeight + 'px';

		const newWidth = Math.round(cssWidth * dpr);
		const newHeight = Math.round(cssHeight * dpr);

		if (canvas.width !== newWidth || canvas.height !== newHeight) {
			canvas.width = newWidth;
			canvas.height = newHeight;
			viewport.width = window.innerWidth;
			viewport.height = window.innerHeight;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.clearRect(0, 0, cssWidth, cssHeight);
		}
	}

	let raf = null;
	function scheduleResize() {
		if (raf) cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			raf = null;
			resizeCanvas();
		});
	}
	
	window.addEventListener('resize', scheduleResize);
	window.addEventListener('orientationchange', scheduleResize);
	document.addEventListener('fullscreenchange', scheduleResize);

	const dpr = Math.max(window.devicePixelRatio || 1, 1);
	const mq = window.matchMedia(`(resolution: ${dpr}dppx)`);
	mq.addEventListener('change', scheduleResize);
	mq.addListener(scheduleResize);

	document.addEventListener('visibilitychange', () => {
		if (!document.hidden) scheduleResize();
	});

	viewport.resize = scheduleResize;
	viewport.resizeNow = resizeCanvas;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', scheduleResize);
	} else {
		scheduleResize();
	}
}