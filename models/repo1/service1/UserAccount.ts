import { Model } from '../../../Model';
import Users from './User';

export class UserAccount extends Model {
	/* @ovdrride */
	protected filename(): string {
		return __filename;
	}

	public get id(): number {
		return this.resolveId(Repo1User);
	}

	public get user_id(): number {
		return Users.find(this.record.user_id).id;
	}
}

export default new UserAccount();
