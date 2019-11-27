import fs from 'fs';
import { Parser } from 'node-sql-parser';
import './extentions';
import { Config } from './Config';

type Field = any; // XXX null | number | string;

interface Record {
	[column: string]: Field;
}

type Records = {[id: number]: Record};

interface Table {
	name: string;
	columns: string[];
	records: Records;
}

type Tables = {[name: string]: Table};

interface Meta {
	table: string;
	columns: string[];
}

interface DB {
	dsn: string;
	tables: Tables;
}

type DBs = {[dsn: string]: DB};

class Loader {
	private static readonly dbs: DBs;

	public static load(dsn: string): DB {
		if (dsn in this.dbs) {
			return this.dbs[dsn];
		}

		const tables = this.loadSql(Config.dbs(dsn)).map(this.parse);
		const nameOnTables = Object.assign({}, ...tables.map(table => ({[table.name]: table})));
		this.dbs[dsn] = {
			dsn: dsn,
			tables: nameOnTables,
		};
		return this.dbs[dsn];
	}

	private static loadSql(dsn: string): string[] {
		return fs.readFileSync(Config.dbs(dsn), 'utf-8').split('\n');
	}

	private static parse(sql: string): Table {
		const ast = new Parser().astify(sql);
		const records = ast.values.map(vals => this.parseRecord(ast.columns, vals));
		const idOnRecords = Object.assign({}, ...records.map(record => ({[record.id]: record})));
		return {
			name: ast.table,
			columns: ast.columns,
			records: idOnRecords,
		};
	}

	private static parseRecord(columns: string[], values: Field[]): Record {
		const fields = columns.map((column, index) => ({[column]: values[index]}));
		return Object.assign({}, ...fields);
	}
}

export {
	DB,
	Loader,
	Field,
	Record,
	Table,
	Meta,
}
