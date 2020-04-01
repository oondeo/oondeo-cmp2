import '../../../styles/cpc_standard.scss';
import { OIL_LABELS } from '../userview_constants';
import { forEach } from '../userview_modal';
import { getLabel, getLabelWithDefault, getTheme } from '../userview_config';
import { getCustomPurposes, getCustomVendorListUrl } from '../../core/core_config';
import { JS_CLASS_BUTTON_OPTIN, OIL_GLOBAL_OBJECT_NAME } from '../../core/core_constants';
import { setGlobalOilObject } from '../../core/core_utils';
import { getCustomVendorList, getPurposes, getVendorList, getVendorsToDisplay } from '../../core/core_vendor_lists';
import { BackButton, YesButton } from './components/oil.buttons';
const showdown  = require('showdown');


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
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_HEADING)} DIO
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
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_PURPOSE_DESC)}
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
    <div class="as-oil-cpc__row-title" id="as-oil-cpc-purposes">
      ${getLabel(OIL_LABELS.ATTR_LABEL_CPC_PURPOSE_DESC)}
    </div>
    // qui vengono stampati i purposes
    ${buildPurposeEntries(getPurposes())}
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

const PurposeContainerSnippet = ({id, header, text, value}) => {
  let converter = new showdown.Converter();
  let html = converter.makeHtml(text);

  return `
<div class="as-oil-cpc__purpose Purpose">
    <div class="as-oil-cpc__purpose-container Purpose__Container">
        <div class="Purpose__Heading">
          <div class="as-oil-cpc__purpose-header Purpose__Title">${header}</div>
          <div class="Purpose__Switches">
            <label class="as-oil-cpc__switch Purpose__Switch Purpose__Switch--LegInt">
                <input data-id="${id}" id="as-js-purpose-slider-${id}" class="as-js-purpose-slider" type="checkbox" name="oil-cpc-purpose-${id}" value="${value}"/>
                <span class="as-oil-cpc__status Purpose__SwitchStatus"></span>
                <span class="as-oil-cpc__slider Purpose__SwitchSlider"></span>
            </label>
            <label class="as-oil-cpc__switch Purpose__Switch Purpose__Switch--Consent">
                <input data-id="${id}" id="as-js-purpose-slider-${id}" class="as-js-purpose-slider" type="checkbox" name="oil-cpc-purpose-${id}" value="${value}"/>
                <span class="as-oil-cpc__status Purpose__SwitchStatus"></span>
                <span class="as-oil-cpc__slider Purpose__SwitchSlider"></span>
            </label>
          </div>
        </div>
        <div class="as-oil-cpc__purpose-text">${html}</div>
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
    if (typeof(listWrapped) === 'object') {
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
                    <label class="as-oil-cpc__switch Vendor__Switch Vendor__Switch--LegInt">
                        <input class="as-js-purpose-slider" type="checkbox" name="oil-cpc-purpose" value=""/>
                        <span class="as-oil-cpc__status Vendor__SwitchStatus"></span>
                        <span class="as-oil-cpc__slider Vendor__SwitchSlider"></span>
                    </label>
                    <label class="as-oil-cpc__switch Vendor__Switch Vendor__Switch--Consent">
                        <input class="as-js-purpose-slider" type="checkbox" name="oil-cpc-purpose" value=""/>
                        <span class="as-oil-cpc__status Vendor__SwitchStatus"></span>
                        <span class="as-oil-cpc__slider Vendor__SwitchSlider"></span>
                    </label>
                  </div>
              </span>
              <div class='as-oil-third-party-toggle-part' style='display: none;'>
                <a class='as-oil-third-party-link' href='${element.policyUrl}'>${element.policyUrl}</a>
                <div><strong>Purposes:</strong>  (1) Information storage and access, (2) Personalisation, (3) Ad selection, delivery, reporting, (4) Content selection, delivery, reporting, (5) Measurement</div>
                <div><strong>Legitimate Interest:</strong>  (1) Information storage and access, (2) Personalisation, (3) Ad selection, delivery, reporting, (4) Content selection, delivery, reporting, (5) Measurement</div>
              </div>
            </div>
          `;
  }
};

const ActivateButtonSnippet = () => {
  return `
  <div class="as-oil-cpc__row-btn-all">
        <span class="as-js-btn-deactivate-all as-oil__btn-grey">${getLabel(OIL_LABELS.ATTR_LABEL_CPC_DEACTIVATE_ALL)}</span>
        <span class="as-js-btn-activate-all as-oil__btn-blue">${getLabel(OIL_LABELS.ATTR_LABEL_CPC_ACTIVATE_ALL)}</span>
      </div>
  `
};

const buildPurposeEntries = (list) => {
  console.log('purposeslist', list);
  if (typeof(list) === 'object') {
    list = Object.values(list)
  }

  return list.map(purpose => PurposeContainerSnippet({
    id: purpose.id,
    header: getLabelWithDefault(`label_cpc_purpose_${formatPurposeId(purpose.id)}_text`, purpose.name || `Error: Missing text for purpose with id ${purpose.id}!`),
    text: getLabelWithDefault(`label_cpc_purpose_${formatPurposeId(purpose.id)}_desc`, purpose.descriptionLegal || ''),
    value: false
  })).join('');
};

const formatPurposeId = (id) => {
  return id < 10 ? `0${id}` : id;
};

function activateAll() {
  let elements = document.querySelectorAll('.as-js-purpose-slider');
  forEach(elements, (domNode) => {
    domNode && (domNode.checked = true);
  });
}

export function deactivateAll() {
  forEach(document.querySelectorAll('.as-js-purpose-slider'), (domNode) => {
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
