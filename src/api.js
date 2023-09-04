const express = require("express");
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Alchemy, Network } = require("alchemy-sdk");

const config = {
  apiKey: "nI4gnkiLtepVjnFU_phTTeaJizPXaLQN",
  network: Network.ETH_SEPOLIA,
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
  // console.log(nfts);
  const result = Array.from(nfts.ownedNfts);

  result.map((item) => {
    console.log(item.contract.address);
    if (
      item.contract.address.toLowerCase() ===
      "0x3988c4412888FA14C3F6552562fBD9b49377A130".toLowerCase()
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
