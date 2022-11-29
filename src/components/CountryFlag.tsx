// Prerequisite: https://www.npmjs.com/package/flag-icons
// countryCode should be in ISO 3166 format

const CountryFlag = (({ countryCode, ...rest }) => {
  return (
    <img
      className="flag-img"
      width="30px"
      height="15px"
      src={`images/flags/4x3/${countryCode}.svg`}
      alt={countryCode}
      {...rest}
    />
  )
})

export default CountryFlag