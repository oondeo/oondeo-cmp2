import { getSoiCookie } from '../core/core_cookies';
import { PRIVACY_FULL_TRACKING } from '../core/core_constants';
import { logInfo } from '../core/core_log';
import { forEach } from './userview_modal';
import { getPurposes } from '../core/core_vendor_lists';

export function getSoiConsentData() {
  let soiCookie = getSoiCookie();
  console.log('getSoiConsentData', soiCookie.consentData);
  return soiCookie.opt_in ? soiCookie.consentData : undefined;
}

/**
 * If the CPC is visible it returns the settings from the CPC,
 * otherwise '1' is returned for 'full tracking'
 *
 * @returns {Object,number}
 *  "0": if no checkbox is marked
 *  "1": if all checkboxes are marked or if
 *  "{}": if there are multiple checkboxes
 */
export function getPrivacySettings() {
  //TODO: prendere i dati corretti dal pannello 
  if (document.querySelector('.as-oil-cpc-wrapper')) {
    let purpose = {};
    let specialFeature = {}
    let vendor = {}

    const purposeSliders = document.querySelectorAll('.as-js-purpose-slider');
    purposeSliders && forEach(purposeSliders, (element) => {
      let element_id = element.dataset ? element.dataset.id : element.getAttribute('data-id');
      if (purpose[element_id] !== undefined) {
        purpose[element_id].consent = element.checked;
      } else {
        purpose[element_id] = {};
        purpose[element_id].consent = element.checked;
      }
    }, this);

    const purposeLegintSliders = document.querySelectorAll('.as-js-purpose-legint-slider');
    purposeLegintSliders && forEach(purposeLegintSliders, (element) => {
      let element_id = element.dataset ? element.dataset.id : element.getAttribute('data-id');
      if (purpose[element_id] !== undefined) {
        purpose[element_id].legint = element.checked;
      } else {
        purpose[element_id] = {};
        purpose[element_id].legint = element.checked;
      }
    }, this);

    const specialFeatureSliders = document.querySelectorAll('.as-js-specialFeature-slider');
    specialFeatureSliders && forEach(specialFeatureSliders, (element) => {
      let element_id = element.dataset ? element.dataset.id : element.getAttribute('data-id');
      if (specialFeature[element_id] !== undefined) {
        specialFeature[element_id].optin = element.checked;
      } else {
        specialFeature[element_id] = {};
        specialFeature[element_id].optin = element.checked;
      }
    }, this);

    const vendorSliders = document.querySelectorAll('.as-js-vendor-slider');
    vendorSliders && forEach(vendorSliders, (element) => {
      let element_id = element.dataset ? element.dataset.id : element.getAttribute('data-id');
      if (vendor[element_id] !== undefined) {
        vendor[element_id].consent = element.checked;
      } else {
        vendor[element_id] = {};
        vendor[element_id].consent = element.checked;
      }
    }, this);

    const vendorLegintSliders = document.querySelectorAll('.as-js-vendor-legint-slider');
    vendorLegintSliders && forEach(vendorLegintSliders, (element) => {
      let element_id = element.dataset ? element.dataset.id : element.getAttribute('data-id');
      if (vendor[element_id] !== undefined) {
        vendor[element_id].legint = element.checked;
      } else {
        vendor[element_id] = {};
        vendor[element_id].legint = element.checked;
      }
    }, this);

    return {
      purpose: purpose,
      specialFeature: specialFeature,
      vendor: vendor
    };
  }
  return PRIVACY_FULL_TRACKING;
}

export function applyPrivacySettings(allowedPurposes) {
  logInfo('Apply privacy settings from cookie', allowedPurposes);

  for (let i = 1; i <= getPurposes().length; i++) {
    document.querySelector(`#as-js-purpose-slider-${i}`).checked = (allowedPurposes.indexOf(i) !== -1);
  }

  if (allowedPurposes === 1) {
    forEach(document.querySelectorAll('.as-js-purpose-slider'), (domNode) => {
      domNode && (domNode.checked = true);
    });
  }

  if (allowedPurposes === 0) {
    forEach(document.querySelectorAll('.as-js-purpose-slider'), (domNode) => {
      domNode && (domNode.checked = false);
    });
  }
}
