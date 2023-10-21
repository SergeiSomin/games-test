import { Container, Graphics } from "pixi.js";
import { IViewportData } from "../Viewport";
import { BasePage } from "./BasePage";

const PROGRESS_BAR_BACKGROUND_COLOR = 0xffffff;
const PROGRESS_BAR_COLOR = 0x000000;
const PROGRESS_BAR_WIDTH = 450;
const PROGRESS_BAR_HEIGHT = 20;
const PROGRESS_BAR_PADDING = 3;

export class LoadPage extends BasePage {

	private _progressBarBackground: Graphics;
	private _progressBar: Graphics;

	constructor(container: Container) {
		super(container);

		this._progressBarBackground = this.createProgressBarBackground();
		this._progressBar = this.createProgressBar();
	}

	private createProgressBarBackground() {
		const background = new Graphics();
		this.container.addChild(background);

		background.beginFill(PROGRESS_BAR_BACKGROUND_COLOR);
		background.drawRect(
			-PROGRESS_BAR_WIDTH / 2,
			-PROGRESS_BAR_HEIGHT / 2,
			PROGRESS_BAR_WIDTH,
			PROGRESS_BAR_HEIGHT,
		);

		return background;
	}

	private createProgressBar() {
		const bar = new Graphics();
		this.container.addChild(bar);
		return bar;
	}

	setProgress(progress: number) {
		const barWidth = PROGRESS_BAR_WIDTH - (PROGRESS_BAR_PADDING * 2);
		const barHeight = PROGRESS_BAR_HEIGHT - (PROGRESS_BAR_PADDING * 2);

		this._progressBar.clear();
		this._progressBar.beginFill(PROGRESS_BAR_COLOR)
		this._progressBar.drawRect(
			-barWidth/2,
			-barHeight/2,
			barWidth * progress,
			barHeight
		);
	}

	resize({centerX, centerY}: IViewportData): void {
		this._progressBarBackground.x = centerX;
		this._progressBarBackground.y = centerY;

		this._progressBar.x = centerX;
		this._progressBar.y = centerY
	}
}