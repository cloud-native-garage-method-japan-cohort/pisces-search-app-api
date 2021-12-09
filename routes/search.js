const express = require('express');

const DiscoveryV1 = require('ibm-watson/discovery/v1');
const {IamAuthenticator} = require('ibm-watson/auth');
const config = require('config');

// eslint-disable-next-line new-cap
const router = express.Router();


// 接続情報
const discovery = new DiscoveryV1({
  version: config.get('watson.discovery.version'),
  authenticator: new IamAuthenticator({
    apikey: config.get('watson.discovery.apikey'),
  }),
  serviceUrl: config.get('watson.discovery.serviceUrl'),
});

const createQuery = (categoryLabel, searchStr) => {
  const texts = searchStr.split(' ').map((item) => `text:"${item}"`).join(',');
  return `(${texts})`;
};

const runQuery = async (categoryLabel, searchStr, item_num) => {
  const query = createQuery(categoryLabel, searchStr);

  const queryParams = {
    environmentId: config.get('watson.discovery.environmentId'),
    collectionId: config.get('watson.discovery.collectionId'),
    highlight: true,
    query,
    // _return: 'highlight',
  };

  console.log(`Running query - ${query}`);
  const queryResponse = await discovery.query(queryParams);

  // let result = '';
  const results = queryResponse.result.results;
  console.log(JSON.stringify(results, null, '\t'));
  if (queryResponse.result.results && queryResponse.result.results.length > 0) {
    return queryResponse.result.results.slice(0, item_num).map(result => {
      return {
        text: result.highlight.text[0].replace(/<em>/g, '').replace(/<\/em>/g, ''),
        score: result.result_metadata.score,
        concepts: result.enriched_text.concepts.map((each) => ({
          text:each.text,
          relevance:each.relevance
        }))
      }
    });
  } else {
    return '該当する情報が見つかりませんでした。';
  }
};


router.post('/', async (req, res) => {
  try {
    console.debug(JSON.stringify(req.body))

    if (!req.body.text) {
      res.status(400).send('Missing search text.');
      return;
    }

    const item_num_default = 3
    const data = await runQuery('/health and fitness/disease', req.body.text, req.body.item_num || item_num_default);
    res.json({
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to call watson service');
  }
});

module.exports = router;
