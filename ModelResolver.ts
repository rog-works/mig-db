import { Model } from './Model';

export class ModelResolver {
	public static dsn(repoName: string, serviceName: string, modelName: string): string {
		return [repoName, serviceName, modelName].join('/');
	}

	public static fromDsn(dsn: string): Model {
		return require(`./models/${dsn}`).default;
	}
}
