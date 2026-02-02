export type CurrentWeatherFetchOptions = {
  latitude: number;
  longitude: number;
};

export type WeatherApiResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type CitiesInfoFetchOtions = {
  /** название города для поиска */
  searchQuery: string;
};

export type GeoDirectApiResponse = Array<{
  name: string;
  local_names?: {
    en?: string;
    ru?: string;
  };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}>;

export type CitiesByCoordsFetchOptions = {
  latitude: number;
  longitude: number;
};

export type GeoReverseApiRespone = Array<{
  name: string;
  local_names?: {
    en?: string;
    ru?: string;
  };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}>;
