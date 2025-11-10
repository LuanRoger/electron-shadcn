export const isMacOS = (): boolean => {
  return (
    typeof window !== "undefined" && window.navigator.platform.includes("Mac")
  );
};
