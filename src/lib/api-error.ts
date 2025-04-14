import { NextResponse } from "next/server";
import { z } from "zod";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown) => {
  console.error("[API_ERROR]", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: error.errors[0].message },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
};

export const throwUnauthorizedError = () => {
  throw new ApiError("Unauthorized", 401, "UNAUTHORIZED");
};

export const throwForbiddenError = () => {
  throw new ApiError("Forbidden", 403, "FORBIDDEN");
};

export const throwNotFoundError = (resource: string) => {
  throw new ApiError(`${resource} not found`, 404, "NOT_FOUND");
};

export const throwBadRequestError = (message: string) => {
  throw new ApiError(message, 400, "BAD_REQUEST");
}; 