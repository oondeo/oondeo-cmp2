import '../../../styles/cpc_standard.scss';
import { OIL_LABELS } from '../userview_constants';
import { forEach } from '../userview_modal';
import { getLabel, getLabelWithDefault, getTheme } from '../userview_config';
import { getCustomPurposes, getCustomVendorListUrl } from '../../core/core_config';
import { JS_CLASS_BUTTON_OPTIN, OIL_GLOBAL_OBJECT_NAME } from '../../core/core_constants';
import { setGlobalOilObject } from '../../core/core_utils';
import { getCustomVendorList, getPurposes, getSpecialPurposes, getFeatures, getSpecialFeatures, getVendorList, getVendorsToDisplay } from '../../core/core_vendor_lists';
import { BackButton, YesButton } from './components/oil.buttons';
const CLASS_NAME_FOR_ACTIVE_MENU_SECTION = 'as-oil-cpc__category-link--active';

export function oilAdvancedSettingsTemplate() {
  return `
  <div id="as-oil-cpc" class="as-oil-content-overlay" data-qa="oil-cpc-overlay">
    ${oilAdvancedSettingsInlineTemplate()}
  </div>`
}

export function oilAdvancedSettingsInlineTemplate() {
  return `<div class="as-oil-l-wrapper-layout-max-width as-oil-cpc-wrapper">
    <div class="as-oil__heading">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_HEADING)}
    </div>
    <p class="as-oil__intro-txt">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_TEXT)}
    </p>
    ${ActivateButtonSnippet()}
    ${BackButton()}
    ${ContentSnippet()}
  </div>`
}

export function attachCpcHandlers() {
  forEach(document.querySelectorAll('.as-js-btn-activate-all'), (domNode) => {
    domNode && domNode.addEventListener('click', activateAll, false);
  });
  forEach(document.querySelectorAll('.as-js-btn-deactivate-all'), (domNode) => {
    domNode && domNode.addEventListener('click', deactivateAll, false);
  });
}


const ContentSnippet = () => {

  return `
<div data-qa="cpc-snippet" class="as-oil-l-row as-oil-cpc__content">
  <div class="as-oil-cpc__left">
    <a href="#as-oil-cpc-purposes" onclick='${OIL_GLOBAL_OBJECT_NAME}._switchLeftMenuClass(this)' class="as-oil-cpc__category-link ${CLASS_NAME_FOR_ACTIVE_MENU_SECTION}">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_PURPOSE_TITLE)}
    </a>
    <a href="#as-oil-cpc-special-purposes" onclick='${OIL_GLOBAL_OBJECT_NAME}._switchLeftMenuClass(this)' class="as-oil-cpc__category-link">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_SPECIAL_PURPOSE_TITLE)}
    </a>
    <a href="#as-oil-cpc-features" onclick='${OIL_GLOBAL_OBJECT_NAME}._switchLeftMenuClass(this)' class="as-oil-cpc__category-link">
    ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_FEATURE_TITLE)}
    </a>
    <a href="#as-oil-cpc-special-features" onclick='${OIL_GLOBAL_OBJECT_NAME}._switchLeftMenuClass(this)' class="as-oil-cpc__category-link">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_SPECIAL_FEATURE_TITLE)}
    </a>
    <a href="#as-oil-cpc-third-parties" onclick='${OIL_GLOBAL_OBJECT_NAME}._switchLeftMenuClass(this)' class="as-oil-cpc__category-link">
      ${getLabel(OIL_LABELS.ATTR_LABEL_THIRD_PARTY)}
    </a>
    ${IsCustomVendorsEnables() ? `
      <a href="#as-oil-cpc-custom-third-parties" onclick='${OIL_GLOBAL_OBJECT_NAME}._switchLeftMenuClass(this)' class="as-oil-cpc__category-link">
         ${getLabel(OIL_LABELS.ATTR_LABEL_CUSTOM_THIRD_PARTY_HEADING)}
      </a>
    ` : ''}
  </div>
  <div class="as-oil-cpc__middle as-js-purposes">
    ${getPurposes() ? `
    <div class="as-oil-cpc__row-title" id="as-oil-cpc-purposes">
    ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_PURPOSE_TITLE)}
    </div>
    ${buildPurposeEntries(getPurposes(), 'purpose')}
    ` : ''}

    ${getSpecialPurposes() ? `
    <div class="as-oil-cpc__row-title" id="as-oil-cpc-special-purposes">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_SPECIAL_PURPOSE_TITLE)}
    </div>
    ${buildPurposeEntries(getSpecialPurposes())}
    ` : ''}

    ${getFeatures() ? `
    <div class="as-oil-cpc__row-title" id="as-oil-cpc-features">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_FEATURE_TITLE)}
    </div>
    ${buildPurposeEntries(getFeatures())}
    ` : ''}

    ${getSpecialFeatures() ? `
    <div class="as-oil-cpc__row-title" id="as-oil-cpc-special-features">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_SPECIAL_FEATURE_TITLE)}
    </div>
    ${buildPurposeEntries(getSpecialFeatures(), 'specialFeature')}
    ` : ''}
    
    ${buildPurposeEntries(getCustomPurposes())}

    ${buildIabVendorList()}
    ${buildCustomVendorList()}
  </div>
  <div class="as-oil-cpc__right">
    <div class="as-oil-l-row as-oil-l-buttons-${getTheme()}">
      <div class="as-oil-l-item">
        ${YesButton(`as-oil__btn-optin ${JS_CLASS_BUTTON_OPTIN}`)}
      </div>
    </div>
  </div>
</div>`;
};

