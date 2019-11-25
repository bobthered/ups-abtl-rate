const _corsAnywhereURL       = `https://cors-anywhere.herokuapp.com/`;
let _discount = .1869;
const _ups = {
  "UPSSecurity":{
     "UsernameToken":{
        "Username":"bobmcaleavey",
        "Password":"Superma3+"
     },
     "ServiceAccessToken":{
        "AccessLicenseNumber":"4D5DFA30E51E44B2"
     }
  },
  "RateRequest":{
     "Request":{
        "RequestOption":"Rate",
        "TransactionReference":{
           "CustomerContext":"Your Customer Context"
        }
     },
     "Shipment":{
        "Shipper":{
           "Name":"Shipper Name",
           "ShipperNumber":"Shipper Number",
           "Address":{
              "AddressLine":[
                 "Address Line ",
                 "Address Line ",
                 "Address Line "
              ],
              "City":"Caledonia",
              "StateProvinceCode":"NY",
              "PostalCode":"14423",
              "CountryCode":"US"
           }
        },
        "ShipTo":{
           "Name":"Extruders",
           "Address":{
              "AddressLine":[
                 "Address Line ",
                 "Address Line ",
                 "Address Line "
              ],
              "City":"Wylie",
              "StateProvinceCode":"TX",
              "PostalCode":"75098",
              "CountryCode":"US"
           }
        },
        "ShipFrom":{
           "Name":"ABTL",
           "Address":{
              "AddressLine":[
                 "Address Line ",
                 "Address Line ",
                 "Address Line "
              ],
              "City":"Caledonia",
              "StateProvinceCode":"NY",
              "PostalCode":"14423",
              "CountryCode":"US"
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
                 "Code":"Lbs",
                 "Description":"pounds"
              },
              "Weight":"17.4"
           }
        },
        "ShipmentRatingOptions":{
           "NegotiatedRatesIndicator":""
        }
     }
  }
};

const nonValidatedRateClickHandler = async e => {
  e.preventDefault();
  const response = await fetch( _corsAnywhereURL + 'https://wwwcie.ups.com/rest/Rate', {
    method : 'POST',
    body: JSON.stringify( _ups )
  } );
  // const result = await response.json();
  console.log( response );
}

document.querySelector( '.nonValidatedRate' ).addEventListener( 'click', nonValidatedRateClickHandler );