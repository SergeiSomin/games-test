import { Application, Graphics, Polygon } from "pixi.js";
import { BasePage, LoadPage } from ".";
import { IViewportData } from "../Viewport";

interface IPageSwitcherParams {
	loadPage: LoadPage;
	pages: BasePage[];
	app: Application;
}

export class PageSwitcher {

	private _application: Application;
	private _previousPage?: BasePage;
	private _pages: BasePage[];
	private _currentPageIndex: number = -1;
	private _loadPage: LoadPage;
	private _viewport!: IViewportData;
	private _previousButton: Graphics;
	private _nextButton: Graphics;

	constructor(params: IPageSwitcherParams) {
		this._pages = params.pages;
		this._loadPage = params.loadPage;
		this._application = params.app;

		this._nextButton = this.createNextButton();
		this._previousButton = this.createPreviousButton();
	}

	private async switchPage(nextPage: BasePage) {
		if(this._previousPage) {
			this._previousPage.container.visible = false;
			this._previousPage.hide();
		}
		
		this._loadPage.container.visible = true;
		await nextPage.load((progress: number) => this._loadPage.setProgress(progress));
		this._loadPage.container.visible = false;
		nextPage.container.visible = true;
		nextPage.show();
		nextPage.resize(this._viewport);
		this._previousPage = nextPage;
	}

	private createNextButton() {
		const button = new Graphics();
		this._application.stage.addChild(button);
		button.beginFill(0xffffff);
		button.drawCircle(0, 0, 75);
		button.beginFill(0x000000);
		button.drawShape(new Polygon({x: -20, y: 35}, {x: 35, y: 0}, {x: -20, y: -35}));

		button.eventMode = "static";
		button.cursor = "pointer";

		button.on("pointerdown", () => this.nextPage());

		return button;
	}

	private createPreviousButton() {
		const button = new Graphics();
		this._application.stage.addChild(button);
		button.beginFill(0xffffff);
		button.drawCircle(0, 0, 75);
		button.beginFill(0x000000);
		button.drawShape(new Polygon({x: 20, y: 35}, {x: -35, y: 0}, {x: 20, y: -35}));

		button.eventMode = "static";
		button.cursor = "pointer";

		button.on("pointerdown", () => this.previousPage());
		
		return button;
	}

	nextPage() {
		this._currentPageIndex = (this._currentPageIndex + 1) % this._pages.length;
		const nextPage = this._pages[this._currentPageIndex];
		this.switchPage(nextPage);
	}

	previousPage() {
		this._currentPageIndex = (this._currentPageIndex - 1) >= 0 ? this._currentPageIndex - 1 : this._pages.length - 1;
		const previousPage = this._pages[this._currentPageIndex];
		this.switchPage(previousPage);
	}

	resize(viewport: IViewportData) {
		this._viewport = viewport;
		const {bottom, centerX} = viewport;
		this._nextButton.x = centerX + 350;
		this._nextButton.y = bottom + 100;

		this._previousButton.x = centerX - 350;
		this._previousButton.y = bottom + 100;
	}
}