import ISO3166 from '../lib/iso3166-alpha2.json'

export const countryCodes = Object.entries(ISO3166).map(([code, country]) => ({
  code,
  country,
}))

export const findCountryByCode = (lookupCode: string) =>
  countryCodes.find((entry) => entry.code === lookupCode)?.country
