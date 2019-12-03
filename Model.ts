import { Record, Meta } from './DB';
import { Repository } from './Repository';

export interface IModel {
	all(): IModel[];
	describe(): Meta;
}

export abstract class Model implements IModel {
	private static __models: {[key: string]: IModel};

	private static instantiate<T extends IModel>(dsn: string, record: Record): T {
		const cacheKey = `${dsn}/${record.id}`;
		if (cacheKey in this.__models) {
			return this.__models[cacheKey] as T;
		}

		const ctor = require(`./${dsn}`).default;
		return Object.assign(new ctor(), {record: () => record});
	}

	protected readonly record: Record;

	public constructor(record?: Record) {
		Object.defineProperty(this, 'record', {
			enumerable: false,
			configurable: true,
			get () { return record; },
		});
	}

	/* @implements */
	public all(): this[] {
		return this.repo().all().map(record => Model.instantiate<this>(this.dsn(), record));
	}

	public find(id: number): this {
		return Model.instantiate<this>(this.dsn(), this.repo().find(id));
	}

	/* @implements */
	public describe(): Meta {
		return this.repo().describe();
	}

	protected abstract dsn(): string;

	private repo(): Repository {
		return Repository.get(this.dsn());
	}
}
