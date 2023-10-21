import './style.css'
import { Application, Assets } from "pixi.js";

import { AssetBundle, loadAssets, unloadAssets } from './loadAssets';


const init = async () => {
	const app = new Application<HTMLCanvasElement>();
	document.body.appendChild(app.view);

	await loadAssets(AssetBundle.CARDS);
	console.log(Assets.cache.get("d01"));

	await unloadAssets(AssetBundle.CARDS);
	console.log(Assets.cache.get("d01"));
}


init();
