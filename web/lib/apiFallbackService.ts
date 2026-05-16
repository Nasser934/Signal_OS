export type ApiMode = 'full_api' | 'byo_api_key' | 'manual';

export interface ModeContext {
  mode: ApiMode;
  userId: string;
  accountId?: string;
  byoCredentialId?: string;
}

export interface MetricsRequest {
  postId: string;
  forceRefresh?: boolean;
}

export interface MetricsResult {
  source: ApiMode;
  capturedAt: string;
  metrics: {
    impressions?: number;
    likes?: number;
    replies?: number;
    reposts?: number;
    bookmarks?: number;
  };
  fallbackReason?: string;
}

/**
 * 3-Mode API Fallback router.
 * - full_api: managed platform credentials
 * - byo_api_key: user-provided credentials
 * - manual: user-entered metrics only
 */
export class ApiFallbackService {
  async fetchMetrics(context: ModeContext, req: MetricsRequest): Promise<MetricsResult> {
    switch (context.mode) {
      case 'full_api':
        return this.tryFullApi(context, req);
      case 'byo_api_key':
        return this.tryByoApi(context, req);
      case 'manual':
      default:
        return this.manualFallback('Manual mode enabled by user preference or policy');
    }
  }

  private async tryFullApi(context: ModeContext, req: MetricsRequest): Promise<MetricsResult> {
    try {
      // In production: call your Next.js API route (/api/metrics/full)
      return await this.mockSource('full_api', req.postId);
    } catch (error) {
      const reason = `Full API request failed: ${this.errorToReason(error)}`;
      return this.tryByoApi({ ...context, mode: 'byo_api_key' }, req, reason);
    }
  }

  private async tryByoApi(
    context: ModeContext,
    req: MetricsRequest,
    priorReason?: string
  ): Promise<MetricsResult> {
    if (!context.byoCredentialId) {
      return this.manualFallback(this.combineReasons(priorReason, 'Missing BYO credential; switching to manual mode'));
    }

    try {
      // In production: call /api/metrics/byo with credential reference only.
      const result = await this.mockSource('byo_api_key', req.postId);
      return priorReason ? { ...result, fallbackReason: priorReason } : result;
    } catch (error) {
      return this.manualFallback(
        this.combineReasons(priorReason, `BYO API request failed: ${this.errorToReason(error)}`)
      );
    }
  }


  private combineReasons(priorReason: string | undefined, nextReason: string): string {
    return priorReason ? `${priorReason}; ${nextReason}` : nextReason;
  }

  private errorToReason(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private manualFallback(reason: string): MetricsResult {
    return {
      source: 'manual',
      capturedAt: new Date().toISOString(),
      metrics: {},
      fallbackReason: reason,
    };
  }

  private async mockSource(source: ApiMode, postId: string): Promise<MetricsResult> {
    return {
      source,
      capturedAt: new Date().toISOString(),
      metrics: {
        impressions: 1200,
        likes: 43,
        replies: 12,
        reposts: 5,
        bookmarks: 7,
      },
      fallbackReason: undefined,
    };
  }
}
