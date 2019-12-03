import { Model } from '../../../Model';

export class UserAccount extends Model {
	protected dsn(): string {
		return 'repo1/service1/UserAccount';
	}
}

export default new UserAccount();
