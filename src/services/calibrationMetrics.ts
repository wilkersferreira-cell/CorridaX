import {
  PriceCalibrationResult,
} from './priceCalibration';

export type CalibrationMetrics = {
  sampleCount: number;

  mae: number;

  mape: number;

  bias: number;

  maxAbsoluteError: number;

  averageEstimatedPrice: number;

  averageObservedPrice: number;
};

export type ProviderCalibrationMetrics = {
  uber: CalibrationMetrics;
  '99': CalibrationMetrics;
  indrive: CalibrationMetrics;
};

function round(
  value: number,
): number {
  return Number(
    value.toFixed(2),
  );
}

export function calculateCalibrationMetrics(
  records: PriceCalibrationResult[],
): CalibrationMetrics {
  if (records.length === 0) {
    return {
      sampleCount: 0,
      mae: 0,
      mape: 0,
      bias: 0,
      maxAbsoluteError: 0,
      averageEstimatedPrice: 0,
      averageObservedPrice: 0,
    };
  }

  let totalAbsoluteError = 0;
  let totalPercentageError = 0;
  let totalBias = 0;
  let totalEstimatedPrice = 0;
  let totalObservedPrice = 0;
  let maxAbsoluteError = 0;

  records.forEach((record) => {
    const difference =
      record.estimatedPrice -
      record.observedPrice;

    totalAbsoluteError +=
      record.absoluteError;

    totalPercentageError +=
      record.percentageError;

    totalBias += difference;

    totalEstimatedPrice +=
      record.estimatedPrice;

    totalObservedPrice +=
      record.observedPrice;

    maxAbsoluteError =
      Math.max(
        maxAbsoluteError,
        record.absoluteError,
      );
  });

  const sampleCount =
    records.length;

  return {
    sampleCount,

    mae: round(
      totalAbsoluteError /
        sampleCount,
    ),

    mape: round(
      totalPercentageError /
        sampleCount,
    ),

    bias: round(
      totalBias /
        sampleCount,
    ),

    maxAbsoluteError:
      round(
        maxAbsoluteError,
      ),

    averageEstimatedPrice:
      round(
        totalEstimatedPrice /
          sampleCount,
      ),

    averageObservedPrice:
      round(
        totalObservedPrice /
          sampleCount,
      ),
  };
}

export function calculateMetricsByProvider(
  records: PriceCalibrationResult[],
): ProviderCalibrationMetrics {
  const uberRecords =
    records.filter(
      (record) =>
        record.provider === 'uber',
    );

  const app99Records =
    records.filter(
      (record) =>
        record.provider === '99',
    );

  const inDriveRecords =
    records.filter(
      (record) =>
        record.provider === 'indrive',
    );

  return {
    uber:
      calculateCalibrationMetrics(
        uberRecords,
      ),

    '99':
      calculateCalibrationMetrics(
        app99Records,
      ),

    indrive:
      calculateCalibrationMetrics(
        inDriveRecords,
      ),
  };
}