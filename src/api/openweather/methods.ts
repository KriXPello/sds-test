import axios from 'axios';
import type {
  CurrentWeatherFetchOptions,
  WeatherApiResponse,
  CitiesInfoFetchOtions,
  GeoDirectApiResponse,
  GeoReverseApiRespone,
  CitiesByCoordsFetchOptions,
} from './types';
import type { WeatherInfo, CityInfo } from '~/types/models';
import { wrapAxios } from '~/api/utils';

const API_KEY_ENV = import.meta.env.OPENWEATHERMAP_API_KEY;
const STORAGE_API_KEY = 'openweathermap-api-key';
const getApiKey = () => {
  if (API_KEY_ENV != 'ask') {
    return API_KEY_ENV;
  }

  const savedKey = sessionStorage.getItem(STORAGE_API_KEY);
  if (savedKey) {
    return savedKey;
  }

  let apiKey: string | null = null;
  while (!apiKey || !apiKey.trim()) {
    apiKey = window.prompt('Введите API ключ OpenWeatherMap (будет сохранен в сессионном хранилище)');
  }
  sessionStorage.setItem(STORAGE_API_KEY, apiKey);
  return apiKey;
};

const openweatherAxios = axios.create({
  baseURL: import.meta.env.OPENWEATHERMAP_API_BASE_URL,
  params: {
    appid: getApiKey(),
  },
});

export const fetchCurrentWeather = wrapAxios<CurrentWeatherFetchOptions, WeatherInfo>(async (options, signal) => {
  const { data } = await openweatherAxios.get<WeatherApiResponse>('/data/2.5/weather', {
    params: {
      lat: options.latitude,
      lon: options.longitude,
      units: 'metric',
      lang: 'ru',
    },
    signal,
  });
  const weather = data.weather[0];
  return {
    cityId: data.id,
    cityName: data.name,
    cityLatitude: data.coord.lat,
    cityLongitude: data.coord.lon,
    description: weather.description,
    iconName: weather.icon,
    temperature: data.main.temp,
    wet: data.main.humidity,
    windSpeed: data.wind.speed,
  };
});

export const fetchCitiesInfo = wrapAxios<CitiesInfoFetchOtions, CityInfo[]>(async (options, signal) => {
  const { data } = await openweatherAxios.get<GeoDirectApiResponse>('/geo/1.0/direct', {
    params: {
      q: options.searchQuery,
      limit: 5,
    },
    signal,
  });
  return data.map<CityInfo>((x) => {
    const name = x.local_names?.ru || x.local_names?.en || x.name;
    return {
      country: x.country,
      latitude: x.lat,
      longitude: x.lon,
      name,
      state: x.state,
    };
  });
});

export const fetchCitiesByCoords = wrapAxios<CitiesByCoordsFetchOptions, CityInfo[]>(async (options, signal) => {
  const { data } = await openweatherAxios.get<GeoReverseApiRespone>('/geo/1.0/reverse', {
    params: {
      lat: options.latitude,
      lon: options.longitude,
      limit: 3,
    },
    signal,
  });
  return data.map<CityInfo>((x) => {
    const name = x.local_names?.ru || x.local_names?.en || x.name;
    return {
      country: x.country,
      latitude: x.lat,
      longitude: x.lon,
      name,
      state: x.state,
    };
  });
});
