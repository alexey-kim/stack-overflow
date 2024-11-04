import type { ClassTransformOptions } from 'class-transformer';

export const DefaultTransformOptions = {
  strategy: 'excludeAll',
  excludeExtraneousValues: true,
} as const satisfies ClassTransformOptions;
