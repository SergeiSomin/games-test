import { Application } from "pixi.js";
import { BasePage, LoadPage } from ".";
import { Viewport } from "../Viewport";

interface IPageSwitcherParams {
	loadPage: LoadPage;
	viewport: Viewport;
	pages: BasePage[];
	app: Application;
}

export class PageSwitcher {

	private _application: Application;
	private _previousPage?: BasePage;
	private _pages: BasePage[];
	private _currentPageIndex: number = -1;
	private _loadPage: LoadPage;
	private _viewport: Viewport;

	constructor(params: IPageSwitcherParams) {
		this._pages = params.pages;
		this._loadPage = params.loadPage;
		this._viewport = params.viewport;
		this._application = params.app;
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
		nextPage.resize(this._viewport.getCurrent());
		this._previousPage = nextPage;
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
}