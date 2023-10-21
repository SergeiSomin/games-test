import gsap from "gsap";
import { Container, IPoint, Point, Sprite, Texture } from "pixi.js";
import { IViewportData } from "../Viewport";
import { BasePage } from "./BasePage";
import { arrayFill, randomIntRange, zeroPad } from "../utils";

class Card {

	private _isMoving: boolean;
	private _type: string;
	private _sprite: Sprite;

	constructor(container: Container) {
		this._type = "";
		this._isMoving = false;
		this._sprite = this.createSprite(container);
	}

	private createSprite(container: Container) {
		const sprite = new Sprite();
		sprite.anchor.set(0.5);
		container.addChild(sprite);
		return sprite;
	}

	async move(from: {x: number; y: number}, to: {x: number; y: number}, time: number) {
		this._isMoving = true;

		await gsap.fromTo(this._sprite, {x: from.x, y: from.y}, {
			x: to.x,
			y: to.y,
			duration: time,
		});

		this._isMoving = false;
	}

	setPosition(x: number, y: number) {
		this._sprite.x = x;
		this._sprite.y = y;
	}

	getPosition() {
		return {x: this._sprite.x, y: this._sprite.y};
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

	isMoving() {
		return this._isMoving;
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

	getTopCardPosition() {
		return this._visibleCards[this._visibleCards.length - 1].getPosition();
	}
}


const DECK_CENTER_OFFSET = 450;
const DECK_CARD_MOVE_TIME = 2;
const DECK_CARD_MOVE_DELAY = 1;

export class CardsPage extends BasePage {

	private _deck1?: Deck;
	private _deck2?: Deck;
	private _movingCards?: Card[];

	private getRandomCardType() {
		return `d${zeroPad(randomIntRange(1, 13).toString(), 2)}`;
	}

	show(): void {
		super.show();

		this._deck1 = new Deck(this.container);
		this._deck2 = new Deck(this.container);

		const maxMovingCards = Math.ceil(DECK_CARD_MOVE_TIME / DECK_CARD_MOVE_DELAY);
		this._movingCards = arrayFill(maxMovingCards, () => new Card(this.container));

		for(let i = 0; i < 144; i++) {
			this._deck1.addCard(this.getRandomCardType());
		}

		this.startAnimation();
	}

	async moveAnimation() {
		const from = this._deck1!.getTopCardPosition();
		const to = this._deck2!.getTopCardPosition();
		const cardType = this._deck1!.removeCard();

		if(!cardType) {
			return;
		}

		const card = this._movingCards?.find((card: Card) => !card.isMoving())!;
		card.setType(cardType);
		await card.move(from, to, DECK_CARD_MOVE_TIME);
		card.setType("");

		this._deck2?.addCard(cardType!);
	}

	startAnimation() {
		this.moveAnimation();
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