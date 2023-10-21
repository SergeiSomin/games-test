import { AssetBundle, loadAssets, unloadAssets } from '../loadAssets';
import { IViewportData } from "../Viewport";

export abstract class BasePage {

	private _assetsLoaded: boolean = false;
	private _assetBundle?: AssetBundle;

	constructor(assetBundle?: AssetBundle) {
		this._assetBundle = assetBundle;
	}

	async load() {
		if(this._assetsLoaded && this._assetBundle) {
			return;
		}

		await loadAssets(this._assetBundle!);
		this._assetsLoaded = true;
	}

	async unload() {
		if(!this._assetsLoaded && this._assetBundle) {
			return;
		}

		this._assetsLoaded = false;
		unloadAssets(this._assetBundle!);
	}

	abstract resize(viewport: IViewportData): void;

	abstract show(): void;

	abstract hide(): void;
}
