import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Importing styles
import "./styles/global.css";
import "./index.css";

// Importing fonts
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

// Importing the main App component
import App from "./App.jsx";

// Importing the AuthProvider and ThemeProvider
import { AuthProvider } from "./context/AuthContext.jsx"; // Context provider
import { ThemeProvider } from "./context/ThemeContext"; // Theme provider

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found in the document");
  throw new Error("Root element is missing");
}
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ThemeProvider> {/* Outer wrapper for theme context */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);