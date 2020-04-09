import { getGlobalVendorListBaseUrl } from './core_config';
import {TCModel, TCString, GVL} from '@iabtcf/core';

/**
 *  the IAB requires CMPs to host their own vendor-list.json files.  This must
 *  be set before creating any instance of the GVL class.
 */

GVL.baseUrl = 'https://cdn.jumpgroup.it/assets/';

// create a new TC string
export const gvl = new GVL();
// create a new TC string
export const tcModel = new TCModel(gvl);