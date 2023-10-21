import gsap from "gsap";
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

		if(type) {
			this._sprite.visible = true;
			this._sprite.texture = Texture.from(type);
		} else {
			this._sprite.visible = false;
		}
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
	private _cards: string[];

	constructor(container: Container) {
		this._visibleCards = arrayFill<Card>(DECK_MAX_VISIBLE_CARDS, () => this.createCard(container, ""));
		this._tops = this.createTops(container);
		this._cards = [];
	}

	private createCard(container: Container, type: string) {
		const card = new Card(container);
		card.setType(type);
		return card;
	}

	private createTops(container: Container,) {
		const tops = Sprite.from("tops");
		container.addChild(tops);
		tops.anchor.set(0.5, 1);
		tops.visible = false;
		return tops;
	}

	private updateVisibleCards() {
		this._cards
			.slice(-DECK_MAX_VISIBLE_CARDS)
			.forEach((cardType, index) => this._visibleCards[index].setType(cardType));
	}

	setPosition(x: number, y: number) {
		this._tops.x = x;
		this._tops.y = y - DECK_TOPS_OFFSET;
		this._visibleCards.forEach((card, index) => card.setPosition(x, y + index * 20));
	}

	removeCard() {
		const card = this._cards.pop();

		if(this._cards.length <= 7) {
			this._tops.visible = false;
		}

		this.updateVisibleCards();

		return card;
	}

	addCard(type: string) {
		this._cards.push(type);

		if(this._cards.length > 7) {
			this._tops.visible = true;
		}

		this.updateVisibleCards();
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
		this._deck1 = new Deck(this.container);
		this._deck2 = new Deck(this.container);


		for(let i = 0; i < 144; i++) {
			this._deck1.addCard(this.getRandomCardType());
		}

		super.show();

		this.startAnimation();
	}

	startAnimation() {
		const cardType = this._deck1?.removeCard();
		this._deck2?.addCard(cardType!);
		gsap.delayedCall(1, () => this.startAnimation());
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