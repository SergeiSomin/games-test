import { Container } from 'pixi.js';
import { AssetBundle, loadAssets, unloadAssets } from '../loadAssets';
import { IViewportData } from "../Viewport";

export abstract class BasePage {

	public container: Container;

	private _assetsLoaded: boolean = false;
	private _assetBundle?: AssetBundle;

	constructor(assetBundle?: AssetBundle) {
		this._assetBundle = assetBundle;
		this.container = new Container();
	}

	async load(onProgress?: (progress: number) => void) {
		if(!this._assetBundle) {
			return;
		}

		if(this._assetsLoaded) {
			return;
		}

		await loadAssets(this._assetBundle!, onProgress);
		this._assetsLoaded = true;
	}

	async unload() {
		if(!this._assetBundle) {
			return;
		}

		if(!this._assetsLoaded) {
			return;
		}

		this._assetsLoaded = false;
		unloadAssets(this._assetBundle!);
	}

	abstract resize(viewport: IViewportData): void;
	abstract show(): void;
	abstract hide(): void;
}
