import {
  PriceCalibrationInput,
  PriceCalibrationResult,
  calculatePriceCalibration,
} from './priceCalibration';

/*
 * DATASET DE CALIBRAÇÃO CORRIDAX v1
 *
 * Nesta primeira versão, os registros
 * permanecem em memória durante a
 * execução do aplicativo.
 *
 * A camada foi criada separadamente
 * para permitir futura persistência
 * local ou remota sem alterar a lógica
 * de calibração.
 */

let calibrationRecords:
  PriceCalibrationResult[] = [];

/**
 * Registra uma nova observação.
 */
export function addCalibrationRecord(
  input: PriceCalibrationInput,
): PriceCalibrationResult {
  const record =
    calculatePriceCalibration(
      input,
    );

  calibrationRecords = [
    ...calibrationRecords,
    record,
  ];

  return record;
}

/**
 * Retorna todos os registros.
 *
 * Uma cópia é retornada para impedir
 * alterações externas no dataset.
 */
export function getCalibrationRecords():
  PriceCalibrationResult[] {
  return [
    ...calibrationRecords,
  ];
}

/**
 * Retorna somente os registros
 * de uma determinada plataforma.
 */
export function getCalibrationRecordsByProvider(
  provider:
    PriceCalibrationResult['provider'],
): PriceCalibrationResult[] {
  return calibrationRecords.filter(
    (record) =>
      record.provider === provider,
  );
}

/**
 * Retorna a quantidade total
 * de observações registradas.
 */
export function getCalibrationRecordCount():
  number {
  return calibrationRecords.length;
}

/**
 * Remove todos os registros.
 *
 * Deve ser usado apenas em testes
 * ou quando houver uma ação explícita
 * de limpeza do dataset.
 */
export function clearCalibrationRecords():
  void {
  calibrationRecords = [];
}