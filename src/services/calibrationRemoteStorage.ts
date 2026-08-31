import {
  getAuth,
} from '@react-native-firebase/auth';

import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from '@react-native-firebase/firestore';

import {
  PriceCalibrationResult,
} from './priceCalibration';

const COLLECTION_NAME =
  'price_calibrations';

export async function saveCalibrationRecordRemote(
  record: PriceCalibrationResult,
): Promise<string> {
  const auth =
    getAuth();

  const currentUser =
    auth.currentUser;

  if (!currentUser) {
    throw new Error(
      'Usuário não autenticado.',
    );
  }

  const firestore =
    getFirestore();

  const payload = {
    userId:
      currentUser.uid,

    provider:
      record.provider,

    distanceKm:
      record.distanceKm,

    durationMinutes:
      record.durationMinutes,

    estimatedPrice:
      record.estimatedPrice,

    estimatedPriceMin:
      record.estimatedPriceMin ??
      null,

    estimatedPriceMax:
      record.estimatedPriceMax ??
      null,

    observedPrice:
      record.observedPrice,

    promotionalPrice:
      record.promotionalPrice ??
      null,

    absoluteError:
      record.absoluteError,

    percentageError:
      record.percentageError,

    direction:
      record.direction,

    recordedAt:
      record.recordedAt,

    serverCreatedAt:
      serverTimestamp(),

    appVersion:
      '1.0.0',

    source:
      'corridax-alpha',
  };

  const document =
    await addDoc(
      collection(
        firestore,
        COLLECTION_NAME,
      ),
      payload,
    );

  return document.id;
}