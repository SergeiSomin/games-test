import { Emitter, upgradeConfig } from "@pixi/particle-emitter";
import { IViewportData } from "../Viewport";
import { BasePage } from "./BasePage";
import { ParticleContainer } from "pixi.js";
import { AssetBundle } from "../loadAssets";

const particleConfig = {
	"alpha": {
		"start": 0.62,
		"end": 0
	},
	"scale": {
		"start": 0.25,
		"end": 0.75,
		"minimumScaleMultiplier": 1
	},
	"color": {
		"start": "#fff191",
		"end": "#ff622c"
	},
	"speed": {
		"start": 500,
		"end": 500,
		"minimumSpeedMultiplier": 1
	},
	"acceleration": {
		"x": 0,
		"y": 0
	},
	"maxSpeed": 0,
	"startRotation": {
		"min": 265,
		"max": 275
	},
	"noRotation": false,
	"rotationSpeed": {
		"min": 50,
		"max": 50
	},
	"lifetime": {
		"min": 0.1,
		"max": 0.75
	},
	"blendMode": "normal",
	"frequency": 0.001,
	"emitterLifetime": -1,
	"maxParticles": 10,
	"pos": {
		"x": 0,
		"y": 0
	},
	"addAtBack": false,
	"spawnType": "circle",
	"spawnCircle": {
		"x": 0,
		"y": 0,
		"r": 10
	}
};

export class ParticlesPage extends BasePage {

	private _particles?: Emitter;
	private _particleContainer: ParticleContainer;

	constructor(assetBundle: AssetBundle) {
		super(assetBundle);
		this._particleContainer = new ParticleContainer();
		this.container.addChild(this._particleContainer);
	}

	show() {
		this._particles = new Emitter(this._particleContainer, upgradeConfig(particleConfig, "fire"));
		this._particles.autoUpdate = true;
		this._particles.emit = true;
	}

	hide() {
		this._particles?.destroy();
	}

	resize({centerX, centerY}: IViewportData): void {
		if(!this._particles) {
			return;
		}

		this._particles.spawnPos.x = centerX;
		this._particles.spawnPos.y = centerY;
	}
}