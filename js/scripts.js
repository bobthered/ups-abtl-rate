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
        // "Shipper":{
        //    "Name":"Shipper Name",
        //    "ShipperNumber":"Shipper Number",
        //    "Address":{
        //       "AddressLine":[
        //          "Address Line ",
        //          "Address Line ",
        //          "Address Line "
        //       ],
        //       "City":"Caledonia",
        //       "StateProvinceCode":"NY",
        //       "PostalCode":"14423",
        //       "CountryCode":"US"
        //    }
        // },
        "ShipTo":{
           "Address":{
              "AddressLine":[],
              "City":"Wylie",
              "StateProvinceCode":"TX",
              "PostalCode":"75098",
              "CountryCode":"US"
           }
        },
        "ShipFrom":{
           "Address":{
              "AddressLine":[],
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

const getRatesClickHandler = async e => {
  e.preventDefault();
  updateShipFrom();
  // updateShipTo();
  getRates();
}
const getRates = async () => {
  const response = await fetch( _corsAnywhereURL + 'https://wwwcie.ups.com/rest/Rate', {
    method : 'POST',
    body: JSON.stringify( _ups )
  } );
  const result = await response.json();
  console.log( response, result );
}
const setCurrentTab = tabId => {
  document.querySelectorAll( 'tab' ).forEach( tabNode => {
    tabNode.removeAttribute( 'current' );
  } );
  document.querySelectorAll( 'tabStatus' ).forEach( tabStatusNode => {
    tabStatusNode.removeAttribute( 'current' );
  } );
  document.querySelector( `tab#${tabId}`).setAttribute( 'current', '' );
  document.querySelector( `tabStatus[showTab="${tabId}"]`).setAttribute( 'current', '' );
}
const showTabClickHandler = e => {
  e.preventDefault();
  const tabId = e.target.getAttribute( 'showTab' );
  setCurrentTab( tabId );
}
const updateShipFrom = () => {
  const tabShipFromNode = document.querySelector( 'tab#shipFrom' );
  _ups.RateRequest.Shipment.ShipFrom.Address.AddressLine = [tabShipFromNode.querySelector( '[name="address"]' ).value];
}

document.querySelector( '#getRates' ).addEventListener( 'click', getRatesClickHandler );
document.querySelectorAll( '[showTab]' ).forEach( showTabNode => {
  showTabNode.addEventListener( 'click', showTabClickHandler );
} );