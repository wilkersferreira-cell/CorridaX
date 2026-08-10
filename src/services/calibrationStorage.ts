import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  PriceCalibrationInput,
  PriceCalibrationResult,
  calculatePriceCalibration,
} from './priceCalibration';

const STORAGE_KEY =
  '@corridax:calibration-records:v1';

/**
 * Salva o dataset completo de calibração
 * no armazenamento persistente.
 */
async function saveCalibrationRecords(
  records: PriceCalibrationResult[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(records),
  );
}

/**
 * Retorna todos os registros
 * persistidos no dispositivo.
 */
export async function getCalibrationRecords():
Promise<PriceCalibrationResult[]> {
  const stored =
    await AsyncStorage.getItem(
      STORAGE_KEY,
    );

  if (!stored) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as
      PriceCalibrationResult[];
  } catch {
    return [];
  }
}

/**
 * Registra uma nova observação
 * e persiste o dataset atualizado.
 */
export async function addCalibrationRecord(
  input: PriceCalibrationInput,
): Promise<PriceCalibrationResult> {
  const record =
    calculatePriceCalibration(
      input,
    );

  const currentRecords =
    await getCalibrationRecords();

  const updatedRecords = [
    ...currentRecords,
    record,
  ];

  await saveCalibrationRecords(
    updatedRecords,
  );

  return record;
}

/**
 * Retorna somente os registros
 * de uma plataforma.
 */
export async function getCalibrationRecordsByProvider(
  provider:
    PriceCalibrationResult['provider'],
): Promise<PriceCalibrationResult[]> {
  const records =
    await getCalibrationRecords();

  return records.filter(
    (record) =>
      record.provider === provider,
  );
}

/**
 * Retorna a quantidade total
 * de observações persistidas.
 */
export async function getCalibrationRecordCount():
Promise<number> {
  const records =
    await getCalibrationRecords();

  return records.length;
}

/**
 * Remove todos os registros persistidos.
 *
 * Usar somente quando houver uma ação
 * explícita de limpeza do dataset.
 */
export async function clearCalibrationRecords():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}