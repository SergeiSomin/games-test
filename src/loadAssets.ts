import { Assets } from "pixi.js";

export enum AssetBundle {
	CARDS = "cards",
	MIX_TOOL = "mix-tool",
	PARTICLES = "particles"
}

export const loadAssets = async (bundle: AssetBundle, onProgress?: (progress: number) => void) => {
	const response = await fetch("manifest.json");
    const manifest = await response.json();
	await Assets.init({manifest});
	await Assets.loadBundle(bundle, onProgress);
}

export const unloadAssets = async (bundle: AssetBundle) => {
	await Assets.unloadBundle(bundle);
}