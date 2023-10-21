import { Container } from 'pixi.js';
import { AssetBundle, loadAssets, unloadAssets } from '../loadAssets';
import { IViewportData } from "../Viewport";

export abstract class BasePage {

	protected container: Container;

	private _assetsLoaded: boolean = false;
	private _assetBundle?: AssetBundle;

	constructor(container: Container, assetBundle?: AssetBundle) {
		this.container = container;
		this._assetBundle = assetBundle;
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

	show(): void {
		this.container.visible = true;
	}

	hide(): void {
		this.container.visible = false
	}
}
