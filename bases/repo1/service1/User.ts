import { Record } from '../../../DB';
import { Model } from '../../../Model';

export class User extends Model {
	public readonly id: number;

	public constructor(record? :Record) {
		super(record);
		this.id = record !== undefined && ('id' in record) ? record.id : 0;
	}

	protected dsn(): string {
		return 'repo1/service1/User';
	}
}

export default new User();
