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

		const tables = this.loadSql(filePath).map(sql => this.parseTable(sql));
		const nameOnTables = Object.assign({}, ...tables.map(table => ({[table.name]: table})));
		this.dbs[filePath] = {
			tables: nameOnTables,
		};
		return this.dbs[filePath];
	}

	private static loadSql(filePath: string): string[] {
		return fs.readFileSync(filePath, 'utf-8').split('\n');
	}

	private static parseTable(sql: string): Table {
		const matches = sql.match(/INSERT INTO `([^`]+)`/);
		if (matches === null) {
			throw Error(`SQL parse error. unexpected sql type. sql = ${sql}`);
		}

		const tableName = matches[1];
		let ast = () => {
			const _asts = new Parser().astify(sql) as AST[];
			const _ast = _asts[0] as Insert_Replace;
			ast = () => _ast;
			return _ast;
		};
		return {
			name: tableName,
			columns: () => this.parseColumns(ast()),
			records: () => this.parseRecords(ast()),
		};
	}

	private static parseColumns(ast: Insert_Replace): string[] {
		if (ast.columns === null) {
			throw Error('SQL parse error. unexpected insert sql. column deffinition is nothing.');
		}

		return ast.columns;
	}

	private static parseRecords(ast: Insert_Replace): Records {
		const columns = ast.columns;
		if (columns === null) {
			throw Error('SQL parse error. unexpected insert sql. column deffinition is nothing.');
		}

		const records: Records = {};
		const idIndex = columns.indexOf('id');
		for (const row of ast.values) {
			const values = row.value as AstValue[];
			const id = values[idIndex].value;
			records[id] = this.parseRecord(columns, ast.values);
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
