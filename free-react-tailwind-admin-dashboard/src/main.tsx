import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ thêm dòng này
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import  AppContextProvider  from "./context/AppContext.tsx"; // ✅ sửa đường dẫn

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ bọc toàn bộ ứng dụng */}
      <ThemeProvider>
        <AppWrapper>
          <AppContextProvider>
            <App />
          </AppContextProvider>      
        </AppWrapper>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
