import { Record, Meta } from './DB';
import { Repository } from './Repository';

export interface IModel {
	all(): IModel[];
	describe(): Meta;
}

export abstract class Model implements IModel {
	private static instantiate<T>(dsn: string, record: Record): T {
		const ctor = require(`./${dsn}`).default;
		return Object.assign(new ctor(), {record: () => record});
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

	protected record(): Record {
		return {}; // XXX
	}

	protected abstract filename(): string;

	private dsn(): string {
		return this.filename().split('/').slice(-3).join('/').split('.')[0];
	}

	private repo(): Repository {
		return Repository.get(this.dsn());
	}
}
