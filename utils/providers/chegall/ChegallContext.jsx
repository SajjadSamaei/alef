"use client";
import { createContext, useContext, useState } from "react";

const ChegallContext = createContext();

export const ChegallProvider = ({ children }) => {
  // Logo
  const chegallLogoColor = "fill-white group-hover:fill-neutral-200";
  const chegallLogoColorInvert =
    "fill-neutral-950 fill-jarounLight group-hover:fill-jarounDark";
  const jarounLogoColor = "fill-jarounNeutralDark group-hover:fill-jarounLight";
  const jarounLogoColorInvert = "fill-jarounLight group-hover:fill-jarounDark";

  // User Agent
  const [userAgent, setUserAgent] = useState("");
  const [browser, setBrowser] = useState({ name: "", version: "" });
  const [isBrowserOld, setIsBrowserOld] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [iOsVersion, setIosVersion] = useState("");

  const value = {
    chegallLogoColor,
    chegallLogoColorInvert,
    jarounLogoColor,
    jarounLogoColorInvert,
    userAgent,
    setUserAgent,
    browser,
    setBrowser,
    isBrowserOld,
    setIsBrowserOld,
    isIOS,
    setIsIOS,
    iOsVersion,
    setIosVersion,
  };

  return (
    <ChegallContext.Provider value={value}>{children}</ChegallContext.Provider>
  );
};

export const useChegallContext = () => {
  return useContext(ChegallContext);
};
