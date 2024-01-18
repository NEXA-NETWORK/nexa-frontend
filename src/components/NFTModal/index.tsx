import { useState, useEffect } from "react";
import { Flex } from "components/Box";
import {
  Closeicon,
  ImageContainer,
  MainContainer,
  NFTMainContainer,
  NFTimgcontainer,
} from "./styles";
import { Text } from "components/Text";
import Modal from "react-modal";
import useTheme from "hooks/useTheme";
import Button from "components/Button";
import { getMoralisNFTs } from "services/nft.service";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { toast } from "react-toastify";
import { MORALIS_CHAIN_IDs } from "config/constants/chains";
import { catERC721 } from "config/abi/catERC721";
import { ethers } from "ethers";
import axios from "axios";

const NFTmodal = ({
  modalIsOpen,
  setModalIsOpen,
  setNftId,
  nfts,
  setSelectedChainNetworks,
}) => {
  const { theme } = useTheme();
  const [isSelected, setIsSelected] = useState(false);
  const [nftCollection, setNftCollection] = useState<any>();
  const { chain } = useNetwork();
  const [selectedCollectionNfts, setSelectedCollectionNfts] = useState<any>();
  const [selectedNftId, setSelectedNftId] = useState(undefined);
  const { data: signer } = useSigner();
  const { address: walletAddress } = useAccount();

  const closeModal = (callFrom?: string) => {
    // if (callFrom === 'close') {
    //   setSelectedNFT('')
    // }
    setModalIsOpen(false);
    setIsSelected(false);
    setSelectedCollectionNfts(null);
  };

  const cleanseURI = (URI: string) => {
    return URI.replace("ipfs://", "https://ipfs.io/ipfs/");
  };

  const handleMoralisChainIds = (chainId) => {
    return MORALIS_CHAIN_IDs[chainId];
  };

  // TODO: Alternate for moralis when moralis is down (Fallback)

  const getUserNFTs = async (userWallet: string, contractAddress: string) => {
    try {
      const contract = new ethers.Contract(contractAddress, catERC721, signer);
      const totalNFTs = await contract.balanceOf(userWallet);
      const userNFTs: Array<any> = [];
      for (let i = 0; i < totalNFTs; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(userWallet, i);
        const URI = await contract.tokenURI(tokenId);
        const updateURI = cleanseURI(URI);
        const tokenJson = await axios.get(updateURI);
        let imageURI = "";
        if (tokenJson?.data && tokenJson?.data?.image) {
          imageURI = cleanseURI(tokenJson?.data?.image);
        }
        const NFTObject = {
          tokenId: tokenId?.toString(),
          imageURL: imageURI,
        };
        userNFTs.push(NFTObject);
      }
      return userNFTs;
    } catch (error) {
      console.log("Error get user NFT", error);
      return [];
    }
  };

  const handleCollection = () => {
    setSelectedNftId(null);
    const networks = nftCollection.networks.filter((res) => res.chainId);
    setSelectedChainNetworks(networks);
    if (nftCollection && selectedNftId == null) {
      const genericAddress = nftCollection?.networks.find(
        (res) => res?.genericTokenAddress != null
      )?.genericTokenAddress;
      const collectionTokenAddress = nftCollection?.networks?.find(
        (res) => res?.chainId === chain?.id
      )?.address;
      const address =
        genericAddress && nftCollection?.tokenMintChainId === chain?.id
          ? genericAddress
          : collectionTokenAddress;
      const fetchNFTdetails = async () => {
        try {
          const result = await getMoralisNFTs(
            walletAddress,
            address,
            handleMoralisChainIds(chain?.id)
          );
          const nfts = result?.data?.result?.map((res) => {
            return {
              id: res?.token_id,
              image: cleanseURI(res?.normalized_metadata?.image),
            };
          });
          setIsSelected(true);
          setSelectedCollectionNfts(nfts);
        } catch (error) {
          toast.error(`Error while fetching NFTs.`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            theme: "dark",
          });
        }
      };
      fetchNFTdetails();
    } else {
      setNftId(selectedNftId);
      setModalIsOpen(false);
      setIsSelected(false);
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => closeModal("close")}
      contentLabel="NFT Modal"
      ariaHideApp={false}
    >
      <Flex justifyContent={"center"} background={"#0F1111"}>
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Flex>
            <Text
              fontFamily={theme.fonts.primary}
              fontWeight={theme.fonts.semiBold}
              fontSize={"32px"}
            >
              Select NFT collection
            </Text>
            <Closeicon onClick={() => closeModal("close")} />
          </Flex>
          <Text
            fontFamily={theme.fonts.primary}
            fontWeight={theme.fonts.light}
            color={theme.colors.textDisabled}
            fontSize={"14px"}
            mt={"15px"}
          >
            Migrate your NFT across chains.
          </Text>
        </Flex>
      </Flex>
      {isSelected === false && (
        <Flex
          justifyContent={"flex-start"}
          className="custom-scroll"
          maxHeight={"270px"}
          overflow={"auto"}
          flexWrap={"wrap"}
          width={"100%"}
        >
          {nfts?.map((nftData, index) => (
            <CollectionContainer
              key={index}
              setNftCollection={setNftCollection}
              nftCollection={nftCollection}
              name={nftData.name}
              index={nfts[index]}
              url={nftData?.imageUrl}
            />
          ))}
        </Flex>
      )}
      {isSelected === true && (
        <Flex
          justifyContent={"flex-start"}
          className="custom-scroll"
          maxHeight={"270px"}
          overflow={"auto"}
          flexWrap={"wrap"}
          width={"100%"}
        >
          {selectedCollectionNfts?.map((item, index) => (
            <NFTContainer
              key={index}
              setSelectedNftId={setSelectedNftId}
              selectedNftId={selectedNftId}
              nftId={item?.id}
              url={item?.image}
            />
          ))}
        </Flex>
      )}
      <Flex justifyContent={"flex-end"} mt={"60px"}>
        <Flex mr={"10px"}>
          <Button
            height={"44px"}
            width={"240px"}
            type={"button"}
            variant={"secondary"}
            onClick={() => closeModal("close")}
          >
            <Flex justifyContent={"center"}>
              <Text
                fontWeight={theme.fonts.semiBold}
                fontSize={"14px"}
                color={theme.colors.link}
                ml={"6px"}
              >
                Cancel
              </Text>
            </Flex>
          </Button>
        </Flex>
        <Button
          height={"44px"}
          width={"240px"}
          type={"button"}
          variant={"tertiary"}
          onClick={() => handleCollection()}
        >
          <Flex justifyContent={"center"}>
            <Text
              fontWeight={theme.fonts.semiBold}
              fontSize={"14px"}
              ml={"6px"}
            >
              Select
            </Text>
          </Flex>
        </Button>
      </Flex>
    </Modal>
  );
};