const PurposeContainerSnippet = ({ id, header, text, value, key }) => {
  text = text.replace(/(\r\n|\n|\r)/gm, '<br>').replace(/\*/gm, '&bull;');

  let hasLegInt;

  hasLegInt = Object.keys(getVendorList().getVendorsWithLegIntPurpose(id)).length;

  return `
    <div class="as-oil-cpc__purpose Purpose">
        <div class="as-oil-cpc__purpose-container Purpose__Container">
            <div class="Purpose__Heading">
              <div class="as-oil-cpc__purpose-header Purpose__Title">${header}</div>
              <div class="Purpose__Switches">
              ${key !== undefined ? `              
                ${hasLegInt && (key !== 'specialFeature') ? `          
                  <label class="as-oil-cpc__switch Purpose__Switch Purpose__Switch--LegInt">
                      <input data-id="${id}" id="as-js-legint-slider-${id}" class="as-js-${key}-legint-slider" type="checkbox" name="oil-cpc-legint-${id}" value="${value}"/>
                      <span class="as-oil-cpc__status Purpose__SwitchStatus"></span>
                      <span class="as-oil-cpc__slider Purpose__SwitchSlider"></span>
                  </label>
                `: ''}
                  <label class="as-oil-cpc__switch Purpose__Switch Purpose__Switch--Consent">
                      <input data-id="${id}" id="as-js-${key}-slider-${id}" class="as-js-${key}-slider" type="checkbox" name="oil-cpc-${key}-${id}" value="${value}"/>
                      <span class="as-oil-cpc__status Purpose__SwitchStatus"></span>
                      <span class="as-oil-cpc__slider Purpose__SwitchSlider"></span>
                  </label>
              `: ''}
              </div>
            </div>
            <div class="as-oil-cpc__purpose-text">${text}</div>
        </div>
    </div>`
};

const IsCustomVendorsEnables = () => {
  return !!getCustomVendorListUrl();
};

const buildIabVendorList = () => {
  return `
<div class="as-oil-cpc__row-title" id="as-oil-cpc-third-parties">
  ${getLabel(OIL_LABELS.ATTR_LABEL_THIRD_PARTY)}
</div>
<div id="as-js-third-parties-list">
  ${buildIabVendorEntries()}
</div>`
};

const buildCustomVendorList = () => {
  if (IsCustomVendorsEnables()) {
    return `
<div class="as-oil-cpc__row-title" id="as-oil-cpc-custom-third-parties">
  ${getLabel(OIL_LABELS.ATTR_LABEL_CUSTOM_THIRD_PARTY_HEADING)}
</div>
<div id="as-oil-custom-third-parties-list">
  ${buildCustomVendorEntries()}
</div>`
  } else {
    return '';
  }
};


const buildIabVendorEntries = () => {
  let vendorList = getVendorList();


  if (vendorList && !vendorList.isDefault) {
    let listWrapped = getVendorsToDisplay();

    if (typeof (listWrapped) === 'object') {
      listWrapped = Object.values(listWrapped)
    }
    listWrapped = listWrapped.map((element) => {
      return buildVendorListEntry(element);
    });
    return `<div class="as-oil-poi-group-list">${listWrapped.join('')}</div>`;
  } else {
    return 'Missing vendor list! Maybe vendor list retrieval has failed! Please contact web administrator!';
  }
};

const buildCustomVendorEntries = () => {
  let customVendorList = getCustomVendorList();

  if (customVendorList && !customVendorList.isDefault) {
    let listWrapped = customVendorList.vendors.map((element) => {
      return buildVendorListEntry(element);
    });
    return `<div class="as-oil-poi-group-list">${listWrapped.join('')}</div>`;
  } else {
    return 'Missing custom vendor list! Maybe vendor list retrieval has failed! Please contact web administrator!';
  }
};

