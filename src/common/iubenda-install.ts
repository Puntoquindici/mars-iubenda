/******************************************************************************
 * Iubenda setup and install
 *****************************************************************************/
declare global {
  interface Window {
    dataLayer: any
    __iubCategories: any
    _iub: any
  }
}

declare let process: any

const installIubenda = function(lang: string, iubendaShouldLog: boolean = true, $store: any = undefined, baseUrl: string = 'https://www.myarstudio.cloud') {
  const siteId = 2701995
  const cookiePolicies : {[id: string]: number} = {
    'en': 20018456,
    'it': 61469158,
    'de': 21462515,
  }
  const cookiePolicyId = cookiePolicies[lang] || cookiePolicies.en
  const banner = {
    'acceptButtonCaptionColor': '#FFFFFF',
    'acceptButtonColor': '#0073CE',
    'acceptButtonDisplay': true,
    'backgroundColor': '#FFFFFF',
    'backgroundOverlay': false,
    'brandBackgroundColor': '#FFFFFF',
    'brandTextColor': '#000000',
    'closeButtonDisplay': false,
    'customizeButtonCaptionColor': '#4D4D4D',
    'customizeButtonColor': '#DADADA',
    'customizeButtonDisplay': true,
    'explicitWithdrawal': true,
    'listPurposes': true,
    'logo': 'https://www.myarstudio.cloud/assets/img/logo.d9ac90d.svg',
    'position': 'float-bottom-center',
    'rejectButtonCaptionColor': '#FFFFFF',
    'rejectButtonColor': '#0073CE',
    'rejectButtonDisplay': true,
    'showPurposesToggles': true,
    'textColor': '#000000'
  }

  if ($store) { $store.dispatch('iubenda/setShouldLog', iubendaShouldLog) }

  // process.client is used in nuxt.js build
  if (process === undefined || (process.client !== undefined && process.client)) {
    const dataLayer = window.dataLayer || null
    iubendaShouldLog &&
      console.log('App.vue installIubenda language: ', lang,
        'siteId:', siteId,
        'cookiePolicyId:', cookiePolicyId)
    window.__iubCategories = {}
    window._iub = window._iub || {}
    window._iub.csConfiguration = {
      'askConsentAtCookiePolicyUpdate': true,
      'countryDetection': true,
      'applyGdprForCH': false,
      'enableFadp': true,
      'enableLgpd': true,
      'enableUspr': true,
      'usprPurposes': 's,adv',
      'gdprAppliesGlobally': false,
      'lgpdAppliesGlobally': false,
      lang,
      'localConsentDomain': 'myarstudio.cloud',
      'logLevel': 'debug',
      'perPurposeConsent': true,
      siteId,
      'whitelabel': false,
      cookiePolicyId,
      'reloadOnConsent': true,
      banner,
      // https://www.iubenda.com/en/help/74198-google-consent-mode-set-up-google-tag-manager-with-iubenda
      // see "Manual embedding"
      'googleConsentMode': 'template',
      'emitGtmEvents': true,
      'callback': {
        'onPreferenceExpressedOrNotNeeded': (preference: any) => { // does not bind? using self
          window.__iubCategories = window._iub.cs.consent.purposes
          iubendaShouldLog && console.log('Iubenda cb ')

          const ccpaOptedOut = window._iub.cs.api.isCcpaOptedOut()
          if (dataLayer) {
            dataLayer.push({
              iubenda_ccpa_opted_out: ccpaOptedOut
            })
          }
          if ($store) { $store.dispatch('iubenda/setCcpaOptedOut', ccpaOptedOut) }
          iubendaShouldLog && console.log('Iubenda cb: GTag dataLayer push ', 'iubenda_ccpa_opted_out:' + ccpaOptedOut)

          if (!preference) {
            if (dataLayer) {
              dataLayer.push({
                event: 'iubenda_preference_not_needed'
              })
            }
            if ($store) { $store.dispatch('iubenda/setPreferenceNotNeeded', true) }
            iubendaShouldLog && console.log('Iubenda cb: GTag dataLayer push ', 'iubenda_preference_not_needed')
          } else {
            if ($store) { $store.dispatch('iubenda/setPreferenceNotNeeded', false) }
            if (preference.consent === true) {
              if (dataLayer) {
                dataLayer.push({
                  event: 'iubenda_consent_given'
                })
              }
              if ($store) { $store.dispatch('iubenda/setConsetGiven', true) }
              iubendaShouldLog && console.log('Iubenda cb: GTag dataLayer push ', 'iubenda_consent_given')
            } else if (preference.consent === false) {
              if (dataLayer) {
                dataLayer.push({
                  event: 'iubenda_consent_rejected'
                })
              }
              if ($store) { $store.dispatch('iubenda/setConsetRejected', true) }
              iubendaShouldLog && console.log('Iubenda cb: GTag dataLayer push ', 'iubenda_consent_rejected')
            } else if (preference.purposes) {
              if ($store) { $store.dispatch('iubenda/resetConsetGivenPurpose') }
              for (const purposeId in preference.purposes) {
                if (preference.purposes[purposeId]) {
                  if (dataLayer) {
                    dataLayer.push({
                      event: 'iubenda_consent_given_purpose_' + purposeId
                    })
                  }
                  if ($store) { $store.dispatch('iubenda/setConsetGivenPurpose', { iPurpose: purposeId, bValue: true }) }
                  iubendaShouldLog && console.log('Iubenda cb: GTag dataLayer push ', 'iubenda_consent_given_purpose_' + purposeId)
                }
              }
            }
            // TODO: should we do something spefic for US Privacy Law
          }
        }
      },
    }

    const iubendaScripts: {[id: string]: string}[] = [
      { src: '//cs.iubenda.com/sync/2701995.js' },
      { src: '//cdn.iubenda.com/cs/gpp/stub.js' },
      // local modified version of
      // { src: '//cdn.iubenda.com/cs/iubenda_cs.js', charset: 'UTF-8', async: '' },
      // NOTE: this downloads a versioned script. It probably must be updated regurarily.
      // There is one file per language: they have been modified to encapsulate the iubenda elements
      // with a <section> element to avoid double H1 in page
      { src: `${baseUrl}/js/iubenda/iubenda_cs.js`, charset: 'UTF-8', async: '' },
      { src: `${baseUrl}/js/debugIubendaBootstrap.js`, charset: 'UTF-8', async: '' },

      // old setup:
      // { src: '/js/debugIubendaBootstrap.js' },
      // { src: '//cdn.iubenda.com/cs/ccpa/stub.js' },
      // { src: '//cdn.iubenda.com/cs/iubenda_cs.js', charset: 'UTF-8', async: '' },
    ]
    for (const iubendaScript of iubendaScripts) {
      iubendaShouldLog && console.log('Appending script tag', iubendaScript)
      const script = document.createElement('script')
      const keys = Object.keys(iubendaScript)
      keys.forEach((key) => {
        script.setAttribute(key, iubendaScript[key])
      })
      document.head.appendChild(script)
    }
  }
}

export default installIubenda
