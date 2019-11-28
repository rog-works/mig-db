import Config from './Config';
import { IModel } from './Model';
import { Integrator } from './Integrator';

export class App {
	public static run(): IModel[] {
		return new this().main();
	}

	private main(): IModel[] {
		return Config.models.keys().map(domainName => {
			return Config.models[domainName].keys()
				.map(modelName => new Integrator(domainName, modelName));
		}).flat();
	}
}
