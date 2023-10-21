import './style.css'
import { Application, Assets } from "pixi.js";
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
	viewport.resize()
	window.addEventListener("resize", () => viewport.resize());
}

const switchPage = async (loadPage: LoadPage, nextPage: BasePage, previousPage?: BasePage) => {

	if(previousPage) {
		previousPage.hide();
		await previousPage.unload();
	}
	
	loadPage.show();
	await nextPage.load((progress: number) => loadPage.setProgress(progress));
	loadPage.hide();
	nextPage.show();
}

const init = async () => {
	const app = new Application<HTMLCanvasElement>();
	document.body.appendChild(app.view);

	const loadPage = new LoadPage(app.stage);
	const cardsPage = new CardsPage(app.stage, AssetBundle.CARDS);
	const toolPage = new ToolPage(app.stage, AssetBundle.MIX_TOOL);
	const particlesPage = new ParticlesPage(app.stage, AssetBundle.PARTICLES);

	const pages = [
		loadPage,
		cardsPage,
		toolPage,
		particlesPage
	];

	setResize(app, pages);

	await switchPage(loadPage, cardsPage);
}


init();
