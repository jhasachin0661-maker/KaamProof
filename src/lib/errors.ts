import { NextResponse } from "next/server";

/** Structured, user-safe error. Every API error has error_code + message_en + message_hi. */
export class ApiError extends Error {
  status: number;
  errorCode: string;
  messageEn: string;
  messageHi: string;
  extra?: Record<string, unknown>;

  constructor(status: number, errorCode: string, messageEn: string, messageHi?: string, extra?: Record<string, unknown>) {
    super(messageEn);
    this.status = status;
    this.errorCode = errorCode;
    this.messageEn = messageEn;
    this.messageHi = messageHi || messageEn;
    this.extra = extra;
  }

  toResponse(headers?: Record<string, string>) {
    return NextResponse.json(
      {
        error: this.messageEn,
        error_code: this.errorCode,
        message_en: this.messageEn,
        message_hi: this.messageHi,
        ...(this.extra || {}),
      },
      { status: this.status, headers }
    );
  }
}

export const Errors = {
  authRequired: () => new ApiError(401, "AUTH_REQUIRED", "Please log in to continue.", "कृपया जारी रखने के लिए लॉगिन करें।"),
  invalidCredentials: () => new ApiError(401, "INVALID_CREDENTIALS", "Incorrect phone number or password.", "मोबाइल नंबर या पासवर्ड गलत है।"),
  forbidden: (en = "You are not allowed to do this.", hi = "आपको यह करने की अनुमति नहीं है।") => new ApiError(403, "FORBIDDEN", en, hi),
  notFound: (en = "Record not found.", hi = "रिकॉर्ड नहीं मिला।") => new ApiError(404, "NOT_FOUND", en, hi),
  invalid: (en: string, hi?: string) => new ApiError(400, "VALIDATION_ERROR", en, hi),
  conflict: (code: string, en: string, hi?: string, extra?: Record<string, unknown>) => new ApiError(409, code, en, hi, extra),
  rateLimited: () => new ApiError(429, "RATE_LIMITED", "Too many attempts. Please wait and try again.", "बहुत अधिक प्रयास। कृपया कुछ देर बाद पुनः प्रयास करें।"),
};

/** Converts any thrown value into a safe response. Never leaks stack traces or DB messages. */
export function errorResponse(error: unknown, context = "api") {
  if (error instanceof ApiError) return error.toResponse();
  console.error(`[${context}] unhandled error`, error);
  return NextResponse.json(
    {
      error: "Something went wrong. Please try again.",
      error_code: "INTERNAL_ERROR",
      message_en: "Something went wrong. Please try again.",
      message_hi: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    },
    { status: 500 }
  );
}

/** True if a Postgres error is a unique-constraint violation (optionally for a given constraint/index name). */
export function isUniqueViolation(error: unknown, name?: string): boolean {
  const e = error as { code?: string; constraint?: string; cause?: { code?: string; constraint?: string } } | null;
  const code = e?.code ?? e?.cause?.code;
  const constraint = e?.constraint ?? e?.cause?.constraint;
  return code === "23505" && (!name || constraint === name);
}
