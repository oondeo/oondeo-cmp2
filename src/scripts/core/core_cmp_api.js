import { getGlobalVendorListBaseUrl } from './core_config';
import {TCModel, TCString, GVL} from '@iabtcf/core';

/**
 *  the IAB requires CMPs to host their own vendor-list.json files.  This must
 *  be set before creating any instance of the GVL class.
 */
GVL.baseUrl = 'http://localhost:3000/assets/';

// create a new TC string
export const tcModel = new TCModel(new GVL());

// // Some fields will not be populated until a GVL is loaded
// tcModel.gvl.readyPromise.then(() => {

//   // Set values on tcModel...

//   const encodedString = TCString.encode(tcModel);

//   console.log(encodedString); // TC string encoded begins with 'C'

// });

// // take an encoded TC string and decode into a TCModel
// const decodedTCModel = TCString.decode(encodedString);

// import {TCModel, GVL} from '@iabtcf/core';

// /**
//  *  the IAB requires CMPs to host their own vendor-list.json files.  This must
//  *  be set before creating any instance of the GVL class.
//  */

// GVL.baseUrl = 'http://localhost:3000/assets/';

// // create a new TC string
// export const tcModel = new TCModel(new GVL());