export class StepLimitExceededError extends Error {
  public readonly stepCount: number;
  public readonly stepLimit: number;

  constructor(stepCount: number, stepLimit: number) {
    super(
      `Step limit exceeded: algorithm executed ${stepCount} steps (limit is ${stepLimit}). ` +
        `Check for infinite loops or reduce custom input size.`
    );
    this.name = 'StepLimitExceededError';
    this.stepCount = stepCount;
    this.stepLimit = stepLimit;
  }
}

export const DEFAULT_STEP_LIMIT = 10_000;

export class StepGuard {
  private count = 0;
  public readonly limit: number;

  constructor(limit = DEFAULT_STEP_LIMIT) {
    this.limit = limit;
  }

  public increment(): number {
    this.count++;
    if (this.count > this.limit) {
      throw new StepLimitExceededError(this.count, this.limit);
    }
    return this.count;
  }

  public get current(): number {
    return this.count;
  }

  public reset(): void {
    this.count = 0;
  }
}
