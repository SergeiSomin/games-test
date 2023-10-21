export const randomIntRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
export const zeroPad = (str: string, amount: number) => str.padStart(amount, "0");
export const arrayFill = <T>(amount: number, creator: (index: number) => T) => new Array(amount).fill(0).map(creator);