const express = require('express');
const router = express.Router();
const pino = require('pino')
const logger = pino({
  prettyPrint: true
})
const fs = require('fs');
const csv = require('csv-parser');

router.get('/uniswap', function (req, res, next) {
  var uniswap = [];
  fs.createReadStream('data/Uniswap.csv')
    .pipe(csv())
    .on('data', (row) => {
      uniswap.push(row)
    })
    .on('end', () => {
      logger.info('Uniswap CSV file successfully processed');
      return res.status(200).json(uniswap);
    });
});

router.get('/sushiswap', function (req, res, next) {
  var sushiswap = [];
  fs.createReadStream('data/Sushiswap.csv')
    .pipe(csv())
    .on('data', (row) => {
      sushiswap.push(row)
    })
    .on('end', () => {
      logger.info('Sushiswap CSV file successfully processed');
      return res.status(200).json(sushiswap);
    });
});

router.get('/balancer', function (req, res, next) {
  var balancer = [];
  fs.createReadStream('data/Balancer.csv')
    .pipe(csv())
    .on('data', (row) => {
      balancer.push(row)
    })
    .on('end', () => {
      logger.info('Balancer CSV file successfully processed');
      return res.status(200).json(balancer);
    });
});

router.get('/makerdao', function (req, res, next) {
  var makerDAO = [];
  fs.createReadStream('data/MakerDAO.csv')
    .pipe(csv())
    .on('data', (row) => {
      makerDAO.push(row)
    })
    .on('end', () => {
      logger.info('MakerDAO CSV file successfully processed');
      return res.status(200).json(makerDAO);
    });
});

router.get('/aave', function (req, res, next) {
  var AAVE = [];
  fs.createReadStream('data/AAVE.csv')
    .pipe(csv())
    .on('data', (row) => {
      AAVE.push(row)
    })
    .on('end', () => {
      logger.info('AAVE CSV file successfully processed');
      return res.status(200).json(AAVE);
    });
});

router.get('/compound', function (req, res, next) {
  var Compound = [];
  fs.createReadStream('data/Compound.csv')
    .pipe(csv())
    .on('data', (row) => {
      Compound.push(row)
    })
    .on('end', () => {
      logger.info('Compound CSV file successfully processed');
      return res.status(200).json(Compound);
    });
});

router.get('/nexus', function (req, res, next) {
  var Nexus = [];
  fs.createReadStream('data/Nexus_Mutual.csv')
    .pipe(csv())
    .on('data', (row) => {
      Nexus.push(row)
    })
    .on('end', () => {
      logger.info('Nexus Mutual CSV file successfully processed');
      return res.status(200).json(Nexus);
    });
});

router.get('/synthetix', function (req, res, next) {
  var Synthetix = [];
  fs.createReadStream('data/Synthetix.csv')
    .pipe(csv())
    .on('data', (row) => {
      Synthetix.push(row)
    })
    .on('end', () => {
      logger.info('Synthetix CSV file successfully processed');
      return res.status(200).json(Synthetix);
    });
});

router.get('/all', function (req, res, next) {
  var all = [];
  fs.createReadStream('data/all.csv')
    .pipe(csv())
    .on('data', (row) => {
      all.push(row)
    })
    .on('end', () => {
      logger.info('All CSV file successfully processed');
      return res.status(200).json(all);
    });
});

module.exports = router;
