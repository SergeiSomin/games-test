import './style.css'
import { Application } from "pixi.js";
import { IViewportData, Viewport } from './Viewport';
import { CardsPage } from './pages';
import { AssetBundle } from './loadAssets';
import { ToolPage } from './pages/ToolPage';
import { ParticlesPage } from './pages/ParticlesPage';
import { LoadPage } from './pages/LoadPage';

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

	const viewport = new Viewport({
		width: 1920,
		height: 1080,
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



	// await loadAssets(AssetBundle.CARDS);
	// console.log(Assets.cache.get("d01"));

	// await unloadAssets(AssetBundle.CARDS);
	// console.log(Assets.cache.get("d01"));
}


init();
