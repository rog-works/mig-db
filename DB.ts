import * as fs from 'fs';
import { Parser, AST, Insert_Replace } from 'node-sql-parser';
import './extentions';

type Field = any; // XXX null | number | string;

interface AstValue {
	type: string;
	value: Field;
}

interface Record {
	[column: string]: Field;
}

type Records = {[id: number]: Record};

interface Table {
	name: string;
	columns: () => string[];
	records: () => Records;
}

type Tables = {[name: string]: Table};

interface Meta {
	table: string;
	columns: string[];
}

interface DB {
	tables: Tables;
}

type DBs = {[dsn: string]: DB};

class Loader {
	private static readonly dbs: DBs;

	public static load(filePath: string): DB {
		if (filePath in this.dbs) {
			return this.dbs[filePath];
		}

		const nameOnSqls = this.loadSqls(filePath);
		const tables = nameOnSqls.keys().map(tableName => this.parseTable(tableName, nameOnSqls[tableName]));
		const nameOnTables = Object.assign({}, ...tables.map(table => ({[table.name]: table})));
		this.dbs[filePath] = {
			tables: nameOnTables,
		};
		return this.dbs[filePath];
	}

	private static loadSqls(filePath: string): {[tableName: string]: string[]} {
		const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
		const sqls: {[tableName: string]: string[]} = {};
		for (const line of lines) {
			const matches = line.match(/(INSERT INTO|LOCK TABLE) `([^`]+)`/);
			if (matches === null) {
				continue;
			}

			const tableName = matches[1];
			if (!(tableName in sqls)) {
				sqls[tableName] = [];
			}

			sqls[tableName].push(line);
		}
		return sqls;
	}

	private static parseTable(tableName: string, sqls: string[]): Table {
		let astsFactory = () => {
			return sqls.filter(sql => {
				return /^INSERT INTO/.test(sql);
			})
			.map(sql => {
				const _asts = new Parser().astify(sql) as AST[];
				return _asts[0] as Insert_Replace;
			});
		};
		let asts: Insert_Replace[] | null = null;
		let columns: string[] | null = null;
		let records: Records | null = null;
		return {
			name: tableName,
			columns: () => columns || (columns = this.parseColumns(asts || (asts = astsFactory()))),
			records: () => records || (records = this.parseRecords(asts || (asts = astsFactory()))),
		};
	}

	private static parseColumns(asts: Insert_Replace[]): string[] {
		const ast = asts[0];
		if (ast.columns === null) {
			throw Error('SQL parse error. unexpected insert sql. column deffinition is nothing.');
		}

		return ast.columns;
	}

	private static parseRecords(asts: Insert_Replace[]): Records {
		const records: Records = {};
		for (const ast of asts) {
			const columns = ast.columns;
			if (columns === null) {
				throw Error('SQL parse error. unexpected insert sql. column deffinition is nothing.');
			}

			const idIndex = columns.indexOf('id');
			for (const index in ast.values) {
				const row = ast.values[index];
				const values = row.value as AstValue[];
				const id = idIndex !== -1 ? values[idIndex].value : index;
				records[id] = this.parseRecord(columns, ast.values);
			}
		}

		return records;
	}

	private static parseRecord(columns: string[], values: AstValue[]): Record {
		const fields = columns.map((column, index) => ({[column]: values[index].value}));
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
