import { getCountries } from '~/client/management/get-countries';
import { getShippingZones } from '~/client/management/get-shipping-zones';

export const getShippingCountries = async () => {
  const [shippingZones, allCountries] = await Promise.all([getShippingZones(), getCountries()]);

  if (shippingZones.length === 0 || allCountries.length === 0) {
    console.warn('No shipping zones or countries available. Check your API authentication.');
    return [];
  }

  const uniqueCountryZones = shippingZones.reduce<string[]>((zones, item) => {
    item.locations.forEach(({ country_iso2 }) => {
      if (!zones.includes(country_iso2)) {
        zones.push(country_iso2);
      }
    });
    return zones;
  }, []);

  const shippingCountries = allCountries
    .filter((countryDetails) => uniqueCountryZones.includes(countryDetails.country_iso2))
    .map((countryDetails) => ({
      id: countryDetails.id,
      name: countryDetails.country,
      countryCode: countryDetails.country_iso2,
    }));

  return shippingCountries;
};