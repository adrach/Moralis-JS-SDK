"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/**
 * Automatically generated code, via genWeb3API.js
 * Do not modify manually
 */


const axios = require('axios');

class Web3Api {
  static initialize({
    apiKey,
    serverUrl,
    Moralis = null
  }) {
    if (!serverUrl && !apiKey) {
      throw new Error('Web3Api.initialize failed: initialize with apiKey or serverUrl');
    }

    if (apiKey) this.apiKey = apiKey;
    if (serverUrl) this.serverUrl = serverUrl;
    this.Moralis = Moralis;
  }

  static getBody(params, bodyParams) {
    if (!params || !bodyParams || !bodyParams.length) {
      return undefined;
    }

    let body = {};
    bodyParams.forEach(({
      key,
      type,
      required
    }) => {
      if (params[key] === undefined) {
        if (required) throw new Error(`param ${key} is required!`);
      } else if (type === this.BodyParamTypes.setBody) {
        body = params[key];
      } else {
        body[key] = params[key];
      } // remove the param so it doesn't also get added as a query param


      delete params[key];
    });
    return body;
  }

  static getParameterizedUrl(url, params) {
    if (!Object.keys(params).length) return url; // find url params, they start with :

    const requiredParams = url.split('/').filter(s => s && s.includes(':'));
    if (!requiredParams.length) return url;
    let parameterizedUrl = url;
    requiredParams.forEach(p => {
      // strip the : and replace with param value
      const key = p.substr(1);
      const value = params[key];

      if (!value) {
        throw new Error(`required param ${key} not provided`);
      }

      parameterizedUrl = parameterizedUrl.replace(p, value); // remove required param from param list
      // so it doesn't become part of the query params

      delete params[key];
    });
    return parameterizedUrl;
  }

  static getErrorMessage(error, url) {
    var _error$response, _error$response$data;

    return (error === null || error === void 0 ? void 0 : (_error$response = error.response) === null || _error$response === void 0 ? void 0 : (_error$response$data = _error$response.data) === null || _error$response$data === void 0 ? void 0 : _error$response$data.message) || (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : error.toString()) || `Web3 API error while calling ${url}`;
  }

  static async fetch({
    endpoint,
    params
  }) {
    const {
      method = 'GET',
      url,
      bodyParams
    } = endpoint;

    if (this.Moralis) {
      const {
        User,
        account
      } = this.Moralis;
      const user = User.current();

      if (!params.address) {
        if (user) {
          params.address = user.get('ethAddress');
        } else if (account) {
          params.address = account;
        }
      }
    }

    if (!this.apiKey) {
      return this.apiCall(endpoint.name, params);
    }

    try {
      const parameterizedUrl = this.getParameterizedUrl(url, params);
      const body = this.getBody(params, bodyParams);
      const response = await axios(this.baseURL + parameterizedUrl, {
        params,
        method,
        body,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey
        }
      });
      return response.data;
    } catch (error) {
      const msg = this.getErrorMessage(error, url);
      throw new Error(msg);
    }
  }

  static async apiCall(name, options) {
    if (!this.serverUrl) {
      throw new Error('Web3Api not initialized, run Moralis.start() first');
    }

    try {
      const http = axios.create({
        baseURL: this.serverUrl
      });
      if (!options.chain) options.chain = 'eth';
      const response = await http.post(`/functions/${name}`, options, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      return response.data.result;
    } catch (error) {
      var _error$response2, _error$response2$data;

      if ((_error$response2 = error.response) !== null && _error$response2 !== void 0 && (_error$response2$data = _error$response2.data) !== null && _error$response2$data !== void 0 && _error$response2$data.error) {
        throw new Error(error.response.data.error);
      }

      throw error;
    }
  }

}

_defineProperty(Web3Api, "baseURL", 'https://deep-index.moralis.io/api/v2');

_defineProperty(Web3Api, "BodyParamTypes", {
  setBody: 'set body',
  property: 'property'
});

_defineProperty(Web3Api, "native", {
  getBlock: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "native",
      "name": "getBlock",
      "url": "/block/:block_number_or_hash"
    },
    params: options
  }),
  getDateToBlock: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "native",
      "name": "getDateToBlock",
      "url": "/dateToBlock"
    },
    params: options
  }),
  getLogsByAddress: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "native",
      "name": "getLogsByAddress",
      "url": "/:address/logs"
    },
    params: options
  }),
  getNFTTransfersByBlock: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "native",
      "name": "getNFTTransfersByBlock",
      "url": "/block/:block_number_or_hash/nft/transfers"
    },
    params: options
  }),
  getTransaction: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "native",
      "name": "getTransaction",
      "url": "/transaction/:transaction_hash"
    },
    params: options
  }),
  getContractEvents: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "POST",
      "group": "native",
      "name": "getContractEvents",
      "url": "/:address/events",
      "bodyParams": [{
        "key": "data",
        "type": "set body",
        "required": false
      }]
    },
    params: options
  }),
  runContractFunction: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "POST",
      "group": "native",
      "name": "runContractFunction",
      "url": "/:address/function",
      "bodyParams": [{
        "key": "abi",
        "type": "property",
        "required": true
      }, {
        "key": "params",
        "type": "property",
        "required": false
      }]
    },
    params: options
  })
});

