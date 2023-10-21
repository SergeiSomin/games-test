import gsap from "gsap";
import { Container, ITextStyle, Text, Sprite, Texture, DisplayObject } from "pixi.js";
import { IViewportData } from "../Viewport";
import { BasePage } from "./BasePage";
import { arrayFill, randomIntRange } from "../utils";

const TOOL_ITEM_NUMBER = 3;
const TOOL_ITEM_GAP = 10;

type RowItemSprite = { type: "sprite", data: string };
type RowItemText = { type: "text", data: {text: string, style: Partial<ITextStyle>} };

type RowItem = RowItemSprite | RowItemText;

type SpriteTextRowLayout = { width: number, offsets: number[], items: DisplayObject[] };
class SpriteTextRow {

	private _x: number = 0;
	private _y: number = 0;
	private _spriteItems: Sprite[];
	private _textItems: Text[];
	private _layout: SpriteTextRowLayout;

	constructor(container: Container, itemsNumber: number) {
		this._spriteItems = arrayFill(itemsNumber, () => this.createSpriteItem(container));
		this._textItems = arrayFill(itemsNumber, () => this.createTextItem(container));
		this._layout = {width: 0, offsets: [], items: []};
	}

	private createSpriteItem(container: Container) {
		const sprite = new Sprite();
		sprite.anchor.set(0, 0.5);
		sprite.visible = false;
		container.addChild(sprite);
		return sprite;
	}

	private createTextItem(container: Container) {
		const text = new Text();
		text.anchor.set(0, 0.5);
		text.visible = false;
		container.addChild(text);
		return text;
	}

	private clearItems() {
		this._spriteItems.forEach(item => {
			item.visible = false;
		});

		this._textItems.forEach(item => {
			item.visible = false;
		});
	}

	private applyLayout(layout: SpriteTextRowLayout, x: number, y: number) {
		const halfWidth = layout.width / 2;
		for(let i = 0; i < layout.items.length; i++) {
			const item = this._layout.items[i];
			const offset = this._layout.offsets[i];
			item.x = x - halfWidth + offset;	
			item.y = y;
		}
	}

	setItems(items: RowItem[]) {
		this.clearItems();

		const layoutData = {width: 0, offsets: [], items: []};

		items.reduce((layout: SpriteTextRowLayout, itemData: RowItem, index: number) => {
			if(itemData.type === "sprite") {
				this._spriteItems[index].texture = Texture.from(itemData.data);
				this._spriteItems[index].visible = true;
				layout.offsets.push(layout.width);
				layout.width += this._spriteItems[index].width + TOOL_ITEM_GAP;
				layout.items.push(this._spriteItems[index]);
				return layout;
			} else {
				this._textItems[index].text = itemData.data.text;
				this._textItems[index].style = itemData.data.style;
				this._textItems[index].visible = true;
				layout.offsets.push(layout.width);
				layout.width += this._textItems[index].width + TOOL_ITEM_GAP;
				layout.items.push(this._textItems[index]);
				return layout;
			}
		},  layoutData);

		this._layout = layoutData;
		this.applyLayout(this._layout, this._x, this._y);
	}

	setPosition(x: number, y: number) {
		this._x = x;
		this._y = y;
		this.applyLayout(this._layout, this._x, this._y);
	}
}

export class ToolPage extends BasePage {

	private _row?: SpriteTextRow;
	private _tween?: gsap.core.Tween;

	private getRandomItem(): RowItem {
		if(Math.random() > 0.5) {
			const sprites = ["book", "chest", "coin"];
			const randomSprite = sprites[Math.floor(Math.random() * sprites.length)];

			return {
				type: "sprite",
				data: randomSprite
			}
		} else {
			const words = ["some", "random", "words"];
			const randomWords = arrayFill(3, () => words[Math.floor(Math.random() * words.length)]).join(" ");
			const randomFontSize = randomIntRange(12, 55);

			return {
				type: "text",
				data: {
					text: randomWords,
					style: {
						fontSize: randomFontSize,
						fill: 0xffffff,
					}
				}
			}
		}
	}

	private changeItems(row: SpriteTextRow) {
		row.setItems(arrayFill(TOOL_ITEM_NUMBER, () => this.getRandomItem()))
		this._tween = gsap.delayedCall(2, () => this.changeItems(row));
	}

	show() {
		this._row = new SpriteTextRow(this.container, TOOL_ITEM_NUMBER);
		this.changeItems(this._row!);
		this._tween = gsap.delayedCall(2, () => this.changeItems(this._row!));
	}

	hide() {
		if(!this._tween) {
			return;
		}

		this._tween.kill();
	}

	resize({centerX, centerY}: IViewportData): void {
		if(!this._row) {
			return;
		}
		this._row.setPosition(centerX, centerY);
	}
}