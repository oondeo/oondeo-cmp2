import { JS_CLASS_BUTTON_OPTIN } from '../../core/core_constants.js';
import { getLabel, isAdvancedSettings } from '../userview_config.js';
import { OIL_LABELS } from '../userview_constants.js';
import { AdvancedSettingsButton, YesButton } from './components/oil.buttons.js';

export function oilDefaultTemplate() {
  return `
    <div class="as-oil-content-overlay" data-qa="oil-full">
        <div class="as-oil-l-wrapper-layout-max-width FirstLayer">
            <div class="FirstLayer__HeadingWrapper">
                <div class="FirstLayer__PublisherLogo">
                    <img src="/assets/images/logo-publisher.png">
                </div>
                <div class="as-oil__heading FirstLayer__Heading">
                    ${getLabel(OIL_LABELS.ATTR_LABEL_INTRO_HEADING)}
                </div>
            </div>
            <p class="as-oil__intro-txt FirstLayer__IntroText">
                ${getLabel(OIL_LABELS.ATTR_LABEL_INTRO)}
            </p>
            <div class="FirstLayer__Footer">
                <div class="FirstLayer__CmpLogo">
                    <p class="FirstLayer__Powered">Powered By</p>
                    <a href="https://www.avacysolution.com/" target="_blank">
                        <img src="/assets/images/logo-cmp.png">
                    </a>
                </div>
                <div class="as-oil-l-row as-oil-l-buttons FirstLayer__Buttons">
                    <div class="as-oil-l-item FirstLayer__ButtonItem">
                        ${YesButton(`as-oil__btn-optin ${JS_CLASS_BUTTON_OPTIN}`)}
                    </div>
                    <div class="as-oil-l-item FirstLayer__ButtonItem">
                        ${AdvancedSettingsButton(isAdvancedSettings(), 'as-oil__btn-grey')}
                    </div>
                </div>
            </div>
        </div>
    </div>
`
}
