import './extentions/Object';
import { Targets } from './Config';
import { IModel } from './Model';
import { Integrator } from './Integrator';

export class App {
	public static run(targets: Targets): IModel[] {
		return new this().main(targets);
	}

	private main(targets: Targets): IModel[] {
		return targets.keys().map(repoName => {
			const models = targets[repoName];
			return models.keys().map(modelName => new Integrator(repoName, modelName, models[modelName]));
		}).flat();
	}
}
