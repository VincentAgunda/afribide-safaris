import Cookies from "js-cookie";

const COOKIE_NAME = "cookie_consent";

export const defaultConsent = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
};

export const getConsent = () => {
  const consent = Cookies.get(COOKIE_NAME);

  if (!consent) return null;

  try {
    return JSON.parse(consent);
  } catch {
    // fallback for old values like "accepted"
    if (consent === "accepted") {
      return {
        necessary: true,
        preferences: true,
        statistics: true,
        marketing: true,
      };
    }
    return defaultConsent;
  }
};

export const setConsent = (settings) => {
  Cookies.set(COOKIE_NAME, JSON.stringify(settings), {
    expires: 365,
  });
};