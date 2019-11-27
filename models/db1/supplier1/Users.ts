import { Model } from '../../../Model';

export class User extends Model {
	/* @ovdrride */
	public static get dsn(): string {
		return 'models/db1/supplier1/users';
	}
}
