export type CityInfo = {
  name: string;
  latitude: number;
  longitude: number;
  /** страна (например "RU") */
  country: string;
  /** штат/область */
  state?: string;
};

export type WeatherInfo = {
  cityId: number;
  cityName: string;
  cityLatitude: number;
  cityLongitude: number;
  /** цельсий */
  temperature: number;
  /** процентных пунктов (пример: 80) */
  wet: number;
  /** м/с */
  windSpeed: number;
  /** пример: 01n */
  iconName: string;
  /** пример: преимущественно облачно */
  description: string;
};
