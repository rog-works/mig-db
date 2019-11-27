import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

class _Config {
	private static __config: null | Config;

	public static get config(): Config {
		if (this.__config !== null) {
			return 
		}

		const filePath = path.join(process.cwd(), './config.yml');
		this.__config = yaml.safeLoad(fs.readFileSync(filePath, 'utf-8')) as Config;
		return this.__config;
	}
}

const Config = _Config.config;

export {
	Config,
}
