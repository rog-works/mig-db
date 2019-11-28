import { DB, Loader, Record, Table, Meta } from './DB';

export class Repository {
	public static get(dsn: string): Repository {
		const matches = dsn.match(/table=([^;]+)/);
		if (matches === null) {
			throw Error(`DSN parse error. table deffinition is nothing. dsn = ${dsn}`);
		}

		const tableName = matches[1];
		const db = Loader.load(dsn);
		return new this(db, tableName);
	}

	public constructor(
		private readonly db: DB,
		private readonly tableName: string
	) {}

	public all(): Record[] {
		return this.table.records().values();
	}

	public find(id: number): Record {
		return this.table.records()[id];
	}

	public describe(): Meta {
		return {
			table: this.table.name,
			columns: this.table.columns(),
		}
	}

	private get table(): Table {
		return this.db.tables[this.tableName];
	}
}
