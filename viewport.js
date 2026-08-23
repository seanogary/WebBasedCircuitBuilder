export const viewport = {
	width: null,
	height: null,
    canvasContext: null,
    resizeNow: null,
    resize: null,
	isPanning: false,
	mouseDisplacement: {
		x: 0,
		y: 0,
	},
	prevMousePos: null,
    camera: {
        x: 0,
        y: 0,
    },
    zoomTransform: {
		scale: 1, 
		translation: {
			x: 0,
			y: 0,
		}, 
	},
	
}

export const initResize = () => {
	const viewportChange = new CustomEvent("viewportchange");
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
			window.dispatchEvent(viewportChange);
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

	// panning event listeners
	const canvasObj = document.getElementById('app-canvas');
	canvasObj.addEventListener('mousedown', () => {
		viewport.isPanning = true;
	});
	canvasObj.addEventListener('mouseup', () => {
		viewport.prevMousePos = null;
		
		viewport.mouseDisplacement = {
			x: 0,
			y: 0,
		};
		viewport.isPanning = false;
	});
	canvasObj.addEventListener('mousemove', (e) => {
		if (viewport.isPanning) {
			const newPosition = {
				x: e.offsetX,
				y: e.offsetY,
			}
			viewport.prevMousePos ??= newPosition;
			const delta = {
				x: newPosition.x - viewport.prevMousePos.x,
				y: newPosition.y - viewport.prevMousePos.y,
			}
			viewport.prevMousePos = newPosition;
			viewport.camera.x += delta.x;
			viewport.camera.y += delta.y;
		}	
		window.dispatchEvent(viewportChange);
	});

	canvasObj.addEventListener('wheel', (e) => {
		const oldScale = viewport.zoomTransform.scale;
		const newScale = Math.max(oldScale + 0.01 * e.deltaY, 0.1);
		const ratio = newScale / oldScale;
		const oldOffset = {
			x: viewport.camera.x + viewport.zoomTransform.translation.x,
			y: viewport.camera.y + viewport.zoomTransform.translation.y,
		};
		
		const newOffset = {
			x: e.offsetX - ratio * (e.offsetX - oldOffset.x),
			y: e.offsetY - ratio * (e.offsetY - oldOffset.y),
		};
		
		if (newScale == oldScale) return;

		viewport.zoomTransform.scale = newScale;
		
		viewport.zoomTransform.translation.x =
		newOffset.x - viewport.camera.x;
		viewport.zoomTransform.translation.y =
		newOffset.y - viewport.camera.y;
		window.dispatchEvent(viewportChange);
	});
	
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