import { UserDto } from "../dto/User.dto";
import { User } from "../entity/user.entity";

export const entity2Dto = (user: User): UserDto => Object.assign<UserDto, UserDto>(new UserDto(), {
    id: user.id,
    fullname: user.truename,
    username: user.name,
    role: user.role,
    refresh_token: user.refresh_token,
    online: user.online,
    gm: user.gm,
});