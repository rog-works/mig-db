import { App } from './App';
import { Serializer, Methods } from './Serializer';

const method = process.argv[2] as Methods;

App.run()
	.map(model => Serializer.exec(method, model))
	.forEach(console.log)
