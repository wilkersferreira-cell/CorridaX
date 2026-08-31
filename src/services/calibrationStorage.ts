import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  PriceCalibrationInput,
  PriceCalibrationResult,
  calculatePriceCalibration,
} from './priceCalibration';

import {
  saveCalibrationRecordRemote,
} from './calibrationRemoteStorage';

const STORAGE_KEY =
  '@corridax:calibration-records:v1';

/**
 * Salva o dataset completo de calibração
 * no armazenamento persistente do aparelho.
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
      JSON.parse(
        stored,
      );

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
 * Registra uma nova observação.
 *
 * Fluxo:
 * 1. calcula os dados de calibração;
 * 2. salva localmente;
 * 3. tenta enviar ao Firestore.
 *
 * Se o Firestore falhar, o registro local
 * é preservado e o usuário não perde
 * a contribuição realizada.
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

  /*
   * Primeiro salvamos localmente.
   * Assim o dado fica protegido mesmo
   * se a internet estiver indisponível.
   */
  await saveCalibrationRecords(
    updatedRecords,
  );

  /*
   * Depois tentamos enviar ao banco
   * central do CorridaX.
   *
   * Uma falha remota não deve apagar
   * nem invalidar o registro local.
   */
  try {
    const remoteDocumentId =
      await saveCalibrationRecordRemote(
        record,
      );

    console.log(
      'Calibração enviada ao Firestore:',
      remoteDocumentId,
    );
  } catch (error) {
    console.warn(
      'Calibração salva localmente, mas ainda não enviada ao Firestore.',
      error,
    );
  }

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
      record.provider ===
      provider,
  );
}

/**
 * Retorna a quantidade total
 * de observações persistidas
 * neste dispositivo.
 */
export async function getCalibrationRecordCount():
Promise<number> {
  const records =
    await getCalibrationRecords();

  return records.length;
}

/**
 * Remove os registros locais.
 *
 * Atenção:
 * esta função NÃO apaga os documentos
 * já enviados ao Firestore.
 */
export async function clearCalibrationRecords():
Promise<void> {
  await AsyncStorage.removeItem(
    STORAGE_KEY,
  );
}