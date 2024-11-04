import { validate, type ValidationError } from 'class-validator';
import { IsSafeHtml } from './IsSafeHtml.validator';

class TestClass {
  constructor(content: string) {
    this.html = content;
  }

  @IsSafeHtml({ message: 'HTML content is not safe' })
  html: string;
}

describe('IsSafeHtml Validator', () => {
  it('should validate safe HTML and sanitize it', async () => {
    const safeHtml = '<p>This is <strong>safe</strong> content.</p>';
    const instance = new TestClass(safeHtml);

    const errors: ValidationError[] = await validate(instance);
    expect(errors.length).toBe(0); // Expect no validation errors
    expect(instance.html).toBe(safeHtml); // Content should remain the same
  });

  it('should fail on unsafe HTML and sanitize it', async () => {
    const unsafeHtml = '<script>alert("Unsafe!");</script>';
    const instance = new TestClass(unsafeHtml);

    const errors: ValidationError[] = await validate(instance);
    expect(errors.length).toBe(1); // Expect one validation error
    expect(errors[0].constraints?.isSafeHtml).toBe('HTML content is not safe'); // Check error message
    expect(instance.html).toBe(unsafeHtml); // Content should remain unchanged since it was invalid
  });

  it('should fail on HTML with disallowed tags', async () => {
    const unsafeHtml = '<div>This is not allowed</div>';
    const instance = new TestClass(unsafeHtml);

    const errors: ValidationError[] = await validate(instance);
    expect(errors.length).toBe(1); // Expect one validation error
    expect(errors[0].constraints?.isSafeHtml).toBe('HTML content is not safe'); // Check error message
    expect(instance.html).toBe(unsafeHtml); // Content should remain unchanged since it was invalid
  });

  it('should validate empty HTML string', async () => {
    const emptyHtml = '';
    const instance = new TestClass(emptyHtml);

    const errors: ValidationError[] = await validate(instance);
    expect(errors.length).toBe(0); // Expect no validation errors
    expect(instance.html).toBe(emptyHtml); // Content should be empty
  });

  it('should sanitize and retain safe HTML attributes', async () => {
    const validHtmlWithAttributes = '<a href="http://example.com" target="_blank">Safe link</a>';
    const instance = new TestClass(validHtmlWithAttributes);

    const errors: ValidationError[] = await validate(instance);
    expect(errors.length).toBe(0); // Expect no validation errors
    expect(instance.html).toBe(validHtmlWithAttributes); // Content should remain the same
  });

  it('should reject HTML with disallowed attributes', async () => {
    const unsafeHtmlWithAttributes = '<a href="javascript:void(0)">Unsafe link</a>';
    const instance = new TestClass(unsafeHtmlWithAttributes);

    const errors: ValidationError[] = await validate(instance);
    expect(errors.length).toBe(1); // Expect one validation error
    expect(errors[0].constraints?.isSafeHtml).toBe('HTML content is not safe'); // Check error message
    expect(instance.html).toBe(unsafeHtmlWithAttributes); // Content should remain unchanged since it was invalid
  });
});
