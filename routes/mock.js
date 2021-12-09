const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/', (req, res) => {

    const resData = {
        data: [
            {
                "text": "コロナ・エキストラ[1]（スペイン語: Corona Extra）とは、モデーロ（Grupo Modelo）が製造するメキシコビールの銘柄。コロナ、コローナと corona の日本語転写は複数あるが、本記事では固有名称以外はアンハイザー・ブッシュ・インベブ・ジャパンが定める「コロナ」と記載する。",
                "score": 0.92,
                "concepts": [
                    {
                        "name":"ビール",
                        "relevance": 0.88
                    },
                    {
                        "name": "Youtube",
                        "relevance": 0.74
                    }
                ]
            },
            {
                "text": "日本における2019年コロナウイルス感染症の流行状況（にほんにおける2019ねんコロナウイルスかんせんしょうのりゅうこうじょうきょう）では、日本における新型コロナウイルス感染症（COVID-19）の流行状況について述べる。",
                "score": 0.86,
                "concepts": [
                    {
                        "name":"風邪",
                        "relevance": 0.92
                    },
                    {
                        "name": "評判",
                        "relevance": 0.62
                    }
                ]
            },
            {
                "text": "日本における2019年コロナウイルス感染症の流行状況（にほんにおける2019ねんコロナウイルスかんせんしょうのりゅうこうじょうきょう）では、日本における新型コロナウイルス感染症（COVID-19）の流行状況について述べる。",
                "score": 0.86,
                "concepts": [
                    {
                        "name":"風邪",
                        "relevance": 0.92
                    },
                    {
                        "name": "評判",
                        "relevance": 0.62
                    }
                ]
            },
            {
                "text": "日本における2019年コロナウイルス感染症の流行状況（にほんにおける2019ねんコロナウイルスかんせんしょうのりゅうこうじょうきょう）では、日本における新型コロナウイルス感染症（COVID-19）の流行状況について述べる。",
                "score": 0.86,
                "concepts": [
                    {
                        "name":"風邪",
                        "relevance": 0.92
                    },
                    {
                        "name": "評判",
                        "relevance": 0.62
                    }
                ]
            },
            {
                "text": "日本における2019年コロナウイルス感染症の流行状況（にほんにおける2019ねんコロナウイルスかんせんしょうのりゅうこうじょうきょう）では、日本における新型コロナウイルス感染症（COVID-19）の流行状況について述べる。",
                "score": 0.86,
                "concepts": [
                    {
                        "name":"風邪",
                        "relevance": 0.92
                    },
                    {
                        "name": "評判",
                        "relevance": 0.62
                    }
                ]
            }
        ]
    }
    
    if(!req.body.item_num){
        req.body.item_num = 3;
    }
    if(!req.body.text){
        res.status(400).send('Missing search text.');
    }
    
    resData.data = resData.data.slice(0,req.body.item_num)
    res.json(resData);
});

module.exports = router;
