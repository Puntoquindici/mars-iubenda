/* global dataLayer */

export default {
  computed: {
    iubendaShouldLog() {
      return this.$store.getters["iubenda/log"];
    },
    clickupFormsEnabled() {
      return this.$store.getters["iubenda/clickupFormsEnabled"];
    },
    mauticEnabled() {
      return this.$store.getters["iubenda/mauticEnabled"];
    },
    youtubeEnabled() {
      this.iubendaShouldLog && console.log("youtubeEnabled", this.$store.getters['iubenda/youtubeEnabled'])
      return this.$store.getters['iubenda/youtubeEnabled'];
    },
  },
  methods: {
    installIubenda() {
      this.iubendaShouldLog &&
        console.log("App.vue installIubenda language: ", this.$store.getters['iubenda/lang'], 
                    "siteId:", this.$store.getters['iubenda/siteId'],
                    "cookiePolicyId:", this.$store.getters['iubenda/cookiePolicyId']);
      const self = this;
      window.__iubCategories = {};
        /* eslint-disable-next-line */
      window._iub = window._iub || {};
      /* eslint-disable-next-line */
      window._iub.csConfiguration = {
        "askConsentAtCookiePolicyUpdate": true,
        "ccpaAcknowledgeOnDisplay": true,
        "consentOnContinuedBrowsing": false,
        "countryDetection": true,
        "enableCcpa": true,
        "enableLgpd": true,
        "gdprAppliesGlobally": false,
        "invalidateConsentWithoutLog": true,
        "lang": self.$store.getters['iubenda/lang'], 
        "lgpdAppliesGlobally": false,
        // "localConsentDomain": "myarstudio.cloud",
        "logLevel": "info",
        "perPurposeConsent": true,
        "siteId":  self.$store.getters['iubenda/siteId'],
        "whitelabel": false,
        "cookiePolicyId":  self.$store.getters['iubenda/cookiePolicyId'],
        // "cookiePolicyUrl": this.$i18n.t('links.cookie-policy'),
        // "privacyPolicyUrl": this.$i18n.t('links.privacy-policy'),
        "callback": {
          "onPreferenceExpressedOrNotNeeded": (preference) => { // does not bind? using self
            window.__iubCategories = window._iub.cs.consent.purposes;
            self.iubendaShouldLog && console.log("Iubenda cb ");

            const ccpaOptedOut = window._iub.cs.api.isCcpaOptedOut();
            dataLayer.push({
              iubenda_ccpa_opted_out:ccpaOptedOut
            });
            self.$store.dispatch("iubenda/setCcpaOptedOut", ccpaOptedOut);
            self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_ccpa_opted_out:" + ccpaOptedOut);

            if (!preference) {
              dataLayer.push({
                event: "iubenda_preference_not_needed"
              });
              self.$store.dispatch("iubenda/setPreferenceNotNeeded", true);
              self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_preference_not_needed");
            } else {
              self.$store.dispatch("iubenda/setPreferenceNotNeeded", false);
              if (preference.consent === true) {
                dataLayer.push({
                  event: "iubenda_consent_given"
                });
                self.$store.dispatch("iubenda/setConsetGiven", true);
                self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_consent_given");
              } else if (preference.consent === false) {
                dataLayer.push({
                  event: "iubenda_consent_rejected"
                });
                self.$store.dispatch("iubenda/setConsetRejected", true);
                self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_consent_rejected");
              } else if (preference.purposes) {
                self.$store.dispatch("iubenda/resetConsetGivenPurpose");
                for (var purposeId in preference.purposes) {
                  if (preference.purposes[purposeId]) {
                    dataLayer.push({
                      event: "iubenda_consent_given_purpose_" + purposeId
                    });
                    self.$store.dispatch("iubenda/setConsetGivenPurpose", {iPurpose: purposeId, bValue: true});
                    self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_consent_given_purpose_" + purposeId);
                  }
                }
              }
            }
          }
        }, 
        "banner": self.$store.getters['iubenda/banner'],
      };

      const iubendaScripts = [
        "/debugIubendaBootstrap.js",
        "//cdn.iubenda.com/cs/ccpa/stub.js",
        "//cdn.iubenda.com/cs/iubenda_cs.js"
      ];
      for(const iubendaScript of iubendaScripts) {
        this.iubendaLog && console.log("Appending script tag", iubendaScript);
        const script = document.createElement('script');
        script.setAttribute('src', iubendaScript);
        document.head.appendChild(script);
      }
    }
  }
}