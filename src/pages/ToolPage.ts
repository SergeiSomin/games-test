import { Container, ITextStyle } from "pixi.js";
import { IViewportData } from "../Viewport";
import { BasePage } from "./BasePage";


type RowItemSprite = { type: "sprite", data: string};
type RowItemText = {type: "text", data: {text: string, style: Partial<ITextStyle>}};

type RowItem = RowItemSprite | RowItemText;

class SpriteNumberRow {
	constructor(container: Container, items: RowItem[]) {

	}
}

export class ToolPage extends BasePage {

	resize(viewport: IViewportData): void {

	}
}