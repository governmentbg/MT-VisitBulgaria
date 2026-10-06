import {useState, useCallback} from 'react';
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import type {Location as UserCoordinates} from '../models/Location';

function getPosition(highAccuracy: boolean): Promise<UserCoordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => reject(error),
      {
        enableHighAccuracy: highAccuracy,
        timeout: highAccuracy ? 10000 : 15000,
        maximumAge: 10000,
        forceRequestLocation: true,
        forceLocationManager: !highAccuracy && Platform.OS === 'android',
        showLocationDialog: true,
      },
    );
  });
}

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(
    null,
  );
  const [isLocating, setIsLocating] = useState(false);

  const getCurrentPosition = useCallback(async (): Promise<UserCoordinates> => {
    setIsLocating(true);
    try {
      // Try high accuracy first (GPS), fall back to low accuracy (network)
      let coords: UserCoordinates;
      try {
        coords = await getPosition(true);
      } catch {
        coords = await getPosition(false);
      }
      setUserLocation(coords);
      return coords;
    } finally {
      setIsLocating(false);
    }
  }, []);

  return {userLocation, isLocating, getCurrentPosition};
}
