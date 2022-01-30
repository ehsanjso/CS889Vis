const { json } = require('express');
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const pino = require('pino')
const logger = pino({
  prettyPrint: true
})

router.post('/address', function (req, res, next) {
  let address = req.body.address
  let result = {}
  let balance_options = "https://openapi.debank.com/v1/user/chain_balance?" 
  let protocol_options = "https://openapi.debank.com/v1/user/simple_protocol_list?"
  fetch(balance_options+"id="+address+"&chain_id=eth")
  .then(res => res.json())
  .then(balance_json => {
    result['balance'] = balance_json['usd_value']
    return fetch(protocol_options+"id="+address+"&chain_id=eth")
    .then(res => res.json())
    .then(protocol_list => {
      let result_protocol = []
      for(each of protocol_list){
        if(each['net_usd_value'] > 0){
          result_protocol.push({"name": each['name'], "logo_url": each['logo_url'], 
          "site_url": each["site_url"], "asset": each['asset_usd_value']})
        }
      }
      result['protocol'] = result_protocol
      return res.status(200).json(result);
    })
  }).catch(err => 
    res.status(400).json("Address is not valid"));
});


module.exports = router;
