import { Meta } from './DB';
import { IModel } from './Model';
import { ModelResolver } from './ModelResolver';

export class Integrator implements IModel {
	private readonly models: IModel[];

	public constructor(repoName: string, modelName: string, serviceNames: string[]) {
		this.models = serviceNames.map(serviceName => {
			const dsn = ModelResolver.dsn(repoName, serviceName, modelName);
			return ModelResolver.fromDsn(dsn);
		});
	}

	public all(): IModel[] {
		return this.models.map(model => model.all()).flat();
	}

	public describe(): Meta {
		return this.models[0].describe(); // XXX
	}
}
