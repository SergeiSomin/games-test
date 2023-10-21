import { Container, Point, Sprite } from "pixi.js";
import { IViewportData } from "../Viewport";
import { BasePage } from "./BasePage";
import { randomIntRange, zeroPad } from "../utils";

class Card {

	private _sprite: Sprite;

	constructor(container: Container) {
		this._sprite = this.createSprite(container);
	}

	private createSprite(container: Container) {
		const sprite = Sprite.from(`d${zeroPad(randomIntRange(0, 13).toString(), 2)}`);
		sprite.anchor.set(0.5);
		container.addChild(sprite);
		return sprite;
	}

	async move(from: Point, to: Point, time: number) {

	}

	setPosition(x: number, y: number) {
		this._sprite.x = x;
		this._sprite.y = y;
	}
}

class Deck {

	private _visibleCards: Card[];

	constructor(container: Container) {
		this._visibleCards = [
			new Card(container),
			new Card(container),
			new Card(container),
			new Card(container)
		];
	}

	setPosition(x: number, y: number) {
		this._visibleCards.forEach((card, index) => card.setPosition(x, y + index * 50));
	}
}


const DECK_CENTER_OFFSET = 450;

export class CardsPage extends BasePage {

	private _deck1?: Deck;
	private _deck2?: Deck;

	show(): void {
		this._deck1 = new Deck(this.container);
		this._deck2 = new Deck(this.container);

		super.show();
	}

	resize({centerX, centerY}: IViewportData): void {
		if(this._deck1) {
			this._deck1.setPosition(centerX - DECK_CENTER_OFFSET, centerY);
		}

		if(this._deck2) {
			this._deck2.setPosition(centerX + DECK_CENTER_OFFSET, centerY);
		}
	}
}