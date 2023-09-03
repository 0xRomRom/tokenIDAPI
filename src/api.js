const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Alchemy, Network } = require("alchemy-sdk");

const config = {
  apiKey: "22AL6QQADYRRsmC7gB8JbNNXMw-uJJGG",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

const app = express();

const router = express.Router();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

router.post("/", async (req, res) => {
  const wallet = req.body.address;

  let tokenIDs = [];
  const nfts = await alchemy.nft.getNftsForOwner(wallet);
  console.log(nfts);
  const result = nfts.ownedNfts;

  result.map((item) => {
    if (
      item.contract.address === "0x924e5435837325fdD5048004c4f14BF822980C7c"
    ) {
      tokenIDs.push(item.tokenId);
    }
  });
  console.log(tokenIDs);

  res.json({ result: tokenIDs });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/.netlify/functions/api", router);

module.exports.handler = serverless(app);
