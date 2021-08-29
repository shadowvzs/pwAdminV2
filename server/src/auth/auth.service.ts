import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from 'src/users/dto/User.dto';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto';
import { User } from 'src/users/entity/user.entity';
import { entity2Dto } from 'src/users/converters/entity2Dto';
import { LoginDto } from 'src/users/dto/Login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<UserDto> {
    const user = await this.usersService.findOne(username, 'name');
    if (user && await user.comparePassword(pass)) {
      return entity2Dto(user);
    }
    return null;
  }

  async register(createUserDto: CreateUserDto, ip: string): Promise<User> {
    const user = Object.assign(new User(), {
      name: createUserDto.username,
      email: createUserDto.email,
      idnumber: ip
    });
    user.setPassword(createUserDto.password);
    const savedUser = await this.usersService.create(user);
    const payload = { username: savedUser.name, sub: savedUser.id };
    savedUser.access_token = this.jwtService.sign(payload);
    return savedUser;
  }

  async login(loginDto: LoginDto): Promise<User | null> {
    const res = await this.usersService.findOne(loginDto.username, 'name');
    const user = Object.assign<User, User>(new User, res);
    const isValid = await user.comparePassword(loginDto.password);
    if (!isValid) { return null; }
    return user;
  }
}


/*
    $Salt = "0x".md5($name.$password);
		$statement = $link->prepare("SELECT passwd FROM users WHERE name=?");
		$statement->bind_param('s', $name);
		$statement->execute();
		$statement->bind_result($p2);
		$statement->store_result();
		$count = $statement->num_rows;
		if($count==1){
			while($statement->fetch()) {
				$p2=addslashes($p2);
				$rs=mysqli_query($link,"SELECT fn_varbintohexsubstring (1,'$p2',1,0) AS result");
				$GetResult=mysqli_fetch_array($rs, MYSQLI_BOTH);
				$CheckPassword = $GetResult['result'];
				if ($CheckPassword==$Salt){
					return true;
					exit;
				}
			}
		}	
		$statement->close();	
*/