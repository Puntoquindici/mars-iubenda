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

interface State {
  log: boolean
  preference_not_needed: boolean
  consent_given: boolean
  consent_rejected: boolean
  consent_given_purpose: {
    [key:number]: boolean
  },
  ccpa_opted_out: boolean
}

export default {
  namespaced: true,
  state(): State {
    return {
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
    }
  },
  actions: {
    setShouldLog(context: any, bValue: boolean) {
      context.commit('SET_SHOULD_LOG', bValue)
    },
    setPreferenceNotNeeded(context: any, bValue: boolean) {
      context.commit('SET_PREFERENCE_NOT_NEEDED', bValue)
    },
    setConsetGiven(context: any, bValue: boolean) {
      context.commit('SET_PREFERENCE_NOT_NEEDED', bValue)
    },
    setConsetRejected(context: any, bValue: boolean) {
      context.commit('SET_CONSENT_REJECTED', bValue)
    },
    setConsetGivenPurpose(context: any, { iPurpose, bValue }: {iPurpose: number, bValue: boolean}) {
      context.commit('SET_CONSENT_GIVEN_PURPOSE', { iPurpose, bValue })
    },
    resetConsetGivenPurpose(context: any) {
      for (const iPurpose of [1, 2, 3, 4, 5]) {
        context.commit('SET_CONSENT_GIVEN_PURPOSE', { iPurpose, bValue: false })
      }
    },
    setCcpaOptedOut(context: any, bValue: boolean) {
      context.commit('SET_CCPA_OPTED_OUT', bValue)
    },
  },
  mutations: {
    SET_SHOULD_LOG(state: State, bValue: boolean) {
      state.log = bValue
    },
    SET_PREFERENCE_NOT_NEEDED(state: State, bValue: boolean) {
      state.preference_not_needed = bValue
    },
    SET_CONSENT_GIVEN(state: State, bValue: boolean) {
      state.consent_given = bValue
    },
    SET_CONSENT_REJECTED(state: State, bValue: boolean) {
      state.consent_rejected = bValue
    },
    SET_CONSENT_GIVEN_PURPOSE(state: State, { iPurpose, bValue }: {iPurpose: number, bValue: boolean}) {
      state.consent_given_purpose[iPurpose] = bValue
    },
    SET_CCPA_OPTED_OUT(state: State, bValue: boolean) {
      state.ccpa_opted_out = bValue
    },
  },
  getters: {
    log(state: State) {
      return state.log
    },
    consentGivenForPurpose1(state: State) { return consentGivenForPurpose(state, 1) },
    consentGivenForPurpose2(state: State) { return consentGivenForPurpose(state, 2) },
    consentGivenForPurpose3(state: State) { return consentGivenForPurpose(state, 3) },
    consentGivenForPurpose4(state: State) { return consentGivenForPurpose(state, 4) },
    consentGivenForPurpose5(state: State) { return consentGivenForPurpose(state, 5) },

    necessaryEnabled(_state: State, getters: any) { return getters.consentGivenForPurpose1 },
    functionalityEnabled(_state: State, getters: any) { return getters.consentGivenForPurpose2 },
    experienceEnabled(_state: State, getters: any) { return getters.consentGivenForPurpose3 },
    measurementEnabled(_state: State, getters: any) { return getters.consentGivenForPurpose4 },
    marketingEnabled(_state: State, getters: any) { return getters.consentGivenForPurpose5 },

    clickupFormsEnabled(_state: State, getters: any) { return getters.consentGivenForPurpose2 },
    youtubeEnabled(_state: State, getters: any) { return getters.consentGivenForPurpose3 },
    mauticEnabled(_state: State, getters: any) { return getters.consentGivenForPurpose4 },
    livechatEnabled(_state: State, getters: any) { return getters.consentGivenForPurpose2 },
  }
}

function consentGivenForPurpose(state: State, iPurpose: number) {
  return !state.consent_rejected &&
    (state.preference_not_needed || state.consent_given || state.consent_given_purpose[iPurpose])
}
