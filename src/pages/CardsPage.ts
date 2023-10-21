import { Container, Point, Sprite } from "pixi.js";
import { IViewportData } from "../Viewport";
import { BasePage } from "./BasePage";
import { randomRange } from "../utils";


class Card {

	constructor(container: Container) {
		this.createSprite(container);
	}

	private createSprite(container: Container) {
		const sprite = Sprite.from(`d${randomRange(0, 13)}`);
		container.addChild(sprite);
	}

	async move(from: Point, to: Point, time: number) {

	}
}


export class CardsPage extends BasePage {




	resize(viewport: IViewportData): void {
		
	}
}