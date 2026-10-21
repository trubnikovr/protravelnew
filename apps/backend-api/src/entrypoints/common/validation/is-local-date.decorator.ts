import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';
import { LocalDateValueObject } from '@shared/domain/value-objects';

export function IsLocalDate(validationOptions?: ValidationOptions) {
  return (target: object, propertyName: string): void => {
    registerDecorator({
      name: 'isLocalDate',
      target: target.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'string') return false;
          try {
            LocalDateValueObject.create(value);
            return true;
          } catch {
            return false;
          }
        },
        defaultMessage(arguments_: ValidationArguments): string {
          return `${arguments_.property} must be a valid calendar date in YYYY-MM-DD format`;
        },
      },
    });
  };
}
