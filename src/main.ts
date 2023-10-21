import './style.css'
import { Application, Text } from "pixi.js";
import { IViewportData, Viewport } from './Viewport';
import { BasePage, LoadPage, CardsPage, PageSwitcher, ParticlesPage } from './pages';
import { AssetBundle } from './loadAssets';
import { ToolPage } from './pages/ToolPage';

const APP_WIDTH = 1920;
const APP_HEIGHT = 1080;

const setResize = (app: Application, pages: BasePage[], pageSwitcher: PageSwitcher) => {
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

			pageSwitcher.resize(viewport);
		}
	});
	window.addEventListener("resize", () => viewport.resize());
	viewport.resize();

	return viewport;
}

const createFPSMeter = (app: Application) => {
	const meter = new Text("", {fontSize: 35, fill: 0xffffff});
	app.stage.addChild(meter);
	app.ticker.add(() => {
		meter.text = `FPS: ${app.ticker.FPS.toFixed(2)}`;
	});

	return meter;
}

const init = async () => {
	const app = new Application<HTMLCanvasElement>();
	document.body.appendChild(app.view);

	createFPSMeter(app);

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

	const pageSwitcher = new PageSwitcher({
		pages: [cardsPage, toolPage, particlesPage],
		loadPage: loadPage,
		app: app,
	});

	setResize(app, pages, pageSwitcher);

	pageSwitcher.nextPage();

	window.addEventListener("keypress", ({code}) => {
		if(code == "KeyA") {
			pageSwitcher.previousPage();
		}

		if(code == "KeyD") {
			pageSwitcher.nextPage();
		}
	});
}


init();
