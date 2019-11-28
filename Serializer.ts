import { IModel } from './Model';

export type Methods = 'json' | 'sql';

export class Serializer {
	public static exec(method: Methods, model: IModel) {
		if (method === 'json') {
			return this.jsonify(model);
		} else if (method === 'sql') {
			return this.sqlify(model);
		} else {
			throw Error(`Serialize error. unknown method. method = ${method}`);
		}
	}

	public static jsonify(model: IModel): string {
		return new JsonSerializer(model).toString();
	}

	public static sqlify(model: IModel): string {
		return new SqlSerializer(model).toString();
	}
}

class JsonSerializer {
	public constructor(
		private readonly model: IModel
	) {}

	public toString(): string {
		return JSON.stringify({[this.model.describe().table]: this.model.all()});
	}
}

class SqlSerializer {
	public constructor(
		private readonly model: IModel
	) {}

	public toString(): string {
		return ''; // TODO impl
	}
}
