export {};

declare global {
	interface Object {
		keys(): string[];
		values(): any[];
	}
}

Object.prototype.keys = () => {
	return Object.keys(this);
}

Object.prototype.values = () => {
	return Object.keys(this).map(key => this[key]);
}
