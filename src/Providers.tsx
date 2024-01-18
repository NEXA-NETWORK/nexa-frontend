import { Provider } from "react-redux";
import { ThemeContextProvider } from "contexts/ThemeContext";
import { WagmiProvider } from "contexts/WagmiContext";
import { ModalProvider } from "widgets/Modal";
import { store } from "app/store";
import { RefreshContextProvider } from "contexts/RefreshContext";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <RefreshContextProvider>
          <WagmiProvider>
            <ModalProvider>{children}</ModalProvider>
          </WagmiProvider>
        </RefreshContextProvider>
      </ThemeContextProvider>
    </Provider>
  );
};

export default Providers;
