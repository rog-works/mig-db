import { IModel } from './Model';

export type Methods = 'json' | 'sql';

export class Serializer {
	public static factory(method: Methods) {
		if (method === 'json') {
			return JsonSerializer.toString;
		} else if (method === 'sql') {
			return SqlSerializer.toString;
		} else {
			throw Error(`Serialize error. unknown method. method = ${method}`);
		}
	}
}

class JsonSerializer {
	public static toString(model: IModel): string {
		return JSON.stringify({[model.describe().table]: model.all()});
	}
}

class SqlSerializer {
	public static toString(model: IModel): string {
		return ''; // TODO impl
	}
}
