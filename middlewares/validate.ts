import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

// Define a more specific type for the schemas we expect.
// This tells TypeScript that our schemas will be objects that can contain
// optional 'body', 'query', or 'params' sub-schemas.
type ZodRequestSchema = z.ZodObject<{
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
}>;

export const validate = (schema: ZodRequestSchema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // This is the crucial step: replace req.body with the parsed and coerced data.
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query as any;
    if (parsed.params) req.params = parsed.params as any;

    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      // Pass the Zod error to the global error handler
      return next(error);
    }
    // For any other unexpected errors
    return next(new Error('An unexpected error occurred during validation.'));
  }
};