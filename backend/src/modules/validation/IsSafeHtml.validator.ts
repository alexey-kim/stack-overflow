import { registerDecorator, type ValidationArguments, type ValidationOptions, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator';
import sanitizeHtml from 'sanitize-html';

@ValidatorConstraint({ name: 'isSafeHtml', async: false })
export class IsSafeHtmlConstraint implements ValidatorConstraintInterface {
  validate(unsafeHtml: unknown, args: ValidationArguments) {
    if (typeof unsafeHtml !== 'string') {
      return false;
    }

    // Sanitize unsafe HTML
    const sanitizedHtml: string | undefined = sanitizeHtml(unsafeHtml, {
      allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'li', 'ol', 'code'],
      allowedAttributes: { a: ['href', 'title', 'target'] },
      allowedSchemes: ['http', 'https'],
    }).trim();

    // If HTML is valid then set the sanitized HTML back to the original value
    if (unsafeHtml.trim() === sanitizedHtml) {
      (args.object as any)[args.property] = sanitizedHtml;
      return true;
    }

    return false;
  }

  defaultMessage() {
    return 'HTML content is not safe';
  }
}

/** Custom validator to check that content HTML does not contain dangerous tags/elements */
export const IsSafeHtml = (validationOptions: ValidationOptions = {}) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSafeHtmlConstraint,
    });
  };
};
