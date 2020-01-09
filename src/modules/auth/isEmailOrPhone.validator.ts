import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validator} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsEmailOrPhone implements ValidatorConstraintInterface {

  validate(text: string, args: ValidationArguments) {
    const validator = new Validator();
    return validator.isEmail(text) || validator.isMobilePhone(text, 'zh-CN');
    // return text.length > 1 && text.length < 10; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) { // here you can provide default error message if validation failed
    return 'Text ($value) is too short or too long!';
  }

}
