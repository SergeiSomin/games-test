import './style.css'
import { Application } from "pixi.js";
import { IViewportData, Viewport } from './Viewport';
import { BasePage, LoadPage, CardsPage,  } from './pages';
import { AssetBundle } from './loadAssets';
import { ToolPage } from './pages/ToolPage';
import { ParticlesPage } from './pages/ParticlesPage';

const APP_WIDTH = 1920;
const APP_HEIGHT = 1080;

const setResize = (app: Application, pages: BasePage[]) => {
	const viewport = new Viewport({
		width: APP_WIDTH,
		height: APP_HEIGHT,
		onResized: (viewport: IViewportData) => {
			const {windowWidth, windowHeight, width, height} = viewport;
			app.renderer.view.style!.width = `${windowWidth}px`;
			app.renderer.view.style!.height = `${windowHeight}px`;
			window.scrollTo(0, 0);
			app.renderer.resize(width, height);

			pages.forEach((page) => {
				page.resize(viewport);
			});
		}
	});
	window.addEventListener("resize", () => viewport.resize());
	viewport.resize();

	return viewport;
}

interface ISwitchPageParams {
	loadPage: LoadPage;
	nextPage: BasePage;
	viewport: Viewport;
	previousPage?: BasePage
}
const switchPage = async (params: ISwitchPageParams) => {
	const {loadPage, nextPage, viewport, previousPage} = params;

	if(previousPage) {
		previousPage.hide();
		await previousPage.unload();
	}
	
	loadPage.show();
	await nextPage.load((progress: number) => loadPage.setProgress(progress));
	loadPage.hide();
	nextPage.show();
	nextPage.resize(viewport.getCurrent());
}

const init = async () => {
	const app = new Application<HTMLCanvasElement>();
	document.body.appendChild(app.view);

	const loadPage = new LoadPage();
	const cardsPage = new CardsPage(AssetBundle.CARDS);
	const toolPage = new ToolPage(AssetBundle.MIX_TOOL);
	const particlesPage = new ParticlesPage(AssetBundle.PARTICLES);

	const pages = [
		loadPage,
		cardsPage,
		toolPage,
		particlesPage
	];
	pages.forEach((page) => app.stage.addChild(page.container));

	const viewport = setResize(app, pages);
	await switchPage({
		loadPage,
		viewport,
		nextPage: cardsPage
	});
}


init();
