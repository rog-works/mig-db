import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export type Services = {[repo: string]: string[]};
export type DBs = {[repo: string]: string};
export type Models = {[repo: string]: {[model: string]: string}};
export type Targets = {[repo: string]: {[model: string]: string[]}};

interface Config {
	services: Services;
	dbs: DBs;
	models: Models;
	targets: Targets;
}

function load(): Config {
	const filePath = path.join(process.cwd(), './config.yml');
	return yaml.safeLoad(fs.readFileSync(filePath, 'utf-8'));
}

export default load();
