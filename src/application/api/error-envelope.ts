export type ApiErrorEnvelope = Readonly<{
  code: string;
  message: string;
  fieldErrors?: Readonly<Record<string, readonly string[]>>;
  requestId: string;
}>;

export function apiError(
  code: string,
  requestId: string,
  fieldErrors?: Readonly<Record<string, readonly string[]>>,
): ApiErrorEnvelope {
  return {
    code,
    message: 'Request could not be completed.',
    ...(fieldErrors ? { fieldErrors } : {}),
    requestId,
  };
}
