import Config from './Config';
import { Meta } from './DB';
import { IModel } from './Model';

export class Integrator implements IModel {
	private readonly models: IModel[];

	public constructor(domainName: string, modelName: string) {
		this.models = Config.suppliers[domainName].map(supplierName => {
			const dsn = [domainName, supplierName, modelName].join('/');
			return this.resolveModel(dsn);
		});
	}

	public all(): IModel[] {
		return this.models.map(model => model.all()).flat();
	}

	public describe(): Meta {
		return this.models[0].describe(); // XXX
	}

	private resolveModel(dsn: string): IModel {
		return require(`./${dsn}`).default;
	}
}
