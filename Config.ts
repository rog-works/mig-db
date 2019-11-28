import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

interface Config {
	suppliers: {[domain: string]: string[]};
	dbs: {[repo: string]: string};
	models: {[domain: string]: string};
}

function load(): Config {
	const filePath = path.join(process.cwd(), './config.yml');
	return yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'));
}

export default load();
