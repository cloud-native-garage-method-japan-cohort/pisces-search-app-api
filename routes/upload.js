const stream = require('stream');
const express = require('express');
const cors = require('cors')({ origin: true });

const DiscoveryV1 = require('ibm-watson/discovery/v1');
const {IamAuthenticator} = require('ibm-watson/auth');
const getConfig = require('../tools/get-config');
const { response } = require('express');
const config = getConfig();

// eslint-disable-next-line new-cap
const router = express.Router();

// 接続情報
const discovery = new DiscoveryV1({
  version: config.watson.discovery.version,
  authenticator: new IamAuthenticator({
    apikey: config.watson.discovery.apikey,
  }),
  serviceUrl: config.watson.discovery.serviceUrl,
});

const contentTypes = {
  'HTML': 'text/html',
};

router.post('/', async (req, res) => {
  if (req.method == "OPTIONS") {
    cors(req, res, () => {
      response.status(200).send()
    });
    return
  }

  const contentType = contentTypes[req.body.type];
  if (contentType === undefined) {
    return res.status(400).send(JSON.stringify({
      'message': 'unsupported content type.',
    }));
  }

  const addDocumentParams = {
    environmentId: config.watson.discovery.environmentId,
    collectionId: config.watson.discovery.collectionId,
    file: stream.Readable.from([req.body.contents]),
    filename: req.body.name,
    fileContentType: contentType,
  };
  const response = await discovery.addDocument(addDocumentParams);
  res.json({
    document_id: response.document_id,
    status: response.status,
  });
});

module.exports = router;