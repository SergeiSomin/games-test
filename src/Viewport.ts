export interface IViewportData {
	windowWidth: number;
	windowHeight: number;
	width: number;
	height: number;
	centerX: number;
	centerY: number;
	left: number;
	right: number;
	top: number;
	bottom: number;
}

export interface IViewportParams {
	width: number;
	height: number;
	onResized: (data: IViewportData) => void;
}

export class Viewport {

	private _currentData: IViewportData;
	private _params: IViewportParams;

	constructor(params: IViewportParams) {
		this._params = params;
		this._currentData = {
			windowWidth: 0,
			windowHeight: 0,
			width: 0,
			height: 0,
			centerX: 0,
			centerY: 0,
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
		};
	}

	getCurrent() {
		return this._currentData;
	}

	resize() {
		const minWidth = this._params.width;
		const minHeight = this._params.height;
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1;
		const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1;
		const scale = scaleX > scaleY ? scaleX : scaleY;
		const width = windowWidth * scale;
		const height = windowHeight * scale;
		const centerX = width / 2;
		const centerY = height / 2;
		const left = centerX - (minWidth / 2);
		const right = centerX + (minWidth / 2);
		const top = centerY - (minHeight / 2);
		const bottom = centerY + (minHeight / 2);
		const viewport = Object.freeze({windowWidth, windowHeight, width, height, centerX, centerY, left, right, top, bottom});

		this._currentData = viewport;
		this._params.onResized(viewport);
	}
	
}