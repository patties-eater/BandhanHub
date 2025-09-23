import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // show when install is possible
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);

      // auto-hide after 10 seconds
      setTimeout(() => {
        setVisible(false);
      }, 10000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // hide if already installed
    const installedHandler = () => {
      setVisible(false);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Install choice:", outcome);
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg p-4 rounded-xl flex items-center gap-3 animate-bounce">
      <span className="font-semibold">📲 Install BandhanHub app?</span>
      <button
        onClick={handleInstall}
        className="bg-white text-pink-600 font-bold px-4 py-2 rounded-lg shadow-md transform transition hover:scale-110 hover:bg-gray-100"
      >
        Install
      </button>
    </div>
  );
}
