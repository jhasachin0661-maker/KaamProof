export interface AnomalyEvaluation {
  riskScore: number; // 0.00 to 1.00
  reviewPriority: "Low" | "Medium" | "High";
  signalFlags: string[];
  features: {
    durationMinutes: number;
    deviceServerGapMinutes: number;
    startAccuracyMeters: number;
    hasGps: boolean;
    isNightSession: boolean;
  };
}

export function evaluateSessionAnomaly(params: {
  deviceStartTime?: string | Date | null;
  serverStartTime: string | Date;
  deviceEndTime?: string | Date | null;
  serverEndTime: string | Date;
  durationMinutes: number;
  startAccuracyMeters?: number | null;
  startLatitude?: number | null;
}): AnomalyEvaluation {
  const flags: string[] = [];
  let riskScore = 0.05; // baseline low risk

  const serverStart = new Date(params.serverStartTime).getTime();
  const serverEnd = new Date(params.serverEndTime).getTime();
  
  let gapMinutes = 0;
  if (params.deviceStartTime) {
    const devStart = new Date(params.deviceStartTime).getTime();
    gapMinutes = Math.abs(Math.round((serverStart - devStart) / 60000));
    if (gapMinutes > 15) {
      flags.push(`Device & server start time mismatch (${gapMinutes} min gap)`);
      riskScore += 0.35;
    }
  }

  // Duration rules
  if (params.durationMinutes > 720) {
    // Greater than 12 hours
    flags.push(`Unusually long session length (${Math.round(params.durationMinutes / 60)} hrs)`);
    riskScore += 0.40;
  } else if (params.durationMinutes < 15) {
    flags.push("Extremely short work session (< 15 mins)");
    riskScore += 0.20;
  }

  // GPS Accuracy
  const hasGps = params.startLatitude !== null && params.startLatitude !== undefined;
  if (!hasGps) {
    flags.push("Location evidence not captured (permission denied or unavailable)");
    riskScore += 0.15;
  } else if (params.startAccuracyMeters && params.startAccuracyMeters > 300) {
    flags.push(`Coarse GPS accuracy radius (> ${Math.round(params.startAccuracyMeters)}m)`);
    riskScore += 0.20;
  }

  // Time of day pattern (Night session flag)
  const hour = new Date(params.serverStartTime).getHours();
  const isNightSession = hour >= 23 || hour <= 4;
  if (isNightSession) {
    flags.push("Late-night shift activity recorded");
    riskScore += 0.10;
  }

  // Normalize score
  riskScore = Math.min(0.98, Math.max(0.05, parseFloat(riskScore.toFixed(2))));

  let reviewPriority: "Low" | "Medium" | "High" = "Low";
  if (riskScore >= 0.65) {
    reviewPriority = "High";
  } else if (riskScore >= 0.35) {
    reviewPriority = "Medium";
  }

  return {
    riskScore,
    reviewPriority,
    signalFlags: flags,
    features: {
      durationMinutes: params.durationMinutes,
      deviceServerGapMinutes: gapMinutes,
      startAccuracyMeters: params.startAccuracyMeters || 0,
      hasGps,
      isNightSession,
    },
  };
}