const buildVendorListEntry = (element) => {
  if (element.name) {
    return `
          <div class="as-oil-third-party-list-element Vendor">
              <span onclick='${OIL_GLOBAL_OBJECT_NAME}._toggleViewElements(this)'>
                  <svg class='as-oil-icon-plus' width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.675 4.328H10v1.344H5.675V10h-1.35V5.672H0V4.328h4.325V0h1.35z" fill="#0068FF" fill-rule="evenodd" fill-opacity=".88"/>
                  </svg>
                  <svg class='as-oil-icon-minus' style='display: none;' width="10" height="5" viewBox="0 0 10 5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h10v1.5H0z" fill="#3B7BE2" fill-rule="evenodd" opacity=".88"/>
                  </svg>
                  <span class='as-oil-third-party-name'>${element.name}</span>
                  <div class="Vendor__Switches">
                      ${element.legIntPurposes.length > 0 ? `
                        <label class="as-oil-cpc__switch Vendor__Switch Vendor__Switch--LegInt">
                            <input data-id="${element.id}" id="as-js-vendor-legint-slider-${element.id}" class="as-js-vendor-legint-slider" type="checkbox" name="oil-cpc-purpose" value=""/>
                            <span class="as-oil-cpc__status Vendor__SwitchStatus"></span>
                            <span class="as-oil-cpc__slider Vendor__SwitchSlider"></span>
                        </label>
                      ` : ''}
                    <label class="as-oil-cpc__switch Vendor__Switch Vendor__Switch--Consent">
                        <input data-id="${element.id}" id="as-js-vendor-slider-${element.id}" class="as-js-vendor-slider" type="checkbox" name="oil-cpc-purpose" value=""/>
                        <span class="as-oil-cpc__status Vendor__SwitchStatus"></span>
                        <span class="as-oil-cpc__slider Vendor__SwitchSlider"></span>
                    </label>
                  </div>
              </span>
              <div class='as-oil-third-party-toggle-part' style='display: none;'>
                <a class='as-oil-third-party-link' href='${element.policyUrl}'>${element.policyUrl}</a>      
                ${snippetLegalDescription(element.purposes, 'Purposes')}
                ${snippetLegalDescription(element.legIntPurposes, 'Legitimate Interest')}
                ${snippetLegalDescription(element.features, 'Features')}
                ${snippetLegalDescription(element.specialFeatures, 'Special Features')}
              </div>
            </div>
          `;
  }
};

const snippetLegalDescription = (list, category) => {
  if (list.length > 0) {
    return `
      <div>
        <p>
          <strong>${category}: </strong> ${categoryList(list)}
        </p>
      </div>
    `;
  } else {
    return '';
  }
}


const categoryList = (list) => {
  return list.map((purpose) => `(${purpose}) ${getVendorList().purposes[purpose]['name']}`).join(', ');
};

const ActivateButtonSnippet = () => {
  return `
  <div class="as-oil-cpc__row-btn-all">
        <span class="as-js-btn-deactivate-all as-oil__btn-grey">${getLabel(OIL_LABELS.ATTR_LABEL_CPC_DEACTIVATE_ALL)}</span>
        <span class="as-js-btn-activate-all as-oil__btn-blue">${getLabel(OIL_LABELS.ATTR_LABEL_CPC_ACTIVATE_ALL)}</span>
      </div>
  `
};

const buildPurposeEntries = (list, key = undefined) => {
  if (typeof (list) === 'object') {
    list = Object.values(list)
  }

  return list.map(purpose => {
    return PurposeContainerSnippet({
      id: purpose.id,
      header: getLabelWithDefault(`label_cpc_purpose_${formatPurposeId(purpose.id)}_text`, purpose.name || `Error: Missing text for purpose with id ${purpose.id}!`),
      text: getLabelWithDefault(`label_cpc_purpose_${formatPurposeId(purpose.id)}_desc`, purpose.descriptionLegal || ''),
      value: false,
      key: key
    })
  }).join('');
};

const formatPurposeId = (id) => {
  return id < 10 ? `0${id}` : id;
};

function activateAll() {
  let elements = document.querySelectorAll('.as-js-purpose-slider, .as-js-purpose-legint-slider, .as-js-specialFeature-slider, .as-js-vendor-slider, .as-js-vendor-legint-slider');
  forEach(elements, (domNode) => {
    domNode && (domNode.checked = true);
  });
}

export function deactivateAll() {
  let elements = document.querySelectorAll('.as-js-purpose-slider, .as-js-purpose-legint-slider, .as-js-specialFeature-slider, .as-js-vendor-slider, .as-js-vendor-legint-slider');
  forEach(elements, (domNode) => {
    domNode && (domNode.checked = false);
  });
}

function switchLeftMenuClass(element) {
  let allElementsInMenu = element.parentNode.children;

  forEach(allElementsInMenu, (el) => {
    el.className = el.className.replace(new RegExp(`\\s?${CLASS_NAME_FOR_ACTIVE_MENU_SECTION}\\s?`, 'g'), '');
  });
  element.className += ` ${CLASS_NAME_FOR_ACTIVE_MENU_SECTION}`;
}

setGlobalOilObject('_switchLeftMenuClass', switchLeftMenuClass);
