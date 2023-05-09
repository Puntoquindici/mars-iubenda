/********************************************************************************
 * Iubenda cookie solution
 *
 * -------------------------------
 * Service list per consent given
 * -------------------------------
 * 
 * Purpose 1: Strictly necessary
 * - Google Tag Manager
 * - Iubenda
 * - LogRocket (?)
 * 
 * Purpose 2: Basic interactions & functionalities
 * - Clickup Forms
 * - Livechat
 * 
 * Purpose 3: Experience enhancement
 * - YouTube video widget
 * - Google Fonts
 * - YouTube Data APIs
 * - Font Awesome
 * - YouTube Video Widgets
 * - CodePen
 * 
 * Purpose 4: Measurement
 * - Google Analytics
 * - Google Ads conversion tracking
 * - Google Analytics 4
 * - Beta testing
 * 
 * Purpose 5: Targeting & Advertising
 * - Mautic
 * - Google Ads Remarketing
 * - Remarketing with Google Analytics
 * 
 ********************************************************************************/


export default {
  namespaced: true,
  state: {
    log: true, // if true it logs on the console (debug)
    preference_not_needed: false,
    consent_given: false,
    consent_rejected: false,
    consent_given_purpose: {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false, 
    },
    ccpa_opted_out: false,
    siteId: 2701995,
    cookiePolicyId: 20018456,
    lang: 'en',
    cookiePolicies: {
      'en': 20018456,
      'it': 61469158,
      'de': 21462515,
    },
    banner: { 
      "acceptButtonCaptionColor": "#FFFFFF",
      "acceptButtonColor": "#0073CE",
      "acceptButtonDisplay": true,
      "backgroundColor": "#FFFFFF",
      "backgroundOverlay": true,
      "brandBackgroundColor": "#FFFFFF",
      "brandTextColor": "#000000",
      "closeButtonDisplay": false,
      "customizeButtonCaptionColor": "#4D4D4D",
      "customizeButtonColor": "#DADADA",
      "customizeButtonDisplay": true,
      "explicitWithdrawal": true,
      "listPurposes": true,
      "logo": "https://www.myarstudio.cloud/img/logo.f9e0636a.svg",
      "rejectButtonCaptionColor": "#FFFFFF",
      "rejectButtonColor": "#0073CE",
      "rejectButtonDisplay": true,
      "textColor": "#000000"
    }
  },
  actions: {
    setPreferenceNotNeeded(context, bValue) {
      context.commit("SET_PREFERENCE_NOT_NEEDED", bValue);
    },
    setConsetGiven(context, bValue) {
      context.commit("SET_PREFERENCE_NOT_NEEDED", bValue);
    },
    setConsetRejected(context, bValue) {
      context.commit("SET_CONSENT_REJECTED", bValue);
    },
    setConsetGivenPurpose(context, {iPurpose, bValue}) {
      context.commit("SET_CONSENT_GIVEN_PURPOSE", {iPurpose, bValue});
    },
    resetConsetGivenPurpose(context) {
      for(const iPurpose of [1, 2, 3, 4, 5]) {
        context.commit("SET_CONSENT_GIVEN_PURPOSE", {iPurpose, bValue: false});
      }
    },
    setCcpaOptedOut(context, bValue) {
      context.commit("SET_CCPA_OPTED_OUT", bValue);
    },

    setSiteId(context, siteId) {
      context.commit("SET_SITE_ID", siteId);
    },
    setCookiePolicyId(context, cookiePolicyId) {
      context.commit("SET_COOKIE_POLICY_ID", cookiePolicyId);
    },
    setLang(context, lang) {
      if(lang in context.state.cookiePolicies) {
        context.commit("SET_LANG", lang);
        context.commit("SET_COOKIE_POLICY_ID", context.state.cookiePolicies[lang]);
      } else {
        console.error(`Iubenda vuex store: no policy for lang "${lang}". Discarding action.`);
      }
    },
    setBanner(context, banner) {
      context.commit("SET_BANNER", banner);
    },

  },
  mutations: {
    SET_PREFERENCE_NOT_NEEDED(state, bValue) {
      state.preference_not_needed = bValue;
    },
    SET_CONSENT_GIVEN(state, bValue) {
      state.consent_given = bValue;
    },
    SET_CONSENT_REJECTED(state, bValue) {
      state.consent_rejected = bValue;
    },
    SET_CONSENT_GIVEN_PURPOSE(state, {iPurpose, bValue}) {
      state.consent_given_purpose[iPurpose] = bValue;
    },
    SET_CCPA_OPTED_OUT(state, bValue) {
      state.ccpa_opted_out = bValue;
    },

    SET_SITE_ID(state, value) {
      state.siteId = value;
    },
    SET_COOKIE_POLICY_ID(state, value) {
      state.cookiePolicyId = value;
    },
    SET_LANG(state, value) {
      state.lang = value;
    },
    SET_BANNER(state, value) {
      state.banner = value;
    },
  },
  getters: {
    log(state) {
      return state.log
    },
    consentGivenForPurpose1(state) { return consentGivenForPurpose(state, 1); },
    consentGivenForPurpose2(state) { return consentGivenForPurpose(state, 2); },
    consentGivenForPurpose3(state) { return consentGivenForPurpose(state, 3); },
    consentGivenForPurpose4(state) { return consentGivenForPurpose(state, 4); },
    consentGivenForPurpose5(state) { return consentGivenForPurpose(state, 5); },

    siteId(state) { return state.siteId; }, 
    cookiePolicyId(state) { return state.cookiePolicyId; },
    lang(state) { return state.lang; },
    banner(state) {return state.banner; },

    clickupFormsEnabled(_state, getters) { return getters.consentGivenForPurpose2; },
    youtubeEnabled(_state, getters) { return getters.consentGivenForPurpose3; },
    mauticEnabled(_state, getters) { return getters.consentGivenForPurpose5; },
    livechatEnabled(_state, getters) { return getters.consentGivenForPurpose2; },
  }
}

function consentGivenForPurpose(state, iPurpose) {
  return !state.consent_rejected && 
    (state.preference_not_needed || state.consent_given || state.consent_given_purpose[iPurpose]);
}