const CollectionContainer = ({
  setNftCollection,
  nftCollection,
  name,
  url,
  index,
}) => {
  const { theme } = useTheme();
  return (
    <MainContainer>
      <Flex flexDirection={"column"}>
        <Flex>
          <ImageContainer
            className={nftCollection === index && "selected-border"}
            onClick={() => {
              setNftCollection(index);
            }}
          >
            <img src={url} width={169} height={165} />
          </ImageContainer>
        </Flex>
        <Text
          mt={"25px"}
          ml={"10px"}
          fontFamily={theme.fonts.primary}
          fontWeight={theme.fonts.semiBold}
          fontSize={"12px"}
        >
          {name}
        </Text>
      </Flex>
    </MainContainer>
  );
};

const NFTContainer = ({ setSelectedNftId, selectedNftId, nftId, url }) => {
  const { theme } = useTheme();
  return (
    <NFTMainContainer ml={"15px"}>
      <Flex flexDirection={"column"}>
        <NFTimgcontainer
          className={selectedNftId === nftId && "selected-border"}
          onClick={() => setSelectedNftId(nftId)}
        >
          <img src={url} width={119} height={119} />
        </NFTimgcontainer>
        <Text
          mt={"10px"}
          fontFamily={theme.fonts.primary}
          fontWeight={theme.fonts.light}
          fontSize={"14px"}
        >{`NFT ID: ${nftId}`}</Text>
      </Flex>
    </NFTMainContainer>
  );
};

export default NFTmodal;
