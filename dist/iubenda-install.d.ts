/******************************************************************************
 * Iubenda setup and install
 *****************************************************************************/
declare global {
    interface Window {
        dataLayer: any;
        __iubCategories: any;
        _iub: any;
    }
}
declare const installIubenda: (lang: string, iubendaShouldLog?: boolean, $store?: any, baseUrl?: string) => void;
export default installIubenda;
//# sourceMappingURL=iubenda-install.d.ts.map