_defineProperty(Web3Api, "account", {
  getTransactions: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "account",
      "name": "getTransactions",
      "url": "/:address"
    },
    params: options
  }),
  getNativeBalance: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "account",
      "name": "getNativeBalance",
      "url": "/:address/balance"
    },
    params: options
  }),
  getTokenBalances: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "account",
      "name": "getTokenBalances",
      "url": "/:address/erc20"
    },
    params: options
  }),
  getTokenTransfers: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "account",
      "name": "getTokenTransfers",
      "url": "/:address/erc20/transfers"
    },
    params: options
  }),
  getNFTs: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "account",
      "name": "getNFTs",
      "url": "/:address/nft"
    },
    params: options
  }),
  getNFTTransfers: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "account",
      "name": "getNFTTransfers",
      "url": "/:address/nft/transfers"
    },
    params: options
  }),
  getNFTsForContract: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "account",
      "name": "getNFTsForContract",
      "url": "/:address/nft/:token_address"
    },
    params: options
  })
});

_defineProperty(Web3Api, "token", {
  getTokenMetadata: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getTokenMetadata",
      "url": "/erc20/metadata"
    },
    params: options
  }),
  getNFTTrades: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getNFTTrades",
      "url": "/nft/:address/trades"
    },
    params: options
  }),
  getNFTLowestPrice: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getNFTLowestPrice",
      "url": "/nft/:address/lowestprice"
    },
    params: options
  }),
  getTokenMetadataBySymbol: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getTokenMetadataBySymbol",
      "url": "/erc20/metadata/symbols"
    },
    params: options
  }),
  getTokenPrice: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getTokenPrice",
      "url": "/erc20/:address/price"
    },
    params: options
  }),
  getTokenAddressTransfers: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getTokenAddressTransfers",
      "url": "/erc20/:address/transfers"
    },
    params: options
  }),
  getTokenAllowance: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getTokenAllowance",
      "url": "/erc20/:address/allowance"
    },
    params: options
  }),
  searchNFTs: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "searchNFTs",
      "url": "/nft/search"
    },
    params: options
  }),
  getNftTransfersFromToBlock: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getNftTransfersFromToBlock",
      "url": "/nft/transfers"
    },
    params: options
  }),
  getAllTokenIds: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getAllTokenIds",
      "url": "/nft/:address"
    },
    params: options
  }),
  getContractNFTTransfers: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getContractNFTTransfers",
      "url": "/nft/:address/transfers"
    },
    params: options
  }),
  getNFTOwners: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getNFTOwners",
      "url": "/nft/:address/owners"
    },
    params: options
  }),
  getNFTMetadata: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getNFTMetadata",
      "url": "/nft/:address/metadata"
    },
    params: options
  }),
  reSyncMetadata: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "reSyncMetadata",
      "url": "/nft/:address/:token_id/metadata/resync"
    },
    params: options
  }),
  syncNFTContract: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "PUT",
      "group": "token",
      "name": "syncNFTContract",
      "url": "/nft/:address/sync"
    },
    params: options
  }),
  getTokenIdMetadata: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getTokenIdMetadata",
      "url": "/nft/:address/:token_id"
    },
    params: options
  }),
  getTokenIdOwners: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getTokenIdOwners",
      "url": "/nft/:address/:token_id/owners"
    },
    params: options
  }),
  getWalletTokenIdTransfers: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "token",
      "name": "getWalletTokenIdTransfers",
      "url": "/nft/:address/:token_id/transfers"
    },
    params: options
  })
});

_defineProperty(Web3Api, "resolve", {
  resolveDomain: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "resolve",
      "name": "resolveDomain",
      "url": "/resolve/:domain"
    },
    params: options
  }),
  resolveAddress: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "resolve",
      "name": "resolveAddress",
      "url": "/resolve/:address/reverse"
    },
    params: options
  })
});

_defineProperty(Web3Api, "defi", {
  getPairReserves: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "defi",
      "name": "getPairReserves",
      "url": "/:pair_address/reserves"
    },
    params: options
  }),
  getPairAddress: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "defi",
      "name": "getPairAddress",
      "url": "/:token0_address/:token1_address/pairAddress"
    },
    params: options
  })
});

_defineProperty(Web3Api, "storage", {
  uploadFolder: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "POST",
      "group": "storage",
      "name": "uploadFolder",
      "url": "/ipfs/uploadFolder",
      "bodyParams": [{
        "key": "data",
        "type": "set body",
        "required": false
      }]
    },
    params: options
  })
});

_defineProperty(Web3Api, "info", {
  web3ApiVersion: async (options = {}) => Web3Api.fetch({
    endpoint: {
      "method": "GET",
      "group": "info",
      "name": "web3ApiVersion",
      "url": "/web3/version"
    },
    params: options
  })
});

var _default = Web3Api;
exports.default = _default;