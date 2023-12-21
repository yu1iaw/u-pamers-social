import * as WebBrowser from 'expo-web-browser';

export const openURL = (url) => {
    let prefix = "";
    if (!url.includes('https://')) prefix += 'https://';

    try {
        WebBrowser.openBrowserAsync(prefix + url);
    } catch(err) {
        alert("Unable to view website");
    }
}