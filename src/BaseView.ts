import { IViewportData } from "./Viewport";

export abstract class BaseView {
	abstract resize(viewportData: IViewportData): void;
}