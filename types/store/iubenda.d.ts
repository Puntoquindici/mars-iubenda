declare namespace _default {
    let namespaced: boolean;
    namespace state {
        let log: boolean;
        let preference_not_needed: boolean;
        let consent_given: boolean;
        let consent_rejected: boolean;
        let consent_given_purpose: {
            1: boolean;
            2: boolean;
            3: boolean;
            4: boolean;
            5: boolean;
        };
        let ccpa_opted_out: boolean;
        let siteId: number;
        let cookiePolicyId: number;
        let lang: string;
        namespace cookiePolicies {
            let en: number;
            let it: number;
            let de: number;
        }
        namespace banner {
            let acceptButtonCaptionColor: string;
            let acceptButtonColor: string;
            let acceptButtonDisplay: boolean;
            let backgroundColor: string;
            let backgroundOverlay: boolean;
            let brandBackgroundColor: string;
            let brandTextColor: string;
            let closeButtonDisplay: boolean;
            let customizeButtonCaptionColor: string;
            let customizeButtonColor: string;
            let customizeButtonDisplay: boolean;
            let explicitWithdrawal: boolean;
            let listPurposes: boolean;
            let logo: string;
            let position: string;
            let rejectButtonCaptionColor: string;
            let rejectButtonColor: string;
            let rejectButtonDisplay: boolean;
            let textColor: string;
        }
    }
    namespace actions {
        function setPreferenceNotNeeded(context: any, bValue: any): void;
        function setConsetGiven(context: any, bValue: any): void;
        function setConsetRejected(context: any, bValue: any): void;
        function setConsetGivenPurpose(context: any, { iPurpose, bValue }: {
            iPurpose: any;
            bValue: any;
        }): void;
        function resetConsetGivenPurpose(context: any): void;
        function setCcpaOptedOut(context: any, bValue: any): void;
        function setSiteId(context: any, siteId: any): void;
        function setCookiePolicyId(context: any, cookiePolicyId: any): void;
        function setLang(context: any, lang: any): void;
        function setBanner(context: any, banner: any): void;
    }
    namespace mutations {
        function SET_PREFERENCE_NOT_NEEDED(state: any, bValue: any): void;
        function SET_CONSENT_GIVEN(state: any, bValue: any): void;
        function SET_CONSENT_REJECTED(state: any, bValue: any): void;
        function SET_CONSENT_GIVEN_PURPOSE(state: any, { iPurpose, bValue }: {
            iPurpose: any;
            bValue: any;
        }): void;
        function SET_CCPA_OPTED_OUT(state: any, bValue: any): void;
        function SET_SITE_ID(state: any, value: any): void;
        function SET_COOKIE_POLICY_ID(state: any, value: any): void;
        function SET_LANG(state: any, value: any): void;
        function SET_BANNER(state: any, value: any): void;
    }
    namespace getters {
        function log(state: any): any;
        function consentGivenForPurpose1(state: any): any;
        function consentGivenForPurpose2(state: any): any;
        function consentGivenForPurpose3(state: any): any;
        function consentGivenForPurpose4(state: any): any;
        function consentGivenForPurpose5(state: any): any;
        function necessaryEnabled(_state: any, getters: any): any;
        function functionalityEnabled(_state: any, getters: any): any;
        function experienceEnabled(_state: any, getters: any): any;
        function measurementEnabled(_state: any, getters: any): any;
        function marketingEnabled(_state: any, getters: any): any;
        function siteId(state: any): any;
        function cookiePolicyId(state: any): any;
        function lang(state: any): any;
        function banner(state: any): any;
        function clickupFormsEnabled(_state: any, getters: any): any;
        function youtubeEnabled(_state: any, getters: any): any;
        function mauticEnabled(_state: any, getters: any): any;
        function livechatEnabled(_state: any, getters: any): any;
    }
}
export default _default;
//# sourceMappingURL=iubenda.d.ts.map