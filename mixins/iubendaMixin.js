/* global dataLayer */
const dataLayer = window.dataLayer || null;
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
    livechatEnabled() {
      return this.$store.getters["iubenda/livechatEnabled"];
    },


    consentGivenForPurpose1() { return this.$store.getters['iubenda/consentGivenForPurpose1']; },
    consentGivenForPurpose2() { return this.$store.getters['iubenda/consentGivenForPurpose2']; },
    consentGivenForPurpose3() { return this.$store.getters['iubenda/consentGivenForPurpose3']; },
    consentGivenForPurpose4() { return this.$store.getters['iubenda/consentGivenForPurpose4']; },
    consentGivenForPurpose5() { return this.$store.getters['iubenda/consentGivenForPurpose5']; },

    necessaryEnabled() { return this.$store.getters['iubenda/necessaryEnabled']; },         // level 1
    functionalityEnabled() { return this.$store.getters['iubenda/functionalityEnabled']; }, // level 2
    experienceEnabled() { return this.$store.getters['iubenda/experienceEnabled']; },       // level 3
    measurementEnabled() { return this.$store.getters['iubenda/measurementEnabled']; },     // level 4
    marketingEnabled() { return this.$store.getters['iubenda/marketingEnabled']; }          // level 5
  },
  methods: {
    installIubenda() {
      this.iubendaShouldLog &&
        console.log("App.vue installIubenda language: ", this.$store.getters['iubenda/lang'], 
                    "siteId:", this.$store.getters['iubenda/siteId'],
                    "cookiePolicyId:", this.$store.getters['iubenda/cookiePolicyId']);
      const self = this;
      window.iub = {
        level1: false,
        level2: false,
        level3: false,
        level4: false,
        level5: false
      };
      window.__iubCategories = {};
        /* eslint-disable-next-line */
      window._iub = window._iub || {};
      /* eslint-disable-next-line */
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
        "lang": self.$store.getters['iubenda/lang'],
        'localConsentDomain': 'myarstudio.cloud',
        'logLevel': 'debug',
        'perPurposeConsent': true,
        "siteId":  self.$store.getters['iubenda/siteId'],
        'whitelabel': false,
        "cookiePolicyId":  self.$store.getters['iubenda/cookiePolicyId'],
        'reloadOnConsent': true,
        // https://www.iubenda.com/en/help/74198-google-consent-mode-set-up-google-tag-manager-with-iubenda
        // see "Manual embedding"
        'googleConsentMode': 'template',
        'emitGtmEvents': true,
        'callback': {
          'onPreferenceExpressedOrNotNeeded': (preference) => { // does not bind? using self
            window.__iubCategories = window._iub.cs.consent.purposes
            self.iubendaShouldLog && console.log('Iubenda cb ')

            const ccpaOptedOut = window._iub.cs.api.isCcpaOptedOut()
            if (dataLayer) {
              dataLayer.push({
                iubenda_ccpa_opted_out: ccpaOptedOut
              })
            }
            self.$store.dispatch("iubenda/setCcpaOptedOut", ccpaOptedOut);
            self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_ccpa_opted_out:" + ccpaOptedOut);

            if (!preference) {
              if (dataLayer) {
                dataLayer.push({
                  event: 'iubenda_preference_not_needed'
                })
              }
              self.$store.dispatch("iubenda/setPreferenceNotNeeded", true);
              self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_preference_not_needed");
            } else {
              self.$store.dispatch("iubenda/setPreferenceNotNeeded", false);
              if (preference.consent === true) {
                if (dataLayer) {
                  dataLayer.push({
                    event: 'iubenda_consent_given'
                  })
                }
                self.$store.dispatch("iubenda/setConsetGiven", true);
                self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_consent_given");
              } else if (preference.consent === false) {
                if (dataLayer) {
                  dataLayer.push({
                    event: 'iubenda_consent_rejected'
                  })
                }
                self.$store.dispatch("iubenda/setConsetRejected", true);
                self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_consent_rejected");
              } else if (preference.purposes) {
                self.$store.dispatch("iubenda/resetConsetGivenPurpose");
                for (var purposeId in preference.purposes) {
                  if (preference.purposes[purposeId]) {
                    if (dataLayer) {
                      dataLayer.push({
                        event: 'iubenda_consent_given_purpose_' + purposeId
                      })
                    }
                    self.$store.dispatch("iubenda/setConsetGivenPurpose", {iPurpose: purposeId, bValue: true});
                    self.iubendaShouldLog && console.log("Iubenda cb: GTag dataLayer push ", "iubenda_consent_given_purpose_" + purposeId);

                    const getCookie = function(name) {
                      return document.cookie
                          .split("; ")
                          .find((row) => row.startsWith(name+'='))
                          ?.split("=")[1];
                    }

                    // detect if we have user info
                    const cookieValue = getCookie('mars_user_info')
                    console.log('mars cookie user', cookieValue)
                    const userInfo = cookieValue && JSON.parse(cookieValue)
                    if (userInfo && userInfo.user_id && userInfo.team_id && userInfo.user_plan) {
                      window.dataLayer = window.dataLayer || []
                      window.dataLayer.push({
                        user_id: userInfo.user_id,
                        team_id: userInfo.team_id,
                        user_plan: userInfo.user_plan
                      })
                    }

                    const enableLevel = function(level, userInfo) {
                      console.log("Iubenda enable level", level)
                      switch(level) {
                        case 1:
                          // TODO: enable logrocket script when we have enough traffic?
                          // TODO: load logrocket library
                          // window.LogRocket && window.LogRocket.init('sjxbwd/myarstudio-website');
                          // console.log("Iubenda -> lvl 1  : logrocket");

                          window.iub.level1 = true
                          break
                        case 2:
                          // LiveChat
                          // console.log("Iubenda -> LiveChat");
                          // window.__lc = window.__lc || {};
                          // window.__lc.license = 12709530;
                          // // @ts-ignore
                          // (function(n,t,c){function i(n){return e._h?e._h.apply(null,n):e._q.push(n)}var e={_q:[],_h:null,_v:"2.0",on:function(){i(["on",c.call(arguments)])},once:function(){i(["once",c.call(arguments)])},off:function(){i(["off",c.call(arguments)])},get:function(){if(!e._h)throw new Error("[LiveChatWidget] You can't use getters before load.");return i(["get",c.call(arguments)])},call:function(){i(["call",c.call(arguments)])},init:function(){var n=t.createElement("script");n.async=!0,n.type="text/javascript",n.src="https://cdn.livechatinc.com/tracking.js",t.head.appendChild(n)}};!n.__lc.asyncInit&&e.init(),n.LiveChatWidget=n.LiveChatWidget||e}(window,document,[].slice))

                          window.iub.level2 = true
                          break
                        case 3:
                          window.iub.level3 = true
                          break
                        case 4:
                          window.iub.level4 = true
                          break
                        case 5:
                          // Mautic
                          console.log("Iubenda -> Mautic");
                          // Note: using cached version of mtc.js: see script in /var/www/html/cache-mtc.sh on the mautic web server
                          // @ts-ignore
                          (function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n; w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},a=d.createElement(t),m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)})(window,document,'script','https://ma.myarstudio.cloud/media/js/mtc.js','mt');
                          if (userInfo && userInfo.user_id) {
                            (window).mt('send', 'pageview', { panel_user_id: userInfo.user_id })
                          } else {
                            (window).mt('send', 'pageview')
                          }
                          window.iub.level5 = true
                          break
                      }
                    }

                    enableLevel(+purposeId, userInfo)
                  }
                }
              }
              // TODO: should we do something spefic for US Privacy Law?
            }
          }
        },
        "banner": self.$store.getters['iubenda/banner'],
      };

      const iubendaScripts = [
        "/js/debugIubendaBootstrap.js",
        "//cdn.iubenda.com/cs/ccpa/stub.js",
        "//www.myarstudio.cloud/js/iubenda/iubenda_cs.js"
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