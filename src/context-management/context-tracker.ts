// Basic token counter and context manager
export class ContextTracker {
  private tokenCount: number = 0;
  private readonly tokenLimit: number;
  private readonly transitionThreshold: number;
  
  constructor(tokenLimit: number = 100000, thresholdPercentage: number = 80) {
    this.tokenLimit = tokenLimit;
    this.transitionThreshold = (thresholdPercentage / 100) * tokenLimit;
  }
  
  public addTokens(count: number): void {
    this.tokenCount += count;
  }
  
  public shouldTransition(): boolean {
    return this.tokenCount >= this.transitionThreshold;
  }
  
  public getTokenCount(): number {
    return this.tokenCount;
  }
  
  public getRemainingTokens(): number {
    return this.tokenLimit - this.tokenCount;
  }
  
  public reset(): void {
    this.tokenCount = 0;
  }
}