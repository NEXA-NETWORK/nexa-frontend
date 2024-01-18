import Header from "./components/Header";
import GlobalStyle from "./GlobalStyle";
import CAT from "components/Views/Chain-Agnostic-Token";
import { Switch, Route, Redirect } from "react-router-dom";
import DeployTokens from "components/Views/DeployTokens";
import TokenDetails from "components/Views/TokenDetails";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Bridge from "components/Views/Bridge";
import Bridgeprogress from "components/Views/Bridge/Bridgeprogress";
import NFT from "components/Views/CAT-NFT";
import DeployNFT from "components/Views/DeployNFT";
import BridgeNFT from "components/Views/Bridge-nft";
import { TopLight } from "AppStyles";
import useViewport from "hooks/useViewport";
import Comingsoon from "components/Views/ComingSoon/Comingsoon";

const App: React.FC = () => {
  const { width } = useViewport();
  const isMobile = width < 1140;
  return (
    <>
      <GlobalStyle />
      {isMobile ? (
        <>
          <TopLight />
          <Comingsoon />
        </>
      ) : (
        <>
          <Header />
          <TopLight />
          <Switch>
            <Route path={["/", "/cat/token"]} exact>
              <CAT />
            </Route>
            <Route path="/cat/nft" exact>
              <NFT />
            </Route>
            <Route path="/deploy/nft" exact>
              <DeployNFT />
            </Route>
            <Route path="/deploy/token" exact>
              <DeployTokens />
            </Route>
            <Route path="/details" exact>
              <TokenDetails />
            </Route>
            <Route path="/bridge/token" exact>
              <Bridge />
            </Route>
            <Route path="/bridge/nft" exact>
              <BridgeNFT />
            </Route>
            <Route path="/bridge/status" exact>
              <Bridgeprogress />
            </Route>
            <Redirect from="*" to="/" />
          </Switch>
          <ToastContainer newestOnTop={true} />
        </>
      )}
    </>
  );
};

export default App;
