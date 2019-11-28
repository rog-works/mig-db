import { Model } from '../../../Model';

export class User extends Model {
	/* @ovdrride */
	protected filename(): string {
		return __filename;
	}
}

export default new User();
