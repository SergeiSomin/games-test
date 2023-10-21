import { Container, Point, Sprite, Texture } from "pixi.js";
import { IViewportData } from "../Viewport";
import { BasePage } from "./BasePage";
import { arrayFill, randomIntRange, zeroPad } from "../utils";

class Card {

	private _type: string;
	private _sprite: Sprite;

	constructor(container: Container) {
		this._type = "";
		this._sprite = this.createSprite(container);
	}

	private createSprite(container: Container) {
		const sprite = new Sprite();
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

	setType(type: string) {
		this._type = type;
		this._sprite.texture = Texture.from(type);
	}

	getType() {
		return this._type;
	}
}


const DECK_MAX_VISIBLE_CARDS = 7;
const DECK_TOPS_OFFSET = 260;

class Deck {

	private _tops: Sprite;
	private _visibleCards: Card[];

	constructor(container: Container, cards: string[]) {
		this._visibleCards = arrayFill<Card>(DECK_MAX_VISIBLE_CARDS, (index) => this.createCard(container, cards[index]));
		this._tops = Sprite.from("tops");
		container.addChild(this._tops);
		this._tops.anchor.set(0.5, 1);
	}

	private createCard(container: Container, type: string) {
		const card = new Card(container);
		card.setType(type);
		return card;
	}

	setPosition(x: number, y: number) {
		this._tops.x = x;
		this._tops.y = y - DECK_TOPS_OFFSET;
		this._visibleCards.forEach((card, index) => card.setPosition(x, y + index * 20));
	}

	removeCard() {

	}

	addCard() {

	}
}


const DECK_CENTER_OFFSET = 450;

export class CardsPage extends BasePage {

	private _deck1?: Deck;
	private _deck2?: Deck;

	// private _movingCards: Card[];

	private getRandomCardType() {
		return `d${zeroPad(randomIntRange(1, 13).toString(), 2)}`;
	}

	show(): void {
		this._deck1 = new Deck(this.container, arrayFill(144, () => this.getRandomCardType()));
		this._deck2 = new Deck(this.container, arrayFill(144, () => this.getRandomCardType()));

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