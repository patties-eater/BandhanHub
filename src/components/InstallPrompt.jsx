// import { useEffect, useState } from "react";

// export default function InstallPrompt() {
//   const [deferredPrompt, setDeferredPrompt] = useState(null);
//   const [showButton, setShowButton] = useState(false);

//   useEffect(() => {
//     const handler = (e) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       setShowButton(true);
//     };

//     window.addEventListener("beforeinstallprompt", handler);

//     return () => window.removeEventListener("beforeinstallprompt", handler);
//   }, []);

//   const handleInstall = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     console.log("User response to install:", outcome);
//     setDeferredPrompt(null);
//     setShowButton(false);
//   };

//   if (!showButton) return null;

//   return (
//     <div className="fixed bottom-4 right-4 bg-white shadow-md p-3 rounded-lg flex items-center gap-2">
//       <span>Install BandhanHub app?</span>
//       <button
//         onClick={handleInstall}
//         className="bg-pink-500 text-white px-3 py-1 rounded"
//       >
//         Install
//       </button>
//     </div>
//   );
// }




// src/components/InstallPrompt.jsx
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
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
    <div className="fixed bottom-4 right-4 bg-white shadow-md p-3 rounded-lg flex items-center gap-2">
      <span>Install BandhanHub app?</span>
      <button
        onClick={handleInstall}
        className="bg-pink-500 text-white px-3 py-1 rounded"
      >
        Install
      </button>
    </div>
  );
}
