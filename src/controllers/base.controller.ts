import z, { ZodType } from 'zod';
import { AppError, EErrorCode } from '../types';

export class BaseController {
  protected validate<T>(schema: ZodType<T>, data: unknown): T {
    const result = schema.safeParse(data);

    if (!result.success) {
      const message = z.prettifyError(result.error);
      throw new AppError(EErrorCode.VALIDATION_ERROR, message);
    }

    return result.data;
  }
}
