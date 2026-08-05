import { useEffect, useState } from 'react';

import { getCurrentLocation } from '../services/location';

export default function useLocation() {

  const [loading, setLoading] = useState(true);

  const [address, setAddress] = useState('');

  const [latitude, setLatitude] = useState(0);

  const [longitude, setLongitude] = useState(0);

  useEffect(() => {

    async function load() {

      try {

        const data = await getCurrentLocation();

        setAddress(data.address);

        setLatitude(data.latitude);

        setLongitude(data.longitude);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  return {

    loading,

    address,

    latitude,

    longitude,

  };

}