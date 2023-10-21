import gsap from "gsap";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { IViewportData } from "../Viewport";
import { BasePage } from "./BasePage";
import { arrayFill, randomIntRange, zeroPad } from "../utils";

const DECK_CENTER_OFFSET_X = 450;
const DECK_CENTER_OFFSET_Y = -250;
const DECK_CARD_MOVE_TIME = 2;
const DECK_CARD_SPAWN_DELAY = 1;
const DECK_MAX_VISIBLE_CARDS = 11;
const DECK_TOPS_OFFSET = 260;
const DECK_COUNTER_OFFSET = DECK_TOPS_OFFSET + 50;
const DECK_CARD_OFFSET = 45;

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
		this._sprite.texture = type ? Texture.from(type) : Texture.EMPTY;
	}

	getType() {
		return this._type;
	}

	isMoving() {
		return this._isMoving;
	}

	setZIndex(zIndex: number) {
		this._sprite.zIndex = zIndex;
	}
}


class Deck {
	private _cardsNumberText: Text;

	private _x: number;
	private _y: number;
	private _tops: Sprite;
	private _visibleCards: Card[];
	private _cards: string[];
	private _cardsNumber: number = 0;
	
	constructor(container: Container) {
		this._visibleCards = arrayFill<Card>(DECK_MAX_VISIBLE_CARDS, () => this.createCard(container, ""));
		this._cardsNumberText = this.createCardsNumberText(container);
		this._tops = this.createTops(container);
		this._cards = [];
		this._x = 0;
		this._y = 0;
		this._cardsNumber = 0;
	}

	private createCardsNumberText(container: Container) {
		const text = new Text("", {fontSize: 32, fill: 0xffffff});
		text.anchor.set(0.5, 1);
		container.addChild(text);
		return text;
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
		const visibleCards = this._cards.slice(-DECK_MAX_VISIBLE_CARDS);

		this._visibleCards.forEach((card) => {
			card.setType("");
		});

		visibleCards.forEach((cardType, index) => {
			this._visibleCards[index].setType(cardType);
			this._visibleCards[index].setPosition(this._x, this._y + index * DECK_CARD_OFFSET);
		});
	}

	private updateCardsCounter() {
		this._cardsNumberText.text = `${this._cards.length} Cards`;
	}

	setPosition(x: number, y: number) {
		this._x = x;
		this._y = y;
		this._cardsNumberText.x = x;
		this._cardsNumberText.y = y - DECK_COUNTER_OFFSET;
		this._tops.x = x;
		this._tops.y = y - DECK_TOPS_OFFSET;
		this._visibleCards.forEach((card, index) => card.setPosition(x, y + index * DECK_CARD_OFFSET));
	}

	increaseCardsNumber() {
		this._cardsNumber += 1;
	}

	getAddPosition() {
		return {
			x: this._x,
			y: Math.min(this._cardsNumber, DECK_MAX_VISIBLE_CARDS) * DECK_CARD_OFFSET
		}
	}

	removeCard() {
		const card = this._cards.pop();

		if(this._cards.length <= 7) {
			this._tops.visible = false;
		}

		this.updateVisibleCards();
		this.updateCardsCounter();

		this._cardsNumber -= 1;

		return card;
	}

	addTopCard(type: string) {
		this._cards.push(type);

		if(this._cards.length > 7) {
			this._tops.visible = true;
		}

		this.updateVisibleCards();
		this.updateCardsCounter();
	}

	getTopCardPosition() {
		const index = Math.min(this._cardsNumber, DECK_MAX_VISIBLE_CARDS) - 1;
		return this._visibleCards[index] ? this._visibleCards[index].getPosition() : {x: this._x, y: this._y};
	}
}


export class CardsPage extends BasePage {

	private _deck1?: Deck;
	private _deck2?: Deck;
	private _movingCards?: Card[];

	private getRandomCardType() {
		return `d${zeroPad(randomIntRange(1, 13).toString(), 2)}`;
	}

	private spawnMovingCard(type: string) {
		const cards = this._movingCards!;
		const card = cards.shift()!;
		cards.push(card);
		cards.forEach((card, index) => card.setZIndex(index * 100));

		card.setType(type);
		return card;
	}

	show(): void {
		super.show();

		this._deck1 = new Deck(this.container);
		this._deck2 = new Deck(this.container);

		const movingCardsContainer = new Container();
		movingCardsContainer.sortableChildren = true;
		this.container.addChild(movingCardsContainer);

		const maxMovingCards = Math.ceil(DECK_CARD_MOVE_TIME / DECK_CARD_SPAWN_DELAY) + 1;
		this._movingCards = arrayFill(maxMovingCards, () => new Card(movingCardsContainer));

		for(let i = 0; i < 144; i++) {
			this._deck1.addTopCard(this.getRandomCardType());
			this._deck1.increaseCardsNumber();
		}

		gsap.delayedCall(DECK_CARD_SPAWN_DELAY, () => this.moveAnimation());
	}

	async moveAnimation() {
		const from = this._deck1!.getTopCardPosition();
		this._deck2!.increaseCardsNumber()
		const to = this._deck2!.getTopCardPosition();
		const cardType = this._deck1!.removeCard();

		if(!cardType) {
			return;
		}

		gsap.delayedCall(DECK_CARD_SPAWN_DELAY, () => this.moveAnimation());

		const card = this.spawnMovingCard(cardType);
		await card.move(from, to, DECK_CARD_MOVE_TIME);
		card.setType("");

		this._deck2?.addTopCard(cardType!);

	}


	resize({centerX, centerY}: IViewportData): void {
		if(this._deck1) {
			this._deck1.setPosition(
				centerX - DECK_CENTER_OFFSET_X,
				centerY + DECK_CENTER_OFFSET_Y
			);
		}

		if(this._deck2) {
			this._deck2.setPosition(
				centerX + DECK_CENTER_OFFSET_X,
				centerY + DECK_CENTER_OFFSET_Y
			);
		}
	}
}