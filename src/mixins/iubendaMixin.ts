import Vue from 'vue'
declare global {
  interface Window {
    dataLayer: any
    __iubCategories: any
    _iub: any
  }
}

export default Vue.extend({
  computed: {
    iubendaShouldLog(): boolean {
      return this.$store.getters['iubenda/log']
    },
    clickupFormsEnabled(): boolean {
      return this.$store.getters['iubenda/clickupFormsEnabled']
    },
    mauticEnabled(): boolean {
      return this.$store.getters['iubenda/mauticEnabled']
    },
    youtubeEnabled(): boolean {
      this.iubendaShouldLog && console.log('youtubeEnabled', this.$store.getters['iubenda/youtubeEnabled'])
      return this.$store.getters['iubenda/youtubeEnabled']
    },
    livechatEnabled(): boolean {
      return this.$store.getters['iubenda/livechatEnabled']
    },

    consentGivenForPurpose1(): boolean { return this.$store.getters['iubenda/consentGivenForPurpose1'] },
    consentGivenForPurpose2(): boolean { return this.$store.getters['iubenda/consentGivenForPurpose2'] },
    consentGivenForPurpose3(): boolean { return this.$store.getters['iubenda/consentGivenForPurpose3'] },
    consentGivenForPurpose4(): boolean { return this.$store.getters['iubenda/consentGivenForPurpose4'] },
    consentGivenForPurpose5(): boolean { return this.$store.getters['iubenda/consentGivenForPurpose5'] },

    necessaryEnabled(): boolean { return this.$store.getters['iubenda/necessaryEnabled'] }, // level 1
    functionalityEnabled(): boolean { return this.$store.getters['iubenda/functionalityEnabled'] }, // level 2
    experienceEnabled(): boolean { return this.$store.getters['iubenda/experienceEnabled'] }, // level 3
    measurementEnabled(): boolean { return this.$store.getters['iubenda/measurementEnabled'] }, // level 4
    marketingEnabled(): boolean { return this.$store.getters['iubenda/marketingEnabled'] } // level 5
  }
})
