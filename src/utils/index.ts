import { ADDRESS_TXN_EXPLORER_LINK } from "config/constants/endpoints";
import { BigNumber } from "ethers";

const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const truncateHash = (address: string, startLength: number) => {
  return `${address.substring(0, startLength)}...${address.substring(address.length - 4)}`;
};

const truncateAddress = (address: any) => {
  if (!address) return "No Account";
  const match = address.match(
    /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{8})$/
  );
  if (!match) return address;
  return `${match[1]}.............${match[2]}`;
};

const noExponents = function (expNum) {
  var data = String(expNum).split(/[eE]/);

  if (data.length === 1) return data[0];

  var z = "",
    sign = expNum < 0 ? "-" : "",
    str = data[0].replace(".", ""),
    mag = Number(data[1]) + 1;

  if (mag < 0) {
    z = sign + "0.";

    while (mag++) z += "0"; // eslint-disable-next-line no-useless-escape

    return z + str.replace(/^\-/, "");
  }

  mag -= str.length;

  while (mag--) z += "0";

  return str + z;
};

const handleDecimals = (balance: number) => {
  if (balance) {
    const zeros = -Math.floor(Math.log10(balance) + 1)
    if (zeros >= 4) { return balance.toFixed(6) }
    if (zeros >= 2 && zeros < 4) { return balance.toFixed(4) }
    else { return balance.toFixed(2) }
  }
}

const viewExplorer = (chainId: number, txHash: string) => {
  window.open(`${ADDRESS_TXN_EXPLORER_LINK[chainId]}${txHash}`, "_blank");
}

const increaseGasFee = (
  value: BigNumber,
  percentage: number,
): BigNumber => {
  return value
    ?.mul(
      BigNumber.from(percentage * 1000)?.add(BigNumber.from(percentage * 100)),
    )
    ?.div(BigNumber.from(percentage * 1000));
}

export { copyToClipboard, truncateHash, truncateAddress, noExponents, handleDecimals, viewExplorer, increaseGasFee };
