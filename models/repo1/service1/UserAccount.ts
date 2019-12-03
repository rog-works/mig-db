import { UserAccount as Base } from '../../../bases/repo1/service1/UserAccount';
import Users from './User';

export class UserAccount extends Base {
	public get id(): number {
		return this.resolveId(Repo1User);
	}

	public get user_id(): number {
		return Users.find(this.record.user_id).id;
	}
}

export default new UserAccount();
