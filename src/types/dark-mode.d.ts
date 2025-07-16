declare module 'dark-mode' {
  const darkMode: {
    isEnabled(): Promise<boolean>;
    toggle(): Promise<void>;
    enable(): Promise<void>;
    disable(): Promise<void>;
  };
  export default darkMode;
}
