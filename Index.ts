import Config from './Config';
import { App } from './App';
import { Serializer, Methods } from './Serializer';

const method = process.argv[2] as Methods;
const serializer = Serializer.factory(method);
const lines = App.run(Config.targets).map(serializer);

for (const line of lines) {
	console.log(line);
}
