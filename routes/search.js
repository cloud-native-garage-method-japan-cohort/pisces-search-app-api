const express = require('express');

const DiscoveryV1 = require('ibm-watson/discovery/v1');
const {IamAuthenticator} = require('ibm-watson/auth');
const getConfig = require('../tools/get-config');
const e = require('express');
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

const createSearchQuery = (categoryLabel, searchStr) => {
  const texts = searchStr.split(' ').map((item) => `text:"${item}"`).join(',');
  return `(${texts})`;
};

const createSolutionQuery = (sha) => {
  return `text:"下記の通りです。",extracted_metadata.sha1::${sha}`
}

const searchSolutions = async (result) => {
  const solutionQueryParams = {
    environmentId: config.watson.discovery.environmentId,
    collectionId: config.watson.discovery.collectionId,
    highlight: true,
    query: createSolutionQuery(result.extracted_metadata.sha1) ,
  };
  const solutionQueryResponse = await discovery.query(solutionQueryParams);
  const solutions = solutionQueryResponse.result.results;
  if(solutions.length > 0){
    return solutions[0].highlight.text[0]
      .replace(/<\/??em>/g, '')
      .replace(/.+下記の通りです。/g,'')
      .replace(/\s\W.+/g, '')
      .replace(/^\s/,'')
      .replace(/\sIBM/g,",IBM")
      .replace(/\sDb2/g,",Db2")
      .split(',')
  }
  return [];
}

const removeUnnecessaryWords = (text) => {
  return text
    .replace(/<\/??em>/g, '')
    .replace(/\s/g,'')
    .replace('-日本_IBM.pdf', '');
}

const runQuery = async (categoryLabel, searchStr, item_num) => {
  const searchQuery = createSearchQuery(categoryLabel, searchStr);

  const queryParams = {
    environmentId: config.watson.discovery.environmentId,
    collectionId: config.watson.discovery.collectionId,
    highlight: true,
    query: searchQuery ,
  };

  console.log(`Running query - ${searchQuery}`);
  const queryResponse = await discovery.query(queryParams);

  // let result = '';
  const results = queryResponse.result.results;
  //console.log(JSON.stringify(results, null, '\t'));
  if (queryResponse.result.results && queryResponse.result.results.length > 0) {
    
    const restest = await Promise.all(
      queryResponse.result.results
      .slice(0, item_num)
      .map(async result => {
        return {
          text: removeUnnecessaryWords(result.highlight.text[0]),
          caseName: removeUnnecessaryWords(result.extracted_metadata.filename),
          solutions: await searchSolutions(result),
          score: result.result_metadata.score,
          concepts: result.enriched_text.concepts.map((each) => ({
            text:each.text,
            relevance:each.relevance
          }))
        }
    }));
    return restest;
  } else {
    return [];
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
