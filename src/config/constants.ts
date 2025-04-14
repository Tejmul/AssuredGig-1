export const API_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

export const VALIDATION_RULES = {
  JOB: {
    MIN_TITLE_LENGTH: 3,
    MIN_DESCRIPTION_LENGTH: 10,
    MIN_BUDGET: 1,
  },
  PROPOSAL: {
    MIN_COVER_LETTER_LENGTH: 10,
    MIN_BID_AMOUNT: 1,
  },
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be logged in to access this resource",
  FORBIDDEN: "You do not have permission to perform this action",
  NOT_FOUND: (resource: string) => `${resource} not found`,
  VALIDATION: {
    TITLE_LENGTH: `Title must be at least ${VALIDATION_RULES.JOB.MIN_TITLE_LENGTH} characters`,
    DESCRIPTION_LENGTH: `Description must be at least ${VALIDATION_RULES.JOB.MIN_DESCRIPTION_LENGTH} characters`,
    BUDGET: `Budget must be at least ${VALIDATION_RULES.JOB.MIN_BUDGET}`,
    COVER_LETTER_LENGTH: `Cover letter must be at least ${VALIDATION_RULES.PROPOSAL.MIN_COVER_LETTER_LENGTH} characters`,
    BID_AMOUNT: `Bid amount must be at least ${VALIDATION_RULES.PROPOSAL.MIN_BID_AMOUNT}`,
  },
} as const; 