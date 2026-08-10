import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  CalibrationMetrics,
  calculateCalibrationMetrics,
} from '../services/calibrationMetrics';

import {
  getCalibrationRecordsByProvider,
} from '../services/calibrationStorage';

import {
  PriceCalibrationResult,
} from '../services/priceCalibration';

import {
  ProviderPriceId,
} from '../services/priceEstimator';

const EMPTY_METRICS: CalibrationMetrics = {
  sampleCount: 0,
  mae: 0,
  mape: 0,
  bias: 0,
  maxAbsoluteError: 0,
  averageEstimatedPrice: 0,
  averageObservedPrice: 0,
};

export default function useCalibrationMetrics(
  provider: ProviderPriceId,
) {
  const [metrics, setMetrics] =
    useState<CalibrationMetrics>(
      EMPTY_METRICS,
    );

  const [records, setRecords] =
    useState<
      PriceCalibrationResult[]
    >([]);

  const [loading, setLoading] =
    useState(true);

  const refresh =
    useCallback(async () => {
      setLoading(true);

      try {
        const providerRecords =
          await getCalibrationRecordsByProvider(
            provider,
          );

        const calculated =
          calculateCalibrationMetrics(
            providerRecords,
          );

        setRecords(
          providerRecords,
        );

        setMetrics(
          calculated,
        );
      } catch {
        setRecords([]);

        setMetrics(
          EMPTY_METRICS,
        );
      } finally {
        setLoading(false);
      }
    }, [provider]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    metrics,
    records,
    loading,
    refresh,
  };
}