import './extentions/Object';
import { DB, Loader, Record, Table, Meta } from './DB';

export class Model {
	public static get dsn(): string {
		return '';
	}

	public static all<T>(): T[] {
		return this.repo.all() as T[];
	}

	public static find<T>(id: number): T {
		return this.repo.find(id) as T;
	}

	public static describe(): Meta {
		return this.repo.describe();
	}

	private static get repo(): Repository {
		return Repository.resolve(this.dsn);
	}
}

export class Repository {
	public static resolve(dsn: string): Repository {
		const tableName = dsn.match(/table=([^;]+)/)[1];
		const db = Loader.load(dsn);
		return new this(db, tableName);
	}

	public constructor(
		private readonly db: DB,
		private readonly tableName: string
	) {}

	public all(): Record[] {
		return this.table.records.values();
	}

	public find(id: number): Record {
		return this.table.records[id];
	}

	public describe(): Meta {
		return {
			table: this.table.name,
			columns: this.table.columns,
		}
	}

	private get table(): Table {
		return this.db.tables[this.tableName];
	}
}

