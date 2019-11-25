const _corsAnywhereURL       = `https://cors-anywhere.herokuapp.com/`;
let _discount = .1869;
const _ups = {
  env : 'test',
  serviceAccessToken : {
    "AccessLicenseNumber":"4D5DFA30E51E44B2"
  },
  serviceCodes : {
    '01' : 'UPS Next Day Air',
    '02' : 'UPS 2nd Day Air',
    '03' : 'UPS Ground',
    '12' : 'UPS 3 Day Select',
    '13' : 'UPS Next Day Air Saver',
    '14' : 'UPS Next Day Air Early',
    '59' : 'UPS 2nd Day Air A.M.'
  },
  url : {
    rates : {
      prod : `https://onlinetools.ups.com/rest/Rate`,
      test : `https://wwwcie.ups.com/rest/Rate`
    },
    validation : {
      prod : `https://onlinetools.ups.com/rest/XAV`,
      test : `https://wwwcie.ups.com/rest/XAV`
    }
  },
  usernameToken : {
    "Username":"bobmcaleavey@gmail.com",
    "Password":"Superma3+"
  }
};
const formSubmit = async e => {
  e.preventDefault();
  setLoadingStatus( 'Validating Address...' );
  showContainer( 'loading' );
  pageReset();
  const validAddress = await validateShipTo();
  if ( validAddress ) {
    if ( validAddress.length !== undefined ) {
      showValidAddresses( validAddress );
    } else {
      updateShipTo( validAddress );
      getRates();
    }
  } else {
    showContainer( 'shipment' );
  }
};
const getRates = async ( addressValidate = true ) => {
  setLoadingStatus( 'Getting Rates...' );
  showContainer( 'loading' );
  const _upsBody = {
    "UPSSecurity":{
      "UsernameToken": _ups.usernameToken,
      "ServiceAccessToken": _ups.serviceAccessToken
    },
  	"RateRequest":{
  		"Request":{
  			"RequestOption":"Shop"
  		},
  		"Shipment":{
  			"Shipper":{
  				"Address":{
  					"AddressLine":[
  						document.querySelector( 'form.ShipFrom .AddressLine').value
  					],
  					"City":document.querySelector( 'form.ShipFrom .City').value,
  					"StateProvinceCode":document.querySelector( 'form.ShipFrom .StateProvinceCode').value,
  					"PostalCode":document.querySelector( 'form.ShipFrom .PostalCode').value,
  					"CountryCode":document.querySelector( 'form.ShipFrom .CountryCode').value
  				}
  			},
  			"ShipTo":{
          "Address": {
  					"City":document.querySelector( 'form.ShipTo .City').value,
  					"StateProvinceCode":document.querySelector( 'form.ShipTo .StateProvinceCode').value,
  					"PostalCode":document.querySelector( 'form.ShipTo .PostalCode').value,
  					"CountryCode":document.querySelector( 'form.ShipTo .CountryCode').value
  				}
  			},
  			"ShipFrom":{
          "Address":{
  					"AddressLine":[
  						document.querySelector( 'form.ShipFrom .AddressLine').value
  					],
  					"City":document.querySelector( 'form.ShipFrom .City').value,
  					"StateProvinceCode":document.querySelector( 'form.ShipFrom .StateProvinceCode').value,
  					"PostalCode":document.querySelector( 'form.ShipFrom .PostalCode').value,
  					"CountryCode":document.querySelector( 'form.ShipFrom .CountryCode').value
  				}
  			},
  			"Service":{
  				"Code":"03",
  				"Description":"Service Code Description"
  			},
  			"Package":{
  				"PackagingType":{
  					"Code":"02",
  					"Description":"Rate"
  				},
  				"PackageWeight":{
  					"UnitOfMeasurement":{
  						"Code":"Lbs"
  					},
  					"Weight": document.querySelector( 'form.Package .Weight').value
  				}
  			},
  			"ShipmentRatingOptions":{
  				"NegotiatedRatesIndicator":""
  			}
  		}
  	}
  };
  if ( addressValidate ) {
    _upsBody.RateRequest.Shipment.ShipTo.Address.AddressLine = [ document.querySelector( 'form.ShipTo .AddressLine').value ];
  } else {
    document.querySelector( 'rateContainer .alert' ).classList.remove( 'show' );
    document.querySelector( 'rateContainer residential' ).classList.remove( 'show' );
    document.querySelector( 'rateContainer shipToAddress' ).innerHTML = '';
  }
  const response = await fetch( _corsAnywhereURL + _ups.url.rates[_ups.env], {
    method : 'POST',
    body   : JSON.stringify( _upsBody )
  } );
  const data = await response.json();
  // console.log( response, data );
  if ( data.hasOwnProperty( 'Fault' ) ) {
    showContainer( 'error' );
  } else {
    let ratesHTML = '';
    const quantity = parseInt( document.querySelector( 'form.Package .NumOfPackages').value );
    for ( rate of data.RateResponse.RatedShipment ) {
      if ( rate.Service.Code == '03' ) {
        console.log( rate );
      }
      const amount = ( ( parseFloat( rate.TotalCharges.MonetaryValue ) * ( 1 - _discount ) ) * quantity ).toFixed( 2 );
      ratesHTML += `<rate><service>${_ups.serviceCodes[rate.Service.Code]}</service><amount>$${amount}</amount></rate>`;
    }
    document.querySelector( 'rateContainer rates' ).innerHTML = ratesHTML;
    showContainer( 'rate' );
  }
};
const pageReset = () => {
  document.querySelector( 'form.ShipTo p.error' ).innerHTML = '';
};
const setLoadingStatus = status => {
  document.querySelector( 'loadingContainer status' ).innerHTML = status;
};
const showContainer = container => {
  document.querySelectorAll( '.toggleableContainer' ).forEach( togleableContainer => {
    togleableContainer.style.display = 'none';
  } );
  document.querySelector( container+'Container' ).style.display = 'flex';
};
const showValidAddresses = validAddresses => {
  showContainer( 'validAddress' );
  let validAddressesHTML = '';
  for( validAddress of validAddresses ) {
    // console.log( validAddress );
    validAddressesHTML += `<validAddress><address>${validAddress.AddressKeyFormat.AddressLine}<br>${validAddress.AddressKeyFormat.Region}</address><button>Choose</button></validAddress>`;
  }
  validAddressesHTML += `<validAddress><button>None Available</button></validAddress>`;
  document.querySelector( 'validAddressContainer .validAddresses' ).innerHTML = validAddressesHTML;
  document.querySelectorAll( 'validAddressContainer validAddress button' ).forEach( ( button, index ) => {
    button.addEventListener( 'click', e => {
      if ( index > validAddresses.length -1 ) {
        showContainer( 'shipment' );
      } else {
      updateShipTo( validAddresses[index] );
      formSubmit( e );
      }
    } );
  } );
};
const updateShipTo = validAddress => {
  // console.log( validAddress.AddressKeyFormat );
  document.querySelector( 'rateContainer .alert' ).classList.add( 'show' );
  if ( validAddress.AddressClassification.Code === "2" ) {
    document.querySelector( 'form.ShipTo .Residential' ).checked = true;
    document.querySelector( 'rateContainer residential' ).classList.add( 'show' );
  } else {
    document.querySelector( 'form.ShipTo .Residential' ).checked = false;
    document.querySelector( 'rateContainer residential' ).classList.remove( 'show' );
  }
  document.querySelector( 'form.ShipTo .AddressLine' ).value = validAddress.AddressKeyFormat.AddressLine;
  document.querySelector( 'form.ShipTo .City' ).value = validAddress.AddressKeyFormat.PoliticalDivision2;
  document.querySelector( 'form.ShipTo .StateProvinceCode' ).value = validAddress.AddressKeyFormat.PoliticalDivision1;
  document.querySelector( 'form.ShipTo .PostalCode' ).value = `${validAddress.AddressKeyFormat.PostcodePrimaryLow}-${validAddress.AddressKeyFormat.PostcodeExtendedLow}`;
  const shipToAddressHTML = `${validAddress.AddressKeyFormat.AddressLine}<br>${validAddress.AddressKeyFormat.PoliticalDivision2}, ${validAddress.AddressKeyFormat.PoliticalDivision1}, ${validAddress.AddressKeyFormat.PostcodePrimaryLow}-${validAddress.AddressKeyFormat.PostcodeExtendedLow}`;
  document.querySelector( 'rateContainer shipToAddress' ).innerHTML = shipToAddressHTML;
};
const validateShipTo = async () => {
  const _upsBody = {
    "UPSSecurity":{
      "UsernameToken": _ups.usernameToken,
      "ServiceAccessToken": _ups.serviceAccessToken
    },
    "XAVRequest":{
      "Request":{
        "RequestOption":"3"
      },
      "MaximumListSize":"10",
      "AddressKeyFormat":{
        // "ConsigneeName": document.querySelector( 'form.ShipTo input.ConsigneeName' ).value,
        "AddressLine": document.querySelector( 'form.ShipTo input.AddressLine' ).value,
        "PoliticalDivision2":document.querySelector( 'form.ShipTo input.City' ).value,
        "PoliticalDivision1":document.querySelector( 'form.ShipTo select.StateProvinceCode' ).value,
        "PostcodePrimaryLow":document.querySelector( 'form.ShipTo input.PostalCode' ).value,
        "CountryCode":"US"
      }
    }
  };
  const response = await fetch( _corsAnywhereURL + _ups.url.validation[_ups.env], {
    method : 'POST',
    body   : JSON.stringify( _upsBody )
  } );
  const data = await response.json();
  // console.log( data );
  if ( data.XAVResponse.hasOwnProperty( 'Candidate' ) ) {
    return data.XAVResponse.Candidate;
  } else {
    document.querySelector( 'form.ShipTo p.error' ).innerHTML = 'Could not verify ship to address.  Please check again and/or contact customer.';
    return false;
  }
};
document.querySelector( 'form.getRate' ).addEventListener( 'submit', formSubmit );
document.querySelector( 'form.getRate .nonValidatedRate' ).addEventListener( 'click', e => {
  e.preventDefault();
  getRates( false );
} );
document.querySelector( 'rateContainer button' ).addEventListener( 'click', e => {
  showContainer( 'shipment' );
} );
document.querySelector( 'errorContainer button' ).addEventListener( 'click', e => {
  showContainer( 'shipment' );
} );
