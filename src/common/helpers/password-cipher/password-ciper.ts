import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

/**
 * A cipher which uses bcrypt (https://en.wikipedia.org/wiki/Bcrypt) to hash plaintext password strings.
 */
@Injectable()
export class PasswordCiper {
    public hash(plaintext: string): Promise<string> {
        return bcrypt.hash(plaintext, SALT_ROUNDS);
    }

    public check(plaintext: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plaintext, hash);
    }
}
