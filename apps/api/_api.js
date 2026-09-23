"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to2, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key3 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to2, key3) && key3 !== except)
        __defProp(to2, key3, { get: () => from[key3], enumerable: !(desc = __getOwnPropDesc(from, key3)) || desc.enumerable });
  }
  return to2;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/bcryptjs/dist/bcrypt.js
var require_bcrypt = __commonJS({
  "../../node_modules/bcryptjs/dist/bcrypt.js"(exports2, module2) {
    (function(global2, factory) {
      if (typeof define === "function" && define["amd"])
        define([], factory);
      else if (typeof require === "function" && typeof module2 === "object" && module2 && module2["exports"])
        module2["exports"] = factory();
      else
        (global2["dcodeIO"] = global2["dcodeIO"] || {})["bcrypt"] = factory();
    })(exports2, function() {
      "use strict";
      var bcrypt4 = {};
      var randomFallback = null;
      function random(len) {
        if (typeof module2 !== "undefined" && module2 && module2["exports"])
          try {
            return require("crypto")["randomBytes"](len);
          } catch (e) {
          }
        try {
          var a2;
          (self["crypto"] || self["msCrypto"])["getRandomValues"](a2 = new Uint32Array(len));
          return Array.prototype.slice.call(a2);
        } catch (e) {
        }
        if (!randomFallback)
          throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");
        return randomFallback(len);
      }
      var randomAvailable = false;
      try {
        random(1);
        randomAvailable = true;
      } catch (e) {
      }
      randomFallback = null;
      bcrypt4.setRandomFallback = function(random2) {
        randomFallback = random2;
      };
      bcrypt4.genSaltSync = function(rounds, seed_length) {
        rounds = rounds || GENSALT_DEFAULT_LOG2_ROUNDS;
        if (typeof rounds !== "number")
          throw Error("Illegal arguments: " + typeof rounds + ", " + typeof seed_length);
        if (rounds < 4)
          rounds = 4;
        else if (rounds > 31)
          rounds = 31;
        var salt = [];
        salt.push("$2a$");
        if (rounds < 10)
          salt.push("0");
        salt.push(rounds.toString());
        salt.push("$");
        salt.push(base64_encode(random(BCRYPT_SALT_LEN), BCRYPT_SALT_LEN));
        return salt.join("");
      };
      bcrypt4.genSalt = function(rounds, seed_length, callback) {
        if (typeof seed_length === "function")
          callback = seed_length, seed_length = void 0;
        if (typeof rounds === "function")
          callback = rounds, rounds = void 0;
        if (typeof rounds === "undefined")
          rounds = GENSALT_DEFAULT_LOG2_ROUNDS;
        else if (typeof rounds !== "number")
          throw Error("illegal arguments: " + typeof rounds);
        function _async(callback2) {
          nextTick(function() {
            try {
              callback2(null, bcrypt4.genSaltSync(rounds));
            } catch (err2) {
              callback2(err2);
            }
          });
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err2, res) {
              if (err2) {
                reject(err2);
                return;
              }
              resolve(res);
            });
          });
      };
      bcrypt4.hashSync = function(s, salt) {
        if (typeof salt === "undefined")
          salt = GENSALT_DEFAULT_LOG2_ROUNDS;
        if (typeof salt === "number")
          salt = bcrypt4.genSaltSync(salt);
        if (typeof s !== "string" || typeof salt !== "string")
          throw Error("Illegal arguments: " + typeof s + ", " + typeof salt);
        return _hash(s, salt);
      };
      bcrypt4.hash = function(s, salt, callback, progressCallback) {
        function _async(callback2) {
          if (typeof s === "string" && typeof salt === "number")
            bcrypt4.genSalt(salt, function(err2, salt2) {
              _hash(s, salt2, callback2, progressCallback);
            });
          else if (typeof s === "string" && typeof salt === "string")
            _hash(s, salt, callback2, progressCallback);
          else
            nextTick(callback2.bind(this, Error("Illegal arguments: " + typeof s + ", " + typeof salt)));
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err2, res) {
              if (err2) {
                reject(err2);
                return;
              }
              resolve(res);
            });
          });
      };
      function safeStringCompare(known, unknown) {
        var right = 0, wrong = 0;
        for (var i = 0, k = known.length; i < k; ++i) {
          if (known.charCodeAt(i) === unknown.charCodeAt(i))
            ++right;
          else
            ++wrong;
        }
        if (right < 0)
          return false;
        return wrong === 0;
      }
      bcrypt4.compareSync = function(s, hash) {
        if (typeof s !== "string" || typeof hash !== "string")
          throw Error("Illegal arguments: " + typeof s + ", " + typeof hash);
        if (hash.length !== 60)
          return false;
        return safeStringCompare(bcrypt4.hashSync(s, hash.substr(0, hash.length - 31)), hash);
      };
      bcrypt4.compare = function(s, hash, callback, progressCallback) {
        function _async(callback2) {
          if (typeof s !== "string" || typeof hash !== "string") {
            nextTick(callback2.bind(this, Error("Illegal arguments: " + typeof s + ", " + typeof hash)));
            return;
          }
          if (hash.length !== 60) {
            nextTick(callback2.bind(this, null, false));
            return;
          }
          bcrypt4.hash(s, hash.substr(0, 29), function(err2, comp) {
            if (err2)
              callback2(err2);
            else
              callback2(null, safeStringCompare(comp, hash));
          }, progressCallback);
        }
        if (callback) {
          if (typeof callback !== "function")
            throw Error("Illegal callback: " + typeof callback);
          _async(callback);
        } else
          return new Promise(function(resolve, reject) {
            _async(function(err2, res) {
              if (err2) {
                reject(err2);
                return;
              }
              resolve(res);
            });
          });
      };
      bcrypt4.getRounds = function(hash) {
        if (typeof hash !== "string")
          throw Error("Illegal arguments: " + typeof hash);
        return parseInt(hash.split("$")[2], 10);
      };
      bcrypt4.getSalt = function(hash) {
        if (typeof hash !== "string")
          throw Error("Illegal arguments: " + typeof hash);
        if (hash.length !== 60)
          throw Error("Illegal hash length: " + hash.length + " != 60");
        return hash.substring(0, 29);
      };
      var nextTick = typeof process !== "undefined" && process && typeof process.nextTick === "function" ? typeof setImmediate === "function" ? setImmediate : process.nextTick : setTimeout;
      function stringToBytes(str) {
        var out = [], i = 0;
        utfx.encodeUTF16toUTF8(function() {
          if (i >= str.length) return null;
          return str.charCodeAt(i++);
        }, function(b) {
          out.push(b);
        });
        return out;
      }
      var BASE64_CODE = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
      var BASE64_INDEX = [
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        0,
        1,
        54,
        55,
        56,
        57,
        58,
        59,
        60,
        61,
        62,
        63,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        -1,
        -1,
        -1,
        -1,
        -1,
        -1,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50,
        51,
        52,
        53,
        -1,
        -1,
        -1,
        -1,
        -1
      ];
      var stringFromCharCode = String.fromCharCode;
      function base64_encode(b, len) {
        var off = 0, rs2 = [], c1, c2;
        if (len <= 0 || len > b.length)
          throw Error("Illegal len: " + len);
        while (off < len) {
          c1 = b[off++] & 255;
          rs2.push(BASE64_CODE[c1 >> 2 & 63]);
          c1 = (c1 & 3) << 4;
          if (off >= len) {
            rs2.push(BASE64_CODE[c1 & 63]);
            break;
          }
          c2 = b[off++] & 255;
          c1 |= c2 >> 4 & 15;
          rs2.push(BASE64_CODE[c1 & 63]);
          c1 = (c2 & 15) << 2;
          if (off >= len) {
            rs2.push(BASE64_CODE[c1 & 63]);
            break;
          }
          c2 = b[off++] & 255;
          c1 |= c2 >> 6 & 3;
          rs2.push(BASE64_CODE[c1 & 63]);
          rs2.push(BASE64_CODE[c2 & 63]);
        }
        return rs2.join("");
      }
      function base64_decode(s, len) {
        var off = 0, slen = s.length, olen = 0, rs2 = [], c1, c2, c3, c4, o, code;
        if (len <= 0)
          throw Error("Illegal len: " + len);
        while (off < slen - 1 && olen < len) {
          code = s.charCodeAt(off++);
          c1 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          code = s.charCodeAt(off++);
          c2 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          if (c1 == -1 || c2 == -1)
            break;
          o = c1 << 2 >>> 0;
          o |= (c2 & 48) >> 4;
          rs2.push(stringFromCharCode(o));
          if (++olen >= len || off >= slen)
            break;
          code = s.charCodeAt(off++);
          c3 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          if (c3 == -1)
            break;
          o = (c2 & 15) << 4 >>> 0;
          o |= (c3 & 60) >> 2;
          rs2.push(stringFromCharCode(o));
          if (++olen >= len || off >= slen)
            break;
          code = s.charCodeAt(off++);
          c4 = code < BASE64_INDEX.length ? BASE64_INDEX[code] : -1;
          o = (c3 & 3) << 6 >>> 0;
          o |= c4;
          rs2.push(stringFromCharCode(o));
          ++olen;
        }
        var res = [];
        for (off = 0; off < olen; off++)
          res.push(rs2[off].charCodeAt(0));
        return res;
      }
      var utfx = (function() {
        "use strict";
        var utfx2 = {};
        utfx2.MAX_CODEPOINT = 1114111;
        utfx2.encodeUTF8 = function(src, dst) {
          var cp = null;
          if (typeof src === "number")
            cp = src, src = function() {
              return null;
            };
          while (cp !== null || (cp = src()) !== null) {
            if (cp < 128)
              dst(cp & 127);
            else if (cp < 2048)
              dst(cp >> 6 & 31 | 192), dst(cp & 63 | 128);
            else if (cp < 65536)
              dst(cp >> 12 & 15 | 224), dst(cp >> 6 & 63 | 128), dst(cp & 63 | 128);
            else
              dst(cp >> 18 & 7 | 240), dst(cp >> 12 & 63 | 128), dst(cp >> 6 & 63 | 128), dst(cp & 63 | 128);
            cp = null;
          }
        };
        utfx2.decodeUTF8 = function(src, dst) {
          var a2, b, c, d, fail2 = function(b2) {
            b2 = b2.slice(0, b2.indexOf(null));
            var err2 = Error(b2.toString());
            err2.name = "TruncatedError";
            err2["bytes"] = b2;
            throw err2;
          };
          while ((a2 = src()) !== null) {
            if ((a2 & 128) === 0)
              dst(a2);
            else if ((a2 & 224) === 192)
              (b = src()) === null && fail2([a2, b]), dst((a2 & 31) << 6 | b & 63);
            else if ((a2 & 240) === 224)
              ((b = src()) === null || (c = src()) === null) && fail2([a2, b, c]), dst((a2 & 15) << 12 | (b & 63) << 6 | c & 63);
            else if ((a2 & 248) === 240)
              ((b = src()) === null || (c = src()) === null || (d = src()) === null) && fail2([a2, b, c, d]), dst((a2 & 7) << 18 | (b & 63) << 12 | (c & 63) << 6 | d & 63);
            else throw RangeError("Illegal starting byte: " + a2);
          }
        };
        utfx2.UTF16toUTF8 = function(src, dst) {
          var c1, c2 = null;
          while (true) {
            if ((c1 = c2 !== null ? c2 : src()) === null)
              break;
            if (c1 >= 55296 && c1 <= 57343) {
              if ((c2 = src()) !== null) {
                if (c2 >= 56320 && c2 <= 57343) {
                  dst((c1 - 55296) * 1024 + c2 - 56320 + 65536);
                  c2 = null;
                  continue;
                }
              }
            }
            dst(c1);
          }
          if (c2 !== null) dst(c2);
        };
        utfx2.UTF8toUTF16 = function(src, dst) {
          var cp = null;
          if (typeof src === "number")
            cp = src, src = function() {
              return null;
            };
          while (cp !== null || (cp = src()) !== null) {
            if (cp <= 65535)
              dst(cp);
            else
              cp -= 65536, dst((cp >> 10) + 55296), dst(cp % 1024 + 56320);
            cp = null;
          }
        };
        utfx2.encodeUTF16toUTF8 = function(src, dst) {
          utfx2.UTF16toUTF8(src, function(cp) {
            utfx2.encodeUTF8(cp, dst);
          });
        };
        utfx2.decodeUTF8toUTF16 = function(src, dst) {
          utfx2.decodeUTF8(src, function(cp) {
            utfx2.UTF8toUTF16(cp, dst);
          });
        };
        utfx2.calculateCodePoint = function(cp) {
          return cp < 128 ? 1 : cp < 2048 ? 2 : cp < 65536 ? 3 : 4;
        };
        utfx2.calculateUTF8 = function(src) {
          var cp, l = 0;
          while ((cp = src()) !== null)
            l += utfx2.calculateCodePoint(cp);
          return l;
        };
        utfx2.calculateUTF16asUTF8 = function(src) {
          var n = 0, l = 0;
          utfx2.UTF16toUTF8(src, function(cp) {
            ++n;
            l += utfx2.calculateCodePoint(cp);
          });
          return [n, l];
        };
        return utfx2;
      })();
      Date.now = Date.now || function() {
        return +/* @__PURE__ */ new Date();
      };
      var BCRYPT_SALT_LEN = 16;
      var GENSALT_DEFAULT_LOG2_ROUNDS = 10;
      var BLOWFISH_NUM_ROUNDS = 16;
      var MAX_EXECUTION_TIME = 100;
      var P_ORIG = [
        608135816,
        2242054355,
        320440878,
        57701188,
        2752067618,
        698298832,
        137296536,
        3964562569,
        1160258022,
        953160567,
        3193202383,
        887688300,
        3232508343,
        3380367581,
        1065670069,
        3041331479,
        2450970073,
        2306472731
      ];
      var S_ORIG = [
        3509652390,
        2564797868,
        805139163,
        3491422135,
        3101798381,
        1780907670,
        3128725573,
        4046225305,
        614570311,
        3012652279,
        134345442,
        2240740374,
        1667834072,
        1901547113,
        2757295779,
        4103290238,
        227898511,
        1921955416,
        1904987480,
        2182433518,
        2069144605,
        3260701109,
        2620446009,
        720527379,
        3318853667,
        677414384,
        3393288472,
        3101374703,
        2390351024,
        1614419982,
        1822297739,
        2954791486,
        3608508353,
        3174124327,
        2024746970,
        1432378464,
        3864339955,
        2857741204,
        1464375394,
        1676153920,
        1439316330,
        715854006,
        3033291828,
        289532110,
        2706671279,
        2087905683,
        3018724369,
        1668267050,
        732546397,
        1947742710,
        3462151702,
        2609353502,
        2950085171,
        1814351708,
        2050118529,
        680887927,
        999245976,
        1800124847,
        3300911131,
        1713906067,
        1641548236,
        4213287313,
        1216130144,
        1575780402,
        4018429277,
        3917837745,
        3693486850,
        3949271944,
        596196993,
        3549867205,
        258830323,
        2213823033,
        772490370,
        2760122372,
        1774776394,
        2652871518,
        566650946,
        4142492826,
        1728879713,
        2882767088,
        1783734482,
        3629395816,
        2517608232,
        2874225571,
        1861159788,
        326777828,
        3124490320,
        2130389656,
        2716951837,
        967770486,
        1724537150,
        2185432712,
        2364442137,
        1164943284,
        2105845187,
        998989502,
        3765401048,
        2244026483,
        1075463327,
        1455516326,
        1322494562,
        910128902,
        469688178,
        1117454909,
        936433444,
        3490320968,
        3675253459,
        1240580251,
        122909385,
        2157517691,
        634681816,
        4142456567,
        3825094682,
        3061402683,
        2540495037,
        79693498,
        3249098678,
        1084186820,
        1583128258,
        426386531,
        1761308591,
        1047286709,
        322548459,
        995290223,
        1845252383,
        2603652396,
        3431023940,
        2942221577,
        3202600964,
        3727903485,
        1712269319,
        422464435,
        3234572375,
        1170764815,
        3523960633,
        3117677531,
        1434042557,
        442511882,
        3600875718,
        1076654713,
        1738483198,
        4213154764,
        2393238008,
        3677496056,
        1014306527,
        4251020053,
        793779912,
        2902807211,
        842905082,
        4246964064,
        1395751752,
        1040244610,
        2656851899,
        3396308128,
        445077038,
        3742853595,
        3577915638,
        679411651,
        2892444358,
        2354009459,
        1767581616,
        3150600392,
        3791627101,
        3102740896,
        284835224,
        4246832056,
        1258075500,
        768725851,
        2589189241,
        3069724005,
        3532540348,
        1274779536,
        3789419226,
        2764799539,
        1660621633,
        3471099624,
        4011903706,
        913787905,
        3497959166,
        737222580,
        2514213453,
        2928710040,
        3937242737,
        1804850592,
        3499020752,
        2949064160,
        2386320175,
        2390070455,
        2415321851,
        4061277028,
        2290661394,
        2416832540,
        1336762016,
        1754252060,
        3520065937,
        3014181293,
        791618072,
        3188594551,
        3933548030,
        2332172193,
        3852520463,
        3043980520,
        413987798,
        3465142937,
        3030929376,
        4245938359,
        2093235073,
        3534596313,
        375366246,
        2157278981,
        2479649556,
        555357303,
        3870105701,
        2008414854,
        3344188149,
        4221384143,
        3956125452,
        2067696032,
        3594591187,
        2921233993,
        2428461,
        544322398,
        577241275,
        1471733935,
        610547355,
        4027169054,
        1432588573,
        1507829418,
        2025931657,
        3646575487,
        545086370,
        48609733,
        2200306550,
        1653985193,
        298326376,
        1316178497,
        3007786442,
        2064951626,
        458293330,
        2589141269,
        3591329599,
        3164325604,
        727753846,
        2179363840,
        146436021,
        1461446943,
        4069977195,
        705550613,
        3059967265,
        3887724982,
        4281599278,
        3313849956,
        1404054877,
        2845806497,
        146425753,
        1854211946,
        1266315497,
        3048417604,
        3681880366,
        3289982499,
        290971e4,
        1235738493,
        2632868024,
        2414719590,
        3970600049,
        1771706367,
        1449415276,
        3266420449,
        422970021,
        1963543593,
        2690192192,
        3826793022,
        1062508698,
        1531092325,
        1804592342,
        2583117782,
        2714934279,
        4024971509,
        1294809318,
        4028980673,
        1289560198,
        2221992742,
        1669523910,
        35572830,
        157838143,
        1052438473,
        1016535060,
        1802137761,
        1753167236,
        1386275462,
        3080475397,
        2857371447,
        1040679964,
        2145300060,
        2390574316,
        1461121720,
        2956646967,
        4031777805,
        4028374788,
        33600511,
        2920084762,
        1018524850,
        629373528,
        3691585981,
        3515945977,
        2091462646,
        2486323059,
        586499841,
        988145025,
        935516892,
        3367335476,
        2599673255,
        2839830854,
        265290510,
        3972581182,
        2759138881,
        3795373465,
        1005194799,
        847297441,
        406762289,
        1314163512,
        1332590856,
        1866599683,
        4127851711,
        750260880,
        613907577,
        1450815602,
        3165620655,
        3734664991,
        3650291728,
        3012275730,
        3704569646,
        1427272223,
        778793252,
        1343938022,
        2676280711,
        2052605720,
        1946737175,
        3164576444,
        3914038668,
        3967478842,
        3682934266,
        1661551462,
        3294938066,
        4011595847,
        840292616,
        3712170807,
        616741398,
        312560963,
        711312465,
        1351876610,
        322626781,
        1910503582,
        271666773,
        2175563734,
        1594956187,
        70604529,
        3617834859,
        1007753275,
        1495573769,
        4069517037,
        2549218298,
        2663038764,
        504708206,
        2263041392,
        3941167025,
        2249088522,
        1514023603,
        1998579484,
        1312622330,
        694541497,
        2582060303,
        2151582166,
        1382467621,
        776784248,
        2618340202,
        3323268794,
        2497899128,
        2784771155,
        503983604,
        4076293799,
        907881277,
        423175695,
        432175456,
        1378068232,
        4145222326,
        3954048622,
        3938656102,
        3820766613,
        2793130115,
        2977904593,
        26017576,
        3274890735,
        3194772133,
        1700274565,
        1756076034,
        4006520079,
        3677328699,
        720338349,
        1533947780,
        354530856,
        688349552,
        3973924725,
        1637815568,
        332179504,
        3949051286,
        53804574,
        2852348879,
        3044236432,
        1282449977,
        3583942155,
        3416972820,
        4006381244,
        1617046695,
        2628476075,
        3002303598,
        1686838959,
        431878346,
        2686675385,
        1700445008,
        1080580658,
        1009431731,
        832498133,
        3223435511,
        2605976345,
        2271191193,
        2516031870,
        1648197032,
        4164389018,
        2548247927,
        300782431,
        375919233,
        238389289,
        3353747414,
        2531188641,
        2019080857,
        1475708069,
        455242339,
        2609103871,
        448939670,
        3451063019,
        1395535956,
        2413381860,
        1841049896,
        1491858159,
        885456874,
        4264095073,
        4001119347,
        1565136089,
        3898914787,
        1108368660,
        540939232,
        1173283510,
        2745871338,
        3681308437,
        4207628240,
        3343053890,
        4016749493,
        1699691293,
        1103962373,
        3625875870,
        2256883143,
        3830138730,
        1031889488,
        3479347698,
        1535977030,
        4236805024,
        3251091107,
        2132092099,
        1774941330,
        1199868427,
        1452454533,
        157007616,
        2904115357,
        342012276,
        595725824,
        1480756522,
        206960106,
        497939518,
        591360097,
        863170706,
        2375253569,
        3596610801,
        1814182875,
        2094937945,
        3421402208,
        1082520231,
        3463918190,
        2785509508,
        435703966,
        3908032597,
        1641649973,
        2842273706,
        3305899714,
        1510255612,
        2148256476,
        2655287854,
        3276092548,
        4258621189,
        236887753,
        3681803219,
        274041037,
        1734335097,
        3815195456,
        3317970021,
        1899903192,
        1026095262,
        4050517792,
        356393447,
        2410691914,
        3873677099,
        3682840055,
        3913112168,
        2491498743,
        4132185628,
        2489919796,
        1091903735,
        1979897079,
        3170134830,
        3567386728,
        3557303409,
        857797738,
        1136121015,
        1342202287,
        507115054,
        2535736646,
        337727348,
        3213592640,
        1301675037,
        2528481711,
        1895095763,
        1721773893,
        3216771564,
        62756741,
        2142006736,
        835421444,
        2531993523,
        1442658625,
        3659876326,
        2882144922,
        676362277,
        1392781812,
        170690266,
        3921047035,
        1759253602,
        3611846912,
        1745797284,
        664899054,
        1329594018,
        3901205900,
        3045908486,
        2062866102,
        2865634940,
        3543621612,
        3464012697,
        1080764994,
        553557557,
        3656615353,
        3996768171,
        991055499,
        499776247,
        1265440854,
        648242737,
        3940784050,
        980351604,
        3713745714,
        1749149687,
        3396870395,
        4211799374,
        3640570775,
        1161844396,
        3125318951,
        1431517754,
        545492359,
        4268468663,
        3499529547,
        1437099964,
        2702547544,
        3433638243,
        2581715763,
        2787789398,
        1060185593,
        1593081372,
        2418618748,
        4260947970,
        69676912,
        2159744348,
        86519011,
        2512459080,
        3838209314,
        1220612927,
        3339683548,
        133810670,
        1090789135,
        1078426020,
        1569222167,
        845107691,
        3583754449,
        4072456591,
        1091646820,
        628848692,
        1613405280,
        3757631651,
        526609435,
        236106946,
        48312990,
        2942717905,
        3402727701,
        1797494240,
        859738849,
        992217954,
        4005476642,
        2243076622,
        3870952857,
        3732016268,
        765654824,
        3490871365,
        2511836413,
        1685915746,
        3888969200,
        1414112111,
        2273134842,
        3281911079,
        4080962846,
        172450625,
        2569994100,
        980381355,
        4109958455,
        2819808352,
        2716589560,
        2568741196,
        3681446669,
        3329971472,
        1835478071,
        660984891,
        3704678404,
        4045999559,
        3422617507,
        3040415634,
        1762651403,
        1719377915,
        3470491036,
        2693910283,
        3642056355,
        3138596744,
        1364962596,
        2073328063,
        1983633131,
        926494387,
        3423689081,
        2150032023,
        4096667949,
        1749200295,
        3328846651,
        309677260,
        2016342300,
        1779581495,
        3079819751,
        111262694,
        1274766160,
        443224088,
        298511866,
        1025883608,
        3806446537,
        1145181785,
        168956806,
        3641502830,
        3584813610,
        1689216846,
        3666258015,
        3200248200,
        1692713982,
        2646376535,
        4042768518,
        1618508792,
        1610833997,
        3523052358,
        4130873264,
        2001055236,
        3610705100,
        2202168115,
        4028541809,
        2961195399,
        1006657119,
        2006996926,
        3186142756,
        1430667929,
        3210227297,
        1314452623,
        4074634658,
        4101304120,
        2273951170,
        1399257539,
        3367210612,
        3027628629,
        1190975929,
        2062231137,
        2333990788,
        2221543033,
        2438960610,
        1181637006,
        548689776,
        2362791313,
        3372408396,
        3104550113,
        3145860560,
        296247880,
        1970579870,
        3078560182,
        3769228297,
        1714227617,
        3291629107,
        3898220290,
        166772364,
        1251581989,
        493813264,
        448347421,
        195405023,
        2709975567,
        677966185,
        3703036547,
        1463355134,
        2715995803,
        1338867538,
        1343315457,
        2802222074,
        2684532164,
        233230375,
        2599980071,
        2000651841,
        3277868038,
        1638401717,
        4028070440,
        3237316320,
        6314154,
        819756386,
        300326615,
        590932579,
        1405279636,
        3267499572,
        3150704214,
        2428286686,
        3959192993,
        3461946742,
        1862657033,
        1266418056,
        963775037,
        2089974820,
        2263052895,
        1917689273,
        448879540,
        3550394620,
        3981727096,
        150775221,
        3627908307,
        1303187396,
        508620638,
        2975983352,
        2726630617,
        1817252668,
        1876281319,
        1457606340,
        908771278,
        3720792119,
        3617206836,
        2455994898,
        1729034894,
        1080033504,
        976866871,
        3556439503,
        2881648439,
        1522871579,
        1555064734,
        1336096578,
        3548522304,
        2579274686,
        3574697629,
        3205460757,
        3593280638,
        3338716283,
        3079412587,
        564236357,
        2993598910,
        1781952180,
        1464380207,
        3163844217,
        3332601554,
        1699332808,
        1393555694,
        1183702653,
        3581086237,
        1288719814,
        691649499,
        2847557200,
        2895455976,
        3193889540,
        2717570544,
        1781354906,
        1676643554,
        2592534050,
        3230253752,
        1126444790,
        2770207658,
        2633158820,
        2210423226,
        2615765581,
        2414155088,
        3127139286,
        673620729,
        2805611233,
        1269405062,
        4015350505,
        3341807571,
        4149409754,
        1057255273,
        2012875353,
        2162469141,
        2276492801,
        2601117357,
        993977747,
        3918593370,
        2654263191,
        753973209,
        36408145,
        2530585658,
        25011837,
        3520020182,
        2088578344,
        530523599,
        2918365339,
        1524020338,
        1518925132,
        3760827505,
        3759777254,
        1202760957,
        3985898139,
        3906192525,
        674977740,
        4174734889,
        2031300136,
        2019492241,
        3983892565,
        4153806404,
        3822280332,
        352677332,
        2297720250,
        60907813,
        90501309,
        3286998549,
        1016092578,
        2535922412,
        2839152426,
        457141659,
        509813237,
        4120667899,
        652014361,
        1966332200,
        2975202805,
        55981186,
        2327461051,
        676427537,
        3255491064,
        2882294119,
        3433927263,
        1307055953,
        942726286,
        933058658,
        2468411793,
        3933900994,
        4215176142,
        1361170020,
        2001714738,
        2830558078,
        3274259782,
        1222529897,
        1679025792,
        2729314320,
        3714953764,
        1770335741,
        151462246,
        3013232138,
        1682292957,
        1483529935,
        471910574,
        1539241949,
        458788160,
        3436315007,
        1807016891,
        3718408830,
        978976581,
        1043663428,
        3165965781,
        1927990952,
        4200891579,
        2372276910,
        3208408903,
        3533431907,
        1412390302,
        2931980059,
        4132332400,
        1947078029,
        3881505623,
        4168226417,
        2941484381,
        1077988104,
        1320477388,
        886195818,
        18198404,
        3786409e3,
        2509781533,
        112762804,
        3463356488,
        1866414978,
        891333506,
        18488651,
        661792760,
        1628790961,
        3885187036,
        3141171499,
        876946877,
        2693282273,
        1372485963,
        791857591,
        2686433993,
        3759982718,
        3167212022,
        3472953795,
        2716379847,
        445679433,
        3561995674,
        3504004811,
        3574258232,
        54117162,
        3331405415,
        2381918588,
        3769707343,
        4154350007,
        1140177722,
        4074052095,
        668550556,
        3214352940,
        367459370,
        261225585,
        2610173221,
        4209349473,
        3468074219,
        3265815641,
        314222801,
        3066103646,
        3808782860,
        282218597,
        3406013506,
        3773591054,
        379116347,
        1285071038,
        846784868,
        2669647154,
        3771962079,
        3550491691,
        2305946142,
        453669953,
        1268987020,
        3317592352,
        3279303384,
        3744833421,
        2610507566,
        3859509063,
        266596637,
        3847019092,
        517658769,
        3462560207,
        3443424879,
        370717030,
        4247526661,
        2224018117,
        4143653529,
        4112773975,
        2788324899,
        2477274417,
        1456262402,
        2901442914,
        1517677493,
        1846949527,
        2295493580,
        3734397586,
        2176403920,
        1280348187,
        1908823572,
        3871786941,
        846861322,
        1172426758,
        3287448474,
        3383383037,
        1655181056,
        3139813346,
        901632758,
        1897031941,
        2986607138,
        3066810236,
        3447102507,
        1393639104,
        373351379,
        950779232,
        625454576,
        3124240540,
        4148612726,
        2007998917,
        544563296,
        2244738638,
        2330496472,
        2058025392,
        1291430526,
        424198748,
        50039436,
        29584100,
        3605783033,
        2429876329,
        2791104160,
        1057563949,
        3255363231,
        3075367218,
        3463963227,
        1469046755,
        985887462
      ];
      var C_ORIG = [
        1332899944,
        1700884034,
        1701343084,
        1684370003,
        1668446532,
        1869963892
      ];
      function _encipher(lr2, off, P, S2) {
        var n, l = lr2[off], r = lr2[off + 1];
        l ^= P[0];
        n = S2[l >>> 24];
        n += S2[256 | l >> 16 & 255];
        n ^= S2[512 | l >> 8 & 255];
        n += S2[768 | l & 255];
        r ^= n ^ P[1];
        n = S2[r >>> 24];
        n += S2[256 | r >> 16 & 255];
        n ^= S2[512 | r >> 8 & 255];
        n += S2[768 | r & 255];
        l ^= n ^ P[2];
        n = S2[l >>> 24];
        n += S2[256 | l >> 16 & 255];
        n ^= S2[512 | l >> 8 & 255];
        n += S2[768 | l & 255];
        r ^= n ^ P[3];
        n = S2[r >>> 24];
        n += S2[256 | r >> 16 & 255];
        n ^= S2[512 | r >> 8 & 255];
        n += S2[768 | r & 255];
        l ^= n ^ P[4];
        n = S2[l >>> 24];
        n += S2[256 | l >> 16 & 255];
        n ^= S2[512 | l >> 8 & 255];
        n += S2[768 | l & 255];
        r ^= n ^ P[5];
        n = S2[r >>> 24];
        n += S2[256 | r >> 16 & 255];
        n ^= S2[512 | r >> 8 & 255];
        n += S2[768 | r & 255];
        l ^= n ^ P[6];
        n = S2[l >>> 24];
        n += S2[256 | l >> 16 & 255];
        n ^= S2[512 | l >> 8 & 255];
        n += S2[768 | l & 255];
        r ^= n ^ P[7];
        n = S2[r >>> 24];
        n += S2[256 | r >> 16 & 255];
        n ^= S2[512 | r >> 8 & 255];
        n += S2[768 | r & 255];
        l ^= n ^ P[8];
        n = S2[l >>> 24];
        n += S2[256 | l >> 16 & 255];
        n ^= S2[512 | l >> 8 & 255];
        n += S2[768 | l & 255];
        r ^= n ^ P[9];
        n = S2[r >>> 24];
        n += S2[256 | r >> 16 & 255];
        n ^= S2[512 | r >> 8 & 255];
        n += S2[768 | r & 255];
        l ^= n ^ P[10];
        n = S2[l >>> 24];
        n += S2[256 | l >> 16 & 255];
        n ^= S2[512 | l >> 8 & 255];
        n += S2[768 | l & 255];
        r ^= n ^ P[11];
        n = S2[r >>> 24];
        n += S2[256 | r >> 16 & 255];
        n ^= S2[512 | r >> 8 & 255];
        n += S2[768 | r & 255];
        l ^= n ^ P[12];
        n = S2[l >>> 24];
        n += S2[256 | l >> 16 & 255];
        n ^= S2[512 | l >> 8 & 255];
        n += S2[768 | l & 255];
        r ^= n ^ P[13];
        n = S2[r >>> 24];
        n += S2[256 | r >> 16 & 255];
        n ^= S2[512 | r >> 8 & 255];
        n += S2[768 | r & 255];
        l ^= n ^ P[14];
        n = S2[l >>> 24];
        n += S2[256 | l >> 16 & 255];
        n ^= S2[512 | l >> 8 & 255];
        n += S2[768 | l & 255];
        r ^= n ^ P[15];
        n = S2[r >>> 24];
        n += S2[256 | r >> 16 & 255];
        n ^= S2[512 | r >> 8 & 255];
        n += S2[768 | r & 255];
        l ^= n ^ P[16];
        lr2[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
        lr2[off + 1] = l;
        return lr2;
      }
      function _streamtoword(data, offp) {
        for (var i = 0, word = 0; i < 4; ++i)
          word = word << 8 | data[offp] & 255, offp = (offp + 1) % data.length;
        return { key: word, offp };
      }
      function _key(key3, P, S2) {
        var offset = 0, lr2 = [0, 0], plen = P.length, slen = S2.length, sw;
        for (var i = 0; i < plen; i++)
          sw = _streamtoword(key3, offset), offset = sw.offp, P[i] = P[i] ^ sw.key;
        for (i = 0; i < plen; i += 2)
          lr2 = _encipher(lr2, 0, P, S2), P[i] = lr2[0], P[i + 1] = lr2[1];
        for (i = 0; i < slen; i += 2)
          lr2 = _encipher(lr2, 0, P, S2), S2[i] = lr2[0], S2[i + 1] = lr2[1];
      }
      function _ekskey(data, key3, P, S2) {
        var offp = 0, lr2 = [0, 0], plen = P.length, slen = S2.length, sw;
        for (var i = 0; i < plen; i++)
          sw = _streamtoword(key3, offp), offp = sw.offp, P[i] = P[i] ^ sw.key;
        offp = 0;
        for (i = 0; i < plen; i += 2)
          sw = _streamtoword(data, offp), offp = sw.offp, lr2[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr2[1] ^= sw.key, lr2 = _encipher(lr2, 0, P, S2), P[i] = lr2[0], P[i + 1] = lr2[1];
        for (i = 0; i < slen; i += 2)
          sw = _streamtoword(data, offp), offp = sw.offp, lr2[0] ^= sw.key, sw = _streamtoword(data, offp), offp = sw.offp, lr2[1] ^= sw.key, lr2 = _encipher(lr2, 0, P, S2), S2[i] = lr2[0], S2[i + 1] = lr2[1];
      }
      function _crypt(b, salt, rounds, callback, progressCallback) {
        var cdata = C_ORIG.slice(), clen = cdata.length, err2;
        if (rounds < 4 || rounds > 31) {
          err2 = Error("Illegal number of rounds (4-31): " + rounds);
          if (callback) {
            nextTick(callback.bind(this, err2));
            return;
          } else
            throw err2;
        }
        if (salt.length !== BCRYPT_SALT_LEN) {
          err2 = Error("Illegal salt length: " + salt.length + " != " + BCRYPT_SALT_LEN);
          if (callback) {
            nextTick(callback.bind(this, err2));
            return;
          } else
            throw err2;
        }
        rounds = 1 << rounds >>> 0;
        var P, S2, i = 0, j;
        if (Int32Array) {
          P = new Int32Array(P_ORIG);
          S2 = new Int32Array(S_ORIG);
        } else {
          P = P_ORIG.slice();
          S2 = S_ORIG.slice();
        }
        _ekskey(salt, b, P, S2);
        function next() {
          if (progressCallback)
            progressCallback(i / rounds);
          if (i < rounds) {
            var start = Date.now();
            for (; i < rounds; ) {
              i = i + 1;
              _key(b, P, S2);
              _key(salt, P, S2);
              if (Date.now() - start > MAX_EXECUTION_TIME)
                break;
            }
          } else {
            for (i = 0; i < 64; i++)
              for (j = 0; j < clen >> 1; j++)
                _encipher(cdata, j << 1, P, S2);
            var ret = [];
            for (i = 0; i < clen; i++)
              ret.push((cdata[i] >> 24 & 255) >>> 0), ret.push((cdata[i] >> 16 & 255) >>> 0), ret.push((cdata[i] >> 8 & 255) >>> 0), ret.push((cdata[i] & 255) >>> 0);
            if (callback) {
              callback(null, ret);
              return;
            } else
              return ret;
          }
          if (callback)
            nextTick(next);
        }
        if (typeof callback !== "undefined") {
          next();
        } else {
          var res;
          while (true)
            if (typeof (res = next()) !== "undefined")
              return res || [];
        }
      }
      function _hash(s, salt, callback, progressCallback) {
        var err2;
        if (typeof s !== "string" || typeof salt !== "string") {
          err2 = Error("Invalid string / salt: Not a string");
          if (callback) {
            nextTick(callback.bind(this, err2));
            return;
          } else
            throw err2;
        }
        var minor, offset;
        if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
          err2 = Error("Invalid salt version: " + salt.substring(0, 2));
          if (callback) {
            nextTick(callback.bind(this, err2));
            return;
          } else
            throw err2;
        }
        if (salt.charAt(2) === "$")
          minor = String.fromCharCode(0), offset = 3;
        else {
          minor = salt.charAt(2);
          if (minor !== "a" && minor !== "b" && minor !== "y" || salt.charAt(3) !== "$") {
            err2 = Error("Invalid salt revision: " + salt.substring(2, 4));
            if (callback) {
              nextTick(callback.bind(this, err2));
              return;
            } else
              throw err2;
          }
          offset = 4;
        }
        if (salt.charAt(offset + 2) > "$") {
          err2 = Error("Missing salt rounds");
          if (callback) {
            nextTick(callback.bind(this, err2));
            return;
          } else
            throw err2;
        }
        var r1 = parseInt(salt.substring(offset, offset + 1), 10) * 10, r2 = parseInt(salt.substring(offset + 1, offset + 2), 10), rounds = r1 + r2, real_salt = salt.substring(offset + 3, offset + 25);
        s += minor >= "a" ? "\0" : "";
        var passwordb = stringToBytes(s), saltb = base64_decode(real_salt, BCRYPT_SALT_LEN);
        function finish(bytes) {
          var res = [];
          res.push("$2");
          if (minor >= "a")
            res.push(minor);
          res.push("$");
          if (rounds < 10)
            res.push("0");
          res.push(rounds.toString());
          res.push("$");
          res.push(base64_encode(saltb, saltb.length));
          res.push(base64_encode(bytes, C_ORIG.length * 4 - 1));
          return res.join("");
        }
        if (typeof callback == "undefined")
          return finish(_crypt(passwordb, saltb, rounds));
        else {
          _crypt(passwordb, saltb, rounds, function(err3, bytes) {
            if (err3)
              callback(err3, null);
            else
              callback(null, finish(bytes));
          }, progressCallback);
        }
      }
      bcrypt4.encodeBase64 = base64_encode;
      bcrypt4.decodeBase64 = base64_decode;
      return bcrypt4;
    });
  }
});

// ../../node_modules/bcryptjs/index.js
var require_bcryptjs = __commonJS({
  "../../node_modules/bcryptjs/index.js"(exports2, module2) {
    module2.exports = require_bcrypt();
  }
});

// ../../node_modules/@prisma/debug/dist/index.js
var require_dist = __commonJS({
  "../../node_modules/@prisma/debug/dist/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
      for (var name2 in all)
        __defProp2(target, name2, { get: all[name2], enumerable: true });
    };
    var __copyProps2 = (to2, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key3 of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to2, key3) && key3 !== except)
            __defProp2(to2, key3, { get: () => from[key3], enumerable: !(desc = __getOwnPropDesc2(from, key3)) || desc.enumerable });
      }
      return to2;
    };
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var src_exports2 = {};
    __export2(src_exports2, {
      Debug: () => Debug2,
      clearLogs: () => clearLogs,
      default: () => src_default,
      getLogs: () => getLogs
    });
    module2.exports = __toCommonJS2(src_exports2);
    var colors_exports = {};
    __export2(colors_exports, {
      $: () => $,
      bgBlack: () => bgBlack,
      bgBlue: () => bgBlue,
      bgCyan: () => bgCyan,
      bgGreen: () => bgGreen,
      bgMagenta: () => bgMagenta,
      bgRed: () => bgRed,
      bgWhite: () => bgWhite,
      bgYellow: () => bgYellow,
      black: () => black,
      blue: () => blue,
      bold: () => bold,
      cyan: () => cyan,
      dim: () => dim,
      gray: () => gray,
      green: () => green,
      grey: () => grey,
      hidden: () => hidden,
      inverse: () => inverse,
      italic: () => italic,
      magenta: () => magenta,
      red: () => red,
      reset: () => reset,
      strikethrough: () => strikethrough,
      underline: () => underline,
      white: () => white,
      yellow: () => yellow
    });
    var FORCE_COLOR;
    var NODE_DISABLE_COLORS;
    var NO_COLOR;
    var TERM;
    var isTTY = true;
    if (typeof process !== "undefined") {
      ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
      isTTY = process.stdout && process.stdout.isTTY;
    }
    var $ = {
      enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
    };
    function init2(x2, y2) {
      let rgx = new RegExp(`\\x1b\\[${y2}m`, "g");
      let open = `\x1B[${x2}m`, close = `\x1B[${y2}m`;
      return function(txt) {
        if (!$.enabled || txt == null) return txt;
        return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
      };
    }
    var reset = init2(0, 0);
    var bold = init2(1, 22);
    var dim = init2(2, 22);
    var italic = init2(3, 23);
    var underline = init2(4, 24);
    var inverse = init2(7, 27);
    var hidden = init2(8, 28);
    var strikethrough = init2(9, 29);
    var black = init2(30, 39);
    var red = init2(31, 39);
    var green = init2(32, 39);
    var yellow = init2(33, 39);
    var blue = init2(34, 39);
    var magenta = init2(35, 39);
    var cyan = init2(36, 39);
    var white = init2(37, 39);
    var gray = init2(90, 39);
    var grey = init2(90, 39);
    var bgBlack = init2(40, 49);
    var bgRed = init2(41, 49);
    var bgGreen = init2(42, 49);
    var bgYellow = init2(43, 49);
    var bgBlue = init2(44, 49);
    var bgMagenta = init2(45, 49);
    var bgCyan = init2(46, 49);
    var bgWhite = init2(47, 49);
    var MAX_ARGS_HISTORY = 100;
    var COLORS = ["green", "yellow", "blue", "magenta", "cyan", "red"];
    var argsHistory = [];
    var lastTimestamp = Date.now();
    var lastColor = 0;
    var processEnv = typeof process !== "undefined" ? process.env : {};
    globalThis.DEBUG ??= processEnv.DEBUG ?? "";
    globalThis.DEBUG_COLORS ??= processEnv.DEBUG_COLORS ? processEnv.DEBUG_COLORS === "true" : true;
    var topProps = {
      enable(namespace) {
        if (typeof namespace === "string") {
          globalThis.DEBUG = namespace;
        }
      },
      disable() {
        const prev = globalThis.DEBUG;
        globalThis.DEBUG = "";
        return prev;
      },
      // this is the core logic to check if logging should happen or not
      enabled(namespace) {
        const listenedNamespaces = globalThis.DEBUG.split(",").map((s) => {
          return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
        });
        const isListened = listenedNamespaces.some((listenedNamespace) => {
          if (listenedNamespace === "" || listenedNamespace[0] === "-") return false;
          return namespace.match(RegExp(listenedNamespace.split("*").join(".*") + "$"));
        });
        const isExcluded = listenedNamespaces.some((listenedNamespace) => {
          if (listenedNamespace === "" || listenedNamespace[0] !== "-") return false;
          return namespace.match(RegExp(listenedNamespace.slice(1).split("*").join(".*") + "$"));
        });
        return isListened && !isExcluded;
      },
      log: (...args) => {
        const [namespace, format, ...rest] = args;
        const logWithFormatting = console.warn ?? console.log;
        logWithFormatting(`${namespace} ${format}`, ...rest);
      },
      formatters: {}
      // not implemented
    };
    function debugCreate(namespace) {
      const instanceProps = {
        color: COLORS[lastColor++ % COLORS.length],
        enabled: topProps.enabled(namespace),
        namespace,
        log: topProps.log,
        extend: () => {
        }
        // not implemented
      };
      const debugCall = (...args) => {
        const { enabled, namespace: namespace2, color, log: log2 } = instanceProps;
        if (args.length !== 0) {
          argsHistory.push([namespace2, ...args]);
        }
        if (argsHistory.length > MAX_ARGS_HISTORY) {
          argsHistory.shift();
        }
        if (topProps.enabled(namespace2) || enabled) {
          const stringArgs = args.map((arg) => {
            if (typeof arg === "string") {
              return arg;
            }
            return safeStringify(arg);
          });
          const ms2 = `+${Date.now() - lastTimestamp}ms`;
          lastTimestamp = Date.now();
          if (globalThis.DEBUG_COLORS) {
            log2(colors_exports[color](bold(namespace2)), ...stringArgs, colors_exports[color](ms2));
          } else {
            log2(namespace2, ...stringArgs, ms2);
          }
        }
      };
      return new Proxy(debugCall, {
        get: (_2, prop) => instanceProps[prop],
        set: (_2, prop, value) => instanceProps[prop] = value
      });
    }
    var Debug2 = new Proxy(debugCreate, {
      get: (_2, prop) => topProps[prop],
      set: (_2, prop, value) => topProps[prop] = value
    });
    function safeStringify(value, indent = 2) {
      const cache2 = /* @__PURE__ */ new Set();
      return JSON.stringify(
        value,
        (key3, value2) => {
          if (typeof value2 === "object" && value2 !== null) {
            if (cache2.has(value2)) {
              return `[Circular *]`;
            }
            cache2.add(value2);
          } else if (typeof value2 === "bigint") {
            return value2.toString();
          }
          return value2;
        },
        indent
      );
    }
    function getLogs(numChars = 7500) {
      const logs = argsHistory.map(([namespace, ...args]) => {
        return `${namespace} ${args.map((arg) => {
          if (typeof arg === "string") {
            return arg;
          } else {
            return JSON.stringify(arg);
          }
        }).join(" ")}`;
      }).join("\n");
      if (logs.length < numChars) {
        return logs;
      }
      return logs.slice(-numChars);
    }
    function clearLogs() {
      argsHistory.length = 0;
    }
    var src_default = Debug2;
  }
});

// ../../packages/db/node_modules/postgres-array/index.js
var require_postgres_array = __commonJS({
  "../../packages/db/node_modules/postgres-array/index.js"(exports2) {
    "use strict";
    exports2.parse = function(source, transform) {
      return parsePostgresArray(source, transform);
    };
    function parsePostgresArray(source, transform, nested = false) {
      let character = "";
      let quote = false;
      let position = 0;
      let dimension = 0;
      const entries = [];
      let recorded = "";
      const newEntry = function(includeEmpty) {
        let entry = recorded;
        if (entry.length > 0 || includeEmpty) {
          if (entry === "NULL" && !includeEmpty) {
            entry = null;
          }
          if (entry !== null && transform) {
            entry = transform(entry);
          }
          entries.push(entry);
          recorded = "";
        }
      };
      if (source[0] === "[") {
        while (position < source.length) {
          const char = source[position++];
          if (char === "=") {
            break;
          }
        }
      }
      while (position < source.length) {
        let escaped = false;
        character = source[position++];
        if (character === "\\") {
          character = source[position++];
          escaped = true;
        }
        if (character === "{" && !quote) {
          dimension++;
          if (dimension > 1) {
            const parser = parsePostgresArray(source.substr(position - 1), transform, true);
            entries.push(parser.entries);
            position += parser.position - 2;
          }
        } else if (character === "}" && !quote) {
          dimension--;
          if (!dimension) {
            newEntry();
            if (nested) {
              return {
                entries,
                position
              };
            }
          }
        } else if (character === '"' && !escaped) {
          if (quote) {
            newEntry(true);
          }
          quote = !quote;
        } else if (character === "," && !quote) {
          newEntry();
        } else {
          recorded += character;
        }
      }
      if (dimension !== 0) {
        throw new Error("array dimension not balanced");
      }
      return entries;
    }
  }
});

// ../../node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "../../node_modules/safe-buffer/index.js"(exports2, module2) {
    var buffer = require("buffer");
    var Buffer2 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key3 in src) {
        dst[key3] = src[key3];
      }
    }
    if (Buffer2.from && Buffer2.alloc && Buffer2.allocUnsafe && Buffer2.allocUnsafeSlow) {
      module2.exports = buffer;
    } else {
      copyProps(buffer, exports2);
      exports2.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer2(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer2.prototype);
    copyProps(Buffer2, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer2(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer2(size);
      if (fill !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill, encoding);
        } else {
          buf.fill(fill);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer2(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// ../../node_modules/jws/lib/data-stream.js
var require_data_stream = __commonJS({
  "../../node_modules/jws/lib/data-stream.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var Stream = require("stream");
    var util2 = require("util");
    function DataStream(data) {
      this.buffer = null;
      this.writable = true;
      this.readable = true;
      if (!data) {
        this.buffer = Buffer2.alloc(0);
        return this;
      }
      if (typeof data.pipe === "function") {
        this.buffer = Buffer2.alloc(0);
        data.pipe(this);
        return this;
      }
      if (data.length || typeof data === "object") {
        this.buffer = data;
        this.writable = false;
        process.nextTick(function() {
          this.emit("end", data);
          this.readable = false;
          this.emit("close");
        }.bind(this));
        return this;
      }
      throw new TypeError("Unexpected data type (" + typeof data + ")");
    }
    util2.inherits(DataStream, Stream);
    DataStream.prototype.write = function write(data) {
      this.buffer = Buffer2.concat([this.buffer, Buffer2.from(data)]);
      this.emit("data", data);
    };
    DataStream.prototype.end = function end(data) {
      if (data)
        this.write(data);
      this.emit("end", data);
      this.emit("close");
      this.writable = false;
      this.readable = false;
    };
    module2.exports = DataStream;
  }
});

// ../../node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js
var require_param_bytes_for_alg = __commonJS({
  "../../node_modules/ecdsa-sig-formatter/src/param-bytes-for-alg.js"(exports2, module2) {
    "use strict";
    function getParamSize(keySize) {
      var result = (keySize / 8 | 0) + (keySize % 8 === 0 ? 0 : 1);
      return result;
    }
    var paramBytesForAlg = {
      ES256: getParamSize(256),
      ES384: getParamSize(384),
      ES512: getParamSize(521)
    };
    function getParamBytesForAlg(alg) {
      var paramBytes = paramBytesForAlg[alg];
      if (paramBytes) {
        return paramBytes;
      }
      throw new Error('Unknown algorithm "' + alg + '"');
    }
    module2.exports = getParamBytesForAlg;
  }
});

// ../../node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js
var require_ecdsa_sig_formatter = __commonJS({
  "../../node_modules/ecdsa-sig-formatter/src/ecdsa-sig-formatter.js"(exports2, module2) {
    "use strict";
    var Buffer2 = require_safe_buffer().Buffer;
    var getParamBytesForAlg = require_param_bytes_for_alg();
    var MAX_OCTET = 128;
    var CLASS_UNIVERSAL = 0;
    var PRIMITIVE_BIT = 32;
    var TAG_SEQ = 16;
    var TAG_INT = 2;
    var ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | CLASS_UNIVERSAL << 6;
    var ENCODED_TAG_INT = TAG_INT | CLASS_UNIVERSAL << 6;
    function base64Url(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function signatureAsBuffer(signature) {
      if (Buffer2.isBuffer(signature)) {
        return signature;
      } else if ("string" === typeof signature) {
        return Buffer2.from(signature, "base64");
      }
      throw new TypeError("ECDSA signature must be a Base64 string or a Buffer");
    }
    function derToJose(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var maxEncodedParamLength = paramBytes + 1;
      var inputLength = signature.length;
      var offset = 0;
      if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
      }
      var seqLength = signature[offset++];
      if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
      }
      if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
      }
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
      }
      var rLength = signature[offset++];
      if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
      }
      if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var rOffset = offset;
      offset += rLength;
      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
      }
      var sLength = signature[offset++];
      if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
      }
      if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }
      var sOffset = offset;
      offset += sLength;
      if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
      }
      var rPadding = paramBytes - rLength, sPadding = paramBytes - sLength;
      var dst = Buffer2.allocUnsafe(rPadding + rLength + sPadding + sLength);
      for (offset = 0; offset < rPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);
      offset = paramBytes;
      for (var o = offset; offset < o + sPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);
      dst = dst.toString("base64");
      dst = base64Url(dst);
      return dst;
    }
    function countPadding(buf, start, stop) {
      var padding = 0;
      while (start + padding < stop && buf[start + padding] === 0) {
        ++padding;
      }
      var needsSign = buf[start + padding] >= MAX_OCTET;
      if (needsSign) {
        --padding;
      }
      return padding;
    }
    function joseToDer(signature, alg) {
      signature = signatureAsBuffer(signature);
      var paramBytes = getParamBytesForAlg(alg);
      var signatureBytes = signature.length;
      if (signatureBytes !== paramBytes * 2) {
        throw new TypeError('"' + alg + '" signatures must be "' + paramBytes * 2 + '" bytes, saw "' + signatureBytes + '"');
      }
      var rPadding = countPadding(signature, 0, paramBytes);
      var sPadding = countPadding(signature, paramBytes, signature.length);
      var rLength = paramBytes - rPadding;
      var sLength = paramBytes - sPadding;
      var rsBytes = 1 + 1 + rLength + 1 + 1 + sLength;
      var shortLength = rsBytes < MAX_OCTET;
      var dst = Buffer2.allocUnsafe((shortLength ? 2 : 3) + rsBytes);
      var offset = 0;
      dst[offset++] = ENCODED_TAG_SEQ;
      if (shortLength) {
        dst[offset++] = rsBytes;
      } else {
        dst[offset++] = MAX_OCTET | 1;
        dst[offset++] = rsBytes & 255;
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = rLength;
      if (rPadding < 0) {
        dst[offset++] = 0;
        offset += signature.copy(dst, offset, 0, paramBytes);
      } else {
        offset += signature.copy(dst, offset, rPadding, paramBytes);
      }
      dst[offset++] = ENCODED_TAG_INT;
      dst[offset++] = sLength;
      if (sPadding < 0) {
        dst[offset++] = 0;
        signature.copy(dst, offset, paramBytes);
      } else {
        signature.copy(dst, offset, paramBytes + sPadding);
      }
      return dst;
    }
    module2.exports = {
      derToJose,
      joseToDer
    };
  }
});

// ../../node_modules/buffer-equal-constant-time/index.js
var require_buffer_equal_constant_time = __commonJS({
  "../../node_modules/buffer-equal-constant-time/index.js"(exports2, module2) {
    "use strict";
    var Buffer2 = require("buffer").Buffer;
    var SlowBuffer = require("buffer").SlowBuffer;
    module2.exports = bufferEq;
    function bufferEq(a2, b) {
      if (!Buffer2.isBuffer(a2) || !Buffer2.isBuffer(b)) {
        return false;
      }
      if (a2.length !== b.length) {
        return false;
      }
      var c = 0;
      for (var i = 0; i < a2.length; i++) {
        c |= a2[i] ^ b[i];
      }
      return c === 0;
    }
    bufferEq.install = function() {
      Buffer2.prototype.equal = SlowBuffer.prototype.equal = function equal(that) {
        return bufferEq(this, that);
      };
    };
    var origBufEqual = Buffer2.prototype.equal;
    var origSlowBufEqual = SlowBuffer.prototype.equal;
    bufferEq.restore = function() {
      Buffer2.prototype.equal = origBufEqual;
      SlowBuffer.prototype.equal = origSlowBufEqual;
    };
  }
});

// ../../node_modules/jwa/index.js
var require_jwa = __commonJS({
  "../../node_modules/jwa/index.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var crypto4 = require("crypto");
    var formatEcdsa = require_ecdsa_sig_formatter();
    var util2 = require("util");
    var MSG_INVALID_ALGORITHM = '"%s" is not a valid algorithm.\n  Supported algorithms are:\n  "HS256", "HS384", "HS512", "RS256", "RS384", "RS512", "PS256", "PS384", "PS512", "ES256", "ES384", "ES512" and "none".';
    var MSG_INVALID_SECRET = "secret must be a string or buffer";
    var MSG_INVALID_VERIFIER_KEY = "key must be a string or a buffer";
    var MSG_INVALID_SIGNER_KEY = "key must be a string, a buffer or an object";
    var supportsKeyObjects = typeof crypto4.createPublicKey === "function";
    if (supportsKeyObjects) {
      MSG_INVALID_VERIFIER_KEY += " or a KeyObject";
      MSG_INVALID_SECRET += "or a KeyObject";
    }
    function checkIsPublicKey(key3) {
      if (Buffer2.isBuffer(key3)) {
        return;
      }
      if (typeof key3 === "string") {
        return;
      }
      if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key3 !== "object") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key3.type !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key3.asymmetricKeyType !== "string") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
      if (typeof key3.export !== "function") {
        throw typeError(MSG_INVALID_VERIFIER_KEY);
      }
    }
    function checkIsPrivateKey(key3) {
      if (Buffer2.isBuffer(key3)) {
        return;
      }
      if (typeof key3 === "string") {
        return;
      }
      if (typeof key3 === "object") {
        return;
      }
      throw typeError(MSG_INVALID_SIGNER_KEY);
    }
    function checkIsSecretKey(key3) {
      if (Buffer2.isBuffer(key3)) {
        return;
      }
      if (typeof key3 === "string") {
        return key3;
      }
      if (!supportsKeyObjects) {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (typeof key3 !== "object") {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (key3.type !== "secret") {
        throw typeError(MSG_INVALID_SECRET);
      }
      if (typeof key3.export !== "function") {
        throw typeError(MSG_INVALID_SECRET);
      }
    }
    function fromBase64(base64) {
      return base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function toBase64(base64url) {
      base64url = base64url.toString();
      var padding = 4 - base64url.length % 4;
      if (padding !== 4) {
        for (var i = 0; i < padding; ++i) {
          base64url += "=";
        }
      }
      return base64url.replace(/\-/g, "+").replace(/_/g, "/");
    }
    function typeError(template) {
      var args = [].slice.call(arguments, 1);
      var errMsg = util2.format.bind(util2, template).apply(null, args);
      return new TypeError(errMsg);
    }
    function bufferOrString(obj) {
      return Buffer2.isBuffer(obj) || typeof obj === "string";
    }
    function normalizeInput(thing) {
      if (!bufferOrString(thing))
        thing = JSON.stringify(thing);
      return thing;
    }
    function createHmacSigner(bits) {
      return function sign(thing, secret2) {
        checkIsSecretKey(secret2);
        thing = normalizeInput(thing);
        var hmac = crypto4.createHmac("sha" + bits, secret2);
        var sig = (hmac.update(thing), hmac.digest("base64"));
        return fromBase64(sig);
      };
    }
    var bufferEqual;
    var timingSafeEqual2 = "timingSafeEqual" in crypto4 ? function timingSafeEqual3(a2, b) {
      if (a2.byteLength !== b.byteLength) {
        return false;
      }
      return crypto4.timingSafeEqual(a2, b);
    } : function timingSafeEqual3(a2, b) {
      if (!bufferEqual) {
        bufferEqual = require_buffer_equal_constant_time();
      }
      return bufferEqual(a2, b);
    };
    function createHmacVerifier(bits) {
      return function verify(thing, signature, secret2) {
        var computedSig = createHmacSigner(bits)(thing, secret2);
        return timingSafeEqual2(Buffer2.from(signature), Buffer2.from(computedSig));
      };
    }
    function createKeySigner(bits) {
      return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto4.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign(privateKey, "base64"));
        return fromBase64(sig);
      };
    }
    function createKeyVerifier(bits) {
      return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto4.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify(publicKey, signature, "base64");
      };
    }
    function createPSSKeySigner(bits) {
      return function sign(thing, privateKey) {
        checkIsPrivateKey(privateKey);
        thing = normalizeInput(thing);
        var signer = crypto4.createSign("RSA-SHA" + bits);
        var sig = (signer.update(thing), signer.sign({
          key: privateKey,
          padding: crypto4.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto4.constants.RSA_PSS_SALTLEN_DIGEST
        }, "base64"));
        return fromBase64(sig);
      };
    }
    function createPSSKeyVerifier(bits) {
      return function verify(thing, signature, publicKey) {
        checkIsPublicKey(publicKey);
        thing = normalizeInput(thing);
        signature = toBase64(signature);
        var verifier = crypto4.createVerify("RSA-SHA" + bits);
        verifier.update(thing);
        return verifier.verify({
          key: publicKey,
          padding: crypto4.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: crypto4.constants.RSA_PSS_SALTLEN_DIGEST
        }, signature, "base64");
      };
    }
    function createECDSASigner(bits) {
      var inner = createKeySigner(bits);
      return function sign() {
        var signature = inner.apply(null, arguments);
        signature = formatEcdsa.derToJose(signature, "ES" + bits);
        return signature;
      };
    }
    function createECDSAVerifer(bits) {
      var inner = createKeyVerifier(bits);
      return function verify(thing, signature, publicKey) {
        signature = formatEcdsa.joseToDer(signature, "ES" + bits).toString("base64");
        var result = inner(thing, signature, publicKey);
        return result;
      };
    }
    function createNoneSigner() {
      return function sign() {
        return "";
      };
    }
    function createNoneVerifier() {
      return function verify(thing, signature) {
        return signature === "";
      };
    }
    module2.exports = function jwa(algorithm) {
      var signerFactories = {
        hs: createHmacSigner,
        rs: createKeySigner,
        ps: createPSSKeySigner,
        es: createECDSASigner,
        none: createNoneSigner
      };
      var verifierFactories = {
        hs: createHmacVerifier,
        rs: createKeyVerifier,
        ps: createPSSKeyVerifier,
        es: createECDSAVerifer,
        none: createNoneVerifier
      };
      var match2 = algorithm.match(/^(RS|PS|ES|HS)(256|384|512)$|^(none)$/);
      if (!match2)
        throw typeError(MSG_INVALID_ALGORITHM, algorithm);
      var algo = (match2[1] || match2[3]).toLowerCase();
      var bits = match2[2];
      return {
        sign: signerFactories[algo](bits),
        verify: verifierFactories[algo](bits)
      };
    };
  }
});

// ../../node_modules/jws/lib/tostring.js
var require_tostring = __commonJS({
  "../../node_modules/jws/lib/tostring.js"(exports2, module2) {
    var Buffer2 = require("buffer").Buffer;
    module2.exports = function toString(obj) {
      if (typeof obj === "string")
        return obj;
      if (typeof obj === "number" || Buffer2.isBuffer(obj))
        return obj.toString();
      return JSON.stringify(obj);
    };
  }
});

// ../../node_modules/jws/lib/sign-stream.js
var require_sign_stream = __commonJS({
  "../../node_modules/jws/lib/sign-stream.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var DataStream = require_data_stream();
    var jwa = require_jwa();
    var Stream = require("stream");
    var toString = require_tostring();
    var util2 = require("util");
    function base64url(string, encoding) {
      return Buffer2.from(string, encoding).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    }
    function jwsSecuredInput(header, payload, encoding) {
      encoding = encoding || "utf8";
      var encodedHeader = base64url(toString(header), "binary");
      var encodedPayload = base64url(toString(payload), encoding);
      return util2.format("%s.%s", encodedHeader, encodedPayload);
    }
    function jwsSign(opts) {
      var header = opts.header;
      var payload = opts.payload;
      var secretOrKey = opts.secret || opts.privateKey;
      var encoding = opts.encoding;
      var algo = jwa(header.alg);
      var securedInput = jwsSecuredInput(header, payload, encoding);
      var signature = algo.sign(securedInput, secretOrKey);
      return util2.format("%s.%s", securedInput, signature);
    }
    function SignStream(opts) {
      var secret2 = opts.secret;
      secret2 = secret2 == null ? opts.privateKey : secret2;
      secret2 = secret2 == null ? opts.key : secret2;
      if (/^hs/i.test(opts.header.alg) === true && secret2 == null) {
        throw new TypeError("secret must be a string or buffer or a KeyObject");
      }
      var secretStream = new DataStream(secret2);
      this.readable = true;
      this.header = opts.header;
      this.encoding = opts.encoding;
      this.secret = this.privateKey = this.key = secretStream;
      this.payload = new DataStream(opts.payload);
      this.secret.once("close", function() {
        if (!this.payload.writable && this.readable)
          this.sign();
      }.bind(this));
      this.payload.once("close", function() {
        if (!this.secret.writable && this.readable)
          this.sign();
      }.bind(this));
    }
    util2.inherits(SignStream, Stream);
    SignStream.prototype.sign = function sign() {
      try {
        var signature = jwsSign({
          header: this.header,
          payload: this.payload.buffer,
          secret: this.secret.buffer,
          encoding: this.encoding
        });
        this.emit("done", signature);
        this.emit("data", signature);
        this.emit("end");
        this.readable = false;
        return signature;
      } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
      }
    };
    SignStream.sign = jwsSign;
    module2.exports = SignStream;
  }
});

// ../../node_modules/jws/lib/verify-stream.js
var require_verify_stream = __commonJS({
  "../../node_modules/jws/lib/verify-stream.js"(exports2, module2) {
    var Buffer2 = require_safe_buffer().Buffer;
    var DataStream = require_data_stream();
    var jwa = require_jwa();
    var Stream = require("stream");
    var toString = require_tostring();
    var util2 = require("util");
    var JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;
    function isObject2(thing) {
      return Object.prototype.toString.call(thing) === "[object Object]";
    }
    function safeJsonParse(thing) {
      if (isObject2(thing))
        return thing;
      try {
        return JSON.parse(thing);
      } catch (e) {
        return void 0;
      }
    }
    function headerFromJWS(jwsSig) {
      var encodedHeader = jwsSig.split(".", 1)[0];
      return safeJsonParse(Buffer2.from(encodedHeader, "base64").toString("binary"));
    }
    function securedInputFromJWS(jwsSig) {
      return jwsSig.split(".", 2).join(".");
    }
    function signatureFromJWS(jwsSig) {
      return jwsSig.split(".")[2];
    }
    function payloadFromJWS(jwsSig, encoding) {
      encoding = encoding || "utf8";
      var payload = jwsSig.split(".")[1];
      return Buffer2.from(payload, "base64").toString(encoding);
    }
    function isValidJws(string) {
      return JWS_REGEX.test(string) && !!headerFromJWS(string);
    }
    function jwsVerify(jwsSig, algorithm, secretOrKey) {
      if (!algorithm) {
        var err2 = new Error("Missing algorithm parameter for jws.verify");
        err2.code = "MISSING_ALGORITHM";
        throw err2;
      }
      jwsSig = toString(jwsSig);
      var signature = signatureFromJWS(jwsSig);
      var securedInput = securedInputFromJWS(jwsSig);
      var algo = jwa(algorithm);
      return algo.verify(securedInput, signature, secretOrKey);
    }
    function jwsDecode(jwsSig, opts) {
      opts = opts || {};
      jwsSig = toString(jwsSig);
      if (!isValidJws(jwsSig))
        return null;
      var header = headerFromJWS(jwsSig);
      if (!header)
        return null;
      var payload = payloadFromJWS(jwsSig);
      if (header.typ === "JWT" || opts.json)
        payload = JSON.parse(payload, opts.encoding);
      return {
        header,
        payload,
        signature: signatureFromJWS(jwsSig)
      };
    }
    function VerifyStream(opts) {
      opts = opts || {};
      var secretOrKey = opts.secret;
      secretOrKey = secretOrKey == null ? opts.publicKey : secretOrKey;
      secretOrKey = secretOrKey == null ? opts.key : secretOrKey;
      if (/^hs/i.test(opts.algorithm) === true && secretOrKey == null) {
        throw new TypeError("secret must be a string or buffer or a KeyObject");
      }
      var secretStream = new DataStream(secretOrKey);
      this.readable = true;
      this.algorithm = opts.algorithm;
      this.encoding = opts.encoding;
      this.secret = this.publicKey = this.key = secretStream;
      this.signature = new DataStream(opts.signature);
      this.secret.once("close", function() {
        if (!this.signature.writable && this.readable)
          this.verify();
      }.bind(this));
      this.signature.once("close", function() {
        if (!this.secret.writable && this.readable)
          this.verify();
      }.bind(this));
    }
    util2.inherits(VerifyStream, Stream);
    VerifyStream.prototype.verify = function verify() {
      try {
        var valid = jwsVerify(this.signature.buffer, this.algorithm, this.key.buffer);
        var obj = jwsDecode(this.signature.buffer, this.encoding);
        this.emit("done", valid, obj);
        this.emit("data", valid);
        this.emit("end");
        this.readable = false;
        return valid;
      } catch (e) {
        this.readable = false;
        this.emit("error", e);
        this.emit("close");
      }
    };
    VerifyStream.decode = jwsDecode;
    VerifyStream.isValid = isValidJws;
    VerifyStream.verify = jwsVerify;
    module2.exports = VerifyStream;
  }
});

// ../../node_modules/jws/index.js
var require_jws = __commonJS({
  "../../node_modules/jws/index.js"(exports2) {
    var SignStream = require_sign_stream();
    var VerifyStream = require_verify_stream();
    var ALGORITHMS = [
      "HS256",
      "HS384",
      "HS512",
      "RS256",
      "RS384",
      "RS512",
      "PS256",
      "PS384",
      "PS512",
      "ES256",
      "ES384",
      "ES512"
    ];
    exports2.ALGORITHMS = ALGORITHMS;
    exports2.sign = SignStream.sign;
    exports2.verify = VerifyStream.verify;
    exports2.decode = VerifyStream.decode;
    exports2.isValid = VerifyStream.isValid;
    exports2.createSign = function createSign(opts) {
      return new SignStream(opts);
    };
    exports2.createVerify = function createVerify(opts) {
      return new VerifyStream(opts);
    };
  }
});

// ../../node_modules/jsonwebtoken/decode.js
var require_decode = __commonJS({
  "../../node_modules/jsonwebtoken/decode.js"(exports2, module2) {
    var jws = require_jws();
    module2.exports = function(jwt2, options) {
      options = options || {};
      var decoded = jws.decode(jwt2, options);
      if (!decoded) {
        return null;
      }
      var payload = decoded.payload;
      if (typeof payload === "string") {
        try {
          var obj = JSON.parse(payload);
          if (obj !== null && typeof obj === "object") {
            payload = obj;
          }
        } catch (e) {
        }
      }
      if (options.complete === true) {
        return {
          header: decoded.header,
          payload,
          signature: decoded.signature
        };
      }
      return payload;
    };
  }
});

// ../../node_modules/jsonwebtoken/lib/JsonWebTokenError.js
var require_JsonWebTokenError = __commonJS({
  "../../node_modules/jsonwebtoken/lib/JsonWebTokenError.js"(exports2, module2) {
    var JsonWebTokenError = function(message, error) {
      Error.call(this, message);
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
      this.name = "JsonWebTokenError";
      this.message = message;
      if (error) this.inner = error;
    };
    JsonWebTokenError.prototype = Object.create(Error.prototype);
    JsonWebTokenError.prototype.constructor = JsonWebTokenError;
    module2.exports = JsonWebTokenError;
  }
});

// ../../node_modules/jsonwebtoken/lib/NotBeforeError.js
var require_NotBeforeError = __commonJS({
  "../../node_modules/jsonwebtoken/lib/NotBeforeError.js"(exports2, module2) {
    var JsonWebTokenError = require_JsonWebTokenError();
    var NotBeforeError = function(message, date) {
      JsonWebTokenError.call(this, message);
      this.name = "NotBeforeError";
      this.date = date;
    };
    NotBeforeError.prototype = Object.create(JsonWebTokenError.prototype);
    NotBeforeError.prototype.constructor = NotBeforeError;
    module2.exports = NotBeforeError;
  }
});

// ../../node_modules/jsonwebtoken/lib/TokenExpiredError.js
var require_TokenExpiredError = __commonJS({
  "../../node_modules/jsonwebtoken/lib/TokenExpiredError.js"(exports2, module2) {
    var JsonWebTokenError = require_JsonWebTokenError();
    var TokenExpiredError = function(message, expiredAt) {
      JsonWebTokenError.call(this, message);
      this.name = "TokenExpiredError";
      this.expiredAt = expiredAt;
    };
    TokenExpiredError.prototype = Object.create(JsonWebTokenError.prototype);
    TokenExpiredError.prototype.constructor = TokenExpiredError;
    module2.exports = TokenExpiredError;
  }
});

// ../../node_modules/ms/index.js
var require_ms = __commonJS({
  "../../node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m2 = s * 60;
    var h = m2 * 60;
    var d = h * 24;
    var w2 = d * 7;
    var y2 = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse2(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse2(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match2 = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match2) {
        return;
      }
      var n = parseFloat(match2[1]);
      var type = (match2[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y2;
        case "weeks":
        case "week":
        case "w":
          return n * w2;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m2;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms2) {
      var msAbs = Math.abs(ms2);
      if (msAbs >= d) {
        return Math.round(ms2 / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms2 / h) + "h";
      }
      if (msAbs >= m2) {
        return Math.round(ms2 / m2) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms2 / s) + "s";
      }
      return ms2 + "ms";
    }
    function fmtLong(ms2) {
      var msAbs = Math.abs(ms2);
      if (msAbs >= d) {
        return plural(ms2, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms2, msAbs, h, "hour");
      }
      if (msAbs >= m2) {
        return plural(ms2, msAbs, m2, "minute");
      }
      if (msAbs >= s) {
        return plural(ms2, msAbs, s, "second");
      }
      return ms2 + " ms";
    }
    function plural(ms2, msAbs, n, name2) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms2 / n) + " " + name2 + (isPlural ? "s" : "");
    }
  }
});

// ../../node_modules/jsonwebtoken/lib/timespan.js
var require_timespan = __commonJS({
  "../../node_modules/jsonwebtoken/lib/timespan.js"(exports2, module2) {
    var ms2 = require_ms();
    module2.exports = function(time2, iat) {
      var timestamp = iat || Math.floor(Date.now() / 1e3);
      if (typeof time2 === "string") {
        var milliseconds = ms2(time2);
        if (typeof milliseconds === "undefined") {
          return;
        }
        return Math.floor(timestamp + milliseconds / 1e3);
      } else if (typeof time2 === "number") {
        return timestamp + time2;
      } else {
        return;
      }
    };
  }
});

// ../../node_modules/semver/internal/constants.js
var require_constants = __commonJS({
  "../../node_modules/semver/internal/constants.js"(exports2, module2) {
    "use strict";
    var SEMVER_SPEC_VERSION = "2.0.0";
    var MAX_LENGTH = 256;
    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
    9007199254740991;
    var MAX_SAFE_COMPONENT_LENGTH = 16;
    var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
    var RELEASE_TYPES = [
      "major",
      "premajor",
      "minor",
      "preminor",
      "patch",
      "prepatch",
      "prerelease"
    ];
    module2.exports = {
      MAX_LENGTH,
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_SAFE_INTEGER,
      RELEASE_TYPES,
      SEMVER_SPEC_VERSION,
      FLAG_INCLUDE_PRERELEASE: 1,
      FLAG_LOOSE: 2
    };
  }
});

// ../../node_modules/semver/internal/debug.js
var require_debug = __commonJS({
  "../../node_modules/semver/internal/debug.js"(exports2, module2) {
    "use strict";
    var debug2 = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
    };
    module2.exports = debug2;
  }
});

// ../../node_modules/semver/internal/re.js
var require_re = __commonJS({
  "../../node_modules/semver/internal/re.js"(exports2, module2) {
    "use strict";
    var {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = require_constants();
    var debug2 = require_debug();
    exports2 = module2.exports = {};
    var re = exports2.re = [];
    var safeRe = exports2.safeRe = [];
    var src = exports2.src = [];
    var safeSrc = exports2.safeSrc = [];
    var t = exports2.t = {};
    var R = 0;
    var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    var safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    var makeSafeRegex = (value) => {
      for (const [token, max] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
      }
      return value;
    };
    var createToken = (name2, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug2(name2, index, value);
      t[name2] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  }
});

// ../../node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS({
  "../../node_modules/semver/internal/parse-options.js"(exports2, module2) {
    "use strict";
    var looseOption = Object.freeze({ loose: true });
    var emptyOpts = Object.freeze({});
    var parseOptions = (options) => {
      if (!options) {
        return emptyOpts;
      }
      if (typeof options !== "object") {
        return looseOption;
      }
      return options;
    };
    module2.exports = parseOptions;
  }
});

// ../../node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS({
  "../../node_modules/semver/internal/identifiers.js"(exports2, module2) {
    "use strict";
    var numeric = /^[0-9]+$/;
    var compareIdentifiers = (a2, b) => {
      if (typeof a2 === "number" && typeof b === "number") {
        return a2 === b ? 0 : a2 < b ? -1 : 1;
      }
      const anum = numeric.test(a2);
      const bnum = numeric.test(b);
      if (anum && bnum) {
        a2 = +a2;
        b = +b;
      }
      return a2 === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a2 < b ? -1 : 1;
    };
    var rcompareIdentifiers = (a2, b) => compareIdentifiers(b, a2);
    module2.exports = {
      compareIdentifiers,
      rcompareIdentifiers
    };
  }
});

// ../../node_modules/semver/classes/semver.js
var require_semver = __commonJS({
  "../../node_modules/semver/classes/semver.js"(exports2, module2) {
    "use strict";
    var debug2 = require_debug();
    var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
    var { safeRe: re, t } = require_re();
    var parseOptions = require_parse_options();
    var { compareIdentifiers } = require_identifiers();
    var SemVer = class _SemVer {
      constructor(version, options) {
        options = parseOptions(options);
        if (version instanceof _SemVer) {
          if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
            return version;
          } else {
            version = version.version;
          }
        } else if (typeof version !== "string") {
          throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
        }
        if (version.length > MAX_LENGTH) {
          throw new TypeError(
            `version is longer than ${MAX_LENGTH} characters`
          );
        }
        debug2("SemVer", version, options);
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        const m2 = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
        if (!m2) {
          throw new TypeError(`Invalid Version: ${version}`);
        }
        this.raw = version;
        this.major = +m2[1];
        this.minor = +m2[2];
        this.patch = +m2[3];
        if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
          throw new TypeError("Invalid major version");
        }
        if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
          throw new TypeError("Invalid minor version");
        }
        if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
          throw new TypeError("Invalid patch version");
        }
        if (!m2[4]) {
          this.prerelease = [];
        } else {
          this.prerelease = m2[4].split(".").map((id) => {
            if (/^[0-9]+$/.test(id)) {
              const num = +id;
              if (num >= 0 && num < MAX_SAFE_INTEGER) {
                return num;
              }
            }
            return id;
          });
        }
        this.build = m2[5] ? m2[5].split(".") : [];
        this.format();
      }
      format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) {
          this.version += `-${this.prerelease.join(".")}`;
        }
        return this.version;
      }
      toString() {
        return this.version;
      }
      compare(other) {
        debug2("SemVer.compare", this.version, this.options, other);
        if (!(other instanceof _SemVer)) {
          if (typeof other === "string" && other === this.version) {
            return 0;
          }
          other = new _SemVer(other, this.options);
        }
        if (other.version === this.version) {
          return 0;
        }
        return this.compareMain(other) || this.comparePre(other);
      }
      compareMain(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.major < other.major) {
          return -1;
        }
        if (this.major > other.major) {
          return 1;
        }
        if (this.minor < other.minor) {
          return -1;
        }
        if (this.minor > other.minor) {
          return 1;
        }
        if (this.patch < other.patch) {
          return -1;
        }
        if (this.patch > other.patch) {
          return 1;
        }
        return 0;
      }
      comparePre(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        if (this.prerelease.length && !other.prerelease.length) {
          return -1;
        } else if (!this.prerelease.length && other.prerelease.length) {
          return 1;
        } else if (!this.prerelease.length && !other.prerelease.length) {
          return 0;
        }
        let i = 0;
        do {
          const a2 = this.prerelease[i];
          const b = other.prerelease[i];
          debug2("prerelease compare", i, a2, b);
          if (a2 === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a2 === void 0) {
            return -1;
          } else if (a2 === b) {
            continue;
          } else {
            return compareIdentifiers(a2, b);
          }
        } while (++i);
      }
      compareBuild(other) {
        if (!(other instanceof _SemVer)) {
          other = new _SemVer(other, this.options);
        }
        let i = 0;
        do {
          const a2 = this.build[i];
          const b = other.build[i];
          debug2("build compare", i, a2, b);
          if (a2 === void 0 && b === void 0) {
            return 0;
          } else if (b === void 0) {
            return 1;
          } else if (a2 === void 0) {
            return -1;
          } else if (a2 === b) {
            continue;
          } else {
            return compareIdentifiers(a2, b);
          }
        } while (++i);
      }
      // preminor will bump the version up to the next minor release, and immediately
      // down to pre-release. premajor and prepatch work the same way.
      inc(release, identifier, identifierBase) {
        if (release.startsWith("pre")) {
          if (!identifier && identifierBase === false) {
            throw new Error("invalid increment argument: identifier is empty");
          }
          if (identifier) {
            const match2 = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
            if (!match2 || match2[1] !== identifier) {
              throw new Error(`invalid identifier: ${identifier}`);
            }
          }
        }
        switch (release) {
          case "premajor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor = 0;
            this.major++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "preminor":
            this.prerelease.length = 0;
            this.patch = 0;
            this.minor++;
            this.inc("pre", identifier, identifierBase);
            break;
          case "prepatch":
            this.prerelease.length = 0;
            this.inc("patch", identifier, identifierBase);
            this.inc("pre", identifier, identifierBase);
            break;
          // If the input is a non-prerelease version, this acts the same as
          // prepatch.
          case "prerelease":
            if (this.prerelease.length === 0) {
              this.inc("patch", identifier, identifierBase);
            }
            this.inc("pre", identifier, identifierBase);
            break;
          case "release":
            if (this.prerelease.length === 0) {
              throw new Error(`version ${this.raw} is not a prerelease`);
            }
            this.prerelease.length = 0;
            break;
          case "major":
            if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
              this.major++;
            }
            this.minor = 0;
            this.patch = 0;
            this.prerelease = [];
            break;
          case "minor":
            if (this.patch !== 0 || this.prerelease.length === 0) {
              this.minor++;
            }
            this.patch = 0;
            this.prerelease = [];
            break;
          case "patch":
            if (this.prerelease.length === 0) {
              this.patch++;
            }
            this.prerelease = [];
            break;
          // This probably shouldn't be used publicly.
          // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
          case "pre": {
            const base = Number(identifierBase) ? 1 : 0;
            if (this.prerelease.length === 0) {
              this.prerelease = [base];
            } else {
              let i = this.prerelease.length;
              while (--i >= 0) {
                if (typeof this.prerelease[i] === "number") {
                  this.prerelease[i]++;
                  i = -2;
                }
              }
              if (i === -1) {
                if (identifier === this.prerelease.join(".") && identifierBase === false) {
                  throw new Error("invalid increment argument: identifier already exists");
                }
                this.prerelease.push(base);
              }
            }
            if (identifier) {
              let prerelease = [identifier, base];
              if (identifierBase === false) {
                prerelease = [identifier];
              }
              if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                if (isNaN(this.prerelease[1])) {
                  this.prerelease = prerelease;
                }
              } else {
                this.prerelease = prerelease;
              }
            }
            break;
          }
          default:
            throw new Error(`invalid increment argument: ${release}`);
        }
        this.raw = this.format();
        if (this.build.length) {
          this.raw += `+${this.build.join(".")}`;
        }
        return this;
      }
    };
    module2.exports = SemVer;
  }
});

// ../../node_modules/semver/functions/parse.js
var require_parse = __commonJS({
  "../../node_modules/semver/functions/parse.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse2 = (version, options, throwErrors = false) => {
      if (version instanceof SemVer) {
        return version;
      }
      try {
        return new SemVer(version, options);
      } catch (er) {
        if (!throwErrors) {
          return null;
        }
        throw er;
      }
    };
    module2.exports = parse2;
  }
});

// ../../node_modules/semver/functions/valid.js
var require_valid = __commonJS({
  "../../node_modules/semver/functions/valid.js"(exports2, module2) {
    "use strict";
    var parse2 = require_parse();
    var valid = (version, options) => {
      const v2 = parse2(version, options);
      return v2 ? v2.version : null;
    };
    module2.exports = valid;
  }
});

// ../../node_modules/semver/functions/clean.js
var require_clean = __commonJS({
  "../../node_modules/semver/functions/clean.js"(exports2, module2) {
    "use strict";
    var parse2 = require_parse();
    var clean = (version, options) => {
      const s = parse2(version.trim().replace(/^[=v]+/, ""), options);
      return s ? s.version : null;
    };
    module2.exports = clean;
  }
});

// ../../node_modules/semver/functions/inc.js
var require_inc = __commonJS({
  "../../node_modules/semver/functions/inc.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var inc = (version, release, options, identifier, identifierBase) => {
      if (typeof options === "string") {
        identifierBase = identifier;
        identifier = options;
        options = void 0;
      }
      try {
        return new SemVer(
          version instanceof SemVer ? version.version : version,
          options
        ).inc(release, identifier, identifierBase).version;
      } catch (er) {
        return null;
      }
    };
    module2.exports = inc;
  }
});

// ../../node_modules/semver/functions/diff.js
var require_diff = __commonJS({
  "../../node_modules/semver/functions/diff.js"(exports2, module2) {
    "use strict";
    var parse2 = require_parse();
    var diff = (version1, version2) => {
      const v1 = parse2(version1, null, true);
      const v2 = parse2(version2, null, true);
      const comparison = v1.compare(v2);
      if (comparison === 0) {
        return null;
      }
      const v1Higher = comparison > 0;
      const highVersion = v1Higher ? v1 : v2;
      const lowVersion = v1Higher ? v2 : v1;
      const highHasPre = !!highVersion.prerelease.length;
      const lowHasPre = !!lowVersion.prerelease.length;
      if (lowHasPre && !highHasPre) {
        if (!lowVersion.patch && !lowVersion.minor) {
          return "major";
        }
        if (lowVersion.compareMain(highVersion) === 0) {
          if (lowVersion.minor && !lowVersion.patch) {
            return "minor";
          }
          return "patch";
        }
      }
      const prefix = highHasPre ? "pre" : "";
      if (v1.major !== v2.major) {
        return prefix + "major";
      }
      if (v1.minor !== v2.minor) {
        return prefix + "minor";
      }
      if (v1.patch !== v2.patch) {
        return prefix + "patch";
      }
      return "prerelease";
    };
    module2.exports = diff;
  }
});

// ../../node_modules/semver/functions/major.js
var require_major = __commonJS({
  "../../node_modules/semver/functions/major.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var major = (a2, loose) => new SemVer(a2, loose).major;
    module2.exports = major;
  }
});

// ../../node_modules/semver/functions/minor.js
var require_minor = __commonJS({
  "../../node_modules/semver/functions/minor.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var minor = (a2, loose) => new SemVer(a2, loose).minor;
    module2.exports = minor;
  }
});

// ../../node_modules/semver/functions/patch.js
var require_patch = __commonJS({
  "../../node_modules/semver/functions/patch.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var patch = (a2, loose) => new SemVer(a2, loose).patch;
    module2.exports = patch;
  }
});

// ../../node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS({
  "../../node_modules/semver/functions/prerelease.js"(exports2, module2) {
    "use strict";
    var parse2 = require_parse();
    var prerelease = (version, options) => {
      const parsed = parse2(version, options);
      return parsed && parsed.prerelease.length ? parsed.prerelease : null;
    };
    module2.exports = prerelease;
  }
});

// ../../node_modules/semver/functions/compare.js
var require_compare = __commonJS({
  "../../node_modules/semver/functions/compare.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var compare = (a2, b, loose) => new SemVer(a2, loose).compare(new SemVer(b, loose));
    module2.exports = compare;
  }
});

// ../../node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS({
  "../../node_modules/semver/functions/rcompare.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var rcompare = (a2, b, loose) => compare(b, a2, loose);
    module2.exports = rcompare;
  }
});

// ../../node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS({
  "../../node_modules/semver/functions/compare-loose.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var compareLoose = (a2, b) => compare(a2, b, true);
    module2.exports = compareLoose;
  }
});

// ../../node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS({
  "../../node_modules/semver/functions/compare-build.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var compareBuild = (a2, b, loose) => {
      const versionA = new SemVer(a2, loose);
      const versionB = new SemVer(b, loose);
      return versionA.compare(versionB) || versionA.compareBuild(versionB);
    };
    module2.exports = compareBuild;
  }
});

// ../../node_modules/semver/functions/sort.js
var require_sort = __commonJS({
  "../../node_modules/semver/functions/sort.js"(exports2, module2) {
    "use strict";
    var compareBuild = require_compare_build();
    var sort = (list, loose) => list.sort((a2, b) => compareBuild(a2, b, loose));
    module2.exports = sort;
  }
});

// ../../node_modules/semver/functions/rsort.js
var require_rsort = __commonJS({
  "../../node_modules/semver/functions/rsort.js"(exports2, module2) {
    "use strict";
    var compareBuild = require_compare_build();
    var rsort = (list, loose) => list.sort((a2, b) => compareBuild(b, a2, loose));
    module2.exports = rsort;
  }
});

// ../../node_modules/semver/functions/gt.js
var require_gt = __commonJS({
  "../../node_modules/semver/functions/gt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gt = (a2, b, loose) => compare(a2, b, loose) > 0;
    module2.exports = gt;
  }
});

// ../../node_modules/semver/functions/lt.js
var require_lt = __commonJS({
  "../../node_modules/semver/functions/lt.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lt = (a2, b, loose) => compare(a2, b, loose) < 0;
    module2.exports = lt;
  }
});

// ../../node_modules/semver/functions/eq.js
var require_eq = __commonJS({
  "../../node_modules/semver/functions/eq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var eq = (a2, b, loose) => compare(a2, b, loose) === 0;
    module2.exports = eq;
  }
});

// ../../node_modules/semver/functions/neq.js
var require_neq = __commonJS({
  "../../node_modules/semver/functions/neq.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var neq = (a2, b, loose) => compare(a2, b, loose) !== 0;
    module2.exports = neq;
  }
});

// ../../node_modules/semver/functions/gte.js
var require_gte = __commonJS({
  "../../node_modules/semver/functions/gte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var gte = (a2, b, loose) => compare(a2, b, loose) >= 0;
    module2.exports = gte;
  }
});

// ../../node_modules/semver/functions/lte.js
var require_lte = __commonJS({
  "../../node_modules/semver/functions/lte.js"(exports2, module2) {
    "use strict";
    var compare = require_compare();
    var lte = (a2, b, loose) => compare(a2, b, loose) <= 0;
    module2.exports = lte;
  }
});

// ../../node_modules/semver/functions/cmp.js
var require_cmp = __commonJS({
  "../../node_modules/semver/functions/cmp.js"(exports2, module2) {
    "use strict";
    var eq = require_eq();
    var neq = require_neq();
    var gt = require_gt();
    var gte = require_gte();
    var lt = require_lt();
    var lte = require_lte();
    var cmp = (a2, op, b, loose) => {
      switch (op) {
        case "===":
          if (typeof a2 === "object") {
            a2 = a2.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a2 === b;
        case "!==":
          if (typeof a2 === "object") {
            a2 = a2.version;
          }
          if (typeof b === "object") {
            b = b.version;
          }
          return a2 !== b;
        case "":
        case "=":
        case "==":
          return eq(a2, b, loose);
        case "!=":
          return neq(a2, b, loose);
        case ">":
          return gt(a2, b, loose);
        case ">=":
          return gte(a2, b, loose);
        case "<":
          return lt(a2, b, loose);
        case "<=":
          return lte(a2, b, loose);
        default:
          throw new TypeError(`Invalid operator: ${op}`);
      }
    };
    module2.exports = cmp;
  }
});

// ../../node_modules/semver/functions/coerce.js
var require_coerce = __commonJS({
  "../../node_modules/semver/functions/coerce.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var parse2 = require_parse();
    var { safeRe: re, t } = require_re();
    var coerce2 = (version, options) => {
      if (version instanceof SemVer) {
        return version;
      }
      if (typeof version === "number") {
        version = String(version);
      }
      if (typeof version !== "string") {
        return null;
      }
      options = options || {};
      let match2 = null;
      if (!options.rtl) {
        match2 = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
      } else {
        const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
        let next;
        while ((next = coerceRtlRegex.exec(version)) && (!match2 || match2.index + match2[0].length !== version.length)) {
          if (!match2 || next.index + next[0].length !== match2.index + match2[0].length) {
            match2 = next;
          }
          coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
        }
        coerceRtlRegex.lastIndex = -1;
      }
      if (match2 === null) {
        return null;
      }
      const major = match2[2];
      const minor = match2[3] || "0";
      const patch = match2[4] || "0";
      const prerelease = options.includePrerelease && match2[5] ? `-${match2[5]}` : "";
      const build = options.includePrerelease && match2[6] ? `+${match2[6]}` : "";
      return parse2(`${major}.${minor}.${patch}${prerelease}${build}`, options);
    };
    module2.exports = coerce2;
  }
});

// ../../node_modules/semver/internal/lrucache.js
var require_lrucache = __commonJS({
  "../../node_modules/semver/internal/lrucache.js"(exports2, module2) {
    "use strict";
    var LRUCache = class {
      constructor() {
        this.max = 1e3;
        this.map = /* @__PURE__ */ new Map();
      }
      get(key3) {
        const value = this.map.get(key3);
        if (value === void 0) {
          return void 0;
        } else {
          this.map.delete(key3);
          this.map.set(key3, value);
          return value;
        }
      }
      delete(key3) {
        return this.map.delete(key3);
      }
      set(key3, value) {
        const deleted = this.delete(key3);
        if (!deleted && value !== void 0) {
          if (this.map.size >= this.max) {
            const firstKey = this.map.keys().next().value;
            this.delete(firstKey);
          }
          this.map.set(key3, value);
        }
        return this;
      }
    };
    module2.exports = LRUCache;
  }
});

// ../../node_modules/semver/classes/range.js
var require_range = __commonJS({
  "../../node_modules/semver/classes/range.js"(exports2, module2) {
    "use strict";
    var SPACE_CHARACTERS = /\s+/g;
    var Range = class _Range {
      constructor(range, options) {
        options = parseOptions(options);
        if (range instanceof _Range) {
          if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
            return range;
          } else {
            return new _Range(range.raw, options);
          }
        }
        if (range instanceof Comparator) {
          this.raw = range.value;
          this.set = [[range]];
          this.formatted = void 0;
          return this;
        }
        this.options = options;
        this.loose = !!options.loose;
        this.includePrerelease = !!options.includePrerelease;
        this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
        this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
        if (!this.set.length) {
          throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
        }
        if (this.set.length > 1) {
          const first = this.set[0];
          this.set = this.set.filter((c) => !isNullSet(c[0]));
          if (this.set.length === 0) {
            this.set = [first];
          } else if (this.set.length > 1) {
            for (const c of this.set) {
              if (c.length === 1 && isAny(c[0])) {
                this.set = [c];
                break;
              }
            }
          }
        }
        this.formatted = void 0;
      }
      get range() {
        if (this.formatted === void 0) {
          this.formatted = "";
          for (let i = 0; i < this.set.length; i++) {
            if (i > 0) {
              this.formatted += "||";
            }
            const comps = this.set[i];
            for (let k = 0; k < comps.length; k++) {
              if (k > 0) {
                this.formatted += " ";
              }
              this.formatted += comps[k].toString().trim();
            }
          }
        }
        return this.formatted;
      }
      format() {
        return this.range;
      }
      toString() {
        return this.range;
      }
      parseRange(range) {
        const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
        const memoKey = memoOpts + ":" + range;
        const cached = cache2.get(memoKey);
        if (cached) {
          return cached;
        }
        const loose = this.options.loose;
        const hr2 = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
        range = range.replace(hr2, hyphenReplace(this.options.includePrerelease));
        debug2("hyphen replace", range);
        range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
        debug2("comparator trim", range);
        range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
        debug2("tilde trim", range);
        range = range.replace(re[t.CARETTRIM], caretTrimReplace);
        debug2("caret trim", range);
        let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
        if (loose) {
          rangeList = rangeList.filter((comp) => {
            debug2("loose invalid filter", comp, this.options);
            return !!comp.match(re[t.COMPARATORLOOSE]);
          });
        }
        debug2("range list", rangeList);
        const rangeMap = /* @__PURE__ */ new Map();
        const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
        for (const comp of comparators) {
          if (isNullSet(comp)) {
            return [comp];
          }
          rangeMap.set(comp.value, comp);
        }
        if (rangeMap.size > 1 && rangeMap.has("")) {
          rangeMap.delete("");
        }
        const result = [...rangeMap.values()];
        cache2.set(memoKey, result);
        return result;
      }
      intersects(range, options) {
        if (!(range instanceof _Range)) {
          throw new TypeError("a Range is required");
        }
        return this.set.some((thisComparators) => {
          return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
            return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
              return rangeComparators.every((rangeComparator) => {
                return thisComparator.intersects(rangeComparator, options);
              });
            });
          });
        });
      }
      // if ANY of the sets match ALL of its comparators, then pass
      test(version) {
        if (!version) {
          return false;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        for (let i = 0; i < this.set.length; i++) {
          if (testSet(this.set[i], version, this.options)) {
            return true;
          }
        }
        return false;
      }
    };
    module2.exports = Range;
    var LRU = require_lrucache();
    var cache2 = new LRU();
    var parseOptions = require_parse_options();
    var Comparator = require_comparator();
    var debug2 = require_debug();
    var SemVer = require_semver();
    var {
      safeRe: re,
      t,
      comparatorTrimReplace,
      tildeTrimReplace,
      caretTrimReplace
    } = require_re();
    var { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
    var isNullSet = (c) => c.value === "<0.0.0-0";
    var isAny = (c) => c.value === "";
    var isSatisfiable = (comparators, options) => {
      let result = true;
      const remainingComparators = comparators.slice();
      let testComparator = remainingComparators.pop();
      while (result && remainingComparators.length) {
        result = remainingComparators.every((otherComparator) => {
          return testComparator.intersects(otherComparator, options);
        });
        testComparator = remainingComparators.pop();
      }
      return result;
    };
    var parseComparator = (comp, options) => {
      comp = comp.replace(re[t.BUILD], "");
      debug2("comp", comp, options);
      comp = replaceCarets(comp, options);
      debug2("caret", comp);
      comp = replaceTildes(comp, options);
      debug2("tildes", comp);
      comp = replaceXRanges(comp, options);
      debug2("xrange", comp);
      comp = replaceStars(comp, options);
      debug2("stars", comp);
      return comp;
    };
    var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
    var replaceTildes = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
    };
    var replaceTilde = (comp, options) => {
      const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
      return comp.replace(r, (_2, M, m2, p2, pr) => {
        debug2("tilde", comp, _2, M, m2, p2, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m2)) {
          ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
        } else if (isX(p2)) {
          ret = `>=${M}.${m2}.0 <${M}.${+m2 + 1}.0-0`;
        } else if (pr) {
          debug2("replaceTilde pr", pr);
          ret = `>=${M}.${m2}.${p2}-${pr} <${M}.${+m2 + 1}.0-0`;
        } else {
          ret = `>=${M}.${m2}.${p2} <${M}.${+m2 + 1}.0-0`;
        }
        debug2("tilde return", ret);
        return ret;
      });
    };
    var replaceCarets = (comp, options) => {
      return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
    };
    var replaceCaret = (comp, options) => {
      debug2("caret", comp, options);
      const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
      const z2 = options.includePrerelease ? "-0" : "";
      return comp.replace(r, (_2, M, m2, p2, pr) => {
        debug2("caret", comp, _2, M, m2, p2, pr);
        let ret;
        if (isX(M)) {
          ret = "";
        } else if (isX(m2)) {
          ret = `>=${M}.0.0${z2} <${+M + 1}.0.0-0`;
        } else if (isX(p2)) {
          if (M === "0") {
            ret = `>=${M}.${m2}.0${z2} <${M}.${+m2 + 1}.0-0`;
          } else {
            ret = `>=${M}.${m2}.0${z2} <${+M + 1}.0.0-0`;
          }
        } else if (pr) {
          debug2("replaceCaret pr", pr);
          if (M === "0") {
            if (m2 === "0") {
              ret = `>=${M}.${m2}.${p2}-${pr} <${M}.${m2}.${+p2 + 1}-0`;
            } else {
              ret = `>=${M}.${m2}.${p2}-${pr} <${M}.${+m2 + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m2}.${p2}-${pr} <${+M + 1}.0.0-0`;
          }
        } else {
          debug2("no pr");
          if (M === "0") {
            if (m2 === "0") {
              ret = `>=${M}.${m2}.${p2}${z2} <${M}.${m2}.${+p2 + 1}-0`;
            } else {
              ret = `>=${M}.${m2}.${p2}${z2} <${M}.${+m2 + 1}.0-0`;
            }
          } else {
            ret = `>=${M}.${m2}.${p2} <${+M + 1}.0.0-0`;
          }
        }
        debug2("caret return", ret);
        return ret;
      });
    };
    var replaceXRanges = (comp, options) => {
      debug2("replaceXRanges", comp, options);
      return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
    };
    var replaceXRange = (comp, options) => {
      comp = comp.trim();
      const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
      return comp.replace(r, (ret, gtlt, M, m2, p2, pr) => {
        debug2("xRange", comp, ret, gtlt, M, m2, p2, pr);
        const xM = isX(M);
        const xm = xM || isX(m2);
        const xp = xm || isX(p2);
        const anyX = xp;
        if (gtlt === "=" && anyX) {
          gtlt = "";
        }
        pr = options.includePrerelease ? "-0" : "";
        if (xM) {
          if (gtlt === ">" || gtlt === "<") {
            ret = "<0.0.0-0";
          } else {
            ret = "*";
          }
        } else if (gtlt && anyX) {
          if (xm) {
            m2 = 0;
          }
          p2 = 0;
          if (gtlt === ">") {
            gtlt = ">=";
            if (xm) {
              M = +M + 1;
              m2 = 0;
              p2 = 0;
            } else {
              m2 = +m2 + 1;
              p2 = 0;
            }
          } else if (gtlt === "<=") {
            gtlt = "<";
            if (xm) {
              M = +M + 1;
            } else {
              m2 = +m2 + 1;
            }
          }
          if (gtlt === "<") {
            pr = "-0";
          }
          ret = `${gtlt + M}.${m2}.${p2}${pr}`;
        } else if (xm) {
          ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
        } else if (xp) {
          ret = `>=${M}.${m2}.0${pr} <${M}.${+m2 + 1}.0-0`;
        }
        debug2("xRange return", ret);
        return ret;
      });
    };
    var replaceStars = (comp, options) => {
      debug2("replaceStars", comp, options);
      return comp.trim().replace(re[t.STAR], "");
    };
    var replaceGTE0 = (comp, options) => {
      debug2("replaceGTE0", comp, options);
      return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
    };
    var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to2, tM, tm, tp, tpr) => {
      if (isX(fM)) {
        from = "";
      } else if (isX(fm)) {
        from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
      } else if (isX(fp)) {
        from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
      } else if (fpr) {
        from = `>=${from}`;
      } else {
        from = `>=${from}${incPr ? "-0" : ""}`;
      }
      if (isX(tM)) {
        to2 = "";
      } else if (isX(tm)) {
        to2 = `<${+tM + 1}.0.0-0`;
      } else if (isX(tp)) {
        to2 = `<${tM}.${+tm + 1}.0-0`;
      } else if (tpr) {
        to2 = `<=${tM}.${tm}.${tp}-${tpr}`;
      } else if (incPr) {
        to2 = `<${tM}.${tm}.${+tp + 1}-0`;
      } else {
        to2 = `<=${to2}`;
      }
      return `${from} ${to2}`.trim();
    };
    var testSet = (set, version, options) => {
      for (let i = 0; i < set.length; i++) {
        if (!set[i].test(version)) {
          return false;
        }
      }
      if (version.prerelease.length && !options.includePrerelease) {
        for (let i = 0; i < set.length; i++) {
          debug2(set[i].semver);
          if (set[i].semver === Comparator.ANY) {
            continue;
          }
          if (set[i].semver.prerelease.length > 0) {
            const allowed = set[i].semver;
            if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
              return true;
            }
          }
        }
        return false;
      }
      return true;
    };
  }
});

// ../../node_modules/semver/classes/comparator.js
var require_comparator = __commonJS({
  "../../node_modules/semver/classes/comparator.js"(exports2, module2) {
    "use strict";
    var ANY = /* @__PURE__ */ Symbol("SemVer ANY");
    var Comparator = class _Comparator {
      static get ANY() {
        return ANY;
      }
      constructor(comp, options) {
        options = parseOptions(options);
        if (comp instanceof _Comparator) {
          if (comp.loose === !!options.loose) {
            return comp;
          } else {
            comp = comp.value;
          }
        }
        comp = comp.trim().split(/\s+/).join(" ");
        debug2("comparator", comp, options);
        this.options = options;
        this.loose = !!options.loose;
        this.parse(comp);
        if (this.semver === ANY) {
          this.value = "";
        } else {
          this.value = this.operator + this.semver.version;
        }
        debug2("comp", this);
      }
      parse(comp) {
        const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
        const m2 = comp.match(r);
        if (!m2) {
          throw new TypeError(`Invalid comparator: ${comp}`);
        }
        this.operator = m2[1] !== void 0 ? m2[1] : "";
        if (this.operator === "=") {
          this.operator = "";
        }
        if (!m2[2]) {
          this.semver = ANY;
        } else {
          this.semver = new SemVer(m2[2], this.options.loose);
        }
      }
      toString() {
        return this.value;
      }
      test(version) {
        debug2("Comparator.test", version, this.options.loose);
        if (this.semver === ANY || version === ANY) {
          return true;
        }
        if (typeof version === "string") {
          try {
            version = new SemVer(version, this.options);
          } catch (er) {
            return false;
          }
        }
        return cmp(version, this.operator, this.semver, this.options);
      }
      intersects(comp, options) {
        if (!(comp instanceof _Comparator)) {
          throw new TypeError("a Comparator is required");
        }
        if (this.operator === "") {
          if (this.value === "") {
            return true;
          }
          return new Range(comp.value, options).test(this.value);
        } else if (comp.operator === "") {
          if (comp.value === "") {
            return true;
          }
          return new Range(this.value, options).test(comp.semver);
        }
        options = parseOptions(options);
        if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
          return false;
        }
        if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
          return false;
        }
        if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
          return true;
        }
        if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
          return true;
        }
        if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
          return true;
        }
        if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
          return true;
        }
        if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
          return true;
        }
        return false;
      }
    };
    module2.exports = Comparator;
    var parseOptions = require_parse_options();
    var { safeRe: re, t } = require_re();
    var cmp = require_cmp();
    var debug2 = require_debug();
    var SemVer = require_semver();
    var Range = require_range();
  }
});

// ../../node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS({
  "../../node_modules/semver/functions/satisfies.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var satisfies = (version, range, options) => {
      try {
        range = new Range(range, options);
      } catch (er) {
        return false;
      }
      return range.test(version);
    };
    module2.exports = satisfies;
  }
});

// ../../node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS({
  "../../node_modules/semver/ranges/to-comparators.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
    module2.exports = toComparators;
  }
});

// ../../node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS({
  "../../node_modules/semver/ranges/max-satisfying.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var maxSatisfying = (versions, range, options) => {
      let max = null;
      let maxSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v2) => {
        if (rangeObj.test(v2)) {
          if (!max || maxSV.compare(v2) === -1) {
            max = v2;
            maxSV = new SemVer(max, options);
          }
        }
      });
      return max;
    };
    module2.exports = maxSatisfying;
  }
});

// ../../node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS({
  "../../node_modules/semver/ranges/min-satisfying.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var minSatisfying = (versions, range, options) => {
      let min = null;
      let minSV = null;
      let rangeObj = null;
      try {
        rangeObj = new Range(range, options);
      } catch (er) {
        return null;
      }
      versions.forEach((v2) => {
        if (rangeObj.test(v2)) {
          if (!min || minSV.compare(v2) === 1) {
            min = v2;
            minSV = new SemVer(min, options);
          }
        }
      });
      return min;
    };
    module2.exports = minSatisfying;
  }
});

// ../../node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS({
  "../../node_modules/semver/ranges/min-version.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Range = require_range();
    var gt = require_gt();
    var minVersion = (range, loose) => {
      range = new Range(range, loose);
      let minver = new SemVer("0.0.0");
      if (range.test(minver)) {
        return minver;
      }
      minver = new SemVer("0.0.0-0");
      if (range.test(minver)) {
        return minver;
      }
      minver = null;
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let setMin = null;
        comparators.forEach((comparator) => {
          const compver = new SemVer(comparator.semver.version);
          switch (comparator.operator) {
            case ">":
              if (compver.prerelease.length === 0) {
                compver.patch++;
              } else {
                compver.prerelease.push(0);
              }
              compver.raw = compver.format();
            /* fallthrough */
            case "":
            case ">=":
              if (!setMin || gt(compver, setMin)) {
                setMin = compver;
              }
              break;
            case "<":
            case "<=":
              break;
            /* istanbul ignore next */
            default:
              throw new Error(`Unexpected operation: ${comparator.operator}`);
          }
        });
        if (setMin && (!minver || gt(minver, setMin))) {
          minver = setMin;
        }
      }
      if (minver && range.test(minver)) {
        return minver;
      }
      return null;
    };
    module2.exports = minVersion;
  }
});

// ../../node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS({
  "../../node_modules/semver/ranges/valid.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var validRange = (range, options) => {
      try {
        return new Range(range, options).range || "*";
      } catch (er) {
        return null;
      }
    };
    module2.exports = validRange;
  }
});

// ../../node_modules/semver/ranges/outside.js
var require_outside = __commonJS({
  "../../node_modules/semver/ranges/outside.js"(exports2, module2) {
    "use strict";
    var SemVer = require_semver();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var Range = require_range();
    var satisfies = require_satisfies();
    var gt = require_gt();
    var lt = require_lt();
    var lte = require_lte();
    var gte = require_gte();
    var outside = (version, range, hilo, options) => {
      version = new SemVer(version, options);
      range = new Range(range, options);
      let gtfn, ltefn, ltfn, comp, ecomp;
      switch (hilo) {
        case ">":
          gtfn = gt;
          ltefn = lte;
          ltfn = lt;
          comp = ">";
          ecomp = ">=";
          break;
        case "<":
          gtfn = lt;
          ltefn = gte;
          ltfn = gt;
          comp = "<";
          ecomp = "<=";
          break;
        default:
          throw new TypeError('Must provide a hilo val of "<" or ">"');
      }
      if (satisfies(version, range, options)) {
        return false;
      }
      for (let i = 0; i < range.set.length; ++i) {
        const comparators = range.set[i];
        let high = null;
        let low = null;
        comparators.forEach((comparator) => {
          if (comparator.semver === ANY) {
            comparator = new Comparator(">=0.0.0");
          }
          high = high || comparator;
          low = low || comparator;
          if (gtfn(comparator.semver, high.semver, options)) {
            high = comparator;
          } else if (ltfn(comparator.semver, low.semver, options)) {
            low = comparator;
          }
        });
        if (high.operator === comp || high.operator === ecomp) {
          return false;
        }
        if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
          return false;
        } else if (low.operator === ecomp && ltfn(version, low.semver)) {
          return false;
        }
      }
      return true;
    };
    module2.exports = outside;
  }
});

// ../../node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS({
  "../../node_modules/semver/ranges/gtr.js"(exports2, module2) {
    "use strict";
    var outside = require_outside();
    var gtr = (version, range, options) => outside(version, range, ">", options);
    module2.exports = gtr;
  }
});

// ../../node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS({
  "../../node_modules/semver/ranges/ltr.js"(exports2, module2) {
    "use strict";
    var outside = require_outside();
    var ltr = (version, range, options) => outside(version, range, "<", options);
    module2.exports = ltr;
  }
});

// ../../node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS({
  "../../node_modules/semver/ranges/intersects.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var intersects = (r1, r2, options) => {
      r1 = new Range(r1, options);
      r2 = new Range(r2, options);
      return r1.intersects(r2, options);
    };
    module2.exports = intersects;
  }
});

// ../../node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS({
  "../../node_modules/semver/ranges/simplify.js"(exports2, module2) {
    "use strict";
    var satisfies = require_satisfies();
    var compare = require_compare();
    module2.exports = (versions, range, options) => {
      const set = [];
      let first = null;
      let prev = null;
      const v2 = versions.sort((a2, b) => compare(a2, b, options));
      for (const version of v2) {
        const included = satisfies(version, range, options);
        if (included) {
          prev = version;
          if (!first) {
            first = version;
          }
        } else {
          if (prev) {
            set.push([first, prev]);
          }
          prev = null;
          first = null;
        }
      }
      if (first) {
        set.push([first, null]);
      }
      const ranges = [];
      for (const [min, max] of set) {
        if (min === max) {
          ranges.push(min);
        } else if (!max && min === v2[0]) {
          ranges.push("*");
        } else if (!max) {
          ranges.push(`>=${min}`);
        } else if (min === v2[0]) {
          ranges.push(`<=${max}`);
        } else {
          ranges.push(`${min} - ${max}`);
        }
      }
      const simplified = ranges.join(" || ");
      const original = typeof range.raw === "string" ? range.raw : String(range);
      return simplified.length < original.length ? simplified : range;
    };
  }
});

// ../../node_modules/semver/ranges/subset.js
var require_subset = __commonJS({
  "../../node_modules/semver/ranges/subset.js"(exports2, module2) {
    "use strict";
    var Range = require_range();
    var Comparator = require_comparator();
    var { ANY } = Comparator;
    var satisfies = require_satisfies();
    var compare = require_compare();
    var subset = (sub, dom, options = {}) => {
      if (sub === dom) {
        return true;
      }
      sub = new Range(sub, options);
      dom = new Range(dom, options);
      let sawNonNull = false;
      OUTER: for (const simpleSub of sub.set) {
        for (const simpleDom of dom.set) {
          const isSub = simpleSubset(simpleSub, simpleDom, options);
          sawNonNull = sawNonNull || isSub !== null;
          if (isSub) {
            continue OUTER;
          }
        }
        if (sawNonNull) {
          return false;
        }
      }
      return true;
    };
    var minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
    var minimumVersion = [new Comparator(">=0.0.0")];
    var simpleSubset = (sub, dom, options) => {
      if (sub === dom) {
        return true;
      }
      if (sub.length === 1 && sub[0].semver === ANY) {
        if (dom.length === 1 && dom[0].semver === ANY) {
          return true;
        } else if (options.includePrerelease) {
          sub = minimumVersionWithPreRelease;
        } else {
          sub = minimumVersion;
        }
      }
      if (dom.length === 1 && dom[0].semver === ANY) {
        if (options.includePrerelease) {
          return true;
        } else {
          dom = minimumVersion;
        }
      }
      const eqSet = /* @__PURE__ */ new Set();
      let gt, lt;
      for (const c of sub) {
        if (c.operator === ">" || c.operator === ">=") {
          gt = higherGT(gt, c, options);
        } else if (c.operator === "<" || c.operator === "<=") {
          lt = lowerLT(lt, c, options);
        } else {
          eqSet.add(c.semver);
        }
      }
      if (eqSet.size > 1) {
        return null;
      }
      let gtltComp;
      if (gt && lt) {
        gtltComp = compare(gt.semver, lt.semver, options);
        if (gtltComp > 0) {
          return null;
        } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
          return null;
        }
      }
      for (const eq of eqSet) {
        if (gt && !satisfies(eq, String(gt), options)) {
          return null;
        }
        if (lt && !satisfies(eq, String(lt), options)) {
          return null;
        }
        for (const c of dom) {
          if (!satisfies(eq, String(c), options)) {
            return false;
          }
        }
        return true;
      }
      let higher, lower;
      let hasDomLT, hasDomGT;
      let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
      let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
      if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
        needDomLTPre = false;
      }
      for (const c of dom) {
        hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
        hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
        if (gt) {
          if (needDomGTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
              needDomGTPre = false;
            }
          }
          if (c.operator === ">" || c.operator === ">=") {
            higher = higherGT(gt, c, options);
            if (higher === c && higher !== gt) {
              return false;
            }
          } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
            return false;
          }
        }
        if (lt) {
          if (needDomLTPre) {
            if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
              needDomLTPre = false;
            }
          }
          if (c.operator === "<" || c.operator === "<=") {
            lower = lowerLT(lt, c, options);
            if (lower === c && lower !== lt) {
              return false;
            }
          } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
            return false;
          }
        }
        if (!c.operator && (lt || gt) && gtltComp !== 0) {
          return false;
        }
      }
      if (gt && hasDomLT && !lt && gtltComp !== 0) {
        return false;
      }
      if (lt && hasDomGT && !gt && gtltComp !== 0) {
        return false;
      }
      if (needDomGTPre || needDomLTPre) {
        return false;
      }
      return true;
    };
    var higherGT = (a2, b, options) => {
      if (!a2) {
        return b;
      }
      const comp = compare(a2.semver, b.semver, options);
      return comp > 0 ? a2 : comp < 0 ? b : b.operator === ">" && a2.operator === ">=" ? b : a2;
    };
    var lowerLT = (a2, b, options) => {
      if (!a2) {
        return b;
      }
      const comp = compare(a2.semver, b.semver, options);
      return comp < 0 ? a2 : comp > 0 ? b : b.operator === "<" && a2.operator === "<=" ? b : a2;
    };
    module2.exports = subset;
  }
});

// ../../node_modules/semver/index.js
var require_semver2 = __commonJS({
  "../../node_modules/semver/index.js"(exports2, module2) {
    "use strict";
    var internalRe = require_re();
    var constants = require_constants();
    var SemVer = require_semver();
    var identifiers = require_identifiers();
    var parse2 = require_parse();
    var valid = require_valid();
    var clean = require_clean();
    var inc = require_inc();
    var diff = require_diff();
    var major = require_major();
    var minor = require_minor();
    var patch = require_patch();
    var prerelease = require_prerelease();
    var compare = require_compare();
    var rcompare = require_rcompare();
    var compareLoose = require_compare_loose();
    var compareBuild = require_compare_build();
    var sort = require_sort();
    var rsort = require_rsort();
    var gt = require_gt();
    var lt = require_lt();
    var eq = require_eq();
    var neq = require_neq();
    var gte = require_gte();
    var lte = require_lte();
    var cmp = require_cmp();
    var coerce2 = require_coerce();
    var Comparator = require_comparator();
    var Range = require_range();
    var satisfies = require_satisfies();
    var toComparators = require_to_comparators();
    var maxSatisfying = require_max_satisfying();
    var minSatisfying = require_min_satisfying();
    var minVersion = require_min_version();
    var validRange = require_valid2();
    var outside = require_outside();
    var gtr = require_gtr();
    var ltr = require_ltr();
    var intersects = require_intersects();
    var simplifyRange = require_simplify();
    var subset = require_subset();
    module2.exports = {
      parse: parse2,
      valid,
      clean,
      inc,
      diff,
      major,
      minor,
      patch,
      prerelease,
      compare,
      rcompare,
      compareLoose,
      compareBuild,
      sort,
      rsort,
      gt,
      lt,
      eq,
      neq,
      gte,
      lte,
      cmp,
      coerce: coerce2,
      Comparator,
      Range,
      satisfies,
      toComparators,
      maxSatisfying,
      minSatisfying,
      minVersion,
      validRange,
      outside,
      gtr,
      ltr,
      intersects,
      simplifyRange,
      subset,
      SemVer,
      re: internalRe.re,
      src: internalRe.src,
      tokens: internalRe.t,
      SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
      RELEASE_TYPES: constants.RELEASE_TYPES,
      compareIdentifiers: identifiers.compareIdentifiers,
      rcompareIdentifiers: identifiers.rcompareIdentifiers
    };
  }
});

// ../../node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js
var require_asymmetricKeyDetailsSupported = __commonJS({
  "../../node_modules/jsonwebtoken/lib/asymmetricKeyDetailsSupported.js"(exports2, module2) {
    var semver = require_semver2();
    module2.exports = semver.satisfies(process.version, ">=15.7.0");
  }
});

// ../../node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js
var require_rsaPssKeyDetailsSupported = __commonJS({
  "../../node_modules/jsonwebtoken/lib/rsaPssKeyDetailsSupported.js"(exports2, module2) {
    var semver = require_semver2();
    module2.exports = semver.satisfies(process.version, ">=16.9.0");
  }
});

// ../../node_modules/jsonwebtoken/lib/validateAsymmetricKey.js
var require_validateAsymmetricKey = __commonJS({
  "../../node_modules/jsonwebtoken/lib/validateAsymmetricKey.js"(exports2, module2) {
    var ASYMMETRIC_KEY_DETAILS_SUPPORTED = require_asymmetricKeyDetailsSupported();
    var RSA_PSS_KEY_DETAILS_SUPPORTED = require_rsaPssKeyDetailsSupported();
    var allowedAlgorithmsForKeys = {
      "ec": ["ES256", "ES384", "ES512"],
      "rsa": ["RS256", "PS256", "RS384", "PS384", "RS512", "PS512"],
      "rsa-pss": ["PS256", "PS384", "PS512"]
    };
    var allowedCurves = {
      ES256: "prime256v1",
      ES384: "secp384r1",
      ES512: "secp521r1"
    };
    module2.exports = function(algorithm, key3) {
      if (!algorithm || !key3) return;
      const keyType = key3.asymmetricKeyType;
      if (!keyType) return;
      const allowedAlgorithms = allowedAlgorithmsForKeys[keyType];
      if (!allowedAlgorithms) {
        throw new Error(`Unknown key type "${keyType}".`);
      }
      if (!allowedAlgorithms.includes(algorithm)) {
        throw new Error(`"alg" parameter for "${keyType}" key type must be one of: ${allowedAlgorithms.join(", ")}.`);
      }
      if (ASYMMETRIC_KEY_DETAILS_SUPPORTED) {
        switch (keyType) {
          case "ec":
            const keyCurve = key3.asymmetricKeyDetails.namedCurve;
            const allowedCurve = allowedCurves[algorithm];
            if (keyCurve !== allowedCurve) {
              throw new Error(`"alg" parameter "${algorithm}" requires curve "${allowedCurve}".`);
            }
            break;
          case "rsa-pss":
            if (RSA_PSS_KEY_DETAILS_SUPPORTED) {
              const length = parseInt(algorithm.slice(-3), 10);
              const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key3.asymmetricKeyDetails;
              if (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm) {
                throw new Error(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${algorithm}.`);
              }
              if (saltLength !== void 0 && saltLength > length >> 3) {
                throw new Error(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${algorithm}.`);
              }
            }
            break;
        }
      }
    };
  }
});

// ../../node_modules/jsonwebtoken/lib/psSupported.js
var require_psSupported = __commonJS({
  "../../node_modules/jsonwebtoken/lib/psSupported.js"(exports2, module2) {
    var semver = require_semver2();
    module2.exports = semver.satisfies(process.version, "^6.12.0 || >=8.0.0");
  }
});

// ../../node_modules/jsonwebtoken/verify.js
var require_verify = __commonJS({
  "../../node_modules/jsonwebtoken/verify.js"(exports2, module2) {
    var JsonWebTokenError = require_JsonWebTokenError();
    var NotBeforeError = require_NotBeforeError();
    var TokenExpiredError = require_TokenExpiredError();
    var decode = require_decode();
    var timespan = require_timespan();
    var validateAsymmetricKey = require_validateAsymmetricKey();
    var PS_SUPPORTED = require_psSupported();
    var jws = require_jws();
    var { KeyObject, createSecretKey, createPublicKey } = require("crypto");
    var PUB_KEY_ALGS = ["RS256", "RS384", "RS512"];
    var EC_KEY_ALGS = ["ES256", "ES384", "ES512"];
    var RSA_KEY_ALGS = ["RS256", "RS384", "RS512"];
    var HS_ALGS = ["HS256", "HS384", "HS512"];
    if (PS_SUPPORTED) {
      PUB_KEY_ALGS.splice(PUB_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
      RSA_KEY_ALGS.splice(RSA_KEY_ALGS.length, 0, "PS256", "PS384", "PS512");
    }
    module2.exports = function(jwtString, secretOrPublicKey, options, callback) {
      if (typeof options === "function" && !callback) {
        callback = options;
        options = {};
      }
      if (!options) {
        options = {};
      }
      options = Object.assign({}, options);
      let done;
      if (callback) {
        done = callback;
      } else {
        done = function(err2, data) {
          if (err2) throw err2;
          return data;
        };
      }
      if (options.clockTimestamp && typeof options.clockTimestamp !== "number") {
        return done(new JsonWebTokenError("clockTimestamp must be a number"));
      }
      if (options.nonce !== void 0 && (typeof options.nonce !== "string" || options.nonce.trim() === "")) {
        return done(new JsonWebTokenError("nonce must be a non-empty string"));
      }
      if (options.allowInvalidAsymmetricKeyTypes !== void 0 && typeof options.allowInvalidAsymmetricKeyTypes !== "boolean") {
        return done(new JsonWebTokenError("allowInvalidAsymmetricKeyTypes must be a boolean"));
      }
      const clockTimestamp = options.clockTimestamp || Math.floor(Date.now() / 1e3);
      if (!jwtString) {
        return done(new JsonWebTokenError("jwt must be provided"));
      }
      if (typeof jwtString !== "string") {
        return done(new JsonWebTokenError("jwt must be a string"));
      }
      const parts = jwtString.split(".");
      if (parts.length !== 3) {
        return done(new JsonWebTokenError("jwt malformed"));
      }
      let decodedToken;
      try {
        decodedToken = decode(jwtString, { complete: true });
      } catch (err2) {
        return done(err2);
      }
      if (!decodedToken) {
        return done(new JsonWebTokenError("invalid token"));
      }
      const header = decodedToken.header;
      let getSecret;
      if (typeof secretOrPublicKey === "function") {
        if (!callback) {
          return done(new JsonWebTokenError("verify must be called asynchronous if secret or public key is provided as a callback"));
        }
        getSecret = secretOrPublicKey;
      } else {
        getSecret = function(header2, secretCallback) {
          return secretCallback(null, secretOrPublicKey);
        };
      }
      return getSecret(header, function(err2, secretOrPublicKey2) {
        if (err2) {
          return done(new JsonWebTokenError("error in secret or public key callback: " + err2.message));
        }
        const hasSignature = parts[2].trim() !== "";
        if (!hasSignature && secretOrPublicKey2) {
          return done(new JsonWebTokenError("jwt signature is required"));
        }
        if (hasSignature && !secretOrPublicKey2) {
          return done(new JsonWebTokenError("secret or public key must be provided"));
        }
        if (!hasSignature && !options.algorithms) {
          return done(new JsonWebTokenError('please specify "none" in "algorithms" to verify unsigned tokens'));
        }
        if (secretOrPublicKey2 != null && !(secretOrPublicKey2 instanceof KeyObject)) {
          try {
            secretOrPublicKey2 = createPublicKey(secretOrPublicKey2);
          } catch (_2) {
            try {
              secretOrPublicKey2 = createSecretKey(typeof secretOrPublicKey2 === "string" ? Buffer.from(secretOrPublicKey2) : secretOrPublicKey2);
            } catch (_3) {
              return done(new JsonWebTokenError("secretOrPublicKey is not valid key material"));
            }
          }
        }
        if (!options.algorithms) {
          if (secretOrPublicKey2.type === "secret") {
            options.algorithms = HS_ALGS;
          } else if (["rsa", "rsa-pss"].includes(secretOrPublicKey2.asymmetricKeyType)) {
            options.algorithms = RSA_KEY_ALGS;
          } else if (secretOrPublicKey2.asymmetricKeyType === "ec") {
            options.algorithms = EC_KEY_ALGS;
          } else {
            options.algorithms = PUB_KEY_ALGS;
          }
        }
        if (options.algorithms.indexOf(decodedToken.header.alg) === -1) {
          return done(new JsonWebTokenError("invalid algorithm"));
        }
        if (header.alg.startsWith("HS") && secretOrPublicKey2.type !== "secret") {
          return done(new JsonWebTokenError(`secretOrPublicKey must be a symmetric key when using ${header.alg}`));
        } else if (/^(?:RS|PS|ES)/.test(header.alg) && secretOrPublicKey2.type !== "public") {
          return done(new JsonWebTokenError(`secretOrPublicKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInvalidAsymmetricKeyTypes) {
          try {
            validateAsymmetricKey(header.alg, secretOrPublicKey2);
          } catch (e) {
            return done(e);
          }
        }
        let valid;
        try {
          valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPublicKey2);
        } catch (e) {
          return done(e);
        }
        if (!valid) {
          return done(new JsonWebTokenError("invalid signature"));
        }
        const payload = decodedToken.payload;
        if (typeof payload.nbf !== "undefined" && !options.ignoreNotBefore) {
          if (typeof payload.nbf !== "number") {
            return done(new JsonWebTokenError("invalid nbf value"));
          }
          if (payload.nbf > clockTimestamp + (options.clockTolerance || 0)) {
            return done(new NotBeforeError("jwt not active", new Date(payload.nbf * 1e3)));
          }
        }
        if (typeof payload.exp !== "undefined" && !options.ignoreExpiration) {
          if (typeof payload.exp !== "number") {
            return done(new JsonWebTokenError("invalid exp value"));
          }
          if (clockTimestamp >= payload.exp + (options.clockTolerance || 0)) {
            return done(new TokenExpiredError("jwt expired", new Date(payload.exp * 1e3)));
          }
        }
        if (options.audience) {
          const audiences = Array.isArray(options.audience) ? options.audience : [options.audience];
          const target = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
          const match2 = target.some(function(targetAudience) {
            return audiences.some(function(audience) {
              return audience instanceof RegExp ? audience.test(targetAudience) : audience === targetAudience;
            });
          });
          if (!match2) {
            return done(new JsonWebTokenError("jwt audience invalid. expected: " + audiences.join(" or ")));
          }
        }
        if (options.issuer) {
          const invalid_issuer = typeof options.issuer === "string" && payload.iss !== options.issuer || Array.isArray(options.issuer) && options.issuer.indexOf(payload.iss) === -1;
          if (invalid_issuer) {
            return done(new JsonWebTokenError("jwt issuer invalid. expected: " + options.issuer));
          }
        }
        if (options.subject) {
          if (payload.sub !== options.subject) {
            return done(new JsonWebTokenError("jwt subject invalid. expected: " + options.subject));
          }
        }
        if (options.jwtid) {
          if (payload.jti !== options.jwtid) {
            return done(new JsonWebTokenError("jwt jwtid invalid. expected: " + options.jwtid));
          }
        }
        if (options.nonce) {
          if (payload.nonce !== options.nonce) {
            return done(new JsonWebTokenError("jwt nonce invalid. expected: " + options.nonce));
          }
        }
        if (options.maxAge) {
          if (typeof payload.iat !== "number") {
            return done(new JsonWebTokenError("iat required when maxAge is specified"));
          }
          const maxAgeTimestamp = timespan(options.maxAge, payload.iat);
          if (typeof maxAgeTimestamp === "undefined") {
            return done(new JsonWebTokenError('"maxAge" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
          }
          if (clockTimestamp >= maxAgeTimestamp + (options.clockTolerance || 0)) {
            return done(new TokenExpiredError("maxAge exceeded", new Date(maxAgeTimestamp * 1e3)));
          }
        }
        if (options.complete === true) {
          const signature = decodedToken.signature;
          return done(null, {
            header,
            payload,
            signature
          });
        }
        return done(null, payload);
      });
    };
  }
});

// ../../node_modules/lodash.includes/index.js
var require_lodash = __commonJS({
  "../../node_modules/lodash.includes/index.js"(exports2, module2) {
    var INFINITY = 1 / 0;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var argsTag = "[object Arguments]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var freeParseInt = parseInt;
    function arrayMap(array, iteratee) {
      var index = -1, length = array ? array.length : 0, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index-- : ++index < length) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1, length = array.length;
      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseValues(object, props) {
      return arrayMap(props, function(key3) {
        return object[key3];
      });
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectToString = objectProto.toString;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeKeys = overArg(Object.keys, Object);
    var nativeMax = Math.max;
    function arrayLikeKeys(value, inherited) {
      var result = isArray(value) || isArguments(value) ? baseTimes(value.length, String) : [];
      var length = result.length, skipIndexes = !!length;
      for (var key3 in value) {
        if ((inherited || hasOwnProperty.call(value, key3)) && !(skipIndexes && (key3 == "length" || isIndex(key3, length)))) {
          result.push(key3);
        }
      }
      return result;
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key3 in Object(object)) {
        if (hasOwnProperty.call(object, key3) && key3 != "constructor") {
          result.push(key3);
        }
      }
      return result;
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
    }
    function isArguments(value) {
      return isArrayLikeObject(value) && hasOwnProperty.call(value, "callee") && (!propertyIsEnumerable.call(value, "callee") || objectToString.call(value) == argsTag);
    }
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    function isFunction(value) {
      var tag = isObject2(value) ? objectToString.call(value) : "";
      return tag == funcTag || tag == genTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isString(value) {
      return typeof value == "string" || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject2(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject2(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    function values(object) {
      return object ? baseValues(object, keys(object)) : [];
    }
    module2.exports = includes;
  }
});

// ../../node_modules/lodash.isboolean/index.js
var require_lodash2 = __commonJS({
  "../../node_modules/lodash.isboolean/index.js"(exports2, module2) {
    var boolTag = "[object Boolean]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isBoolean(value) {
      return value === true || value === false || isObjectLike(value) && objectToString.call(value) == boolTag;
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    module2.exports = isBoolean;
  }
});

// ../../node_modules/lodash.isinteger/index.js
var require_lodash3 = __commonJS({
  "../../node_modules/lodash.isinteger/index.js"(exports2, module2) {
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isInteger(value) {
      return typeof value == "number" && value == toInteger(value);
    }
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject2(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject2(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module2.exports = isInteger;
  }
});

// ../../node_modules/lodash.isnumber/index.js
var require_lodash4 = __commonJS({
  "../../node_modules/lodash.isnumber/index.js"(exports2, module2) {
    var numberTag = "[object Number]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isNumber(value) {
      return typeof value == "number" || isObjectLike(value) && objectToString.call(value) == numberTag;
    }
    module2.exports = isNumber;
  }
});

// ../../node_modules/lodash.isplainobject/index.js
var require_lodash5 = __commonJS({
  "../../node_modules/lodash.isplainobject/index.js"(exports2, module2) {
    var objectTag = "[object Object]";
    function isHostObject(value) {
      var result = false;
      if (value != null && typeof value.toString != "function") {
        try {
          result = !!(value + "");
        } catch (e) {
        }
      }
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var objectCtorString = funcToString.call(Object);
    var objectToString = objectProto.toString;
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isPlainObject(value) {
      if (!isObjectLike(value) || objectToString.call(value) != objectTag || isHostObject(value)) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    module2.exports = isPlainObject;
  }
});

// ../../node_modules/lodash.isstring/index.js
var require_lodash6 = __commonJS({
  "../../node_modules/lodash.isstring/index.js"(exports2, module2) {
    var stringTag = "[object String]";
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var isArray = Array.isArray;
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isString(value) {
      return typeof value == "string" || !isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag;
    }
    module2.exports = isString;
  }
});

// ../../node_modules/lodash.once/index.js
var require_lodash7 = __commonJS({
  "../../node_modules/lodash.once/index.js"(exports2, module2) {
    var FUNC_ERROR_TEXT = "Expected a function";
    var INFINITY = 1 / 0;
    var MAX_INTEGER = 17976931348623157e292;
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    function before(n, func) {
      var result;
      if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      n = toInteger(n);
      return function() {
        if (--n > 0) {
          result = func.apply(this, arguments);
        }
        if (n <= 1) {
          func = void 0;
        }
        return result;
      };
    }
    function once(func) {
      return before(2, func);
    }
    function isObject2(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = value < 0 ? -1 : 1;
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }
    function toInteger(value) {
      var result = toFinite(value), remainder = result % 1;
      return result === result ? remainder ? result - remainder : result : 0;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject2(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject2(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module2.exports = once;
  }
});

// ../../node_modules/jsonwebtoken/sign.js
var require_sign = __commonJS({
  "../../node_modules/jsonwebtoken/sign.js"(exports2, module2) {
    var timespan = require_timespan();
    var PS_SUPPORTED = require_psSupported();
    var validateAsymmetricKey = require_validateAsymmetricKey();
    var jws = require_jws();
    var includes = require_lodash();
    var isBoolean = require_lodash2();
    var isInteger = require_lodash3();
    var isNumber = require_lodash4();
    var isPlainObject = require_lodash5();
    var isString = require_lodash6();
    var once = require_lodash7();
    var { KeyObject, createSecretKey, createPrivateKey } = require("crypto");
    var SUPPORTED_ALGS = ["RS256", "RS384", "RS512", "ES256", "ES384", "ES512", "HS256", "HS384", "HS512", "none"];
    if (PS_SUPPORTED) {
      SUPPORTED_ALGS.splice(3, 0, "PS256", "PS384", "PS512");
    }
    var sign_options_schema = {
      expiresIn: { isValid: function(value) {
        return isInteger(value) || isString(value) && value;
      }, message: '"expiresIn" should be a number of seconds or string representing a timespan' },
      notBefore: { isValid: function(value) {
        return isInteger(value) || isString(value) && value;
      }, message: '"notBefore" should be a number of seconds or string representing a timespan' },
      audience: { isValid: function(value) {
        return isString(value) || Array.isArray(value);
      }, message: '"audience" must be a string or array' },
      algorithm: { isValid: includes.bind(null, SUPPORTED_ALGS), message: '"algorithm" must be a valid string enum value' },
      header: { isValid: isPlainObject, message: '"header" must be an object' },
      encoding: { isValid: isString, message: '"encoding" must be a string' },
      issuer: { isValid: isString, message: '"issuer" must be a string' },
      subject: { isValid: isString, message: '"subject" must be a string' },
      jwtid: { isValid: isString, message: '"jwtid" must be a string' },
      noTimestamp: { isValid: isBoolean, message: '"noTimestamp" must be a boolean' },
      keyid: { isValid: isString, message: '"keyid" must be a string' },
      mutatePayload: { isValid: isBoolean, message: '"mutatePayload" must be a boolean' },
      allowInsecureKeySizes: { isValid: isBoolean, message: '"allowInsecureKeySizes" must be a boolean' },
      allowInvalidAsymmetricKeyTypes: { isValid: isBoolean, message: '"allowInvalidAsymmetricKeyTypes" must be a boolean' }
    };
    var registered_claims_schema = {
      iat: { isValid: isNumber, message: '"iat" should be a number of seconds' },
      exp: { isValid: isNumber, message: '"exp" should be a number of seconds' },
      nbf: { isValid: isNumber, message: '"nbf" should be a number of seconds' }
    };
    function validate(schema, allowUnknown, object, parameterName) {
      if (!isPlainObject(object)) {
        throw new Error('Expected "' + parameterName + '" to be a plain object.');
      }
      Object.keys(object).forEach(function(key3) {
        const validator2 = schema[key3];
        if (!validator2) {
          if (!allowUnknown) {
            throw new Error('"' + key3 + '" is not allowed in "' + parameterName + '"');
          }
          return;
        }
        if (!validator2.isValid(object[key3])) {
          throw new Error(validator2.message);
        }
      });
    }
    function validateOptions(options) {
      return validate(sign_options_schema, false, options, "options");
    }
    function validatePayload(payload) {
      return validate(registered_claims_schema, true, payload, "payload");
    }
    var options_to_payload = {
      "audience": "aud",
      "issuer": "iss",
      "subject": "sub",
      "jwtid": "jti"
    };
    var options_for_objects = [
      "expiresIn",
      "notBefore",
      "noTimestamp",
      "audience",
      "issuer",
      "subject",
      "jwtid"
    ];
    module2.exports = function(payload, secretOrPrivateKey, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = {};
      } else {
        options = options || {};
      }
      const isObjectPayload = typeof payload === "object" && !Buffer.isBuffer(payload);
      const header = Object.assign({
        alg: options.algorithm || "HS256",
        typ: isObjectPayload ? "JWT" : void 0,
        kid: options.keyid
      }, options.header);
      function failure(err2) {
        if (callback) {
          return callback(err2);
        }
        throw err2;
      }
      if (!secretOrPrivateKey && options.algorithm !== "none") {
        return failure(new Error("secretOrPrivateKey must have a value"));
      }
      if (secretOrPrivateKey != null && !(secretOrPrivateKey instanceof KeyObject)) {
        try {
          secretOrPrivateKey = createPrivateKey(secretOrPrivateKey);
        } catch (_2) {
          try {
            secretOrPrivateKey = createSecretKey(typeof secretOrPrivateKey === "string" ? Buffer.from(secretOrPrivateKey) : secretOrPrivateKey);
          } catch (_3) {
            return failure(new Error("secretOrPrivateKey is not valid key material"));
          }
        }
      }
      if (header.alg.startsWith("HS") && secretOrPrivateKey.type !== "secret") {
        return failure(new Error(`secretOrPrivateKey must be a symmetric key when using ${header.alg}`));
      } else if (/^(?:RS|PS|ES)/.test(header.alg)) {
        if (secretOrPrivateKey.type !== "private") {
          return failure(new Error(`secretOrPrivateKey must be an asymmetric key when using ${header.alg}`));
        }
        if (!options.allowInsecureKeySizes && !header.alg.startsWith("ES") && secretOrPrivateKey.asymmetricKeyDetails !== void 0 && //KeyObject.asymmetricKeyDetails is supported in Node 15+
        secretOrPrivateKey.asymmetricKeyDetails.modulusLength < 2048) {
          return failure(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
        }
      }
      if (typeof payload === "undefined") {
        return failure(new Error("payload is required"));
      } else if (isObjectPayload) {
        try {
          validatePayload(payload);
        } catch (error) {
          return failure(error);
        }
        if (!options.mutatePayload) {
          payload = Object.assign({}, payload);
        }
      } else {
        const invalid_options = options_for_objects.filter(function(opt) {
          return typeof options[opt] !== "undefined";
        });
        if (invalid_options.length > 0) {
          return failure(new Error("invalid " + invalid_options.join(",") + " option for " + typeof payload + " payload"));
        }
      }
      if (typeof payload.exp !== "undefined" && typeof options.expiresIn !== "undefined") {
        return failure(new Error('Bad "options.expiresIn" option the payload already has an "exp" property.'));
      }
      if (typeof payload.nbf !== "undefined" && typeof options.notBefore !== "undefined") {
        return failure(new Error('Bad "options.notBefore" option the payload already has an "nbf" property.'));
      }
      try {
        validateOptions(options);
      } catch (error) {
        return failure(error);
      }
      if (!options.allowInvalidAsymmetricKeyTypes) {
        try {
          validateAsymmetricKey(header.alg, secretOrPrivateKey);
        } catch (error) {
          return failure(error);
        }
      }
      const timestamp = payload.iat || Math.floor(Date.now() / 1e3);
      if (options.noTimestamp) {
        delete payload.iat;
      } else if (isObjectPayload) {
        payload.iat = timestamp;
      }
      if (typeof options.notBefore !== "undefined") {
        try {
          payload.nbf = timespan(options.notBefore, timestamp);
        } catch (err2) {
          return failure(err2);
        }
        if (typeof payload.nbf === "undefined") {
          return failure(new Error('"notBefore" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
      }
      if (typeof options.expiresIn !== "undefined" && typeof payload === "object") {
        try {
          payload.exp = timespan(options.expiresIn, timestamp);
        } catch (err2) {
          return failure(err2);
        }
        if (typeof payload.exp === "undefined") {
          return failure(new Error('"expiresIn" should be a number of seconds or string representing a timespan eg: "1d", "20h", 60'));
        }
      }
      Object.keys(options_to_payload).forEach(function(key3) {
        const claim = options_to_payload[key3];
        if (typeof options[key3] !== "undefined") {
          if (typeof payload[claim] !== "undefined") {
            return failure(new Error('Bad "options.' + key3 + '" option. The payload already has an "' + claim + '" property.'));
          }
          payload[claim] = options[key3];
        }
      });
      const encoding = options.encoding || "utf8";
      if (typeof callback === "function") {
        callback = callback && once(callback);
        jws.createSign({
          header,
          privateKey: secretOrPrivateKey,
          payload,
          encoding
        }).once("error", callback).once("done", function(signature) {
          if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
            return callback(new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`));
          }
          callback(null, signature);
        });
      } else {
        let signature = jws.sign({ header, payload, secret: secretOrPrivateKey, encoding });
        if (!options.allowInsecureKeySizes && /^(?:RS|PS)/.test(header.alg) && signature.length < 256) {
          throw new Error(`secretOrPrivateKey has a minimum key size of 2048 bits for ${header.alg}`);
        }
        return signature;
      }
    };
  }
});

// ../../node_modules/jsonwebtoken/index.js
var require_jsonwebtoken = __commonJS({
  "../../node_modules/jsonwebtoken/index.js"(exports2, module2) {
    module2.exports = {
      decode: require_decode(),
      verify: require_verify(),
      sign: require_sign(),
      JsonWebTokenError: require_JsonWebTokenError(),
      NotBeforeError: require_NotBeforeError(),
      TokenExpiredError: require_TokenExpiredError()
    };
  }
});

// ../../node_modules/es-errors/type.js
var require_type = __commonJS({
  "../../node_modules/es-errors/type.js"(exports2, module2) {
    "use strict";
    module2.exports = TypeError;
  }
});

// ../../node_modules/object-inspect/util.inspect.js
var require_util_inspect = __commonJS({
  "../../node_modules/object-inspect/util.inspect.js"(exports2, module2) {
    module2.exports = require("util").inspect;
  }
});

// ../../node_modules/object-inspect/index.js
var require_object_inspect = __commonJS({
  "../../node_modules/object-inspect/index.js"(exports2, module2) {
    var hasMap = typeof Map === "function" && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === "function" && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
    var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O2) {
      return O2.__proto__;
    } : null);
    function addNumericSeparator(num, str) {
      if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
        return str;
      }
      var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if (typeof num === "number") {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
          var intStr = String(int);
          var dec = $slice.call(str, intStr.length + 1);
          return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
        }
      }
      return $replace.call(str, sepRegex, "$&_");
    }
    var utilInspect = require_util_inspect();
    var inspectCustom = utilInspect.custom;
    var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
    var quotes = {
      __proto__: null,
      "double": '"',
      single: "'"
    };
    var quoteREs = {
      __proto__: null,
      "double": /(["\\])/g,
      single: /(['\\])/g
    };
    module2.exports = function inspect_(obj, options, depth, seen) {
      var opts = options || {};
      if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
      }
      if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
      }
      var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
      if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
        throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
      }
      if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      }
      if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      }
      var numericSeparator = opts.numericSeparator;
      if (typeof obj === "undefined") {
        return "undefined";
      }
      if (obj === null) {
        return "null";
      }
      if (typeof obj === "boolean") {
        return obj ? "true" : "false";
      }
      if (typeof obj === "string") {
        return inspectString(obj, opts);
      }
      if (typeof obj === "number") {
        if (obj === 0) {
          return Infinity / obj > 0 ? "0" : "-0";
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
      }
      if (typeof obj === "bigint") {
        var bigIntStr = String(obj) + "n";
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
      }
      var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
      if (typeof depth === "undefined") {
        depth = 0;
      }
      if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
        return isArray(obj) ? "[Array]" : "[Object]";
      }
      var indent = getIndent(opts, depth);
      if (typeof seen === "undefined") {
        seen = [];
      } else if (indexOf(seen, obj) >= 0) {
        return "[Circular]";
      }
      function inspect(value, from, noIndent) {
        if (from) {
          seen = $arrSlice.call(seen);
          seen.push(from);
        }
        if (noIndent) {
          var newOpts = {
            depth: opts.depth
          };
          if (has(opts, "quoteStyle")) {
            newOpts.quoteStyle = opts.quoteStyle;
          }
          return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
      }
      if (typeof obj === "function" && !isRegExp(obj)) {
        var name2 = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return "[Function" + (name2 ? ": " + name2 : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
      }
      if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
        return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
      }
      if (isElement(obj)) {
        var s = "<" + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
          s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
        }
        s += ">";
        if (obj.childNodes && obj.childNodes.length) {
          s += "...";
        }
        s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
        return s;
      }
      if (isArray(obj)) {
        if (obj.length === 0) {
          return "[]";
        }
        var xs2 = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs2)) {
          return "[" + indentedJoin(xs2, indent) + "]";
        }
        return "[ " + $join.call(xs2, ", ") + " ]";
      }
      if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
          return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
        }
        if (parts.length === 0) {
          return "[" + String(obj) + "]";
        }
        return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
      }
      if (typeof obj === "object" && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
          return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
          return obj.inspect();
        }
      }
      if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
          mapForEach.call(obj, function(value, key3) {
            mapParts.push(inspect(key3, obj, true) + " => " + inspect(value, obj));
          });
        }
        return collectionOf("Map", mapSize.call(obj), mapParts, indent);
      }
      if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
          setForEach.call(obj, function(value) {
            setParts.push(inspect(value, obj));
          });
        }
        return collectionOf("Set", setSize.call(obj), setParts, indent);
      }
      if (isWeakMap(obj)) {
        return weakCollectionOf("WeakMap");
      }
      if (isWeakSet(obj)) {
        return weakCollectionOf("WeakSet");
      }
      if (isWeakRef(obj)) {
        return weakCollectionOf("WeakRef");
      }
      if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
      }
      if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
      }
      if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
      }
      if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
      }
      if (typeof window !== "undefined" && obj === window) {
        return "{ [object Window] }";
      }
      if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) {
        return "{ [object globalThis] }";
      }
      if (!isDate(obj) && !isRegExp(obj)) {
        var ys2 = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? "" : "null prototype";
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
        var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
        var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
        if (ys2.length === 0) {
          return tag + "{}";
        }
        if (indent) {
          return tag + "{" + indentedJoin(ys2, indent) + "}";
        }
        return tag + "{ " + $join.call(ys2, ", ") + " }";
      }
      return String(obj);
    };
    function wrapQuotes(s, defaultStyle, opts) {
      var style = opts.quoteStyle || defaultStyle;
      var quoteChar = quotes[style];
      return quoteChar + s + quoteChar;
    }
    function quote(s) {
      return $replace.call(String(s), /"/g, "&quot;");
    }
    function canTrustToString(obj) {
      return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
    }
    function isArray(obj) {
      return toStr(obj) === "[object Array]" && canTrustToString(obj);
    }
    function isDate(obj) {
      return toStr(obj) === "[object Date]" && canTrustToString(obj);
    }
    function isRegExp(obj) {
      return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
    }
    function isError(obj) {
      return toStr(obj) === "[object Error]" && canTrustToString(obj);
    }
    function isString(obj) {
      return toStr(obj) === "[object String]" && canTrustToString(obj);
    }
    function isNumber(obj) {
      return toStr(obj) === "[object Number]" && canTrustToString(obj);
    }
    function isBoolean(obj) {
      return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
    }
    function isSymbol(obj) {
      if (hasShammedSymbols) {
        return obj && typeof obj === "object" && obj instanceof Symbol;
      }
      if (typeof obj === "symbol") {
        return true;
      }
      if (!obj || typeof obj !== "object" || !symToString) {
        return false;
      }
      try {
        symToString.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isBigInt(obj) {
      if (!obj || typeof obj !== "object" || !bigIntValueOf) {
        return false;
      }
      try {
        bigIntValueOf.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    var hasOwn = Object.prototype.hasOwnProperty || function(key3) {
      return key3 in this;
    };
    function has(obj, key3) {
      return hasOwn.call(obj, key3);
    }
    function toStr(obj) {
      return objectToString.call(obj);
    }
    function nameOf(f) {
      if (f.name) {
        return f.name;
      }
      var m2 = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
      if (m2) {
        return m2[1];
      }
      return null;
    }
    function indexOf(xs2, x2) {
      if (xs2.indexOf) {
        return xs2.indexOf(x2);
      }
      for (var i = 0, l = xs2.length; i < l; i++) {
        if (xs2[i] === x2) {
          return i;
        }
      }
      return -1;
    }
    function isMap(x2) {
      if (!mapSize || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        mapSize.call(x2);
        try {
          setSize.call(x2);
        } catch (s) {
          return true;
        }
        return x2 instanceof Map;
      } catch (e) {
      }
      return false;
    }
    function isWeakMap(x2) {
      if (!weakMapHas || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        weakMapHas.call(x2, weakMapHas);
        try {
          weakSetHas.call(x2, weakSetHas);
        } catch (s) {
          return true;
        }
        return x2 instanceof WeakMap;
      } catch (e) {
      }
      return false;
    }
    function isWeakRef(x2) {
      if (!weakRefDeref || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        weakRefDeref.call(x2);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isSet(x2) {
      if (!setSize || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        setSize.call(x2);
        try {
          mapSize.call(x2);
        } catch (m2) {
          return true;
        }
        return x2 instanceof Set;
      } catch (e) {
      }
      return false;
    }
    function isWeakSet(x2) {
      if (!weakSetHas || !x2 || typeof x2 !== "object") {
        return false;
      }
      try {
        weakSetHas.call(x2, weakSetHas);
        try {
          weakMapHas.call(x2, weakMapHas);
        } catch (s) {
          return true;
        }
        return x2 instanceof WeakSet;
      } catch (e) {
      }
      return false;
    }
    function isElement(x2) {
      if (!x2 || typeof x2 !== "object") {
        return false;
      }
      if (typeof HTMLElement !== "undefined" && x2 instanceof HTMLElement) {
        return true;
      }
      return typeof x2.nodeName === "string" && typeof x2.getAttribute === "function";
    }
    function inspectString(str, opts) {
      if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
      }
      var quoteRE = quoteREs[opts.quoteStyle || "single"];
      quoteRE.lastIndex = 0;
      var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
      return wrapQuotes(s, "single", opts);
    }
    function lowbyte(c) {
      var n = c.charCodeAt(0);
      var x2 = {
        8: "b",
        9: "t",
        10: "n",
        12: "f",
        13: "r"
      }[n];
      if (x2) {
        return "\\" + x2;
      }
      return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
    }
    function markBoxed(str) {
      return "Object(" + str + ")";
    }
    function weakCollectionOf(type) {
      return type + " { ? }";
    }
    function collectionOf(type, size, entries, indent) {
      var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
      return type + " (" + size + ") {" + joinedEntries + "}";
    }
    function singleLineValues(xs2) {
      for (var i = 0; i < xs2.length; i++) {
        if (indexOf(xs2[i], "\n") >= 0) {
          return false;
        }
      }
      return true;
    }
    function getIndent(opts, depth) {
      var baseIndent;
      if (opts.indent === "	") {
        baseIndent = "	";
      } else if (typeof opts.indent === "number" && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), " ");
      } else {
        return null;
      }
      return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
      };
    }
    function indentedJoin(xs2, indent) {
      if (xs2.length === 0) {
        return "";
      }
      var lineJoiner = "\n" + indent.prev + indent.base;
      return lineJoiner + $join.call(xs2, "," + lineJoiner) + "\n" + indent.prev;
    }
    function arrObjKeys(obj, inspect) {
      var isArr = isArray(obj);
      var xs2 = [];
      if (isArr) {
        xs2.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
          xs2[i] = has(obj, i) ? inspect(obj[i], obj) : "";
        }
      }
      var syms = typeof gOPS === "function" ? gOPS(obj) : [];
      var symMap;
      if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
          symMap["$" + syms[k]] = syms[k];
        }
      }
      for (var key3 in obj) {
        if (!has(obj, key3)) {
          continue;
        }
        if (isArr && String(Number(key3)) === key3 && key3 < obj.length) {
          continue;
        }
        if (hasShammedSymbols && symMap["$" + key3] instanceof Symbol) {
          continue;
        } else if ($test.call(/[^\w$]/, key3)) {
          xs2.push(inspect(key3, obj) + ": " + inspect(obj[key3], obj));
        } else {
          xs2.push(key3 + ": " + inspect(obj[key3], obj));
        }
      }
      if (typeof gOPS === "function") {
        for (var j = 0; j < syms.length; j++) {
          if (isEnumerable.call(obj, syms[j])) {
            xs2.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
          }
        }
      }
      return xs2;
    }
  }
});

// ../../node_modules/side-channel-list/index.js
var require_side_channel_list = __commonJS({
  "../../node_modules/side-channel-list/index.js"(exports2, module2) {
    "use strict";
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var listGetNode = function(list, key3, isDelete) {
      var prev = list;
      var curr;
      for (; (curr = prev.next) != null; prev = curr) {
        if (curr.key === key3) {
          prev.next = curr.next;
          if (!isDelete) {
            curr.next = /** @type {NonNullable<typeof list.next>} */
            list.next;
            list.next = curr;
          }
          return curr;
        }
      }
    };
    var listGet = function(objects, key3) {
      if (!objects) {
        return void 0;
      }
      var node = listGetNode(objects, key3);
      return node && node.value;
    };
    var listSet = function(objects, key3, value) {
      var node = listGetNode(objects, key3);
      if (node) {
        node.value = value;
      } else {
        objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
        {
          // eslint-disable-line no-param-reassign, no-extra-parens
          key: key3,
          next: objects.next,
          value
        };
      }
    };
    var listHas = function(objects, key3) {
      if (!objects) {
        return false;
      }
      return !!listGetNode(objects, key3);
    };
    var listDelete = function(objects, key3) {
      if (objects) {
        return listGetNode(objects, key3, true);
      }
    };
    module2.exports = function getSideChannelList() {
      var $o;
      var channel = {
        assert: function(key3) {
          if (!channel.has(key3)) {
            throw new $TypeError("Side channel does not contain " + inspect(key3));
          }
        },
        "delete": function(key3) {
          var deletedNode = listDelete($o, key3);
          if (deletedNode && $o && !$o.next) {
            $o = void 0;
          }
          return !!deletedNode;
        },
        get: function(key3) {
          return listGet($o, key3);
        },
        has: function(key3) {
          return listHas($o, key3);
        },
        set: function(key3, value) {
          if (!$o) {
            $o = {
              next: void 0
            };
          }
          listSet(
            /** @type {NonNullable<typeof $o>} */
            $o,
            key3,
            value
          );
        }
      };
      return channel;
    };
  }
});

// ../../node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  "../../node_modules/es-object-atoms/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Object;
  }
});

// ../../node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "../../node_modules/es-errors/index.js"(exports2, module2) {
    "use strict";
    module2.exports = Error;
  }
});

// ../../node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "../../node_modules/es-errors/eval.js"(exports2, module2) {
    "use strict";
    module2.exports = EvalError;
  }
});

// ../../node_modules/es-errors/range.js
var require_range2 = __commonJS({
  "../../node_modules/es-errors/range.js"(exports2, module2) {
    "use strict";
    module2.exports = RangeError;
  }
});

// ../../node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "../../node_modules/es-errors/ref.js"(exports2, module2) {
    "use strict";
    module2.exports = ReferenceError;
  }
});

// ../../node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "../../node_modules/es-errors/syntax.js"(exports2, module2) {
    "use strict";
    module2.exports = SyntaxError;
  }
});

// ../../node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "../../node_modules/es-errors/uri.js"(exports2, module2) {
    "use strict";
    module2.exports = URIError;
  }
});

// ../../node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  "../../node_modules/math-intrinsics/abs.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.abs;
  }
});

// ../../node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  "../../node_modules/math-intrinsics/floor.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.floor;
  }
});

// ../../node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  "../../node_modules/math-intrinsics/max.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.max;
  }
});

// ../../node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  "../../node_modules/math-intrinsics/min.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.min;
  }
});

// ../../node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  "../../node_modules/math-intrinsics/pow.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.pow;
  }
});

// ../../node_modules/math-intrinsics/round.js
var require_round = __commonJS({
  "../../node_modules/math-intrinsics/round.js"(exports2, module2) {
    "use strict";
    module2.exports = Math.round;
  }
});

// ../../node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS({
  "../../node_modules/math-intrinsics/isNaN.js"(exports2, module2) {
    "use strict";
    module2.exports = Number.isNaN || function isNaN2(a2) {
      return a2 !== a2;
    };
  }
});

// ../../node_modules/math-intrinsics/sign.js
var require_sign2 = __commonJS({
  "../../node_modules/math-intrinsics/sign.js"(exports2, module2) {
    "use strict";
    var $isNaN = require_isNaN();
    module2.exports = function sign(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    };
  }
});

// ../../node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  "../../node_modules/gopd/gOPD.js"(exports2, module2) {
    "use strict";
    module2.exports = Object.getOwnPropertyDescriptor;
  }
});

// ../../node_modules/gopd/index.js
var require_gopd = __commonJS({
  "../../node_modules/gopd/index.js"(exports2, module2) {
    "use strict";
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module2.exports = $gOPD;
  }
});

// ../../node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "../../node_modules/es-define-property/index.js"(exports2, module2) {
    "use strict";
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module2.exports = $defineProperty;
  }
});

// ../../node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "../../node_modules/has-symbols/shams.js"(exports2, module2) {
    "use strict";
    module2.exports = function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = /* @__PURE__ */ Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _2 in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym)
        );
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  }
});

// ../../node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "../../node_modules/has-symbols/index.js"(exports2, module2) {
    "use strict";
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module2.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof /* @__PURE__ */ Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  }
});

// ../../node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS({
  "../../node_modules/get-proto/Reflect.getPrototypeOf.js"(exports2, module2) {
    "use strict";
    module2.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  }
});

// ../../node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS({
  "../../node_modules/get-proto/Object.getPrototypeOf.js"(exports2, module2) {
    "use strict";
    var $Object = require_es_object_atoms();
    module2.exports = $Object.getPrototypeOf || null;
  }
});

// ../../node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "../../node_modules/function-bind/implementation.js"(exports2, module2) {
    "use strict";
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = "[object Function]";
    var concatty = function concatty2(a2, b) {
      var arr = [];
      for (var i = 0; i < a2.length; i += 1) {
        arr[i] = a2[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a2.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    module2.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      };
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  }
});

// ../../node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "../../node_modules/function-bind/index.js"(exports2, module2) {
    "use strict";
    var implementation = require_implementation();
    module2.exports = Function.prototype.bind || implementation;
  }
});

// ../../node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  "../../node_modules/call-bind-apply-helpers/functionCall.js"(exports2, module2) {
    "use strict";
    module2.exports = Function.prototype.call;
  }
});

// ../../node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  "../../node_modules/call-bind-apply-helpers/functionApply.js"(exports2, module2) {
    "use strict";
    module2.exports = Function.prototype.apply;
  }
});

// ../../node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  "../../node_modules/call-bind-apply-helpers/reflectApply.js"(exports2, module2) {
    "use strict";
    module2.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  }
});

// ../../node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  "../../node_modules/call-bind-apply-helpers/actualApply.js"(exports2, module2) {
    "use strict";
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module2.exports = $reflectApply || bind.call($call, $apply);
  }
});

// ../../node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  "../../node_modules/call-bind-apply-helpers/index.js"(exports2, module2) {
    "use strict";
    var bind = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module2.exports = function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind, $call, args);
    };
  }
});

// ../../node_modules/dunder-proto/get.js
var require_get = __commonJS({
  "../../node_modules/dunder-proto/get.js"(exports2, module2) {
    "use strict";
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
        throw e;
      }
    }
    var desc = !!hasProtoAccessor && gOPD && gOPD(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module2.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
      /** @type {import('./get')} */
      function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      }
    ) : false;
  }
});

// ../../node_modules/get-proto/index.js
var require_get_proto = __commonJS({
  "../../node_modules/get-proto/index.js"(exports2, module2) {
    "use strict";
    var reflectGetProto = require_Reflect_getPrototypeOf();
    var originalGetProto = require_Object_getPrototypeOf();
    var getDunderProto = require_get();
    module2.exports = reflectGetProto ? function getProto(O2) {
      return reflectGetProto(O2);
    } : originalGetProto ? function getProto(O2) {
      if (!O2 || typeof O2 !== "object" && typeof O2 !== "function") {
        throw new TypeError("getProto: not an object");
      }
      return originalGetProto(O2);
    } : getDunderProto ? function getProto(O2) {
      return getDunderProto(O2);
    } : null;
  }
});

// ../../node_modules/hasown/index.js
var require_hasown = __commonJS({
  "../../node_modules/hasown/index.js"(exports2, module2) {
    "use strict";
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module2.exports = bind.call(call, $hasOwn);
  }
});

// ../../node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "../../node_modules/get-intrinsic/index.js"(exports2, module2) {
    "use strict";
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range2();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max = require_max();
    var min = require_min();
    var pow = require_pow();
    var round = require_round();
    var sign = require_sign2();
    var $Function = Function;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? (function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    })() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = require_get_proto();
    var $ObjectGPO = require_Object_getPrototypeOf();
    var $ReflectGPO = require_Reflect_getPrototypeOf();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Object.getPrototypeOf%": $ObjectGPO,
      "%Math.abs%": abs,
      "%Math.floor%": floor,
      "%Math.max%": max,
      "%Math.min%": min,
      "%Math.pow%": pow,
      "%Math.round%": round,
      "%Math.sign%": sign,
      "%Reflect.getPrototypeOf%": $ReflectGPO
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = function doEval2(name2) {
      var value;
      if (name2 === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name2 === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name2 === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name2 === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name2 === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name2] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call($call, Array.prototype.concat);
    var $spliceApply = bind.call($apply, Array.prototype.splice);
    var $replace = bind.call($call, String.prototype.replace);
    var $strSlice = bind.call($call, String.prototype.slice);
    var $exec = bind.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match2, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match2;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name2, allowMissing) {
      var intrinsicName = name2;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name2 + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name2 + " does not exist!");
    };
    module2.exports = function GetIntrinsic(name2, allowMissing) {
      if (typeof name2 !== "string" || name2.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name2) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name2);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name2 + " exists, but the property is not available.");
            }
            return void undefined2;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  }
});

// ../../node_modules/call-bound/index.js
var require_call_bound = __commonJS({
  "../../node_modules/call-bound/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBindBasic = require_call_bind_apply_helpers();
    var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
    module2.exports = function callBoundIntrinsic(name2, allowMissing) {
      var intrinsic = (
        /** @type {(this: unknown, ...args: unknown[]) => unknown} */
        GetIntrinsic(name2, !!allowMissing)
      );
      if (typeof intrinsic === "function" && $indexOf(name2, ".prototype.") > -1) {
        return callBindBasic(
          /** @type {const} */
          [intrinsic]
        );
      }
      return intrinsic;
    };
  }
});

// ../../node_modules/side-channel-map/index.js
var require_side_channel_map = __commonJS({
  "../../node_modules/side-channel-map/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var $Map = GetIntrinsic("%Map%", true);
    var $mapGet = callBound("Map.prototype.get", true);
    var $mapSet = callBound("Map.prototype.set", true);
    var $mapHas = callBound("Map.prototype.has", true);
    var $mapDelete = callBound("Map.prototype.delete", true);
    var $mapSize = callBound("Map.prototype.size", true);
    module2.exports = !!$Map && /** @type {Exclude<import('.'), false>} */
    function getSideChannelMap() {
      var $m;
      var channel = {
        assert: function(key3) {
          if (!channel.has(key3)) {
            throw new $TypeError("Side channel does not contain " + inspect(key3));
          }
        },
        "delete": function(key3) {
          if ($m) {
            var result = $mapDelete($m, key3);
            if ($mapSize($m) === 0) {
              $m = void 0;
            }
            return result;
          }
          return false;
        },
        get: function(key3) {
          if ($m) {
            return $mapGet($m, key3);
          }
        },
        has: function(key3) {
          if ($m) {
            return $mapHas($m, key3);
          }
          return false;
        },
        set: function(key3, value) {
          if (!$m) {
            $m = new $Map();
          }
          $mapSet($m, key3, value);
        }
      };
      return channel;
    };
  }
});

// ../../node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = __commonJS({
  "../../node_modules/side-channel-weakmap/index.js"(exports2, module2) {
    "use strict";
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var getSideChannelMap = require_side_channel_map();
    var $TypeError = require_type();
    var $WeakMap = GetIntrinsic("%WeakMap%", true);
    var $weakMapGet = callBound("WeakMap.prototype.get", true);
    var $weakMapSet = callBound("WeakMap.prototype.set", true);
    var $weakMapHas = callBound("WeakMap.prototype.has", true);
    var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
    module2.exports = $WeakMap ? (
      /** @type {Exclude<import('.'), false>} */
      function getSideChannelWeakMap() {
        var $wm;
        var $m;
        var channel = {
          assert: function(key3) {
            if (!channel.has(key3)) {
              throw new $TypeError("Side channel does not contain " + inspect(key3));
            }
          },
          "delete": function(key3) {
            if ($WeakMap && key3 && (typeof key3 === "object" || typeof key3 === "function")) {
              if ($wm) {
                return $weakMapDelete($wm, key3);
              }
            } else if (getSideChannelMap) {
              if ($m) {
                return $m["delete"](key3);
              }
            }
            return false;
          },
          get: function(key3) {
            if ($WeakMap && key3 && (typeof key3 === "object" || typeof key3 === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key3);
              }
            }
            return $m && $m.get(key3);
          },
          has: function(key3) {
            if ($WeakMap && key3 && (typeof key3 === "object" || typeof key3 === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key3);
              }
            }
            return !!$m && $m.has(key3);
          },
          set: function(key3, value) {
            if ($WeakMap && key3 && (typeof key3 === "object" || typeof key3 === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key3, value);
            } else if (getSideChannelMap) {
              if (!$m) {
                $m = getSideChannelMap();
              }
              $m.set(key3, value);
            }
          }
        };
        return channel;
      }
    ) : getSideChannelMap;
  }
});

// ../../node_modules/side-channel/index.js
var require_side_channel = __commonJS({
  "../../node_modules/side-channel/index.js"(exports2, module2) {
    "use strict";
    var $TypeError = require_type();
    var inspect = require_object_inspect();
    var getSideChannelList = require_side_channel_list();
    var getSideChannelMap = require_side_channel_map();
    var getSideChannelWeakMap = require_side_channel_weakmap();
    var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
    module2.exports = function getSideChannel() {
      var $channelData;
      var channel = {
        assert: function(key3) {
          if (!channel.has(key3)) {
            throw new $TypeError("Side channel does not contain " + inspect(key3));
          }
        },
        "delete": function(key3) {
          return !!$channelData && $channelData["delete"](key3);
        },
        get: function(key3) {
          return $channelData && $channelData.get(key3);
        },
        has: function(key3) {
          return !!$channelData && $channelData.has(key3);
        },
        set: function(key3, value) {
          if (!$channelData) {
            $channelData = makeChannel();
          }
          $channelData.set(key3, value);
        }
      };
      return channel;
    };
  }
});

// ../../node_modules/qs/lib/formats.js
var require_formats = __commonJS({
  "../../node_modules/qs/lib/formats.js"(exports2, module2) {
    "use strict";
    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;
    var Format = {
      RFC1738: "RFC1738",
      RFC3986: "RFC3986"
    };
    module2.exports = {
      "default": Format.RFC3986,
      formatters: {
        RFC1738: function(value) {
          return replace.call(value, percentTwenties, "+");
        },
        RFC3986: function(value) {
          return String(value);
        }
      },
      RFC1738: Format.RFC1738,
      RFC3986: Format.RFC3986
    };
  }
});

// ../../node_modules/qs/lib/utils.js
var require_utils = __commonJS({
  "../../node_modules/qs/lib/utils.js"(exports2, module2) {
    "use strict";
    var formats = require_formats();
    var getSideChannel = require_side_channel();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var overflowChannel = getSideChannel();
    var markOverflow = function markOverflow2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
      return obj;
    };
    var isOverflow = function isOverflow2(obj) {
      return overflowChannel.has(obj);
    };
    var getMaxIndex = function getMaxIndex2(obj) {
      return overflowChannel.get(obj);
    };
    var setMaxIndex = function setMaxIndex2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
    };
    var hexTable = (function() {
      var array = [];
      for (var i = 0; i < 256; ++i) {
        array[array.length] = "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase();
      }
      return array;
    })();
    var compactQueue = function compactQueue2(queue) {
      while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];
        if (isArray(obj)) {
          var compacted = [];
          for (var j = 0; j < obj.length; ++j) {
            if (typeof obj[j] !== "undefined") {
              compacted[compacted.length] = obj[j];
            }
          }
          item.obj[item.prop] = compacted;
        }
      }
    };
    var arrayToObject = function arrayToObject2(source, options) {
      var obj = options && options.plainObjects ? { __proto__: null } : {};
      for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== "undefined") {
          obj[i] = source[i];
        }
      }
      return obj;
    };
    var merge = function merge2(target, source, options) {
      if (!source) {
        return target;
      }
      if (typeof source !== "object" && typeof source !== "function") {
        if (isArray(target)) {
          var nextIndex = target.length;
          if (options && typeof options.arrayLimit === "number" && nextIndex > options.arrayLimit) {
            return markOverflow(arrayToObject(target.concat(source), options), nextIndex);
          }
          target[nextIndex] = source;
        } else if (target && typeof target === "object") {
          if (isOverflow(target)) {
            var newIndex = getMaxIndex(target) + 1;
            target[newIndex] = source;
            setMaxIndex(target, newIndex);
          } else if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
            target[source] = true;
          }
        } else {
          return [target, source];
        }
        return target;
      }
      if (!target || typeof target !== "object") {
        if (isOverflow(source)) {
          var sourceKeys = Object.keys(source);
          var result = options && options.plainObjects ? { __proto__: null, 0: target } : { 0: target };
          for (var m2 = 0; m2 < sourceKeys.length; m2++) {
            var oldKey = parseInt(sourceKeys[m2], 10);
            result[oldKey + 1] = source[sourceKeys[m2]];
          }
          return markOverflow(result, getMaxIndex(source) + 1);
        }
        var combined = [target].concat(source);
        if (options && typeof options.arrayLimit === "number" && combined.length > options.arrayLimit) {
          return markOverflow(arrayToObject(combined, options), combined.length - 1);
        }
        return combined;
      }
      var mergeTarget = target;
      if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
      }
      if (isArray(target) && isArray(source)) {
        source.forEach(function(item, i) {
          if (has.call(target, i)) {
            var targetItem = target[i];
            if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
              target[i] = merge2(targetItem, item, options);
            } else {
              target[target.length] = item;
            }
          } else {
            target[i] = item;
          }
        });
        return target;
      }
      return Object.keys(source).reduce(function(acc, key3) {
        var value = source[key3];
        if (has.call(acc, key3)) {
          acc[key3] = merge2(acc[key3], value, options);
        } else {
          acc[key3] = value;
        }
        if (isOverflow(source) && !isOverflow(acc)) {
          markOverflow(acc, getMaxIndex(source));
        }
        if (isOverflow(acc)) {
          var keyNum = parseInt(key3, 10);
          if (String(keyNum) === key3 && keyNum >= 0 && keyNum > getMaxIndex(acc)) {
            setMaxIndex(acc, keyNum);
          }
        }
        return acc;
      }, mergeTarget);
    };
    var assign = function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function(acc, key3) {
        acc[key3] = source[key3];
        return acc;
      }, target);
    };
    var decode = function(str, defaultDecoder, charset) {
      var strWithoutPlus = str.replace(/\+/g, " ");
      if (charset === "iso-8859-1") {
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    };
    var limit = 1024;
    var encode = function encode2(str, defaultEncoder, charset, kind, format) {
      if (str.length === 0) {
        return str;
      }
      var string = str;
      if (typeof str === "symbol") {
        string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== "string") {
        string = String(str);
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        });
      }
      var out = "";
      for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        var arr = [];
        for (var i = 0; i < segment.length; ++i) {
          var c = segment.charCodeAt(i);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hexTable[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
          arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    };
    var compact = function compact2(value) {
      var queue = [{ obj: { o: value }, prop: "o" }];
      var refs = [];
      for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];
        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
          var key3 = keys[j];
          var val = obj[key3];
          if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
            queue[queue.length] = { obj, prop: key3 };
            refs[refs.length] = val;
          }
        }
      }
      compactQueue(queue);
      return value;
    };
    var isRegExp = function isRegExp2(obj) {
      return Object.prototype.toString.call(obj) === "[object RegExp]";
    };
    var isBuffer = function isBuffer2(obj) {
      if (!obj || typeof obj !== "object") {
        return false;
      }
      return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
    };
    var combine = function combine2(a2, b, arrayLimit, plainObjects) {
      if (isOverflow(a2)) {
        var newIndex = getMaxIndex(a2) + 1;
        a2[newIndex] = b;
        setMaxIndex(a2, newIndex);
        return a2;
      }
      var result = [].concat(a2, b);
      if (result.length > arrayLimit) {
        return markOverflow(arrayToObject(result, { plainObjects }), result.length - 1);
      }
      return result;
    };
    var maybeMap = function maybeMap2(val, fn) {
      if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
          mapped[mapped.length] = fn(val[i]);
        }
        return mapped;
      }
      return fn(val);
    };
    module2.exports = {
      arrayToObject,
      assign,
      combine,
      compact,
      decode,
      encode,
      isBuffer,
      isOverflow,
      isRegExp,
      markOverflow,
      maybeMap,
      merge
    };
  }
});

// ../../node_modules/qs/lib/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/qs/lib/stringify.js"(exports2, module2) {
    "use strict";
    var getSideChannel = require_side_channel();
    var utils = require_utils();
    var formats = require_formats();
    var has = Object.prototype.hasOwnProperty;
    var arrayPrefixGenerators = {
      brackets: function brackets(prefix) {
        return prefix + "[]";
      },
      comma: "comma",
      indices: function indices(prefix, key3) {
        return prefix + "[" + key3 + "]";
      },
      repeat: function repeat(prefix) {
        return prefix;
      }
    };
    var isArray = Array.isArray;
    var push = Array.prototype.push;
    var pushToArray = function(arr, valueOrArray) {
      push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
    };
    var toISO = Date.prototype.toISOString;
    var defaultFormat = formats["default"];
    var defaults = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      commaRoundTrip: false,
      delimiter: "&",
      encode: true,
      encodeDotInKeys: false,
      encoder: utils.encode,
      encodeValuesOnly: false,
      filter: void 0,
      format: defaultFormat,
      formatter: formats.formatters[defaultFormat],
      // deprecated
      indices: false,
      serializeDate: function serializeDate(date) {
        return toISO.call(date);
      },
      skipNulls: false,
      strictNullHandling: false
    };
    var isNonNullishPrimitive = function isNonNullishPrimitive2(v2) {
      return typeof v2 === "string" || typeof v2 === "number" || typeof v2 === "boolean" || typeof v2 === "symbol" || typeof v2 === "bigint";
    };
    var sentinel = {};
    var stringify2 = function stringify3(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel) {
      var obj = object;
      var tmpSc = sideChannel;
      var step = 0;
      var findFlag = false;
      while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== "undefined") {
          if (pos === step) {
            throw new RangeError("Cyclic object value");
          } else {
            findFlag = true;
          }
        }
        if (typeof tmpSc.get(sentinel) === "undefined") {
          step = 0;
        }
      }
      if (typeof filter === "function") {
        obj = filter(prefix, obj);
      } else if (obj instanceof Date) {
        obj = serializeDate(obj);
      } else if (generateArrayPrefix === "comma" && isArray(obj)) {
        obj = utils.maybeMap(obj, function(value2) {
          if (value2 instanceof Date) {
            return serializeDate(value2);
          }
          return value2;
        });
      }
      if (obj === null) {
        if (strictNullHandling) {
          return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix;
        }
        obj = "";
      }
      if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
          var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
          return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
        }
        return [formatter(prefix) + "=" + formatter(String(obj))];
      }
      var values = [];
      if (typeof obj === "undefined") {
        return values;
      }
      var objKeys;
      if (generateArrayPrefix === "comma" && isArray(obj)) {
        if (encodeValuesOnly && encoder) {
          obj = utils.maybeMap(obj, encoder);
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
      } else if (isArray(filter)) {
        objKeys = filter;
      } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
      }
      var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
      var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
      if (allowEmptyArrays && isArray(obj) && obj.length === 0) {
        return adjustedPrefix + "[]";
      }
      for (var j = 0; j < objKeys.length; ++j) {
        var key3 = objKeys[j];
        var value = typeof key3 === "object" && key3 && typeof key3.value !== "undefined" ? key3.value : obj[key3];
        if (skipNulls && value === null) {
          continue;
        }
        var encodedKey = allowDots && encodeDotInKeys ? String(key3).replace(/\./g, "%2E") : String(key3);
        var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify3(
          value,
          keyPrefix,
          generateArrayPrefix,
          commaRoundTrip,
          allowEmptyArrays,
          strictNullHandling,
          skipNulls,
          encodeDotInKeys,
          generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder,
          filter,
          sort,
          allowDots,
          serializeDate,
          format,
          formatter,
          encodeValuesOnly,
          charset,
          valueSideChannel
        ));
      }
      return values;
    };
    var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
        throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
        throw new TypeError("Encoder has to be a function.");
      }
      var charset = opts.charset || defaults.charset;
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      var format = formats["default"];
      if (typeof opts.format !== "undefined") {
        if (!has.call(formats.formatters, opts.format)) {
          throw new TypeError("Unknown format option provided.");
        }
        format = opts.format;
      }
      var formatter = formats.formatters[format];
      var filter = defaults.filter;
      if (typeof opts.filter === "function" || isArray(opts.filter)) {
        filter = opts.filter;
      }
      var arrayFormat;
      if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
      } else if ("indices" in opts) {
        arrayFormat = opts.indices ? "indices" : "repeat";
      } else {
        arrayFormat = defaults.arrayFormat;
      }
      if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
        throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter,
        format,
        formatter,
        serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === "function" ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
      };
    };
    module2.exports = function(object, opts) {
      var obj = object;
      var options = normalizeStringifyOptions(opts);
      var objKeys;
      var filter;
      if (typeof options.filter === "function") {
        filter = options.filter;
        obj = filter("", obj);
      } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
      }
      var keys = [];
      if (typeof obj !== "object" || obj === null) {
        return "";
      }
      var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
      var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
      if (!objKeys) {
        objKeys = Object.keys(obj);
      }
      if (options.sort) {
        objKeys.sort(options.sort);
      }
      var sideChannel = getSideChannel();
      for (var i = 0; i < objKeys.length; ++i) {
        var key3 = objKeys[i];
        var value = obj[key3];
        if (options.skipNulls && value === null) {
          continue;
        }
        pushToArray(keys, stringify2(
          value,
          key3,
          generateArrayPrefix,
          commaRoundTrip,
          options.allowEmptyArrays,
          options.strictNullHandling,
          options.skipNulls,
          options.encodeDotInKeys,
          options.encode ? options.encoder : null,
          options.filter,
          options.sort,
          options.allowDots,
          options.serializeDate,
          options.format,
          options.formatter,
          options.encodeValuesOnly,
          options.charset,
          sideChannel
        ));
      }
      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? "?" : "";
      if (options.charsetSentinel) {
        if (options.charset === "iso-8859-1") {
          prefix += "utf8=%26%2310003%3B&";
        } else {
          prefix += "utf8=%E2%9C%93&";
        }
      }
      return joined.length > 0 ? prefix + joined : "";
    };
  }
});

// ../../node_modules/qs/lib/parse.js
var require_parse2 = __commonJS({
  "../../node_modules/qs/lib/parse.js"(exports2, module2) {
    "use strict";
    var utils = require_utils();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var defaults = {
      allowDots: false,
      allowEmptyArrays: false,
      allowPrototypes: false,
      allowSparse: false,
      arrayLimit: 20,
      charset: "utf-8",
      charsetSentinel: false,
      comma: false,
      decodeDotInKeys: false,
      decoder: utils.decode,
      delimiter: "&",
      depth: 5,
      duplicates: "combine",
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1e3,
      parseArrays: true,
      plainObjects: false,
      strictDepth: false,
      strictNullHandling: false,
      throwOnLimitExceeded: false
    };
    var interpretNumericEntities = function(str) {
      return str.replace(/&#(\d+);/g, function($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
      });
    };
    var parseArrayValue = function(val, options, currentArrayLength) {
      if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
        return val.split(",");
      }
      if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
      }
      return val;
    };
    var isoSentinel = "utf8=%26%2310003%3B";
    var charsetSentinel = "utf8=%E2%9C%93";
    var parseValues = function parseQueryStringValues(str, options) {
      var obj = { __proto__: null };
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
      cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
      var parts = cleanStr.split(
        options.delimiter,
        options.throwOnLimitExceeded ? limit + 1 : limit
      );
      if (options.throwOnLimitExceeded && parts.length > limit) {
        throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
      }
      var skipIndex = -1;
      var i;
      var charset = options.charset;
      if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
          if (parts[i].indexOf("utf8=") === 0) {
            if (parts[i] === charsetSentinel) {
              charset = "utf-8";
            } else if (parts[i] === isoSentinel) {
              charset = "iso-8859-1";
            }
            skipIndex = i;
            i = parts.length;
          }
        }
      }
      for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
          continue;
        }
        var part = parts[i];
        var bracketEqualsPos = part.indexOf("]=");
        var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
        var key3;
        var val;
        if (pos === -1) {
          key3 = options.decoder(part, defaults.decoder, charset, "key");
          val = options.strictNullHandling ? null : "";
        } else {
          key3 = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
          if (key3 !== null) {
            val = utils.maybeMap(
              parseArrayValue(
                part.slice(pos + 1),
                options,
                isArray(obj[key3]) ? obj[key3].length : 0
              ),
              function(encodedVal) {
                return options.decoder(encodedVal, defaults.decoder, charset, "value");
              }
            );
          }
        }
        if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
          val = interpretNumericEntities(String(val));
        }
        if (part.indexOf("[]=") > -1) {
          val = isArray(val) ? [val] : val;
        }
        if (options.comma && isArray(val) && val.length > options.arrayLimit) {
          if (options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          }
          val = utils.combine([], val, options.arrayLimit, options.plainObjects);
        }
        if (key3 !== null) {
          var existing = has.call(obj, key3);
          if (existing && options.duplicates === "combine") {
            obj[key3] = utils.combine(
              obj[key3],
              val,
              options.arrayLimit,
              options.plainObjects
            );
          } else if (!existing || options.duplicates === "last") {
            obj[key3] = val;
          }
        }
      }
      return obj;
    };
    var parseObject = function(chain, val, options, valuesParsed) {
      var currentArrayLength = 0;
      if (chain.length > 0 && chain[chain.length - 1] === "[]") {
        var parentKey = chain.slice(0, -1).join("");
        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
      }
      var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
      for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];
        if (root === "[]" && options.parseArrays) {
          if (utils.isOverflow(leaf)) {
            obj = leaf;
          } else {
            obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine(
              [],
              leaf,
              options.arrayLimit,
              options.plainObjects
            );
          }
        } else {
          obj = options.plainObjects ? { __proto__: null } : {};
          var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
          var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
          var index = parseInt(decodedRoot, 10);
          var isValidArrayIndex = !isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays;
          if (!options.parseArrays && decodedRoot === "") {
            obj = { 0: leaf };
          } else if (isValidArrayIndex && index < options.arrayLimit) {
            obj = [];
            obj[index] = leaf;
          } else if (isValidArrayIndex && options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          } else if (isValidArrayIndex) {
            obj[index] = leaf;
            utils.markOverflow(obj, index);
          } else if (decodedRoot !== "__proto__") {
            obj[decodedRoot] = leaf;
          }
        }
        leaf = obj;
      }
      return leaf;
    };
    var splitKeyIntoSegments = function splitKeyIntoSegments2(givenKey, options) {
      var key3 = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
      if (options.depth <= 0) {
        if (!options.plainObjects && has.call(Object.prototype, key3)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        return [key3];
      }
      var brackets = /(\[[^[\]]*])/;
      var child = /(\[[^[\]]*])/g;
      var segment = brackets.exec(key3);
      var parent = segment ? key3.slice(0, segment.index) : key3;
      var keys = [];
      if (parent) {
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys[keys.length] = parent;
      }
      var i = 0;
      while ((segment = child.exec(key3)) !== null && i < options.depth) {
        i += 1;
        var segmentContent = segment[1].slice(1, -1);
        if (!options.plainObjects && has.call(Object.prototype, segmentContent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        keys[keys.length] = segment[1];
      }
      if (segment) {
        if (options.strictDepth === true) {
          throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
        }
        keys[keys.length] = "[" + key3.slice(segment.index) + "]";
      }
      return keys;
    };
    var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
      if (!givenKey) {
        return;
      }
      var keys = splitKeyIntoSegments(givenKey, options);
      if (!keys) {
        return;
      }
      return parseObject(keys, val, options, valuesParsed);
    };
    var normalizeParseOptions = function normalizeParseOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
        throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
        throw new TypeError("Decoder has to be a function.");
      }
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
        throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
      }
      var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
      var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
      if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
        throw new TypeError("The duplicates option must be either combine, first, or last");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
        duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
        strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
      };
    };
    module2.exports = function(str, opts) {
      var options = normalizeParseOptions(opts);
      if (str === "" || str === null || typeof str === "undefined") {
        return options.plainObjects ? { __proto__: null } : {};
      }
      var tempObj = typeof str === "string" ? parseValues(str, options) : str;
      var obj = options.plainObjects ? { __proto__: null } : {};
      var keys = Object.keys(tempObj);
      for (var i = 0; i < keys.length; ++i) {
        var key3 = keys[i];
        var newObj = parseKeys(key3, tempObj[key3], options, typeof str === "string");
        obj = utils.merge(obj, newObj, options);
      }
      if (options.allowSparse === true) {
        return obj;
      }
      return utils.compact(obj);
    };
  }
});

// ../../node_modules/qs/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/qs/lib/index.js"(exports2, module2) {
    "use strict";
    var stringify2 = require_stringify();
    var parse2 = require_parse2();
    var formats = require_formats();
    module2.exports = {
      formats,
      parse: parse2,
      stringify: stringify2
    };
  }
});

// src/handler.ts
var handler_exports = {};
__export(handler_exports, {
  config: () => config,
  default: () => handler
});
module.exports = __toCommonJS(handler_exports);

// ../../node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler2;
      if (middleware[i]) {
        handler2 = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler2 = i === middleware.length && next || void 0;
      }
      if (handler2) {
        try {
          res = await handler2(context, () => dispatch(i + 1));
        } catch (err2) {
          if (err2 instanceof Error && onError) {
            context.error = err2;
            res = await onError(err2, context);
            isError = true;
          } else {
            throw err2;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// ../../node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
  res;
  status;
  /**
   * Creates an instance of `HTTPException`.
   * @param status - HTTP status code for the exception. Defaults to 500.
   * @param options - Additional options for the exception.
   */
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }
  /**
   * Returns the response object associated with the exception.
   * If a response object is not provided, a new response is created with the error message and status code.
   * @returns The response object.
   */
  getResponse() {
    if (this.res) {
      const newResponse = new Response(this.res.body, {
        status: this.status,
        headers: this.res.headers
      });
      return newResponse;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// ../../node_modules/hono/dist/request/constants.js
var GET_MATCH_RESULT = /* @__PURE__ */ Symbol();

// ../../node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key3) => {
    const shouldParseAllValues = options.all || key3.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key3] = value;
    } else {
      handleParsingAllValues(form, key3, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key3, value]) => {
      const shouldParseDotValues = key3.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key3, value);
        delete form[key3];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key3, value) => {
  if (form[key3] !== void 0) {
    if (Array.isArray(form[key3])) {
      ;
      form[key3].push(value);
    } else {
      form[key3] = [form[key3], value];
    }
  } else {
    if (!key3.endsWith("[]")) {
      form[key3] = value;
    } else {
      form[key3] = [value];
    }
  }
};
var handleParsingNestedValues = (form, key3, value) => {
  if (/(?:^|\.)__proto__\./.test(key3)) {
    return;
  }
  let nestedForm = form;
  const keys = key3.split(".");
  keys.forEach((key22, index) => {
    if (index === keys.length - 1) {
      nestedForm[key22] = value;
    } else {
      if (!nestedForm[key22] || typeof nestedForm[key22] !== "object" || Array.isArray(nestedForm[key22]) || nestedForm[key22] instanceof File) {
        nestedForm[key22] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key22];
    }
  });
};

// ../../node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match2, index) => {
    const mark = `@${index}`;
    groups.push([mark, match2]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match2 = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match2) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match2[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match2[1], new RegExp(`^${match2[2]}(?=/${next})`)] : [label, match2[1], new RegExp(`^${match2[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match2[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match2) => {
      try {
        return decoder(match2);
      } catch {
        return match2;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", url.indexOf(":") + 4);
  let i = start;
  for (; i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const hashIndex = url.indexOf("#", i);
      const end = queryIndex === -1 ? hashIndex === -1 ? void 0 : hashIndex : hashIndex === -1 ? queryIndex : Math.min(queryIndex, hashIndex);
      const path = url.slice(start, end);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63 || charCode === 35) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v2, i, a2) => a2.indexOf(v2) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? tryDecode(value, decodeURIComponent_) : value;
};
var _getQueryParam = (url, key3, multiple) => {
  let encoded;
  if (!multiple && key3 && !/[%+]/.test(key3)) {
    let keyIndex2 = url.indexOf("?", 8);
    if (keyIndex2 === -1) {
      return void 0;
    }
    if (!url.startsWith(key3, keyIndex2 + 1)) {
      keyIndex2 = url.indexOf(`&${key3}`, keyIndex2 + 1);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key3.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key3.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key3}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name2 = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name2 = _decodeURI(name2);
    }
    keyIndex = nextKeyIndex;
    if (name2 === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name2] && Array.isArray(results[name2]))) {
        results[name2] = [];
      }
      ;
      results[name2].push(value);
    } else {
      results[name2] ??= value;
    }
  }
  return key3 ? results[key3] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key3) => {
  return _getQueryParam(url, key3, true);
};
var decodeURIComponent_ = decodeURIComponent;

// ../../node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  /**
   * `.raw` can get the raw Request object.
   *
   * @see {@link https://hono.dev/docs/api/request#raw}
   *
   * @example
   * ```ts
   * // For Cloudflare Workers
   * app.post('/', async (c) => {
   *   const metadata = c.req.raw.cf?.hostMetadata?
   *   ...
   * })
   * ```
   */
  raw;
  #validatedData;
  // Short name of validatedData
  #matchResult;
  routeIndex = 0;
  /**
   * `.path` can get the pathname of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#path}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const pathname = c.req.path // `/about/me`
   * })
   * ```
   */
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key3) {
    return key3 ? this.#getDecodedParam(key3) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key3) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key3];
    const param = this.#getParamValue(paramKey);
    return param && /\%/.test(param) ? tryDecodeURIComponent(param) : param;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key3 of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key3]);
      if (value !== void 0) {
        decoded[key3] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key3) {
    return getQueryParam(this.url, key3);
  }
  queries(key3) {
    return getQueryParams(this.url, key3);
  }
  header(name2) {
    if (name2) {
      return this.raw.headers.get(name2) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key3) => {
      headerData[key3] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return parseBody(this, options);
  }
  #cachedBody = (key3) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key3];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key3]();
      });
    }
    return bodyCache[key3] = raw2[key3]();
  };
  /**
   * `.json()` can parse Request body of type `application/json`
   *
   * @see {@link https://hono.dev/docs/api/request#json}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.json()
   * })
   * ```
   */
  json() {
    return this.#cachedBody("text").then((text) => JSON.parse(text));
  }
  /**
   * `.text()` can parse Request body of type `text/plain`
   *
   * @see {@link https://hono.dev/docs/api/request#text}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.text()
   * })
   * ```
   */
  text() {
    return this.#cachedBody("text");
  }
  /**
   * `.arrayBuffer()` parse Request body as an `ArrayBuffer`
   *
   * @see {@link https://hono.dev/docs/api/request#arraybuffer}
   *
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.arrayBuffer()
   * })
   * ```
   */
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  /**
   * Parses the request body as a `Blob`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.blob();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#blob
   */
  blob() {
    return this.#cachedBody("blob");
  }
  /**
   * Parses the request body as `FormData`.
   * @example
   * ```ts
   * app.post('/entry', async (c) => {
   *   const body = await c.req.formData();
   * });
   * ```
   * @see https://hono.dev/docs/api/request#formdata
   */
  formData() {
    return this.#cachedBody("formData");
  }
  /**
   * Adds validated data to the request.
   *
   * @param target - The target of the validation.
   * @param data - The validated data to add.
   */
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  /**
   * `.url()` can get the request url strings.
   *
   * @see {@link https://hono.dev/docs/api/request#url}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const url = c.req.url // `http://localhost:8787/about/me`
   *   ...
   * })
   * ```
   */
  get url() {
    return this.raw.url;
  }
  /**
   * `.method()` can get the method name of the request.
   *
   * @see {@link https://hono.dev/docs/api/request#method}
   *
   * @example
   * ```ts
   * app.get('/about/me', (c) => {
   *   const method = c.req.method // `GET`
   * })
   * ```
   */
  get method() {
    return this.raw.method;
  }
  get [GET_MATCH_RESULT]() {
    return this.#matchResult;
  }
  /**
   * `.matchedRoutes()` can return a matched route in the handler
   *
   * @deprecated
   *
   * Use matchedRoutes helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#matchedroutes}
   *
   * @example
   * ```ts
   * app.use('*', async function logger(c, next) {
   *   await next()
   *   c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
   *     const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
   *     console.log(
   *       method,
   *       ' ',
   *       path,
   *       ' '.repeat(Math.max(10 - path.length, 0)),
   *       name,
   *       i === c.req.routeIndex ? '<- respond from here' : ''
   *     )
   *   })
   * })
   * ```
   */
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  /**
   * `routePath()` can retrieve the path registered within the handler
   *
   * @deprecated
   *
   * Use routePath helper defined in "hono/route" instead.
   *
   * @see {@link https://hono.dev/docs/api/request#routepath}
   *
   * @example
   * ```ts
   * app.get('/posts/:id', (c) => {
   *   return c.json({ path: c.req.routePath })
   * })
   * ```
   */
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// ../../node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// ../../node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setDefaultContentType = (contentType, headers) => {
  return {
    "Content-Type": contentType,
    ...headers
  };
};
var createResponseInstance = (body, init2) => new Response(body, init2);
var Context = class {
  #rawRequest;
  #req;
  /**
   * `.env` can get bindings (environment variables, secrets, KV namespaces, D1 database, R2 bucket etc.) in Cloudflare Workers.
   *
   * @see {@link https://hono.dev/docs/api/context#env}
   *
   * @example
   * ```ts
   * // Environment object for Cloudflare Workers
   * app.get('*', async c => {
   *   const counter = c.env.COUNTER
   * })
   * ```
   */
  env = {};
  #var;
  finalized = false;
  /**
   * `.error` can get the error object from the middleware if the Handler throws an error.
   *
   * @see {@link https://hono.dev/docs/api/context#error}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   await next()
   *   if (c.error) {
   *     // do something...
   *   }
   * })
   * ```
   */
  error;
  #status;
  #executionCtx;
  #res;
  #layout;
  #renderer;
  #notFoundHandler;
  #preparedHeaders;
  #matchResult;
  #path;
  /**
   * Creates an instance of the Context class.
   *
   * @param req - The Request object.
   * @param options - Optional configuration options for the context.
   */
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  /**
   * `.req` is the instance of {@link HonoRequest}.
   */
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#event}
   * The FetchEvent associated with the current request.
   *
   * @throws Will throw an error if the context does not have a FetchEvent.
   */
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#executionctx}
   * The ExecutionContext associated with the current request.
   *
   * @throws Will throw an error if the context does not have an ExecutionContext.
   */
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  /**
   * @see {@link https://hono.dev/docs/api/context#res}
   * The Response object for the current request.
   */
  get res() {
    return this.#res ||= createResponseInstance(null, {
      headers: this.#preparedHeaders ??= new Headers()
    });
  }
  /**
   * Sets the Response object for the current request.
   *
   * @param _res - The Response object to set.
   */
  set res(_res) {
    if (this.#res && _res) {
      _res = createResponseInstance(_res.body, _res);
      for (const [k, v2] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v2);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  /**
   * `.render()` can create a response within a layout.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   return c.render('Hello!')
   * })
   * ```
   */
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  /**
   * Sets the layout for the response.
   *
   * @param layout - The layout to set.
   * @returns The layout function.
   */
  setLayout = (layout) => this.#layout = layout;
  /**
   * Gets the current layout for the response.
   *
   * @returns The current layout function.
   */
  getLayout = () => this.#layout;
  /**
   * `.setRenderer()` can set the layout in the custom middleware.
   *
   * @see {@link https://hono.dev/docs/api/context#render-setrenderer}
   *
   * @example
   * ```tsx
   * app.use('*', async (c, next) => {
   *   c.setRenderer((content) => {
   *     return c.html(
   *       <html>
   *         <body>
   *           <p>{content}</p>
   *         </body>
   *       </html>
   *     )
   *   })
   *   await next()
   * })
   * ```
   */
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  /**
   * `.header()` can set headers.
   *
   * @see {@link https://hono.dev/docs/api/context#header}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  header = (name2, value, options) => {
    if (this.finalized) {
      this.#res = createResponseInstance(this.#res.body, this.#res);
    }
    const headers = this.#res ? this.#res.headers : this.#preparedHeaders ??= new Headers();
    if (value === void 0) {
      headers.delete(name2);
    } else if (options?.append) {
      headers.append(name2, value);
    } else {
      headers.set(name2, value);
    }
  };
  status = (status) => {
    this.#status = status;
  };
  /**
   * `.set()` can set the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.use('*', async (c, next) => {
   *   c.set('message', 'Hono is hot!!')
   *   await next()
   * })
   * ```
   */
  set = (key3, value) => {
    this.#var ??= /* @__PURE__ */ new Map();
    this.#var.set(key3, value);
  };
  /**
   * `.get()` can use the value specified by the key.
   *
   * @see {@link https://hono.dev/docs/api/context#set-get}
   *
   * @example
   * ```ts
   * app.get('/', (c) => {
   *   const message = c.get('message')
   *   return c.text(`The message is "${message}"`)
   * })
   * ```
   */
  get = (key3) => {
    return this.#var ? this.#var.get(key3) : void 0;
  };
  /**
   * `.var` can access the value of a variable.
   *
   * @see {@link https://hono.dev/docs/api/context#var}
   *
   * @example
   * ```ts
   * const result = c.var.client.oneMethod()
   * ```
   */
  // c.var.propName is a read-only
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    const responseHeaders = this.#res ? new Headers(this.#res.headers) : this.#preparedHeaders ?? new Headers();
    if (typeof arg === "object" && "headers" in arg) {
      const argHeaders = arg.headers instanceof Headers ? arg.headers : new Headers(arg.headers);
      for (const [key3, value] of argHeaders) {
        if (key3.toLowerCase() === "set-cookie") {
          responseHeaders.append(key3, value);
        } else {
          responseHeaders.set(key3, value);
        }
      }
    }
    if (headers) {
      for (const [k, v2] of Object.entries(headers)) {
        if (typeof v2 === "string") {
          responseHeaders.set(k, v2);
        } else {
          responseHeaders.delete(k);
          for (const v22 of v2) {
            responseHeaders.append(k, v22);
          }
        }
      }
    }
    const status = typeof arg === "number" ? arg : arg?.status ?? this.#status;
    return createResponseInstance(data, { status, headers: responseHeaders });
  }
  newResponse = (...args) => this.#newResponse(...args);
  /**
   * `.body()` can return the HTTP response.
   * You can set headers with `.header()` and set HTTP status code with `.status`.
   * This can also be set in `.text()`, `.json()` and so on.
   *
   * @see {@link https://hono.dev/docs/api/context#body}
   *
   * @example
   * ```ts
   * app.get('/welcome', (c) => {
   *   // Set headers
   *   c.header('X-Message', 'Hello!')
   *   c.header('Content-Type', 'text/plain')
   *   // Set HTTP status code
   *   c.status(201)
   *
   *   // Return the response body
   *   return c.body('Thank you for coming')
   * })
   * ```
   */
  body = (data, arg, headers) => this.#newResponse(data, arg, headers);
  /**
   * `.text()` can render text as `Content-Type:text/plain`.
   *
   * @see {@link https://hono.dev/docs/api/context#text}
   *
   * @example
   * ```ts
   * app.get('/say', (c) => {
   *   return c.text('Hello!')
   * })
   * ```
   */
  text = (text, arg, headers) => {
    return !this.#preparedHeaders && !this.#status && !arg && !headers && !this.finalized ? new Response(text) : this.#newResponse(
      text,
      arg,
      setDefaultContentType(TEXT_PLAIN, headers)
    );
  };
  /**
   * `.json()` can render JSON as `Content-Type:application/json`.
   *
   * @see {@link https://hono.dev/docs/api/context#json}
   *
   * @example
   * ```ts
   * app.get('/api', (c) => {
   *   return c.json({ message: 'Hello!' })
   * })
   * ```
   */
  json = (object, arg, headers) => {
    return this.#newResponse(
      JSON.stringify(object),
      arg,
      setDefaultContentType("application/json", headers)
    );
  };
  html = (html, arg, headers) => {
    const res = (html2) => this.#newResponse(html2, arg, setDefaultContentType("text/html; charset=UTF-8", headers));
    return typeof html === "object" ? resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then(res) : res(html);
  };
  /**
   * `.redirect()` can Redirect, default status code is 302.
   *
   * @see {@link https://hono.dev/docs/api/context#redirect}
   *
   * @example
   * ```ts
   * app.get('/redirect', (c) => {
   *   return c.redirect('/')
   * })
   * app.get('/redirect-permanently', (c) => {
   *   return c.redirect('/', 301)
   * })
   * ```
   */
  redirect = (location, status) => {
    const locationString = String(location);
    this.header(
      "Location",
      // Multibyes should be encoded
      // eslint-disable-next-line no-control-regex
      !/[^\x00-\xFF]/.test(locationString) ? locationString : encodeURI(locationString)
    );
    return this.newResponse(null, status ?? 302);
  };
  /**
   * `.notFound()` can return the Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/context#notfound}
   *
   * @example
   * ```ts
   * app.get('/notfound', (c) => {
   *   return c.notFound()
   * })
   * ```
   */
  notFound = () => {
    this.#notFoundHandler ??= () => createResponseInstance();
    return this.#notFoundHandler(this);
  };
};

// ../../node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// ../../node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// ../../node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err2, c) => {
  if ("getResponse" in err2) {
    const res = err2.getResponse();
    return c.newResponse(res.body, res);
  }
  console.error(err2);
  return c.text("Internal Server Error", 500);
};
var Hono = class _Hono {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  /*
    This class is like an abstract class and does not have a router.
    To use it, inherit the class and implement router in the constructor.
  */
  router;
  getPath;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler2) => {
          this.#addRoute(method, this.#path, handler2);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p2 of [path].flat()) {
        this.#path = p2;
        for (const m2 of [method].flat()) {
          handlers.map((handler2) => {
            this.#addRoute(m2.toUpperCase(), this.#path, handler2);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler2) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler2);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new _Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.errorHandler = this.errorHandler;
    clone.#notFoundHandler = this.#notFoundHandler;
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  // Cannot use `#` because it requires visibility at JavaScript runtime.
  errorHandler = errorHandler;
  /**
   * `.route()` allows grouping other Hono instance in routes.
   *
   * @see {@link https://hono.dev/docs/api/routing#grouping}
   *
   * @param {string} path - base Path
   * @param {Hono} app - other Hono instance
   * @returns {Hono} routed Hono instance
   *
   * @example
   * ```ts
   * const app = new Hono()
   * const app2 = new Hono()
   *
   * app2.get("/user", (c) => c.text("user"))
   * app.route("/api", app2) // GET /api/user
   * ```
   */
  route(path, app26) {
    const subApp = this.basePath(path);
    app26.routes.map((r) => {
      let handler2;
      if (app26.errorHandler === errorHandler) {
        handler2 = r.handler;
      } else {
        handler2 = async (c, next) => (await compose([], app26.errorHandler)(c, () => r.handler(c, next))).res;
        handler2[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler2);
    });
    return this;
  }
  /**
   * `.basePath()` allows base paths to be specified.
   *
   * @see {@link https://hono.dev/docs/api/routing#base-path}
   *
   * @param {string} path - base Path
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * const api = new Hono().basePath('/api')
   * ```
   */
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  /**
   * `.onError()` handles an error and returns a customized Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#error-handling}
   *
   * @param {ErrorHandler} handler - request Handler for error
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.onError((err, c) => {
   *   console.error(`${err}`)
   *   return c.text('Custom Error Message', 500)
   * })
   * ```
   */
  onError = (handler2) => {
    this.errorHandler = handler2;
    return this;
  };
  /**
   * `.notFound()` allows you to customize a Not Found Response.
   *
   * @see {@link https://hono.dev/docs/api/hono#not-found}
   *
   * @param {NotFoundHandler} handler - request handler for not-found
   * @returns {Hono} changed Hono instance
   *
   * @example
   * ```ts
   * app.notFound((c) => {
   *   return c.text('Custom 404 Message', 404)
   * })
   * ```
   */
  notFound = (handler2) => {
    this.#notFoundHandler = handler2;
    return this;
  };
  /**
   * `.mount()` allows you to mount applications built with other frameworks into your Hono application.
   *
   * @see {@link https://hono.dev/docs/api/hono#mount}
   *
   * @param {string} path - base Path
   * @param {Function} applicationHandler - other Request Handler
   * @param {MountOptions} [options] - options of `.mount()`
   * @returns {Hono} mounted Hono instance
   *
   * @example
   * ```ts
   * import { Router as IttyRouter } from 'itty-router'
   * import { Hono } from 'hono'
   * // Create itty-router application
   * const ittyRouter = IttyRouter()
   * // GET /itty-router/hello
   * ittyRouter.get('/hello', () => new Response('Hello from itty-router'))
   *
   * const app = new Hono()
   * app.mount('/itty-router', ittyRouter.handle)
   * ```
   *
   * @example
   * ```ts
   * const app = new Hono()
   * // Send the request to another application without modification.
   * app.mount('/app', anotherApp, {
   *   replaceRequest: (req) => req,
   * })
   * ```
   */
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler2 = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler2);
    return this;
  }
  #addRoute(method, path, handler2) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { basePath: this._basePath, path, method, handler: handler2 };
    this.router.add(method, path, [handler2, r]);
    this.routes.push(r);
  }
  #handleError(err2, c) {
    if (err2 instanceof Error) {
      return this.errorHandler(err2, c);
    }
    throw err2;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err2) {
        return this.#handleError(err2, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))
      ).catch((err2) => this.#handleError(err2, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. Did you forget to return a Response object or `await next()`?"
          );
        }
        return context.res;
      } catch (err2) {
        return this.#handleError(err2, c);
      }
    })();
  }
  /**
   * `.fetch()` will be entry point of your app.
   *
   * @see {@link https://hono.dev/docs/api/hono#fetch}
   *
   * @param {Request} request - request Object of request
   * @param {Env} Env - env Object
   * @param {ExecutionContext} - context of execution
   * @returns {Response | Promise<Response>} response of request
   *
   */
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  /**
   * `.request()` is a useful method for testing.
   * You can pass a URL or pathname to send a GET request.
   * app will return a Response object.
   * ```ts
   * test('GET /hello is ok', async () => {
   *   const res = await app.request('/hello')
   *   expect(res.status).toBe(200)
   * })
   * ```
   * @see https://hono.dev/docs/api/hono#request
   */
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(
      new Request(
        /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`,
        requestInit
      ),
      Env,
      executionCtx
    );
  };
  /**
   * `.fire()` automatically adds a global fetch event listener.
   * This can be useful for environments that adhere to the Service Worker API, such as non-ES module Cloudflare Workers.
   * @deprecated
   * Use `fire` from `hono/service-worker` instead.
   * ```ts
   * import { Hono } from 'hono'
   * import { fire } from 'hono/service-worker'
   *
   * const app = new Hono()
   * // ...
   * fire(app)
   * ```
   * @see https://hono.dev/docs/api/hono#fire
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
   * @see https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/
   */
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// ../../node_modules/hono/dist/router/reg-exp-router/matcher.js
var emptyParam = [];
function match(method, path) {
  const matchers = this.buildAllMatchers();
  const match2 = ((method2, path2) => {
    const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
    const staticMatch = matcher[2][path2];
    if (staticMatch) {
      return staticMatch;
    }
    const match3 = path2.match(matcher[0]);
    if (!match3) {
      return [[], emptyParam];
    }
    const index = match3.indexOf("", 1);
    return [matcher[1][index], match3];
  });
  this.match = match2;
  return match2(method, path);
}

// ../../node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = /* @__PURE__ */ Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a2, b) {
  if (a2.length === 1) {
    return b.length === 1 ? a2 < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a2 === ONLY_WILDCARD_REG_EXP_STR || a2 === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a2 === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a2.length === b.length ? a2 < b ? -1 : 1 : b.length - a2.length;
}
var Node = class _Node {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name2 = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name2 && pattern[2]) {
        if (regexpStr === ".*") {
          throw PATH_ERROR;
        }
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new _Node();
        if (name2 !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name2 !== "") {
        paramMap.push([name2, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new _Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// ../../node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m2) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m2];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_2, handlerIndex, paramIndex) => {
      if (handlerIndex !== void 0) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== void 0) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// ../../node_modules/hono/dist/router/reg-exp-router/router.js
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_2, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key3, value] = paramAssoc[paramCount];
        paramIndexMap[key3] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a2, b) => b.length - a2.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler2) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p2) => {
          handlerMap[method][p2] = [...handlerMap[METHOD_NAME_ALL][p2]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m2) => {
          middleware[m2][path] ||= findMiddleware(middleware[m2], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m2) => {
        if (method === METHOD_NAME_ALL || method === m2) {
          Object.keys(middleware[m2]).forEach((p2) => {
            re.test(p2) && middleware[m2][p2].push([handler2, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m2) => {
        if (method === METHOD_NAME_ALL || method === m2) {
          Object.keys(routes[m2]).forEach(
            (p2) => re.test(p2) && routes[m2][p2].push([handler2, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m2) => {
        if (method === METHOD_NAME_ALL || method === m2) {
          routes[m2][path2] ||= [
            ...findMiddleware(middleware[m2], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m2][path2].push([handler2, paramCount - len + i + 1]);
        }
      });
    }
  }
  match = match;
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = void 0;
    clearWildcardRegExpCache();
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// ../../node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init2) {
    this.#routers = init2.routers;
  }
  add(method, path, handler2) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler2]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length; i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// ../../node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var hasChildren = (children) => {
  for (const _2 in children) {
    return true;
  }
  return false;
};
var Node2 = class _Node2 {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler2, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler2) {
      const m2 = /* @__PURE__ */ Object.create(null);
      m2[method] = { handler: handler2, possibleKeys: [], score: 0 };
      this.#methods = [m2];
    }
    this.#patterns = [];
  }
  insert(method, path, handler2) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p2 = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p2, nextP);
      const key3 = Array.isArray(pattern) ? pattern[0] : p2;
      if (key3 in curNode.#children) {
        curNode = curNode.#children[key3];
        if (pattern) {
          possibleKeys.push(pattern[1]);
        }
        continue;
      }
      curNode.#children[key3] = new _Node2();
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key3];
    }
    curNode.#methods.push({
      [method]: {
        handler: handler2,
        possibleKeys: possibleKeys.filter((v2, i, a2) => a2.indexOf(v2) === i),
        score: this.#order
      }
    });
    return curNode;
  }
  #pushHandlerSets(handlerSets, node, method, nodeParams, params) {
    for (let i = 0, len = node.#methods.length; i < len; i++) {
      const m2 = node.#methods[i];
      const handlerSet = m2[method] || m2[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length; i2 < len2; i2++) {
            const key3 = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key3] = params?.[key3] && !processed ? params[key3] : nodeParams[key3] ?? params?.[key3];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    const len = parts.length;
    let partOffsets = null;
    for (let i = 0; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              this.#pushHandlerSets(handlerSets, nextNode.#children["*"], method, node.#params);
            }
            this.#pushHandlerSets(handlerSets, nextNode, method, node.#params);
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length; k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              this.#pushHandlerSets(handlerSets, astNode, method, node.#params);
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          const [key3, name2, matcher] = pattern;
          if (!part && !(matcher instanceof RegExp)) {
            continue;
          }
          const child = node.#children[key3];
          if (matcher instanceof RegExp) {
            if (partOffsets === null) {
              partOffsets = new Array(len);
              let offset = path[0] === "/" ? 1 : 0;
              for (let p2 = 0; p2 < len; p2++) {
                partOffsets[p2] = offset;
                offset += parts[p2].length + 1;
              }
            }
            const restPathString = path.substring(partOffsets[i]);
            const m2 = matcher.exec(restPathString);
            if (m2) {
              params[name2] = m2[0];
              this.#pushHandlerSets(handlerSets, child, method, node.#params, params);
              if (hasChildren(child.#children)) {
                child.#params = params;
                const componentCount = m2[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name2] = part;
            if (isLast) {
              this.#pushHandlerSets(handlerSets, child, method, params, node.#params);
              if (child.#children["*"]) {
                this.#pushHandlerSets(
                  handlerSets,
                  child.#children["*"],
                  method,
                  params,
                  node.#params
                );
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      const shifted = curNodesQueue.shift();
      curNodes = shifted ? tempNodes.concat(shifted) : tempNodes;
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a2, b) => {
        return a2.score - b.score;
      });
    }
    return [handlerSets.map(({ handler: handler2, params }) => [handler2, params])];
  }
};

// ../../node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2();
  }
  add(method, path, handler2) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length; i < len; i++) {
        this.#node.insert(method, results[i], handler2);
      }
      return;
    }
    this.#node.insert(method, path, handler2);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// ../../node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  /**
   * Creates an instance of the Hono class.
   *
   * @param options - Optional configuration options for the Hono instance.
   */
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// ../../node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        if (opts.credentials) {
          return (origin) => origin || null;
        }
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  const findAllowMethods = ((optsAllowMethods) => {
    if (typeof optsAllowMethods === "function") {
      return optsAllowMethods;
    } else if (Array.isArray(optsAllowMethods)) {
      return () => optsAllowMethods;
    } else {
      return () => [];
    }
  })(opts.allowMethods);
  return async function cors2(c, next) {
    function set(key3, value) {
      c.res.headers.set(key3, value);
    }
    const allowOrigin = await findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.origin !== "*" || opts.credentials) {
        set("Vary", "Origin");
      }
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      const allowMethods = await findAllowMethods(c.req.header("origin") || "", c);
      if (allowMethods.length) {
        set("Access-Control-Allow-Methods", allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
    if (opts.origin !== "*" || opts.credentials) {
      c.header("Vary", "Origin", { append: true });
    }
  };
};

// ../../node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process: process2, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process2 !== void 0 ? (
    // eslint-disable-next-line no-unsafe-optional-chaining
    "NO_COLOR" in process2?.env
  ) : false;
  return !isNoColor;
}
async function getColorEnabledAsync() {
  const { navigator } = globalThis;
  const cfWorkers = "cloudflare:workers";
  const isNoColor = navigator !== void 0 && navigator.userAgent === "Cloudflare-Workers" ? await (async () => {
    try {
      return "NO_COLOR" in ((await import(cfWorkers)).env ?? {});
    } catch {
      return false;
    }
  })() : !getColorEnabled();
  return !isNoColor;
}

// ../../node_modules/hono/dist/middleware/logger/index.js
var humanize = (times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v2) => v2.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
};
var time = (start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
};
var colorStatus = async (status) => {
  const colorEnabled = await getColorEnabledAsync();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
};
async function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${await colorStatus(status)} ${elapsed}`;
  fn(out);
}
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method, url } = c.req;
    const path = url.slice(url.indexOf("/", 8));
    await log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    await log(fn, "-->", method, path, c.res.status, time(start));
  };
};

// ../../packages/config/src/site.ts
var SITE = {
  name: "Speedy Van",
  shortName: "SpeedyVan",
  domain: "speedyvan.uk",
  url: "https://www.speedyvan.uk",
  email: "hello@speedyvan.uk",
  supportEmail: "support@speedyvan.uk",
  phone: "+44 800 000 0000",
  address: "London, United Kingdom",
  // Public link to leave / read Google Business Profile reviews.
  // TODO: replace with the real GBP link once the listing is verified.
  googleReviewsUrl: "https://g.page/speedyvan/review",
  social: {
    facebook: "https://www.facebook.com/share/1Dd8NQPV4f/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@speedyvan0",
    whatsapp: "https://wa.me/message/J6EO772GDPHFO1"
  }
};
var ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://www.speedyvan.uk",
  "https://www.speedyvan.uk",
  "https://www.speedyvan.uk",
  "https://www.speedyvan.uk"
];

// ../../packages/config/src/pricing.ts
var DEFAULT_PRICING_CONFIG = {
  distance: {
    freeMiles: 5,
    perMileRate: 1.5,
    longDistanceDiscountStart: 20,
    longDistanceDiscountFactor: 0.85
  },
  floor: {
    perFloorSurcharge: 8,
    noLiftPenaltyMultiplier: 1.5,
    groundFloorThreshold: 0
  },
  urgency: {
    todayMultiplier: 1.4,
    tomorrowMultiplier: 1.2,
    twoDaysMultiplier: 1.1
  },
  slot: {
    morningMultiplier: 1.05,
    afternoonMultiplier: 1,
    eveningMultiplier: 1.1
  },
  weekend: { multiplier: 1.15 },
  season: {
    peakMonthMultiplier: 1.1,
    // Jun/Jul/Aug
    endOfMonthMultiplier: 1.08
  },
  weather: {
    clear: 0,
    rain: 5,
    heavy_rain: 10,
    snow: 20,
    storm: 25
  },
  addon: {
    helperPerHourPerHelper: 18,
    packingFlat: 35,
    assemblyFlat: 25
  },
  variant: {
    bedroom1Multiplier: 1,
    bedroom2Multiplier: 1.2,
    bedroom3Multiplier: 1.45,
    bedroom4Multiplier: 1.7,
    bedroom5PlusMultiplier: 2,
    businessSmallMultiplier: 1,
    businessMediumMultiplier: 1.4,
    businessLargeMultiplier: 1.8
  },
  base: {
    houseRemovalsBasePrice: 120,
    furnitureBasePrice: 60,
    storageBasePrice: 45,
    officeBasePrice: 150,
    otherBasePrice: 45,
    studentMoveBasePrice: 80,
    ikeaDeliveryBasePrice: 70,
    rubbishRemovalBasePrice: 90,
    pianoMovingBasePrice: 200,
    sameDayDeliveryBasePrice: 55,
    packingServiceBasePrice: 100,
    serviceBasePrice: 49
  }
};
var DEFAULT_PRICING_CONFIG_ROWS = Object.entries(
  DEFAULT_PRICING_CONFIG
).flatMap(
  ([category, values]) => Object.entries(values).map(([key3, value]) => ({
    category,
    key: key3,
    value: Number(value)
  }))
);

// ../../node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// ../../node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_2) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key3 in object) {
      if (Object.prototype.hasOwnProperty.call(object, key3)) {
        keys.push(key3);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_2, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// ../../node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// ../../node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// ../../node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// ../../node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m2) => !!m2).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x2) => !!x2)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key3 = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key: key3,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key: key3, value } = pair;
      if (key3.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key3.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key3.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key3.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x2) => x2.status === "aborted";
var isDirty = (x2) => x2.status === "dirty";
var isValid = (x2) => x2.status === "valid";
var isAsync = (x2) => typeof Promise !== "undefined" && x2 instanceof Promise;

// ../../node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// ../../node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key3) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key3;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err2) {
        if (err2?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt2, alg) {
  if (!jwtRegex.test(jwt2))
    return false;
  try {
    const [header] = jwt2.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key3 in schema.shape) {
      const fieldSchema = schema.shape[key3];
      newShape[key3] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key3 in ctx.data) {
        if (!shapeKeys.includes(key3)) {
          extraKeys.push(key3);
        }
      }
    }
    const pairs = [];
    for (const key3 of shapeKeys) {
      const keyValidator = shape[key3];
      const value = ctx.data[key3];
      pairs.push({
        key: { status: "valid", value: key3 },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key3)),
        alwaysSet: key3 in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key3 of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key3 },
            value: { status: "valid", value: ctx.data[key3] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key3 of extraKeys) {
        const value = ctx.data[key3];
        pairs.push({
          key: { status: "valid", value: key3 },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key3)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key3 in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key3 = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key: key3,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key3, schema) {
    return this.augment({ [key3]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key3 of util.objectKeys(mask)) {
      if (mask[key3] && this.shape[key3]) {
        shape[key3] = this.shape[key3];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key3 of util.objectKeys(this.shape)) {
      if (!mask[key3]) {
        shape[key3] = this.shape[key3];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key3 of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key3];
      if (mask && !mask[key3]) {
        newShape[key3] = fieldSchema;
      } else {
        newShape[key3] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key3 of util.objectKeys(this.shape)) {
      if (mask && !mask[key3]) {
        newShape[key3] = this.shape[key3];
      } else {
        const fieldSchema = this.shape[key3];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key3] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a2, b) {
  const aType = getParsedType(a2);
  const bType = getParsedType(b);
  if (a2 === b) {
    return { valid: true, data: a2 };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a2).filter((key3) => bKeys.indexOf(key3) !== -1);
    const newObj = { ...a2, ...b };
    for (const key3 of sharedKeys) {
      const sharedValue = mergeValues(a2[key3], b[key3]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key3] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a2.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a2.length; index++) {
      const itemA = a2[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a2 === +b) {
    return { valid: true, data: a2 };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x2) => !!x2);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key3 in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key3, ctx.path, key3)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key3], ctx.path, key3)),
        alwaysSet: key3 in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key3, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key3, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key3 = await pair.key;
          const value = await pair.value;
          if (key3.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key3.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key3.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key3 = pair.key;
        const value = pair.value;
        if (key3.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key3.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key3.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x2) => !!x2),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x2) => !!x2),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a2, b) {
    return new _ZodPipeline({
      in: a2,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p2 = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p22 = typeof p2 === "string" ? { message: p2 } : p2;
  return p22;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// ../../packages/shared/src/response.ts
var ok = (data) => ({ success: true, data });
var fail = (error, code, details) => details === void 0 ? code === void 0 ? { success: false, error } : { success: false, error, code } : { success: false, error, code, details };
var paginated = (data, page, limit, total) => ({
  success: true,
  data,
  pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) }
});

// ../../packages/shared/src/validations.ts
var LoginSchema = external_exports.object({
  email: external_exports.string().email(),
  password: external_exports.string().min(1)
});
var RegisterSchema = external_exports.object({
  name: external_exports.string().min(1),
  email: external_exports.string().email(),
  phone: external_exports.string().optional(),
  password: external_exports.string().min(8).optional()
});
var ForgotPasswordSchema = external_exports.object({ email: external_exports.string().email() });
var ResetPasswordSchema = external_exports.object({
  token: external_exports.string().min(10),
  newPassword: external_exports.string().min(8)
});
var SelectedItemSchema = external_exports.object({
  itemId: external_exports.string().optional(),
  name: external_exports.string(),
  quantity: external_exports.number().int().positive().default(1)
});
var CreateBookingSchema = external_exports.object({
  customerName: external_exports.string().min(1),
  customerEmail: external_exports.string().email(),
  customerPhone: external_exports.string().min(1),
  serviceSlug: external_exports.string().min(1),
  serviceName: external_exports.string().min(1),
  serviceVariant: external_exports.string().optional(),
  pickupAddress: external_exports.string().min(1),
  pickupPostcode: external_exports.string().min(1),
  pickupLat: external_exports.number(),
  pickupLng: external_exports.number(),
  pickupFloor: external_exports.number().int().min(0).default(0),
  pickupHasLift: external_exports.boolean().default(false),
  dropoffAddress: external_exports.string().min(1),
  dropoffPostcode: external_exports.string().min(1),
  dropoffLat: external_exports.number(),
  dropoffLng: external_exports.number(),
  dropoffFloor: external_exports.number().int().min(0).default(0),
  dropoffHasLift: external_exports.boolean().default(false),
  distanceMiles: external_exports.number().nonnegative(),
  selectedDate: external_exports.string(),
  // ISO
  selectedTimeSlot: external_exports.enum(["morning", "afternoon", "evening"]),
  helpersCount: external_exports.number().int().min(0).default(0),
  needsPacking: external_exports.boolean().default(false),
  needsAssembly: external_exports.boolean().default(false),
  selectedItems: external_exports.array(SelectedItemSchema).default([]),
  clientTotal: external_exports.number().nonnegative()
});
var ConfirmBookingSchema = external_exports.object({
  bookingId: external_exports.string().min(1),
  stripePaymentIntentId: external_exports.string().min(1)
});
var CancelBookingSchema = external_exports.object({
  email: external_exports.string().email(),
  reason: external_exports.string().optional()
});
var PricingCalculateSchema = external_exports.object({
  serviceType: external_exports.string(),
  serviceVariant: external_exports.string().optional(),
  distanceMiles: external_exports.number().nonnegative(),
  pickupFloor: external_exports.number().int().min(0).default(0),
  pickupHasLift: external_exports.boolean().default(false),
  dropoffFloor: external_exports.number().int().min(0).default(0),
  dropoffHasLift: external_exports.boolean().default(false),
  helpersCount: external_exports.number().int().min(0).default(0),
  needsPacking: external_exports.boolean().default(false),
  needsAssembly: external_exports.boolean().default(false),
  pickupLat: external_exports.number().optional(),
  pickupLng: external_exports.number().optional()
});
var GeocodeSearchSchema = external_exports.object({ q: external_exports.string().min(2) });
var DirectionsSchema = external_exports.object({
  pickupLat: external_exports.number(),
  pickupLng: external_exports.number(),
  dropoffLat: external_exports.number(),
  dropoffLng: external_exports.number()
});
var DriverStatusUpdateSchema = external_exports.object({
  status: external_exports.enum([
    "DRIVER_EN_ROUTE",
    "ARRIVED_PICKUP",
    "LOADING",
    "IN_TRANSIT",
    "ARRIVED_DROPOFF",
    "UNLOADING",
    "COMPLETED"
  ]),
  note: external_exports.string().optional()
});
var DriverLocationSchema = external_exports.object({
  bookingId: external_exports.string(),
  lat: external_exports.number(),
  lng: external_exports.number()
});
var VisitorSessionSchema = external_exports.object({
  userAgent: external_exports.string().optional(),
  referrer: external_exports.string().optional(),
  landingPage: external_exports.string().optional(),
  screenWidth: external_exports.number().int().optional()
});
var VisitorEventSchema = external_exports.object({
  sessionId: external_exports.string(),
  type: external_exports.string(),
  page: external_exports.string().optional(),
  element: external_exports.string().optional(),
  metadata: external_exports.record(external_exports.unknown()).optional()
});
var SendMessageSchema = external_exports.object({
  body: external_exports.string().min(1).max(4e3)
});

// ../../packages/shared/src/constants.ts
var TIME_SLOTS = ["morning", "afternoon", "evening"];
var CURRENCY = { code: "GBP", symbol: "\xA3" };

// ../../packages/shared/src/_nanoid.ts
var import_crypto = require("crypto");
function customAlphabet(alphabet, size) {
  const len = alphabet.length;
  return () => {
    const bytes = (0, import_crypto.randomBytes)(size);
    let out = "";
    for (let i = 0; i < size; i++) {
      out += alphabet[bytes[i] % len];
    }
    return out;
  };
}

// ../../packages/shared/src/utils.ts
var ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
var refSuffix = customAlphabet(ALPHABET, 6);
function generateBookingReference() {
  const year = (/* @__PURE__ */ new Date()).getUTCFullYear();
  return `SVR-${year}-${refSuffix()}`;
}
var TOKEN_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var tokenGen = customAlphabet(TOKEN_ALPHABET, 64);
function generateResetToken() {
  return tokenGen();
}
function calculateRefund(scheduledAt, totalPrice, now = /* @__PURE__ */ new Date()) {
  const hoursToService = (scheduledAt.getTime() - now.getTime()) / 36e5;
  if (hoursToService >= 48) return totalPrice;
  if (hoursToService >= 24) return Math.round(totalPrice * 0.5 * 100) / 100;
  return 0;
}
function poundsToPence(pounds) {
  return Math.round(pounds * 100);
}
function maskPostcode(postcode) {
  const trimmed = postcode.replace(/\s+/g, "");
  return trimmed.slice(0, Math.max(2, trimmed.length - 3)).toUpperCase();
}

// src/middleware/error.ts
function errorHandler2(err2, c) {
  console.error(`[API Error] ${c.req.method} ${c.req.path}:`, err2.message);
  if (err2 instanceof ZodError) {
    return c.json(fail("Validation failed", "VALIDATION_ERROR", err2.flatten()), 400);
  }
  if (err2.message === "STRIPE_NOT_CONFIGURED") {
    return c.json(fail("Payments are not configured on this server", "STRIPE_NOT_CONFIGURED"), 503);
  }
  if (err2.message === "NOT_FOUND") {
    return c.json(fail("Resource not found", "NOT_FOUND"), 404);
  }
  console.error(err2.stack);
  const isDev = process.env.NODE_ENV !== "production";
  return c.json(
    fail(
      isDev ? `Internal server error: ${err2.message}` : "Internal server error",
      "INTERNAL_ERROR",
      isDev ? { stack: err2.stack } : void 0
    ),
    500
  );
}

// src/routes/health.ts
var app = new Hono2();
app.get("/", (c) => c.json(ok({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() })));
app.get("/health", (c) => c.json(ok({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() })));
var health_default = app;

// ../../node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var trimCookieWhitespace = (value) => {
  let start = 0;
  let end = value.length;
  while (start < end) {
    const charCode = value.charCodeAt(start);
    if (charCode !== 32 && charCode !== 9) {
      break;
    }
    start++;
  }
  while (end > start) {
    const charCode = value.charCodeAt(end - 1);
    if (charCode !== 32 && charCode !== 9) {
      break;
    }
    end--;
  }
  return start === 0 && end === value.length ? value : value.slice(start, end);
};
var parse = (cookie, name2) => {
  if (name2 && cookie.indexOf(name2) === -1) {
    return {};
  }
  const pairs = cookie.split(";");
  const parsedCookie = {};
  for (const pairStr of pairs) {
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      continue;
    }
    const cookieName = trimCookieWhitespace(pairStr.substring(0, valueStartPos));
    if (name2 && name2 !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      continue;
    }
    let cookieValue = trimCookieWhitespace(pairStr.substring(valueStartPos + 1));
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = cookieValue.indexOf("%") !== -1 ? tryDecode(cookieValue, decodeURIComponent_) : cookieValue;
      if (name2) {
        break;
      }
    }
  }
  return parsedCookie;
};

// ../../node_modules/hono/dist/helper/cookie/index.js
var getCookie = (c, key3, prefix) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key3 === "string") {
    if (!cookie) {
      return void 0;
    }
    let finalKey = key3;
    if (prefix === "secure") {
      finalKey = "__Secure-" + key3;
    } else if (prefix === "host") {
      finalKey = "__Host-" + key3;
    }
    const obj2 = parse(cookie, finalKey);
    return obj2[finalKey];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
};

// ../../node_modules/hono/dist/utils/buffer.js
var bufferToFormData = (arrayBuffer, contentType) => {
  const response = new Response(arrayBuffer, {
    headers: {
      "Content-Type": contentType
    }
  });
  return response.formData();
};

// ../../node_modules/hono/dist/validator/validator.js
var jsonRegex = /^application\/([a-z-\.]+\+)?json(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var multipartRegex = /^multipart\/form-data(;\s?boundary=[a-zA-Z0-9'"()+_,\-./:=?]+)?$/;
var urlencodedRegex = /^application\/x-www-form-urlencoded(;\s*[a-zA-Z0-9\-]+\=([^;]+))*$/;
var validator = (target, validationFunc) => {
  return async (c, next) => {
    let value = {};
    const contentType = c.req.header("Content-Type");
    switch (target) {
      case "json":
        if (!contentType || !jsonRegex.test(contentType)) {
          break;
        }
        try {
          value = await c.req.json();
        } catch {
          const message = "Malformed JSON in request body";
          throw new HTTPException(400, { message });
        }
        break;
      case "form": {
        if (!contentType || !(multipartRegex.test(contentType) || urlencodedRegex.test(contentType))) {
          break;
        }
        let formData;
        if (c.req.bodyCache.formData) {
          formData = await c.req.bodyCache.formData;
        } else {
          try {
            const arrayBuffer = await c.req.arrayBuffer();
            formData = await bufferToFormData(arrayBuffer, contentType);
            c.req.bodyCache.formData = formData;
          } catch (e) {
            let message = "Malformed FormData request.";
            message += e instanceof Error ? ` ${e.message}` : ` ${String(e)}`;
            throw new HTTPException(400, { message });
          }
        }
        const form = /* @__PURE__ */ Object.create(null);
        formData.forEach((value2, key3) => {
          if (key3.endsWith("[]")) {
            ;
            (form[key3] ??= []).push(value2);
          } else if (Array.isArray(form[key3])) {
            ;
            form[key3].push(value2);
          } else if (Object.hasOwn(form, key3)) {
            form[key3] = [form[key3], value2];
          } else {
            form[key3] = value2;
          }
        });
        value = form;
        break;
      }
      case "query":
        value = Object.fromEntries(
          Object.entries(c.req.queries()).map(([k, v2]) => {
            return v2.length === 1 ? [k, v2[0]] : [k, v2];
          })
        );
        break;
      case "param":
        value = c.req.param();
        break;
      case "header":
        value = c.req.header();
        break;
      case "cookie":
        value = getCookie(c);
        break;
    }
    const res = await validationFunc(value, c);
    if (res instanceof Response) {
      return res;
    }
    c.req.addValidatedData(target, res);
    return await next();
  };
};

// ../../node_modules/@hono/zod-validator/dist/index.js
var zValidator = (target, schema, hook) => (
  // @ts-expect-error not typed well
  validator(target, async (value, c) => {
    let validatorValue = value;
    if (target === "header" && schema instanceof ZodObject) {
      const schemaKeys = Object.keys(schema.shape);
      const caseInsensitiveKeymap = Object.fromEntries(
        schemaKeys.map((key3) => [key3.toLowerCase(), key3])
      );
      validatorValue = Object.fromEntries(
        Object.entries(value).map(([key3, value2]) => [caseInsensitiveKeymap[key3] || key3, value2])
      );
    }
    const result = await schema.safeParseAsync(validatorValue);
    if (hook) {
      const hookResult = await hook({ data: validatorValue, ...result, target }, c);
      if (hookResult) {
        if (hookResult instanceof Response) {
          return hookResult;
        }
        if ("response" in hookResult) {
          return hookResult.response;
        }
      }
    }
    if (!result.success) {
      return c.json(result, 400);
    }
    return result.data;
  })
);

// src/routes/auth.ts
var import_bcryptjs = __toESM(require_bcryptjs());

// ../../packages/db/src/index.ts
var src_exports = {};
__export(src_exports, {
  db: () => db,
  prisma: () => prisma
});
var import_client = require("@prisma/client");

// ../../packages/db/node_modules/@neondatabase/serverless/index.mjs
var io = Object.create;
var Ce = Object.defineProperty;
var so = Object.getOwnPropertyDescriptor;
var oo = Object.getOwnPropertyNames;
var ao = Object.getPrototypeOf;
var uo = Object.prototype.hasOwnProperty;
var co = (r, e, t) => e in r ? Ce(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t;
var a = (r, e) => Ce(r, "name", { value: e, configurable: true });
var z = (r, e) => () => (r && (e = r(r = 0)), e);
var I = (r, e) => () => (e || r((e = { exports: {} }).exports, e), e.exports);
var se = (r, e) => {
  for (var t in e)
    Ce(r, t, { get: e[t], enumerable: true });
};
var Tn = (r, e, t, n) => {
  if (e && typeof e == "object" || typeof e == "function") for (let i of oo(e)) !uo.call(r, i) && i !== t && Ce(r, i, { get: () => e[i], enumerable: !(n = so(e, i)) || n.enumerable });
  return r;
};
var Te = (r, e, t) => (t = r != null ? io(ao(r)) : {}, Tn(e || !r || !r.__esModule ? Ce(t, "default", {
  value: r,
  enumerable: true
}) : t, r));
var O = (r) => Tn(Ce({}, "__esModule", { value: true }), r);
var _ = (r, e, t) => co(r, typeof e != "symbol" ? e + "" : e, t);
var Bn = I((st) => {
  "use strict";
  p();
  st.byteLength = lo;
  st.toByteArray = po;
  st.fromByteArray = go;
  var ae = [], re = [], ho = typeof Uint8Array < "u" ? Uint8Array : Array, Rt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (Ee = 0, In = Rt.length; Ee < In; ++Ee)
    ae[Ee] = Rt[Ee], re[Rt.charCodeAt(Ee)] = Ee;
  var Ee, In;
  re[45] = 62;
  re[95] = 63;
  function Pn(r) {
    var e = r.length;
    if (e % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    var t = r.indexOf("=");
    t === -1 && (t = e);
    var n = t === e ? 0 : 4 - t % 4;
    return [t, n];
  }
  a(
    Pn,
    "getLens"
  );
  function lo(r) {
    var e = Pn(r), t = e[0], n = e[1];
    return (t + n) * 3 / 4 - n;
  }
  a(lo, "byteLength");
  function fo(r, e, t) {
    return (e + t) * 3 / 4 - t;
  }
  a(fo, "_byteLength");
  function po(r) {
    var e, t = Pn(r), n = t[0], i = t[1], s = new ho(fo(r, n, i)), o = 0, u = i > 0 ? n - 4 : n, c;
    for (c = 0; c < u; c += 4) e = re[r.charCodeAt(c)] << 18 | re[r.charCodeAt(c + 1)] << 12 | re[r.charCodeAt(c + 2)] << 6 | re[r.charCodeAt(c + 3)], s[o++] = e >> 16 & 255, s[o++] = e >> 8 & 255, s[o++] = e & 255;
    return i === 2 && (e = re[r.charCodeAt(c)] << 2 | re[r.charCodeAt(c + 1)] >> 4, s[o++] = e & 255), i === 1 && (e = re[r.charCodeAt(
      c
    )] << 10 | re[r.charCodeAt(c + 1)] << 4 | re[r.charCodeAt(c + 2)] >> 2, s[o++] = e >> 8 & 255, s[o++] = e & 255), s;
  }
  a(po, "toByteArray");
  function yo(r) {
    return ae[r >> 18 & 63] + ae[r >> 12 & 63] + ae[r >> 6 & 63] + ae[r & 63];
  }
  a(yo, "tripletToBase64");
  function mo(r, e, t) {
    for (var n, i = [], s = e; s < t; s += 3) n = (r[s] << 16 & 16711680) + (r[s + 1] << 8 & 65280) + (r[s + 2] & 255), i.push(yo(n));
    return i.join(
      ""
    );
  }
  a(mo, "encodeChunk");
  function go(r) {
    for (var e, t = r.length, n = t % 3, i = [], s = 16383, o = 0, u = t - n; o < u; o += s) i.push(mo(r, o, o + s > u ? u : o + s));
    return n === 1 ? (e = r[t - 1], i.push(ae[e >> 2] + ae[e << 4 & 63] + "==")) : n === 2 && (e = (r[t - 2] << 8) + r[t - 1], i.push(ae[e >> 10] + ae[e >> 4 & 63] + ae[e << 2 & 63] + "=")), i.join("");
  }
  a(go, "fromByteArray");
});
var Ln = I((Ft) => {
  p();
  Ft.read = function(r, e, t, n, i) {
    var s, o, u = i * 8 - n - 1, c = (1 << u) - 1, h = c >> 1, l = -7, d = t ? i - 1 : 0, b = t ? -1 : 1, C = r[e + d];
    for (d += b, s = C & (1 << -l) - 1, C >>= -l, l += u; l > 0; s = s * 256 + r[e + d], d += b, l -= 8) ;
    for (o = s & (1 << -l) - 1, s >>= -l, l += n; l > 0; o = o * 256 + r[e + d], d += b, l -= 8) ;
    if (s === 0) s = 1 - h;
    else {
      if (s === c) return o ? NaN : (C ? -1 : 1) * (1 / 0);
      o = o + Math.pow(2, n), s = s - h;
    }
    return (C ? -1 : 1) * o * Math.pow(2, s - n);
  };
  Ft.write = function(r, e, t, n, i, s) {
    var o, u, c, h = s * 8 - i - 1, l = (1 << h) - 1, d = l >> 1, b = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, C = n ? 0 : s - 1, B = n ? 1 : -1, Q = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (u = isNaN(e) ? 1 : 0, o = l) : (o = Math.floor(Math.log(e) / Math.LN2), e * (c = Math.pow(2, -o)) < 1 && (o--, c *= 2), o + d >= 1 ? e += b / c : e += b * Math.pow(2, 1 - d), e * c >= 2 && (o++, c /= 2), o + d >= l ? (u = 0, o = l) : o + d >= 1 ? (u = (e * c - 1) * Math.pow(
      2,
      i
    ), o = o + d) : (u = e * Math.pow(2, d - 1) * Math.pow(2, i), o = 0)); i >= 8; r[t + C] = u & 255, C += B, u /= 256, i -= 8) ;
    for (o = o << i | u, h += i; h > 0; r[t + C] = o & 255, C += B, o /= 256, h -= 8) ;
    r[t + C - B] |= Q * 128;
  };
});
var Kn = I((Le) => {
  "use strict";
  p();
  var Mt = Bn(), Pe = Ln(), Rn = typeof Symbol == "function" && typeof Symbol.for == "function" ? /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom") : null;
  Le.Buffer = f;
  Le.SlowBuffer = vo;
  Le.INSPECT_MAX_BYTES = 50;
  var ot = 2147483647;
  Le.kMaxLength = ot;
  f.TYPED_ARRAY_SUPPORT = wo();
  !f.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
  function wo() {
    try {
      let r = new Uint8Array(1), e = { foo: a(function() {
        return 42;
      }, "foo") };
      return Object.setPrototypeOf(e, Uint8Array.prototype), Object.setPrototypeOf(
        r,
        e
      ), r.foo() === 42;
    } catch {
      return false;
    }
  }
  a(wo, "typedArraySupport");
  Object.defineProperty(
    f.prototype,
    "parent",
    { enumerable: true, get: a(function() {
      if (f.isBuffer(this)) return this.buffer;
    }, "get") }
  );
  Object.defineProperty(f.prototype, "offset", { enumerable: true, get: a(
    function() {
      if (f.isBuffer(this)) return this.byteOffset;
    },
    "get"
  ) });
  function le(r) {
    if (r > ot) throw new RangeError('The value "' + r + '" is invalid for option "size"');
    let e = new Uint8Array(
      r
    );
    return Object.setPrototypeOf(e, f.prototype), e;
  }
  a(le, "createBuffer");
  function f(r, e, t) {
    if (typeof r == "number") {
      if (typeof e == "string") throw new TypeError('The "string" argument must be of type string. Received type number');
      return Ot(r);
    }
    return kn(
      r,
      e,
      t
    );
  }
  a(f, "Buffer");
  f.poolSize = 8192;
  function kn(r, e, t) {
    if (typeof r == "string") return So(
      r,
      e
    );
    if (ArrayBuffer.isView(r)) return xo(r);
    if (r == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
    if (ue(r, ArrayBuffer) || r && ue(r.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (ue(r, SharedArrayBuffer) || r && ue(r.buffer, SharedArrayBuffer)))
      return kt(r, e, t);
    if (typeof r == "number") throw new TypeError('The "value" argument must not be of type number. Received type number');
    let n = r.valueOf && r.valueOf();
    if (n != null && n !== r) return f.from(n, e, t);
    let i = Eo(r);
    if (i) return i;
    if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof r[Symbol.toPrimitive] == "function") return f.from(r[Symbol.toPrimitive]("string"), e, t);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof r);
  }
  a(kn, "from");
  f.from = function(r, e, t) {
    return kn(r, e, t);
  };
  Object.setPrototypeOf(f.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(
    f,
    Uint8Array
  );
  function Un(r) {
    if (typeof r != "number") throw new TypeError('"size" argument must be of type number');
    if (r < 0) throw new RangeError('The value "' + r + '" is invalid for option "size"');
  }
  a(Un, "assertSize");
  function bo(r, e, t) {
    return Un(r), r <= 0 ? le(r) : e !== void 0 ? typeof t == "string" ? le(r).fill(e, t) : le(r).fill(e) : le(r);
  }
  a(
    bo,
    "alloc"
  );
  f.alloc = function(r, e, t) {
    return bo(r, e, t);
  };
  function Ot(r) {
    return Un(r), le(
      r < 0 ? 0 : Nt(r) | 0
    );
  }
  a(Ot, "allocUnsafe");
  f.allocUnsafe = function(r) {
    return Ot(r);
  };
  f.allocUnsafeSlow = function(r) {
    return Ot(r);
  };
  function So(r, e) {
    if ((typeof e != "string" || e === "") && (e = "utf8"), !f.isEncoding(e)) throw new TypeError("Unknown encoding: " + e);
    let t = On(r, e) | 0, n = le(t), i = n.write(r, e);
    return i !== t && (n = n.slice(0, i)), n;
  }
  a(So, "fromString");
  function Dt(r) {
    let e = r.length < 0 ? 0 : Nt(r.length) | 0, t = le(e);
    for (let n = 0; n < e; n += 1) t[n] = r[n] & 255;
    return t;
  }
  a(Dt, "fromArrayLike");
  function xo(r) {
    if (ue(r, Uint8Array)) {
      let e = new Uint8Array(r);
      return kt(e.buffer, e.byteOffset, e.byteLength);
    }
    return Dt(r);
  }
  a(xo, "fromArrayView");
  function kt(r, e, t) {
    if (e < 0 || r.byteLength < e) throw new RangeError('"offset" is outside of buffer bounds');
    if (r.byteLength < e + (t || 0)) throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return e === void 0 && t === void 0 ? n = new Uint8Array(
      r
    ) : t === void 0 ? n = new Uint8Array(r, e) : n = new Uint8Array(r, e, t), Object.setPrototypeOf(
      n,
      f.prototype
    ), n;
  }
  a(kt, "fromArrayBuffer");
  function Eo(r) {
    if (f.isBuffer(r)) {
      let e = Nt(
        r.length
      ) | 0, t = le(e);
      return t.length === 0 || r.copy(t, 0, 0, e), t;
    }
    if (r.length !== void 0)
      return typeof r.length != "number" || Qt(r.length) ? le(0) : Dt(r);
    if (r.type === "Buffer" && Array.isArray(r.data)) return Dt(r.data);
  }
  a(Eo, "fromObject");
  function Nt(r) {
    if (r >= ot) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + ot.toString(16) + " bytes");
    return r | 0;
  }
  a(Nt, "checked");
  function vo(r) {
    return +r != r && (r = 0), f.alloc(+r);
  }
  a(vo, "SlowBuffer");
  f.isBuffer = a(function(e) {
    return e != null && e._isBuffer === true && e !== f.prototype;
  }, "isBuffer");
  f.compare = a(function(e, t) {
    if (ue(e, Uint8Array) && (e = f.from(e, e.offset, e.byteLength)), ue(t, Uint8Array) && (t = f.from(t, t.offset, t.byteLength)), !f.isBuffer(e) || !f.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    if (e === t) return 0;
    let n = e.length, i = t.length;
    for (let s = 0, o = Math.min(n, i); s < o; ++s) if (e[s] !== t[s]) {
      n = e[s], i = t[s];
      break;
    }
    return n < i ? -1 : i < n ? 1 : 0;
  }, "compare");
  f.isEncoding = a(function(e) {
    switch (String(e).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return true;
      default:
        return false;
    }
  }, "isEncoding");
  f.concat = a(function(e, t) {
    if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (e.length === 0) return f.alloc(0);
    let n;
    if (t === void 0) for (t = 0, n = 0; n < e.length; ++n) t += e[n].length;
    let i = f.allocUnsafe(t), s = 0;
    for (n = 0; n < e.length; ++n) {
      let o = e[n];
      if (ue(o, Uint8Array)) s + o.length > i.length ? (f.isBuffer(
        o
      ) || (o = f.from(o)), o.copy(i, s)) : Uint8Array.prototype.set.call(i, o, s);
      else if (f.isBuffer(
        o
      )) o.copy(i, s);
      else throw new TypeError('"list" argument must be an Array of Buffers');
      s += o.length;
    }
    return i;
  }, "concat");
  function On(r, e) {
    if (f.isBuffer(r)) return r.length;
    if (ArrayBuffer.isView(r) || ue(r, ArrayBuffer)) return r.byteLength;
    if (typeof r != "string") throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof r);
    let t = r.length, n = arguments.length > 2 && arguments[2] === true;
    if (!n && t === 0) return 0;
    let i = false;
    for (; ; ) switch (e) {
      case "ascii":
      case "latin1":
      case "binary":
        return t;
      case "utf8":
      case "utf-8":
        return Ut(r).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return t * 2;
      case "hex":
        return t >>> 1;
      case "base64":
        return Vn(r).length;
      default:
        if (i) return n ? -1 : Ut(r).length;
        e = ("" + e).toLowerCase(), i = true;
    }
  }
  a(On, "byteLength");
  f.byteLength = On;
  function _o(r, e, t) {
    let n = false;
    if ((e === void 0 || e < 0) && (e = 0), e > this.length || ((t === void 0 || t > this.length) && (t = this.length), t <= 0) || (t >>>= 0, e >>>= 0, t <= e)) return "";
    for (r || (r = "utf8"); ; ) switch (r) {
      case "hex":
        return Mo(
          this,
          e,
          t
        );
      case "utf8":
      case "utf-8":
        return qn(this, e, t);
      case "ascii":
        return Ro(
          this,
          e,
          t
        );
      case "latin1":
      case "binary":
        return Fo(this, e, t);
      case "base64":
        return Bo(
          this,
          e,
          t
        );
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Do(this, e, t);
      default:
        if (n) throw new TypeError("Unknown encoding: " + r);
        r = (r + "").toLowerCase(), n = true;
    }
  }
  a(
    _o,
    "slowToString"
  );
  f.prototype._isBuffer = true;
  function ve(r, e, t) {
    let n = r[e];
    r[e] = r[t], r[t] = n;
  }
  a(ve, "swap");
  f.prototype.swap16 = a(function() {
    let e = this.length;
    if (e % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let t = 0; t < e; t += 2) ve(this, t, t + 1);
    return this;
  }, "swap16");
  f.prototype.swap32 = a(function() {
    let e = this.length;
    if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let t = 0; t < e; t += 4) ve(this, t, t + 3), ve(this, t + 1, t + 2);
    return this;
  }, "swap32");
  f.prototype.swap64 = a(function() {
    let e = this.length;
    if (e % 8 !== 0) throw new RangeError(
      "Buffer size must be a multiple of 64-bits"
    );
    for (let t = 0; t < e; t += 8) ve(this, t, t + 7), ve(this, t + 1, t + 6), ve(this, t + 2, t + 5), ve(this, t + 3, t + 4);
    return this;
  }, "swap64");
  f.prototype.toString = a(function() {
    let e = this.length;
    return e === 0 ? "" : arguments.length === 0 ? qn(
      this,
      0,
      e
    ) : _o.apply(this, arguments);
  }, "toString");
  f.prototype.toLocaleString = f.prototype.toString;
  f.prototype.equals = a(function(e) {
    if (!f.isBuffer(e)) throw new TypeError(
      "Argument must be a Buffer"
    );
    return this === e ? true : f.compare(this, e) === 0;
  }, "equals");
  f.prototype.inspect = a(function() {
    let e = "", t = Le.INSPECT_MAX_BYTES;
    return e = this.toString(
      "hex",
      0,
      t
    ).replace(/(.{2})/g, "$1 ").trim(), this.length > t && (e += " ... "), "<Buffer " + e + ">";
  }, "inspect");
  Rn && (f.prototype[Rn] = f.prototype.inspect);
  f.prototype.compare = a(function(e, t, n, i, s) {
    if (ue(e, Uint8Array) && (e = f.from(e, e.offset, e.byteLength)), !f.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
    if (t === void 0 && (t = 0), n === void 0 && (n = e ? e.length : 0), i === void 0 && (i = 0), s === void 0 && (s = this.length), t < 0 || n > e.length || i < 0 || s > this.length) throw new RangeError("out of range index");
    if (i >= s && t >= n) return 0;
    if (i >= s) return -1;
    if (t >= n) return 1;
    if (t >>>= 0, n >>>= 0, i >>>= 0, s >>>= 0, this === e) return 0;
    let o = s - i, u = n - t, c = Math.min(o, u), h = this.slice(i, s), l = e.slice(t, n);
    for (let d = 0; d < c; ++d)
      if (h[d] !== l[d]) {
        o = h[d], u = l[d];
        break;
      }
    return o < u ? -1 : u < o ? 1 : 0;
  }, "compare");
  function Nn(r, e, t, n, i) {
    if (r.length === 0) return -1;
    if (typeof t == "string" ? (n = t, t = 0) : t > 2147483647 ? t = 2147483647 : t < -2147483648 && (t = -2147483648), t = +t, Qt(t) && (t = i ? 0 : r.length - 1), t < 0 && (t = r.length + t), t >= r.length) {
      if (i) return -1;
      t = r.length - 1;
    } else if (t < 0) if (i) t = 0;
    else return -1;
    if (typeof e == "string" && (e = f.from(e, n)), f.isBuffer(e)) return e.length === 0 ? -1 : Fn(r, e, t, n, i);
    if (typeof e == "number") return e = e & 255, typeof Uint8Array.prototype.indexOf == "function" ? i ? Uint8Array.prototype.indexOf.call(r, e, t) : Uint8Array.prototype.lastIndexOf.call(r, e, t) : Fn(
      r,
      [e],
      t,
      n,
      i
    );
    throw new TypeError("val must be string, number or Buffer");
  }
  a(Nn, "bidirectionalIndexOf");
  function Fn(r, e, t, n, i) {
    let s = 1, o = r.length, u = e.length;
    if (n !== void 0 && (n = String(n).toLowerCase(), n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")) {
      if (r.length < 2 || e.length < 2) return -1;
      s = 2, o /= 2, u /= 2, t /= 2;
    }
    function c(l, d) {
      return s === 1 ? l[d] : l.readUInt16BE(d * s);
    }
    a(c, "read");
    let h;
    if (i) {
      let l = -1;
      for (h = t; h < o; h++) if (c(r, h) === c(e, l === -1 ? 0 : h - l)) {
        if (l === -1 && (l = h), h - l + 1 === u) return l * s;
      } else l !== -1 && (h -= h - l), l = -1;
    } else for (t + u > o && (t = o - u), h = t; h >= 0; h--) {
      let l = true;
      for (let d = 0; d < u; d++)
        if (c(r, h + d) !== c(e, d)) {
          l = false;
          break;
        }
      if (l) return h;
    }
    return -1;
  }
  a(Fn, "arrayIndexOf");
  f.prototype.includes = a(function(e, t, n) {
    return this.indexOf(e, t, n) !== -1;
  }, "includes");
  f.prototype.indexOf = a(function(e, t, n) {
    return Nn(this, e, t, n, true);
  }, "indexOf");
  f.prototype.lastIndexOf = a(function(e, t, n) {
    return Nn(this, e, t, n, false);
  }, "lastIndexOf");
  function Ao(r, e, t, n) {
    t = Number(t) || 0;
    let i = r.length - t;
    n ? (n = Number(n), n > i && (n = i)) : n = i;
    let s = e.length;
    n > s / 2 && (n = s / 2);
    let o;
    for (o = 0; o < n; ++o) {
      let u = parseInt(e.substr(o * 2, 2), 16);
      if (Qt(u))
        return o;
      r[t + o] = u;
    }
    return o;
  }
  a(Ao, "hexWrite");
  function Co(r, e, t, n) {
    return at(Ut(
      e,
      r.length - t
    ), r, t, n);
  }
  a(Co, "utf8Write");
  function To(r, e, t, n) {
    return at(No(e), r, t, n);
  }
  a(To, "asciiWrite");
  function Io(r, e, t, n) {
    return at(Vn(e), r, t, n);
  }
  a(Io, "base64Write");
  function Po(r, e, t, n) {
    return at(qo(e, r.length - t), r, t, n);
  }
  a(Po, "ucs2Write");
  f.prototype.write = a(function(e, t, n, i) {
    if (t === void 0) i = "utf8", n = this.length, t = 0;
    else if (n === void 0 && typeof t == "string") i = t, n = this.length, t = 0;
    else if (isFinite(t)) t = t >>> 0, isFinite(n) ? (n = n >>> 0, i === void 0 && (i = "utf8")) : (i = n, n = void 0);
    else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    let s = this.length - t;
    if ((n === void 0 || n > s) && (n = s), e.length > 0 && (n < 0 || t < 0) || t > this.length) throw new RangeError(
      "Attempt to write outside buffer bounds"
    );
    i || (i = "utf8");
    let o = false;
    for (; ; ) switch (i) {
      case "hex":
        return Ao(this, e, t, n);
      case "utf8":
      case "utf-8":
        return Co(this, e, t, n);
      case "ascii":
      case "latin1":
      case "binary":
        return To(this, e, t, n);
      case "base64":
        return Io(
          this,
          e,
          t,
          n
        );
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return Po(this, e, t, n);
      default:
        if (o) throw new TypeError("Unknown encoding: " + i);
        i = ("" + i).toLowerCase(), o = true;
    }
  }, "write");
  f.prototype.toJSON = a(function() {
    return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
  }, "toJSON");
  function Bo(r, e, t) {
    return e === 0 && t === r.length ? Mt.fromByteArray(r) : Mt.fromByteArray(r.slice(e, t));
  }
  a(Bo, "base64Slice");
  function qn(r, e, t) {
    t = Math.min(r.length, t);
    let n = [], i = e;
    for (; i < t; ) {
      let s = r[i], o = null, u = s > 239 ? 4 : s > 223 ? 3 : s > 191 ? 2 : 1;
      if (i + u <= t) {
        let c, h, l, d;
        switch (u) {
          case 1:
            s < 128 && (o = s);
            break;
          case 2:
            c = r[i + 1], (c & 192) === 128 && (d = (s & 31) << 6 | c & 63, d > 127 && (o = d));
            break;
          case 3:
            c = r[i + 1], h = r[i + 2], (c & 192) === 128 && (h & 192) === 128 && (d = (s & 15) << 12 | (c & 63) << 6 | h & 63, d > 2047 && (d < 55296 || d > 57343) && (o = d));
            break;
          case 4:
            c = r[i + 1], h = r[i + 2], l = r[i + 3], (c & 192) === 128 && (h & 192) === 128 && (l & 192) === 128 && (d = (s & 15) << 18 | (c & 63) << 12 | (h & 63) << 6 | l & 63, d > 65535 && d < 1114112 && (o = d));
        }
      }
      o === null ? (o = 65533, u = 1) : o > 65535 && (o -= 65536, n.push(o >>> 10 & 1023 | 55296), o = 56320 | o & 1023), n.push(o), i += u;
    }
    return Lo(n);
  }
  a(qn, "utf8Slice");
  var Mn = 4096;
  function Lo(r) {
    let e = r.length;
    if (e <= Mn) return String.fromCharCode.apply(String, r);
    let t = "", n = 0;
    for (; n < e; ) t += String.fromCharCode.apply(String, r.slice(n, n += Mn));
    return t;
  }
  a(Lo, "decodeCodePointsArray");
  function Ro(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let i = e; i < t; ++i) n += String.fromCharCode(r[i] & 127);
    return n;
  }
  a(Ro, "asciiSlice");
  function Fo(r, e, t) {
    let n = "";
    t = Math.min(r.length, t);
    for (let i = e; i < t; ++i) n += String.fromCharCode(r[i]);
    return n;
  }
  a(Fo, "latin1Slice");
  function Mo(r, e, t) {
    let n = r.length;
    (!e || e < 0) && (e = 0), (!t || t < 0 || t > n) && (t = n);
    let i = "";
    for (let s = e; s < t; ++s) i += Qo[r[s]];
    return i;
  }
  a(Mo, "hexSlice");
  function Do(r, e, t) {
    let n = r.slice(e, t), i = "";
    for (let s = 0; s < n.length - 1; s += 2) i += String.fromCharCode(n[s] + n[s + 1] * 256);
    return i;
  }
  a(Do, "utf16leSlice");
  f.prototype.slice = a(function(e, t) {
    let n = this.length;
    e = ~~e, t = t === void 0 ? n : ~~t, e < 0 ? (e += n, e < 0 && (e = 0)) : e > n && (e = n), t < 0 ? (t += n, t < 0 && (t = 0)) : t > n && (t = n), t < e && (t = e);
    let i = this.subarray(
      e,
      t
    );
    return Object.setPrototypeOf(i, f.prototype), i;
  }, "slice");
  function N(r, e, t) {
    if (r % 1 !== 0 || r < 0) throw new RangeError("offset is not uint");
    if (r + e > t) throw new RangeError(
      "Trying to access beyond buffer length"
    );
  }
  a(N, "checkOffset");
  f.prototype.readUintLE = f.prototype.readUIntLE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || N(e, t, this.length);
    let i = this[e], s = 1, o = 0;
    for (; ++o < t && (s *= 256); ) i += this[e + o] * s;
    return i;
  }, "readUIntLE");
  f.prototype.readUintBE = f.prototype.readUIntBE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || N(e, t, this.length);
    let i = this[e + --t], s = 1;
    for (; t > 0 && (s *= 256); ) i += this[e + --t] * s;
    return i;
  }, "readUIntBE");
  f.prototype.readUint8 = f.prototype.readUInt8 = a(function(e, t) {
    return e = e >>> 0, t || N(e, 1, this.length), this[e];
  }, "readUInt8");
  f.prototype.readUint16LE = f.prototype.readUInt16LE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 2, this.length), this[e] | this[e + 1] << 8;
  }, "readUInt16LE");
  f.prototype.readUint16BE = f.prototype.readUInt16BE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 2, this.length), this[e] << 8 | this[e + 1];
  }, "readUInt16BE");
  f.prototype.readUint32LE = f.prototype.readUInt32LE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216;
  }, "readUInt32LE");
  f.prototype.readUint32BE = f.prototype.readUInt32BE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 4, this.length), this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]);
  }, "readUInt32BE");
  f.prototype.readBigUInt64LE = me(a(function(e) {
    e = e >>> 0, Be(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && We(e, this.length - 8);
    let i = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24, s = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + n * 2 ** 24;
    return BigInt(i) + (BigInt(s) << BigInt(32));
  }, "readBigUInt64LE"));
  f.prototype.readBigUInt64BE = me(a(function(e) {
    e = e >>> 0, Be(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && We(e, this.length - 8);
    let i = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e], s = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n;
    return (BigInt(
      i
    ) << BigInt(32)) + BigInt(s);
  }, "readBigUInt64BE"));
  f.prototype.readIntLE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || N(e, t, this.length);
    let i = this[e], s = 1, o = 0;
    for (; ++o < t && (s *= 256); )
      i += this[e + o] * s;
    return s *= 128, i >= s && (i -= Math.pow(2, 8 * t)), i;
  }, "readIntLE");
  f.prototype.readIntBE = a(function(e, t, n) {
    e = e >>> 0, t = t >>> 0, n || N(e, t, this.length);
    let i = t, s = 1, o = this[e + --i];
    for (; i > 0 && (s *= 256); ) o += this[e + --i] * s;
    return s *= 128, o >= s && (o -= Math.pow(2, 8 * t)), o;
  }, "readIntBE");
  f.prototype.readInt8 = a(function(e, t) {
    return e = e >>> 0, t || N(e, 1, this.length), this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e];
  }, "readInt8");
  f.prototype.readInt16LE = a(function(e, t) {
    e = e >>> 0, t || N(e, 2, this.length);
    let n = this[e] | this[e + 1] << 8;
    return n & 32768 ? n | 4294901760 : n;
  }, "readInt16LE");
  f.prototype.readInt16BE = a(
    function(e, t) {
      e = e >>> 0, t || N(e, 2, this.length);
      let n = this[e + 1] | this[e] << 8;
      return n & 32768 ? n | 4294901760 : n;
    },
    "readInt16BE"
  );
  f.prototype.readInt32LE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24;
  }, "readInt32LE");
  f.prototype.readInt32BE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3];
  }, "readInt32BE");
  f.prototype.readBigInt64LE = me(a(function(e) {
    e = e >>> 0, Be(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && We(
      e,
      this.length - 8
    );
    let i = this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (n << 24);
    return (BigInt(
      i
    ) << BigInt(32)) + BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24);
  }, "readBigInt64LE"));
  f.prototype.readBigInt64BE = me(a(function(e) {
    e = e >>> 0, Be(e, "offset");
    let t = this[e], n = this[e + 7];
    (t === void 0 || n === void 0) && We(e, this.length - 8);
    let i = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
    return (BigInt(i) << BigInt(32)) + BigInt(
      this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + n
    );
  }, "readBigInt64BE"));
  f.prototype.readFloatLE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 4, this.length), Pe.read(
      this,
      e,
      true,
      23,
      4
    );
  }, "readFloatLE");
  f.prototype.readFloatBE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 4, this.length), Pe.read(this, e, false, 23, 4);
  }, "readFloatBE");
  f.prototype.readDoubleLE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 8, this.length), Pe.read(this, e, true, 52, 8);
  }, "readDoubleLE");
  f.prototype.readDoubleBE = a(function(e, t) {
    return e = e >>> 0, t || N(e, 8, this.length), Pe.read(this, e, false, 52, 8);
  }, "readDoubleBE");
  function Y(r, e, t, n, i, s) {
    if (!f.isBuffer(
      r
    )) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (e > i || e < s) throw new RangeError('"value" argument is out of bounds');
    if (t + n > r.length) throw new RangeError(
      "Index out of range"
    );
  }
  a(Y, "checkInt");
  f.prototype.writeUintLE = f.prototype.writeUIntLE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
      let u = Math.pow(2, 8 * n) - 1;
      Y(
        this,
        e,
        t,
        n,
        u,
        0
      );
    }
    let s = 1, o = 0;
    for (this[t] = e & 255; ++o < n && (s *= 256); ) this[t + o] = e / s & 255;
    return t + n;
  }, "writeUIntLE");
  f.prototype.writeUintBE = f.prototype.writeUIntBE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, n = n >>> 0, !i) {
      let u = Math.pow(2, 8 * n) - 1;
      Y(this, e, t, n, u, 0);
    }
    let s = n - 1, o = 1;
    for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) this[t + s] = e / o & 255;
    return t + n;
  }, "writeUIntBE");
  f.prototype.writeUint8 = f.prototype.writeUInt8 = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(this, e, t, 1, 255, 0), this[t] = e & 255, t + 1;
  }, "writeUInt8");
  f.prototype.writeUint16LE = f.prototype.writeUInt16LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(
      this,
      e,
      t,
      2,
      65535,
      0
    ), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, "writeUInt16LE");
  f.prototype.writeUint16BE = f.prototype.writeUInt16BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(
      this,
      e,
      t,
      2,
      65535,
      0
    ), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, "writeUInt16BE");
  f.prototype.writeUint32LE = f.prototype.writeUInt32LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(
      this,
      e,
      t,
      4,
      4294967295,
      0
    ), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = e & 255, t + 4;
  }, "writeUInt32LE");
  f.prototype.writeUint32BE = f.prototype.writeUInt32BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, "writeUInt32BE");
  function Qn(r, e, t, n, i) {
    $n(
      e,
      n,
      i,
      r,
      t,
      7
    );
    let s = Number(e & BigInt(4294967295));
    r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s, s = s >> 8, r[t++] = s;
    let o = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, o = o >> 8, r[t++] = o, t;
  }
  a(Qn, "wrtBigUInt64LE");
  function jn(r, e, t, n, i) {
    $n(e, n, i, r, t, 7);
    let s = Number(e & BigInt(4294967295));
    r[t + 7] = s, s = s >> 8, r[t + 6] = s, s = s >> 8, r[t + 5] = s, s = s >> 8, r[t + 4] = s;
    let o = Number(e >> BigInt(32) & BigInt(4294967295));
    return r[t + 3] = o, o = o >> 8, r[t + 2] = o, o = o >> 8, r[t + 1] = o, o = o >> 8, r[t] = o, t + 8;
  }
  a(jn, "wrtBigUInt64BE");
  f.prototype.writeBigUInt64LE = me(a(function(e, t = 0) {
    return Qn(this, e, t, BigInt(0), BigInt(
      "0xffffffffffffffff"
    ));
  }, "writeBigUInt64LE"));
  f.prototype.writeBigUInt64BE = me(a(function(e, t = 0) {
    return jn(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  }, "writeBigUInt64BE"));
  f.prototype.writeIntLE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, !i) {
      let c = Math.pow(
        2,
        8 * n - 1
      );
      Y(this, e, t, n, c - 1, -c);
    }
    let s = 0, o = 1, u = 0;
    for (this[t] = e & 255; ++s < n && (o *= 256); ) e < 0 && u === 0 && this[t + s - 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
    return t + n;
  }, "writeIntLE");
  f.prototype.writeIntBE = a(function(e, t, n, i) {
    if (e = +e, t = t >>> 0, !i) {
      let c = Math.pow(
        2,
        8 * n - 1
      );
      Y(this, e, t, n, c - 1, -c);
    }
    let s = n - 1, o = 1, u = 0;
    for (this[t + s] = e & 255; --s >= 0 && (o *= 256); ) e < 0 && u === 0 && this[t + s + 1] !== 0 && (u = 1), this[t + s] = (e / o >> 0) - u & 255;
    return t + n;
  }, "writeIntBE");
  f.prototype.writeInt8 = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(
      this,
      e,
      t,
      1,
      127,
      -128
    ), e < 0 && (e = 255 + e + 1), this[t] = e & 255, t + 1;
  }, "writeInt8");
  f.prototype.writeInt16LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(this, e, t, 2, 32767, -32768), this[t] = e & 255, this[t + 1] = e >>> 8, t + 2;
  }, "writeInt16LE");
  f.prototype.writeInt16BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = e & 255, t + 2;
  }, "writeInt16BE");
  f.prototype.writeInt32LE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(this, e, t, 4, 2147483647, -2147483648), this[t] = e & 255, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4;
  }, "writeInt32LE");
  f.prototype.writeInt32BE = a(function(e, t, n) {
    return e = +e, t = t >>> 0, n || Y(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = e & 255, t + 4;
  }, "writeInt32BE");
  f.prototype.writeBigInt64LE = me(a(function(e, t = 0) {
    return Qn(this, e, t, -BigInt(
      "0x8000000000000000"
    ), BigInt("0x7fffffffffffffff"));
  }, "writeBigInt64LE"));
  f.prototype.writeBigInt64BE = me(a(function(e, t = 0) {
    return jn(this, e, t, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
  }, "writeBigInt64BE"));
  function Wn(r, e, t, n, i, s) {
    if (t + n > r.length) throw new RangeError("Index out of range");
    if (t < 0) throw new RangeError(
      "Index out of range"
    );
  }
  a(Wn, "checkIEEE754");
  function Hn(r, e, t, n, i) {
    return e = +e, t = t >>> 0, i || Wn(r, e, t, 4, 34028234663852886e22, -34028234663852886e22), Pe.write(
      r,
      e,
      t,
      n,
      23,
      4
    ), t + 4;
  }
  a(Hn, "writeFloat");
  f.prototype.writeFloatLE = a(function(e, t, n) {
    return Hn(
      this,
      e,
      t,
      true,
      n
    );
  }, "writeFloatLE");
  f.prototype.writeFloatBE = a(function(e, t, n) {
    return Hn(
      this,
      e,
      t,
      false,
      n
    );
  }, "writeFloatBE");
  function Gn(r, e, t, n, i) {
    return e = +e, t = t >>> 0, i || Wn(
      r,
      e,
      t,
      8,
      17976931348623157e292,
      -17976931348623157e292
    ), Pe.write(r, e, t, n, 52, 8), t + 8;
  }
  a(Gn, "writeDouble");
  f.prototype.writeDoubleLE = a(function(e, t, n) {
    return Gn(
      this,
      e,
      t,
      true,
      n
    );
  }, "writeDoubleLE");
  f.prototype.writeDoubleBE = a(function(e, t, n) {
    return Gn(
      this,
      e,
      t,
      false,
      n
    );
  }, "writeDoubleBE");
  f.prototype.copy = a(function(e, t, n, i) {
    if (!f.isBuffer(
      e
    )) throw new TypeError("argument should be a Buffer");
    if (n || (n = 0), !i && i !== 0 && (i = this.length), t >= e.length && (t = e.length), t || (t = 0), i > 0 && i < n && (i = n), i === n || e.length === 0 || this.length === 0) return 0;
    if (t < 0) throw new RangeError("targetStart out of bounds");
    if (n < 0 || n >= this.length) throw new RangeError("Index out of range");
    if (i < 0) throw new RangeError(
      "sourceEnd out of bounds"
    );
    i > this.length && (i = this.length), e.length - t < i - n && (i = e.length - t + n);
    let s = i - n;
    return this === e && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(t, n, i) : Uint8Array.prototype.set.call(e, this.subarray(n, i), t), s;
  }, "copy");
  f.prototype.fill = a(function(e, t, n, i) {
    if (typeof e == "string") {
      if (typeof t == "string" ? (i = t, t = 0, n = this.length) : typeof n == "string" && (i = n, n = this.length), i !== void 0 && typeof i != "string") throw new TypeError("encoding must be a string");
      if (typeof i == "string" && !f.isEncoding(i)) throw new TypeError("Unknown encoding: " + i);
      if (e.length === 1) {
        let o = e.charCodeAt(0);
        (i === "utf8" && o < 128 || i === "latin1") && (e = o);
      }
    } else typeof e == "number" ? e = e & 255 : typeof e == "boolean" && (e = Number(e));
    if (t < 0 || this.length < t || this.length < n) throw new RangeError("Out of range index");
    if (n <= t) return this;
    t = t >>> 0, n = n === void 0 ? this.length : n >>> 0, e || (e = 0);
    let s;
    if (typeof e == "number") for (s = t; s < n; ++s)
      this[s] = e;
    else {
      let o = f.isBuffer(e) ? e : f.from(e, i), u = o.length;
      if (u === 0) throw new TypeError(
        'The value "' + e + '" is invalid for argument "value"'
      );
      for (s = 0; s < n - t; ++s) this[s + t] = o[s % u];
    }
    return this;
  }, "fill");
  var Ie = {};
  function qt(r, e, t) {
    var n;
    Ie[r] = (n = class extends t {
      constructor() {
        super(), Object.defineProperty(this, "message", {
          value: e.apply(this, arguments),
          writable: true,
          configurable: true
        }), this.name = `${this.name} [${r}]`, this.stack, delete this.name;
      }
      get code() {
        return r;
      }
      set code(s) {
        Object.defineProperty(this, "code", {
          configurable: true,
          enumerable: true,
          value: s,
          writable: true
        });
      }
      toString() {
        return `${this.name} [${r}]: ${this.message}`;
      }
    }, a(n, "NodeError"), n);
  }
  a(qt, "E");
  qt("ERR_BUFFER_OUT_OF_BOUNDS", function(r) {
    return r ? `${r} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
  }, RangeError);
  qt("ERR_INVALID_ARG_TYPE", function(r, e) {
    return `The "${r}" argument must be of type number. Received type ${typeof e}`;
  }, TypeError);
  qt("ERR_OUT_OF_RANGE", function(r, e, t) {
    let n = `The value of "${r}" is out of range.`, i = t;
    return Number.isInteger(t) && Math.abs(t) > 2 ** 32 ? i = Dn(String(t)) : typeof t == "bigint" && (i = String(t), (t > BigInt(2) ** BigInt(32) || t < -(BigInt(2) ** BigInt(32))) && (i = Dn(i)), i += "n"), n += ` It must be ${e}. Received ${i}`, n;
  }, RangeError);
  function Dn(r) {
    let e = "", t = r.length, n = r[0] === "-" ? 1 : 0;
    for (; t >= n + 4; t -= 3) e = `_${r.slice(t - 3, t)}${e}`;
    return `${r.slice(
      0,
      t
    )}${e}`;
  }
  a(Dn, "addNumericalSeparator");
  function ko(r, e, t) {
    Be(e, "offset"), (r[e] === void 0 || r[e + t] === void 0) && We(e, r.length - (t + 1));
  }
  a(ko, "checkBounds");
  function $n(r, e, t, n, i, s) {
    if (r > t || r < e) {
      let o = typeof e == "bigint" ? "n" : "", u;
      throw s > 3 ? e === 0 || e === BigInt(0) ? u = `>= 0${o} and < 2${o} ** ${(s + 1) * 8}${o}` : u = `>= -(2${o} ** ${(s + 1) * 8 - 1}${o}) and < 2 ** ${(s + 1) * 8 - 1}${o}` : u = `>= ${e}${o} and <= ${t}${o}`, new Ie.ERR_OUT_OF_RANGE(
        "value",
        u,
        r
      );
    }
    ko(n, i, s);
  }
  a($n, "checkIntBI");
  function Be(r, e) {
    if (typeof r != "number")
      throw new Ie.ERR_INVALID_ARG_TYPE(e, "number", r);
  }
  a(Be, "validateNumber");
  function We(r, e, t) {
    throw Math.floor(r) !== r ? (Be(r, t), new Ie.ERR_OUT_OF_RANGE(
      t || "offset",
      "an integer",
      r
    )) : e < 0 ? new Ie.ERR_BUFFER_OUT_OF_BOUNDS() : new Ie.ERR_OUT_OF_RANGE(t || "offset", `>= ${t ? 1 : 0} and <= ${e}`, r);
  }
  a(We, "boundsError");
  var Uo = /[^+/0-9A-Za-z-_]/g;
  function Oo(r) {
    if (r = r.split("=")[0], r = r.trim().replace(Uo, ""), r.length < 2) return "";
    for (; r.length % 4 !== 0; ) r = r + "=";
    return r;
  }
  a(Oo, "base64clean");
  function Ut(r, e) {
    e = e || 1 / 0;
    let t, n = r.length, i = null, s = [];
    for (let o = 0; o < n; ++o) {
      if (t = r.charCodeAt(o), t > 55295 && t < 57344) {
        if (!i) {
          if (t > 56319) {
            (e -= 3) > -1 && s.push(239, 191, 189);
            continue;
          } else if (o + 1 === n) {
            (e -= 3) > -1 && s.push(239, 191, 189);
            continue;
          }
          i = t;
          continue;
        }
        if (t < 56320) {
          (e -= 3) > -1 && s.push(
            239,
            191,
            189
          ), i = t;
          continue;
        }
        t = (i - 55296 << 10 | t - 56320) + 65536;
      } else i && (e -= 3) > -1 && s.push(
        239,
        191,
        189
      );
      if (i = null, t < 128) {
        if ((e -= 1) < 0) break;
        s.push(t);
      } else if (t < 2048) {
        if ((e -= 2) < 0) break;
        s.push(t >> 6 | 192, t & 63 | 128);
      } else if (t < 65536) {
        if ((e -= 3) < 0) break;
        s.push(t >> 12 | 224, t >> 6 & 63 | 128, t & 63 | 128);
      } else if (t < 1114112) {
        if ((e -= 4) < 0) break;
        s.push(t >> 18 | 240, t >> 12 & 63 | 128, t >> 6 & 63 | 128, t & 63 | 128);
      } else throw new Error("Invalid code point");
    }
    return s;
  }
  a(
    Ut,
    "utf8ToBytes"
  );
  function No(r) {
    let e = [];
    for (let t = 0; t < r.length; ++t) e.push(r.charCodeAt(
      t
    ) & 255);
    return e;
  }
  a(No, "asciiToBytes");
  function qo(r, e) {
    let t, n, i, s = [];
    for (let o = 0; o < r.length && !((e -= 2) < 0); ++o) t = r.charCodeAt(o), n = t >> 8, i = t % 256, s.push(i), s.push(n);
    return s;
  }
  a(qo, "utf16leToBytes");
  function Vn(r) {
    return Mt.toByteArray(Oo(r));
  }
  a(Vn, "base64ToBytes");
  function at(r, e, t, n) {
    let i;
    for (i = 0; i < n && !(i + t >= e.length || i >= r.length); ++i)
      e[i + t] = r[i];
    return i;
  }
  a(at, "blitBuffer");
  function ue(r, e) {
    return r instanceof e || r != null && r.constructor != null && r.constructor.name != null && r.constructor.name === e.name;
  }
  a(ue, "isInstance");
  function Qt(r) {
    return r !== r;
  }
  a(Qt, "numberIsNaN");
  var Qo = (function() {
    let r = "0123456789abcdef", e = new Array(256);
    for (let t = 0; t < 16; ++t) {
      let n = t * 16;
      for (let i = 0; i < 16; ++i) e[n + i] = r[t] + r[i];
    }
    return e;
  })();
  function me(r) {
    return typeof BigInt > "u" ? jo : r;
  }
  a(me, "defineBigIntMethod");
  function jo() {
    throw new Error("BigInt not supported");
  }
  a(jo, "BufferBigIntNotDefined");
});
var S;
var x;
var E;
var w;
var y;
var m;
var p = z(() => {
  "use strict";
  S = globalThis, x = globalThis.setImmediate ?? ((r) => setTimeout(
    r,
    0
  )), E = globalThis.clearImmediate ?? ((r) => clearTimeout(r)), w = globalThis.crypto ?? {};
  w.subtle ?? (w.subtle = {});
  y = typeof globalThis.Buffer == "function" && typeof globalThis.Buffer.allocUnsafe == "function" ? globalThis.Buffer : Kn().Buffer, m = globalThis.process ?? {};
  m.env ?? (m.env = {});
  try {
    m.nextTick(() => {
    });
  } catch {
    let e = Promise.resolve();
    m.nextTick = e.then.bind(e);
  }
});
var ge = I((nh, jt) => {
  "use strict";
  p();
  var Re = typeof Reflect == "object" ? Reflect : null, zn = Re && typeof Re.apply == "function" ? Re.apply : a(function(e, t, n) {
    return Function.prototype.apply.call(e, t, n);
  }, "ReflectApply"), ut;
  Re && typeof Re.ownKeys == "function" ? ut = Re.ownKeys : Object.getOwnPropertySymbols ? ut = a(function(e) {
    return Object.getOwnPropertyNames(
      e
    ).concat(Object.getOwnPropertySymbols(e));
  }, "ReflectOwnKeys") : ut = a(function(e) {
    return Object.getOwnPropertyNames(e);
  }, "ReflectOwnKeys");
  function Wo(r) {
    console && console.warn && console.warn(r);
  }
  a(Wo, "ProcessEmitWarning");
  var Zn = Number.isNaN || a(function(e) {
    return e !== e;
  }, "NumberIsNaN");
  function L() {
    L.init.call(this);
  }
  a(L, "EventEmitter");
  jt.exports = L;
  jt.exports.once = Vo;
  L.EventEmitter = L;
  L.prototype._events = void 0;
  L.prototype._eventsCount = 0;
  L.prototype._maxListeners = void 0;
  var Yn = 10;
  function ct(r) {
    if (typeof r != "function") throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof r);
  }
  a(ct, "checkListener");
  Object.defineProperty(L, "defaultMaxListeners", { enumerable: true, get: a(function() {
    return Yn;
  }, "get"), set: a(function(r) {
    if (typeof r != "number" || r < 0 || Zn(r)) throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + r + ".");
    Yn = r;
  }, "set") });
  L.init = function() {
    (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
  };
  L.prototype.setMaxListeners = a(
    function(e) {
      if (typeof e != "number" || e < 0 || Zn(e)) throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
      return this._maxListeners = e, this;
    },
    "setMaxListeners"
  );
  function Jn(r) {
    return r._maxListeners === void 0 ? L.defaultMaxListeners : r._maxListeners;
  }
  a(Jn, "_getMaxListeners");
  L.prototype.getMaxListeners = a(function() {
    return Jn(this);
  }, "getMaxListeners");
  L.prototype.emit = a(function(e) {
    for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
    var i = e === "error", s = this._events;
    if (s !== void 0) i = i && s.error === void 0;
    else if (!i) return false;
    if (i) {
      var o;
      if (t.length > 0 && (o = t[0]), o instanceof Error) throw o;
      var u = new Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
      throw u.context = o, u;
    }
    var c = s[e];
    if (c === void 0) return false;
    if (typeof c == "function") zn(c, this, t);
    else for (var h = c.length, l = ni(c, h), n = 0; n < h; ++n) zn(
      l[n],
      this,
      t
    );
    return true;
  }, "emit");
  function Xn(r, e, t, n) {
    var i, s, o;
    if (ct(t), s = r._events, s === void 0 ? (s = r._events = /* @__PURE__ */ Object.create(null), r._eventsCount = 0) : (s.newListener !== void 0 && (r.emit(
      "newListener",
      e,
      t.listener ? t.listener : t
    ), s = r._events), o = s[e]), o === void 0) o = s[e] = t, ++r._eventsCount;
    else if (typeof o == "function" ? o = s[e] = n ? [t, o] : [o, t] : n ? o.unshift(
      t
    ) : o.push(t), i = Jn(r), i > 0 && o.length > i && !o.warned) {
      o.warned = true;
      var u = new Error("Possible EventEmitter memory leak detected. " + o.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
      u.name = "MaxListenersExceededWarning", u.emitter = r, u.type = e, u.count = o.length, Wo(u);
    }
    return r;
  }
  a(Xn, "_addListener");
  L.prototype.addListener = a(function(e, t) {
    return Xn(this, e, t, false);
  }, "addListener");
  L.prototype.on = L.prototype.addListener;
  L.prototype.prependListener = a(function(e, t) {
    return Xn(this, e, t, true);
  }, "prependListener");
  function Ho() {
    if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = true, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
  }
  a(
    Ho,
    "onceWrapper"
  );
  function ei(r, e, t) {
    var n = {
      fired: false,
      wrapFn: void 0,
      target: r,
      type: e,
      listener: t
    }, i = Ho.bind(n);
    return i.listener = t, n.wrapFn = i, i;
  }
  a(ei, "_onceWrap");
  L.prototype.once = a(function(e, t) {
    return ct(t), this.on(e, ei(this, e, t)), this;
  }, "once");
  L.prototype.prependOnceListener = a(function(e, t) {
    return ct(t), this.prependListener(e, ei(
      this,
      e,
      t
    )), this;
  }, "prependOnceListener");
  L.prototype.removeListener = a(
    function(e, t) {
      var n, i, s, o, u;
      if (ct(t), i = this._events, i === void 0) return this;
      if (n = i[e], n === void 0) return this;
      if (n === t || n.listener === t) --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, n.listener || t));
      else if (typeof n != "function") {
        for (s = -1, o = n.length - 1; o >= 0; o--) if (n[o] === t || n[o].listener === t) {
          u = n[o].listener, s = o;
          break;
        }
        if (s < 0) return this;
        s === 0 ? n.shift() : Go(n, s), n.length === 1 && (i[e] = n[0]), i.removeListener !== void 0 && this.emit("removeListener", e, u || t);
      }
      return this;
    },
    "removeListener"
  );
  L.prototype.off = L.prototype.removeListener;
  L.prototype.removeAllListeners = a(function(e) {
    var t, n, i;
    if (n = this._events, n === void 0) return this;
    if (n.removeListener === void 0) return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
    if (arguments.length === 0) {
      var s = Object.keys(n), o;
      for (i = 0; i < s.length; ++i) o = s[i], o !== "removeListener" && this.removeAllListeners(o);
      return this.removeAllListeners(
        "removeListener"
      ), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
    }
    if (t = n[e], typeof t == "function") this.removeListener(e, t);
    else if (t !== void 0) for (i = t.length - 1; i >= 0; i--) this.removeListener(e, t[i]);
    return this;
  }, "removeAllListeners");
  function ti(r, e, t) {
    var n = r._events;
    if (n === void 0) return [];
    var i = n[e];
    return i === void 0 ? [] : typeof i == "function" ? t ? [i.listener || i] : [i] : t ? $o(i) : ni(i, i.length);
  }
  a(ti, "_listeners");
  L.prototype.listeners = a(function(e) {
    return ti(this, e, true);
  }, "listeners");
  L.prototype.rawListeners = a(function(e) {
    return ti(this, e, false);
  }, "rawListeners");
  L.listenerCount = function(r, e) {
    return typeof r.listenerCount == "function" ? r.listenerCount(e) : ri.call(r, e);
  };
  L.prototype.listenerCount = ri;
  function ri(r) {
    var e = this._events;
    if (e !== void 0) {
      var t = e[r];
      if (typeof t == "function") return 1;
      if (t !== void 0) return t.length;
    }
    return 0;
  }
  a(ri, "listenerCount");
  L.prototype.eventNames = a(function() {
    return this._eventsCount > 0 ? ut(this._events) : [];
  }, "eventNames");
  function ni(r, e) {
    for (var t = new Array(e), n = 0; n < e; ++n) t[n] = r[n];
    return t;
  }
  a(ni, "arrayClone");
  function Go(r, e) {
    for (; e + 1 < r.length; e++) r[e] = r[e + 1];
    r.pop();
  }
  a(Go, "spliceOne");
  function $o(r) {
    for (var e = new Array(r.length), t = 0; t < e.length; ++t)
      e[t] = r[t].listener || r[t];
    return e;
  }
  a($o, "unwrapListeners");
  function Vo(r, e) {
    return new Promise(
      function(t, n) {
        function i(o) {
          r.removeListener(e, s), n(o);
        }
        a(i, "errorListener");
        function s() {
          typeof r.removeListener == "function" && r.removeListener("error", i), t([].slice.call(
            arguments
          ));
        }
        a(s, "resolver"), ii(r, e, s, { once: true }), e !== "error" && Ko(r, i, { once: true });
      }
    );
  }
  a(Vo, "once");
  function Ko(r, e, t) {
    typeof r.on == "function" && ii(r, "error", e, t);
  }
  a(
    Ko,
    "addErrorHandlerIfEventEmitter"
  );
  function ii(r, e, t, n) {
    if (typeof r.on == "function")
      n.once ? r.once(e, t) : r.on(e, t);
    else if (typeof r.addEventListener == "function") r.addEventListener(
      e,
      a(function i(s) {
        n.once && r.removeEventListener(e, i), t(s);
      }, "wrapListener")
    );
    else
      throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof r);
  }
  a(ii, "eventTargetAgnosticAddListener");
});
var He = {};
se(He, { default: () => zo });
var zo;
var Ge = z(() => {
  "use strict";
  p();
  zo = {};
});
function $e(r) {
  let e = 1779033703, t = 3144134277, n = 1013904242, i = 2773480762, s = 1359893119, o = 2600822924, u = 528734635, c = 1541459225, h = 0, l = 0, d = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ], b = a(
    (A, g) => A >>> g | A << 32 - g,
    "rrot"
  ), C = new Uint32Array(64), B = new Uint8Array(64), Q = a(() => {
    for (let R = 0, $ = 0; R < 16; R++, $ += 4) C[R] = B[$] << 24 | B[$ + 1] << 16 | B[$ + 2] << 8 | B[$ + 3];
    for (let R = 16; R < 64; R++) {
      let $ = b(C[R - 15], 7) ^ b(C[R - 15], 18) ^ C[R - 15] >>> 3, ce = b(C[R - 2], 17) ^ b(C[R - 2], 19) ^ C[R - 2] >>> 10;
      C[R] = C[R - 16] + $ + C[R - 7] + ce | 0;
    }
    let A = e, g = t, P = n, K = i, k = s, j = o, ee = u, oe = c;
    for (let R = 0; R < 64; R++) {
      let $ = b(
        k,
        6
      ) ^ b(k, 11) ^ b(k, 25), ce = k & j ^ ~k & ee, ye = oe + $ + ce + d[R] + C[R] | 0, Se = b(A, 2) ^ b(A, 13) ^ b(A, 22), je = A & g ^ A & P ^ g & P, he = Se + je | 0;
      oe = ee, ee = j, j = k, k = K + ye | 0, K = P, P = g, g = A, A = ye + he | 0;
    }
    e = e + A | 0, t = t + g | 0, n = n + P | 0, i = i + K | 0, s = s + k | 0, o = o + j | 0, u = u + ee | 0, c = c + oe | 0, l = 0;
  }, "process"), X = a((A) => {
    typeof A == "string" && (A = new TextEncoder().encode(A));
    for (let g = 0; g < A.length; g++) B[l++] = A[g], l === 64 && Q();
    h += A.length;
  }, "add"), de = a(() => {
    if (B[l++] = 128, l == 64 && Q(), l + 8 > 64) {
      for (; l < 64; ) B[l++] = 0;
      Q();
    }
    for (; l < 58; ) B[l++] = 0;
    let A = h * 8;
    B[l++] = A / 1099511627776 & 255, B[l++] = A / 4294967296 & 255, B[l++] = A >>> 24, B[l++] = A >>> 16 & 255, B[l++] = A >>> 8 & 255, B[l++] = A & 255, Q();
    let g = new Uint8Array(32);
    return g[0] = e >>> 24, g[1] = e >>> 16 & 255, g[2] = e >>> 8 & 255, g[3] = e & 255, g[4] = t >>> 24, g[5] = t >>> 16 & 255, g[6] = t >>> 8 & 255, g[7] = t & 255, g[8] = n >>> 24, g[9] = n >>> 16 & 255, g[10] = n >>> 8 & 255, g[11] = n & 255, g[12] = i >>> 24, g[13] = i >>> 16 & 255, g[14] = i >>> 8 & 255, g[15] = i & 255, g[16] = s >>> 24, g[17] = s >>> 16 & 255, g[18] = s >>> 8 & 255, g[19] = s & 255, g[20] = o >>> 24, g[21] = o >>> 16 & 255, g[22] = o >>> 8 & 255, g[23] = o & 255, g[24] = u >>> 24, g[25] = u >>> 16 & 255, g[26] = u >>> 8 & 255, g[27] = u & 255, g[28] = c >>> 24, g[29] = c >>> 16 & 255, g[30] = c >>> 8 & 255, g[31] = c & 255, g;
  }, "digest");
  return r === void 0 ? { add: X, digest: de } : (X(r), de());
}
var si = z(
  () => {
    "use strict";
    p();
    a($e, "sha256");
  }
);
var U;
var Ve;
var oi = z(() => {
  "use strict";
  p();
  U = class U2 {
    constructor() {
      _(
        this,
        "_dataLength",
        0
      );
      _(this, "_bufferLength", 0);
      _(this, "_state", new Int32Array(4));
      _(
        this,
        "_buffer",
        new ArrayBuffer(68)
      );
      _(this, "_buffer8");
      _(this, "_buffer32");
      this._buffer8 = new Uint8Array(
        this._buffer,
        0,
        68
      ), this._buffer32 = new Uint32Array(this._buffer, 0, 17), this.start();
    }
    static hashByteArray(e, t = false) {
      return this.onePassHasher.start().appendByteArray(e).end(t);
    }
    static hashStr(e, t = false) {
      return this.onePassHasher.start().appendStr(e).end(t);
    }
    static hashAsciiStr(e, t = false) {
      return this.onePassHasher.start().appendAsciiStr(e).end(t);
    }
    static _hex(e) {
      let t = U2.hexChars, n = U2.hexOut, i, s, o, u;
      for (u = 0; u < 4; u += 1) for (s = u * 8, i = e[u], o = 0; o < 8; o += 2) n[s + 1 + o] = t.charAt(i & 15), i >>>= 4, n[s + 0 + o] = t.charAt(i & 15), i >>>= 4;
      return n.join("");
    }
    static _md5cycle(e, t) {
      let n = e[0], i = e[1], s = e[2], o = e[3];
      n += (i & s | ~i & o) + t[0] - 680876936 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[1] - 389564586 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[2] + 606105819 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[3] - 1044525330 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[4] - 176418897 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[5] + 1200080426 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[6] - 1473231341 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[7] - 45705983 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[8] + 1770035416 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[9] - 1958414417 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[10] - 42063 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[11] - 1990404162 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & s | ~i & o) + t[12] + 1804603682 | 0, n = (n << 7 | n >>> 25) + i | 0, o += (n & i | ~n & s) + t[13] - 40341101 | 0, o = (o << 12 | o >>> 20) + n | 0, s += (o & n | ~o & i) + t[14] - 1502002290 | 0, s = (s << 17 | s >>> 15) + o | 0, i += (s & o | ~s & n) + t[15] + 1236535329 | 0, i = (i << 22 | i >>> 10) + s | 0, n += (i & o | s & ~o) + t[1] - 165796510 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[6] - 1069501632 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[11] + 643717713 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[0] - 373897302 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[5] - 701558691 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[10] + 38016083 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[15] - 660478335 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[4] - 405537848 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[9] + 568446438 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[14] - 1019803690 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[3] - 187363961 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[8] + 1163531501 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i & o | s & ~o) + t[13] - 1444681467 | 0, n = (n << 5 | n >>> 27) + i | 0, o += (n & s | i & ~s) + t[2] - 51403784 | 0, o = (o << 9 | o >>> 23) + n | 0, s += (o & i | n & ~i) + t[7] + 1735328473 | 0, s = (s << 14 | s >>> 18) + o | 0, i += (s & n | o & ~n) + t[12] - 1926607734 | 0, i = (i << 20 | i >>> 12) + s | 0, n += (i ^ s ^ o) + t[5] - 378558 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[8] - 2022574463 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[11] + 1839030562 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[14] - 35309556 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[1] - 1530992060 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[4] + 1272893353 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[7] - 155497632 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[10] - 1094730640 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[13] + 681279174 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[0] - 358537222 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[3] - 722521979 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[6] + 76029189 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (i ^ s ^ o) + t[9] - 640364487 | 0, n = (n << 4 | n >>> 28) + i | 0, o += (n ^ i ^ s) + t[12] - 421815835 | 0, o = (o << 11 | o >>> 21) + n | 0, s += (o ^ n ^ i) + t[15] + 530742520 | 0, s = (s << 16 | s >>> 16) + o | 0, i += (s ^ o ^ n) + t[2] - 995338651 | 0, i = (i << 23 | i >>> 9) + s | 0, n += (s ^ (i | ~o)) + t[0] - 198630844 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[7] + 1126891415 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[14] - 1416354905 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[5] - 57434055 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[12] + 1700485571 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[3] - 1894986606 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[10] - 1051523 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[1] - 2054922799 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[8] + 1873313359 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[15] - 30611744 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[6] - 1560198380 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[13] + 1309151649 | 0, i = (i << 21 | i >>> 11) + s | 0, n += (s ^ (i | ~o)) + t[4] - 145523070 | 0, n = (n << 6 | n >>> 26) + i | 0, o += (i ^ (n | ~s)) + t[11] - 1120210379 | 0, o = (o << 10 | o >>> 22) + n | 0, s += (n ^ (o | ~i)) + t[2] + 718787259 | 0, s = (s << 15 | s >>> 17) + o | 0, i += (o ^ (s | ~n)) + t[9] - 343485551 | 0, i = (i << 21 | i >>> 11) + s | 0, e[0] = n + e[0] | 0, e[1] = i + e[1] | 0, e[2] = s + e[2] | 0, e[3] = o + e[3] | 0;
    }
    start() {
      return this._dataLength = 0, this._bufferLength = 0, this._state.set(U2.stateIdentity), this;
    }
    appendStr(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o;
      for (o = 0; o < e.length; o += 1) {
        if (s = e.charCodeAt(o), s < 128) t[i++] = s;
        else if (s < 2048) t[i++] = (s >>> 6) + 192, t[i++] = s & 63 | 128;
        else if (s < 55296 || s > 56319) t[i++] = (s >>> 12) + 224, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
        else {
          if (s = (s - 55296) * 1024 + (e.charCodeAt(++o) - 56320) + 65536, s > 1114111) throw new Error("Unicode standard supports code points up to U+10FFFF");
          t[i++] = (s >>> 18) + 240, t[i++] = s >>> 12 & 63 | 128, t[i++] = s >>> 6 & 63 | 128, t[i++] = s & 63 | 128;
        }
        i >= 64 && (this._dataLength += 64, U2._md5cycle(this._state, n), i -= 64, n[0] = n[16]);
      }
      return this._bufferLength = i, this;
    }
    appendAsciiStr(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
      for (; ; ) {
        for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e.charCodeAt(o++);
        if (i < 64) break;
        this._dataLength += 64, U2._md5cycle(
          this._state,
          n
        ), i = 0;
      }
      return this._bufferLength = i, this;
    }
    appendByteArray(e) {
      let t = this._buffer8, n = this._buffer32, i = this._bufferLength, s, o = 0;
      for (; ; ) {
        for (s = Math.min(e.length - o, 64 - i); s--; ) t[i++] = e[o++];
        if (i < 64) break;
        this._dataLength += 64, U2._md5cycle(
          this._state,
          n
        ), i = 0;
      }
      return this._bufferLength = i, this;
    }
    getState() {
      let e = this._state;
      return { buffer: String.fromCharCode.apply(null, Array.from(this._buffer8)), buflen: this._bufferLength, length: this._dataLength, state: [e[0], e[1], e[2], e[3]] };
    }
    setState(e) {
      let t = e.buffer, n = e.state, i = this._state, s;
      for (this._dataLength = e.length, this._bufferLength = e.buflen, i[0] = n[0], i[1] = n[1], i[2] = n[2], i[3] = n[3], s = 0; s < t.length; s += 1) this._buffer8[s] = t.charCodeAt(s);
    }
    end(e = false) {
      let t = this._bufferLength, n = this._buffer8, i = this._buffer32, s = (t >> 2) + 1;
      this._dataLength += t;
      let o = this._dataLength * 8;
      if (n[t] = 128, n[t + 1] = n[t + 2] = n[t + 3] = 0, i.set(U2.buffer32Identity.subarray(s), s), t > 55 && (U2._md5cycle(this._state, i), i.set(U2.buffer32Identity)), o <= 4294967295)
        i[14] = o;
      else {
        let u = o.toString(16).match(/(.*?)(.{0,8})$/);
        if (u === null) return;
        let c = parseInt(
          u[2],
          16
        ), h = parseInt(u[1], 16) || 0;
        i[14] = c, i[15] = h;
      }
      return U2._md5cycle(this._state, i), e ? this._state : U2._hex(this._state);
    }
  };
  a(U, "Md5"), _(U, "stateIdentity", new Int32Array(
    [1732584193, -271733879, -1732584194, 271733878]
  )), _(U, "buffer32Identity", new Int32Array(
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  )), _(U, "hexChars", "0123456789abcdef"), _(U, "hexOut", []), _(U, "onePassHasher", new U());
  Ve = U;
});
var Wt = {};
se(Wt, { createHash: () => Zo, createHmac: () => Jo, randomBytes: () => Yo });
function Yo(r) {
  return w.getRandomValues(y.alloc(r));
}
function Zo(r) {
  if (r === "sha256") return { update: a(
    function(e) {
      return { digest: a(function() {
        return y.from($e(e));
      }, "digest") };
    },
    "update"
  ) };
  if (r === "md5") return { update: a(function(e) {
    return { digest: a(function() {
      return typeof e == "string" ? Ve.hashStr(e) : Ve.hashByteArray(e);
    }, "digest") };
  }, "update") };
  throw new Error(
    `Hash type '${r}' not supported`
  );
}
function Jo(r, e) {
  if (r !== "sha256") throw new Error(
    `Only sha256 is supported (requested: '${r}')`
  );
  return { update: a(function(t) {
    return {
      digest: a(function() {
        typeof e == "string" && (e = new TextEncoder().encode(e)), typeof t == "string" && (t = new TextEncoder().encode(t));
        let n = e.length;
        if (n > 64) e = $e(e);
        else if (n < 64) {
          let c = new Uint8Array(64);
          c.set(e), e = c;
        }
        let i = new Uint8Array(64), s = new Uint8Array(
          64
        );
        for (let c = 0; c < 64; c++) i[c] = 54 ^ e[c], s[c] = 92 ^ e[c];
        let o = new Uint8Array(t.length + 64);
        o.set(i, 0), o.set(t, 64);
        let u = new Uint8Array(96);
        return u.set(s, 0), u.set(
          $e(o),
          64
        ), y.from($e(u));
      }, "digest")
    };
  }, "update") };
}
var Ht = z(() => {
  "use strict";
  p();
  si();
  oi();
  a(Yo, "randomBytes");
  a(Zo, "createHash");
  a(Jo, "createHmac");
});
var $t = I((ai) => {
  "use strict";
  p();
  ai.parse = function(r, e) {
    return new Gt(r, e).parse();
  };
  var ht = class ht2 {
    constructor(e, t) {
      this.source = e, this.transform = t || Xo, this.position = 0, this.entries = [], this.recorded = [], this.dimension = 0;
    }
    isEof() {
      return this.position >= this.source.length;
    }
    nextCharacter() {
      var e = this.source[this.position++];
      return e === "\\" ? { value: this.source[this.position++], escaped: true } : { value: e, escaped: false };
    }
    record(e) {
      this.recorded.push(e);
    }
    newEntry(e) {
      var t;
      (this.recorded.length > 0 || e) && (t = this.recorded.join(""), t === "NULL" && !e && (t = null), t !== null && (t = this.transform(t)), this.entries.push(
        t
      ), this.recorded = []);
    }
    consumeDimensions() {
      if (this.source[0] === "[") for (; !this.isEof(); ) {
        var e = this.nextCharacter();
        if (e.value === "=") break;
      }
    }
    parse(e) {
      var t, n, i;
      for (this.consumeDimensions(); !this.isEof(); ) if (t = this.nextCharacter(), t.value === "{" && !i) this.dimension++, this.dimension > 1 && (n = new ht2(this.source.substr(this.position - 1), this.transform), this.entries.push(
        n.parse(true)
      ), this.position += n.position - 2);
      else if (t.value === "}" && !i) {
        if (this.dimension--, !this.dimension && (this.newEntry(), e)) return this.entries;
      } else t.value === '"' && !t.escaped ? (i && this.newEntry(true), i = !i) : t.value === "," && !i ? this.newEntry() : this.record(
        t.value
      );
      if (this.dimension !== 0) throw new Error("array dimension not balanced");
      return this.entries;
    }
  };
  a(ht, "ArrayParser");
  var Gt = ht;
  function Xo(r) {
    return r;
  }
  a(Xo, "identity");
});
var Vt = I((Sh, ui) => {
  p();
  var ea = $t();
  ui.exports = { create: a(function(r, e) {
    return { parse: a(
      function() {
        return ea.parse(r, e);
      },
      "parse"
    ) };
  }, "create") };
});
var li = I((vh, hi) => {
  "use strict";
  p();
  var ta = /(\d{1,})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})(\.\d{1,})?.*?( BC)?$/, ra = /^(\d{1,})-(\d{2})-(\d{2})( BC)?$/, na = /([Z+-])(\d{2})?:?(\d{2})?:?(\d{2})?/, ia = /^-?infinity$/;
  hi.exports = a(function(e) {
    if (ia.test(e)) return Number(e.replace("i", "I"));
    var t = ta.exec(e);
    if (!t) return sa(e) || null;
    var n = !!t[8], i = parseInt(t[1], 10);
    n && (i = ci(i));
    var s = parseInt(
      t[2],
      10
    ) - 1, o = t[3], u = parseInt(t[4], 10), c = parseInt(t[5], 10), h = parseInt(t[6], 10), l = t[7];
    l = l ? 1e3 * parseFloat(l) : 0;
    var d, b = oa(e);
    return b != null ? (d = new Date(Date.UTC(
      i,
      s,
      o,
      u,
      c,
      h,
      l
    )), Kt(i) && d.setUTCFullYear(i), b !== 0 && d.setTime(d.getTime() - b)) : (d = new Date(
      i,
      s,
      o,
      u,
      c,
      h,
      l
    ), Kt(i) && d.setFullYear(i)), d;
  }, "parseDate");
  function sa(r) {
    var e = ra.exec(r);
    if (e) {
      var t = parseInt(e[1], 10), n = !!e[4];
      n && (t = ci(t));
      var i = parseInt(
        e[2],
        10
      ) - 1, s = e[3], o = new Date(t, i, s);
      return Kt(t) && o.setFullYear(t), o;
    }
  }
  a(sa, "getDate");
  function oa(r) {
    if (r.endsWith("+00")) return 0;
    var e = na.exec(r.split(" ")[1]);
    if (e) {
      var t = e[1];
      if (t === "Z") return 0;
      var n = t === "-" ? -1 : 1, i = parseInt(e[2], 10) * 3600 + parseInt(
        e[3] || 0,
        10
      ) * 60 + parseInt(e[4] || 0, 10);
      return i * n * 1e3;
    }
  }
  a(oa, "timeZoneOffset");
  function ci(r) {
    return -(r - 1);
  }
  a(ci, "bcYearToNegativeYear");
  function Kt(r) {
    return r >= 0 && r < 100;
  }
  a(
    Kt,
    "is0To99"
  );
});
var pi = I((Ch, fi) => {
  p();
  fi.exports = ua;
  var aa = Object.prototype.hasOwnProperty;
  function ua(r) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var n in t) aa.call(
        t,
        n
      ) && (r[n] = t[n]);
    }
    return r;
  }
  a(ua, "extend");
});
var mi = I((Ph, yi) => {
  "use strict";
  p();
  var ca = pi();
  yi.exports = Fe;
  function Fe(r) {
    if (!(this instanceof Fe)) return new Fe(r);
    ca(this, xa(r));
  }
  a(Fe, "PostgresInterval");
  var ha = ["seconds", "minutes", "hours", "days", "months", "years"];
  Fe.prototype.toPostgres = function() {
    var r = ha.filter(this.hasOwnProperty, this);
    return this.milliseconds && r.indexOf("seconds") < 0 && r.push("seconds"), r.length === 0 ? "0" : r.map(function(e) {
      var t = this[e] || 0;
      return e === "seconds" && this.milliseconds && (t = (t + this.milliseconds / 1e3).toFixed(6).replace(
        /\.?0+$/,
        ""
      )), t + " " + e;
    }, this).join(" ");
  };
  var la = { years: "Y", months: "M", days: "D", hours: "H", minutes: "M", seconds: "S" }, fa = ["years", "months", "days"], pa = ["hours", "minutes", "seconds"];
  Fe.prototype.toISOString = Fe.prototype.toISO = function() {
    var r = fa.map(t, this).join(""), e = pa.map(t, this).join("");
    return "P" + r + "T" + e;
    function t(n) {
      var i = this[n] || 0;
      return n === "seconds" && this.milliseconds && (i = (i + this.milliseconds / 1e3).toFixed(6).replace(
        /0+$/,
        ""
      )), i + la[n];
    }
  };
  var zt = "([+-]?\\d+)", da = zt + "\\s+years?", ya = zt + "\\s+mons?", ma = zt + "\\s+days?", ga = "([+-])?([\\d]*):(\\d\\d):(\\d\\d)\\.?(\\d{1,6})?", wa = new RegExp([
    da,
    ya,
    ma,
    ga
  ].map(function(r) {
    return "(" + r + ")?";
  }).join("\\s*")), di = {
    years: 2,
    months: 4,
    days: 6,
    hours: 9,
    minutes: 10,
    seconds: 11,
    milliseconds: 12
  }, ba = ["hours", "minutes", "seconds", "milliseconds"];
  function Sa(r) {
    var e = r + "000000".slice(r.length);
    return parseInt(
      e,
      10
    ) / 1e3;
  }
  a(Sa, "parseMilliseconds");
  function xa(r) {
    if (!r) return {};
    var e = wa.exec(
      r
    ), t = e[8] === "-";
    return Object.keys(di).reduce(function(n, i) {
      var s = di[i], o = e[s];
      return !o || (o = i === "milliseconds" ? Sa(o) : parseInt(o, 10), !o) || (t && ~ba.indexOf(i) && (o *= -1), n[i] = o), n;
    }, {});
  }
  a(xa, "parse");
});
var wi = I((Rh, gi) => {
  "use strict";
  p();
  gi.exports = a(function(e) {
    if (/^\\x/.test(e)) return new y(
      e.substr(2),
      "hex"
    );
    for (var t = "", n = 0; n < e.length; ) if (e[n] !== "\\") t += e[n], ++n;
    else if (/[0-7]{3}/.test(e.substr(n + 1, 3))) t += String.fromCharCode(parseInt(e.substr(n + 1, 3), 8)), n += 4;
    else {
      for (var i = 1; n + i < e.length && e[n + i] === "\\"; ) i++;
      for (var s = 0; s < Math.floor(i / 2); ++s) t += "\\";
      n += Math.floor(i / 2) * 2;
    }
    return new y(t, "binary");
  }, "parseBytea");
});
var Ai = I((Dh, _i) => {
  p();
  var Ke = $t(), ze = Vt(), lt = li(), Si = mi(), xi = wi();
  function ft(r) {
    return a(function(t) {
      return t === null ? t : r(t);
    }, "nullAllowed");
  }
  a(ft, "allowNull");
  function Ei(r) {
    return r === null ? r : r === "TRUE" || r === "t" || r === "true" || r === "y" || r === "yes" || r === "on" || r === "1";
  }
  a(Ei, "parseBool");
  function Ea(r) {
    return r ? Ke.parse(r, Ei) : null;
  }
  a(Ea, "parseBoolArray");
  function va(r) {
    return parseInt(r, 10);
  }
  a(va, "parseBaseTenInt");
  function Yt(r) {
    return r ? Ke.parse(r, ft(va)) : null;
  }
  a(Yt, "parseIntegerArray");
  function _a(r) {
    return r ? Ke.parse(r, ft(function(e) {
      return vi(e).trim();
    })) : null;
  }
  a(_a, "parseBigIntegerArray");
  var Aa = a(function(r) {
    if (!r) return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = er(t)), t;
    });
    return e.parse();
  }, "parsePointArray"), Zt = a(function(r) {
    if (!r)
      return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = parseFloat(t)), t;
    });
    return e.parse();
  }, "parseFloatArray"), ne = a(function(r) {
    if (!r) return null;
    var e = ze.create(r);
    return e.parse();
  }, "parseStringArray"), Jt = a(function(r) {
    if (!r) return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = lt(t)), t;
    });
    return e.parse();
  }, "parseDateArray"), Ca = a(function(r) {
    if (!r) return null;
    var e = ze.create(r, function(t) {
      return t !== null && (t = Si(t)), t;
    });
    return e.parse();
  }, "parseIntervalArray"), Ta = a(function(r) {
    return r ? Ke.parse(r, ft(xi)) : null;
  }, "parseByteAArray"), Xt = a(function(r) {
    return parseInt(
      r,
      10
    );
  }, "parseInteger"), vi = a(function(r) {
    var e = String(r);
    return /^\d+$/.test(e) ? e : r;
  }, "parseBigInteger"), bi = a(
    function(r) {
      return r ? Ke.parse(r, ft(JSON.parse)) : null;
    },
    "parseJsonArray"
  ), er = a(function(r) {
    return r[0] !== "(" ? null : (r = r.substring(1, r.length - 1).split(","), { x: parseFloat(r[0]), y: parseFloat(r[1]) });
  }, "parsePoint"), Ia = a(function(r) {
    if (r[0] !== "<" && r[1] !== "(") return null;
    for (var e = "(", t = "", n = false, i = 2; i < r.length - 1; i++) {
      if (n || (e += r[i]), r[i] === ")") {
        n = true;
        continue;
      } else if (!n) continue;
      r[i] !== "," && (t += r[i]);
    }
    var s = er(e);
    return s.radius = parseFloat(t), s;
  }, "parseCircle"), Pa = a(function(r) {
    r(
      20,
      vi
    ), r(21, Xt), r(23, Xt), r(26, Xt), r(700, parseFloat), r(701, parseFloat), r(16, Ei), r(
      1082,
      lt
    ), r(1114, lt), r(1184, lt), r(600, er), r(651, ne), r(718, Ia), r(1e3, Ea), r(1001, Ta), r(
      1005,
      Yt
    ), r(1007, Yt), r(1028, Yt), r(1016, _a), r(1017, Aa), r(1021, Zt), r(1022, Zt), r(1231, Zt), r(1014, ne), r(1015, ne), r(1008, ne), r(1009, ne), r(1040, ne), r(1041, ne), r(1115, Jt), r(
      1182,
      Jt
    ), r(1185, Jt), r(1186, Si), r(1187, Ca), r(17, xi), r(114, JSON.parse.bind(JSON)), r(
      3802,
      JSON.parse.bind(JSON)
    ), r(199, bi), r(3807, bi), r(3907, ne), r(2951, ne), r(791, ne), r(
      1183,
      ne
    ), r(1270, ne);
  }, "init");
  _i.exports = { init: Pa };
});
var Ti = I((Oh, Ci) => {
  "use strict";
  p();
  var Z = 1e6;
  function Ba(r) {
    var e = r.readInt32BE(
      0
    ), t = r.readUInt32BE(4), n = "";
    e < 0 && (e = ~e + (t === 0), t = ~t + 1 >>> 0, n = "-");
    var i = "", s, o, u, c, h, l;
    {
      if (s = e % Z, e = e / Z >>> 0, o = 4294967296 * s + t, t = o / Z >>> 0, u = "" + (o - Z * t), t === 0 && e === 0) return n + u + i;
      for (c = "", h = 6 - u.length, l = 0; l < h; l++) c += "0";
      i = c + u + i;
    }
    {
      if (s = e % Z, e = e / Z >>> 0, o = 4294967296 * s + t, t = o / Z >>> 0, u = "" + (o - Z * t), t === 0 && e === 0) return n + u + i;
      for (c = "", h = 6 - u.length, l = 0; l < h; l++) c += "0";
      i = c + u + i;
    }
    {
      if (s = e % Z, e = e / Z >>> 0, o = 4294967296 * s + t, t = o / Z >>> 0, u = "" + (o - Z * t), t === 0 && e === 0) return n + u + i;
      for (c = "", h = 6 - u.length, l = 0; l < h; l++) c += "0";
      i = c + u + i;
    }
    return s = e % Z, o = 4294967296 * s + t, u = "" + o % Z, n + u + i;
  }
  a(Ba, "readInt8");
  Ci.exports = Ba;
});
var Ri = I((Qh, Li) => {
  p();
  var La = Ti(), F = a(function(r, e, t, n, i) {
    t = t || 0, n = n || false, i = i || function(C, B, Q) {
      return C * Math.pow(2, Q) + B;
    };
    var s = t >> 3, o = a(function(C) {
      return n ? ~C & 255 : C;
    }, "inv"), u = 255, c = 8 - t % 8;
    e < c && (u = 255 << 8 - e & 255, c = e), t && (u = u >> t % 8);
    var h = 0;
    t % 8 + e >= 8 && (h = i(0, o(r[s]) & u, c));
    for (var l = e + t >> 3, d = s + 1; d < l; d++) h = i(h, o(r[d]), 8);
    var b = (e + t) % 8;
    return b > 0 && (h = i(h, o(r[l]) >> 8 - b, b)), h;
  }, "parseBits"), Bi = a(function(r, e, t) {
    var n = Math.pow(2, t - 1) - 1, i = F(r, 1), s = F(r, t, 1);
    if (s === 0) return 0;
    var o = 1, u = a(function(h, l, d) {
      h === 0 && (h = 1);
      for (var b = 1; b <= d; b++) o /= 2, (l & 1 << d - b) > 0 && (h += o);
      return h;
    }, "parsePrecisionBits"), c = F(r, e, t + 1, false, u);
    return s == Math.pow(2, t + 1) - 1 ? c === 0 ? i === 0 ? 1 / 0 : -1 / 0 : NaN : (i === 0 ? 1 : -1) * Math.pow(2, s - n) * c;
  }, "parseFloatFromBits"), Ra = a(function(r) {
    return F(r, 1) == 1 ? -1 * (F(r, 15, 1, true) + 1) : F(r, 15, 1);
  }, "parseInt16"), Ii = a(function(r) {
    return F(r, 1) == 1 ? -1 * (F(
      r,
      31,
      1,
      true
    ) + 1) : F(r, 31, 1);
  }, "parseInt32"), Fa = a(function(r) {
    return Bi(r, 23, 8);
  }, "parseFloat32"), Ma = a(function(r) {
    return Bi(r, 52, 11);
  }, "parseFloat64"), Da = a(function(r) {
    var e = F(r, 16, 32);
    if (e == 49152) return NaN;
    for (var t = Math.pow(1e4, F(r, 16, 16)), n = 0, i = [], s = F(r, 16), o = 0; o < s; o++) n += F(r, 16, 64 + 16 * o) * t, t /= 1e4;
    var u = Math.pow(10, F(r, 16, 48));
    return (e === 0 ? 1 : -1) * Math.round(n * u) / u;
  }, "parseNumeric"), Pi = a(function(r, e) {
    var t = F(
      e,
      1
    ), n = F(e, 63, 1), i = new Date((t === 0 ? 1 : -1) * n / 1e3 + 9466848e5);
    return r || i.setTime(i.getTime() + i.getTimezoneOffset() * 6e4), i.usec = n % 1e3, i.getMicroSeconds = function() {
      return this.usec;
    }, i.setMicroSeconds = function(s) {
      this.usec = s;
    }, i.getUTCMicroSeconds = function() {
      return this.usec;
    }, i;
  }, "parseDate"), Ye = a(function(r) {
    for (var e = F(r, 32), t = F(r, 32, 32), n = F(r, 32, 64), i = 96, s = [], o = 0; o < e; o++) s[o] = F(r, 32, i), i += 32, i += 32;
    var u = a(function(h) {
      var l = F(r, 32, i);
      if (i += 32, l == 4294967295) return null;
      var d;
      if (h == 23 || h == 20) return d = F(r, l * 8, i), i += l * 8, d;
      if (h == 25) return d = r.toString(this.encoding, i >> 3, (i += l << 3) >> 3), d;
      console.log("ERROR: ElementType not implemented: " + h);
    }, "parseElement"), c = a(function(h, l) {
      var d = [], b;
      if (h.length > 1) {
        var C = h.shift();
        for (b = 0; b < C; b++) d[b] = c(h, l);
        h.unshift(
          C
        );
      } else for (b = 0; b < h[0]; b++) d[b] = u(l);
      return d;
    }, "parse");
    return c(s, n);
  }, "parseArray"), ka = a(function(r) {
    return r.toString("utf8");
  }, "parseText"), Ua = a(function(r) {
    return r === null ? null : F(r, 8) > 0;
  }, "parseBool"), Oa = a(function(r) {
    r(20, La), r(21, Ra), r(23, Ii), r(
      26,
      Ii
    ), r(1700, Da), r(700, Fa), r(701, Ma), r(16, Ua), r(1114, Pi.bind(null, false)), r(1184, Pi.bind(
      null,
      true
    )), r(1e3, Ye), r(1007, Ye), r(1016, Ye), r(1008, Ye), r(1009, Ye), r(25, ka);
  }, "init");
  Li.exports = { init: Oa };
});
var Mi = I((Hh, Fi) => {
  p();
  Fi.exports = {
    BOOL: 16,
    BYTEA: 17,
    CHAR: 18,
    INT8: 20,
    INT2: 21,
    INT4: 23,
    REGPROC: 24,
    TEXT: 25,
    OID: 26,
    TID: 27,
    XID: 28,
    CID: 29,
    JSON: 114,
    XML: 142,
    PG_NODE_TREE: 194,
    SMGR: 210,
    PATH: 602,
    POLYGON: 604,
    CIDR: 650,
    FLOAT4: 700,
    FLOAT8: 701,
    ABSTIME: 702,
    RELTIME: 703,
    TINTERVAL: 704,
    CIRCLE: 718,
    MACADDR8: 774,
    MONEY: 790,
    MACADDR: 829,
    INET: 869,
    ACLITEM: 1033,
    BPCHAR: 1042,
    VARCHAR: 1043,
    DATE: 1082,
    TIME: 1083,
    TIMESTAMP: 1114,
    TIMESTAMPTZ: 1184,
    INTERVAL: 1186,
    TIMETZ: 1266,
    BIT: 1560,
    VARBIT: 1562,
    NUMERIC: 1700,
    REFCURSOR: 1790,
    REGPROCEDURE: 2202,
    REGOPER: 2203,
    REGOPERATOR: 2204,
    REGCLASS: 2205,
    REGTYPE: 2206,
    UUID: 2950,
    TXID_SNAPSHOT: 2970,
    PG_LSN: 3220,
    PG_NDISTINCT: 3361,
    PG_DEPENDENCIES: 3402,
    TSVECTOR: 3614,
    TSQUERY: 3615,
    GTSVECTOR: 3642,
    REGCONFIG: 3734,
    REGDICTIONARY: 3769,
    JSONB: 3802,
    REGNAMESPACE: 4089,
    REGROLE: 4096
  };
});
var Xe = I((Je) => {
  p();
  var Na = Ai(), qa = Ri(), Qa = Vt(), ja = Mi();
  Je.getTypeParser = Wa;
  Je.setTypeParser = Ha;
  Je.arrayParser = Qa;
  Je.builtins = ja;
  var Ze = { text: {}, binary: {} };
  function Di(r) {
    return String(
      r
    );
  }
  a(Di, "noParse");
  function Wa(r, e) {
    return e = e || "text", Ze[e] && Ze[e][r] || Di;
  }
  a(
    Wa,
    "getTypeParser"
  );
  function Ha(r, e, t) {
    typeof e == "function" && (t = e, e = "text"), Ze[e][r] = t;
  }
  a(Ha, "setTypeParser");
  Na.init(function(r, e) {
    Ze.text[r] = e;
  });
  qa.init(function(r, e) {
    Ze.binary[r] = e;
  });
});
var et = I((zh, tr) => {
  "use strict";
  p();
  tr.exports = {
    host: "localhost",
    user: m.platform === "win32" ? m.env.USERNAME : m.env.USER,
    database: void 0,
    password: null,
    connectionString: void 0,
    port: 5432,
    rows: 0,
    binary: false,
    max: 10,
    idleTimeoutMillis: 3e4,
    client_encoding: "",
    ssl: false,
    application_name: void 0,
    fallback_application_name: void 0,
    options: void 0,
    parseInputDatesAsUTC: false,
    statement_timeout: false,
    lock_timeout: false,
    idle_in_transaction_session_timeout: false,
    query_timeout: false,
    connect_timeout: 0,
    keepalives: 1,
    keepalives_idle: 0
  };
  var Me = Xe(), Ga = Me.getTypeParser(
    20,
    "text"
  ), $a = Me.getTypeParser(1016, "text");
  tr.exports.__defineSetter__("parseInt8", function(r) {
    Me.setTypeParser(20, "text", r ? Me.getTypeParser(23, "text") : Ga), Me.setTypeParser(1016, "text", r ? Me.getTypeParser(1007, "text") : $a);
  });
});
var tt = I((Zh, Ui) => {
  "use strict";
  p();
  var Va = (Ht(), O(Wt)), Ka = et();
  function za(r) {
    var e = r.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    return '"' + e + '"';
  }
  a(za, "escapeElement");
  function ki(r) {
    for (var e = "{", t = 0; t < r.length; t++) t > 0 && (e = e + ","), r[t] === null || typeof r[t] > "u" ? e = e + "NULL" : Array.isArray(r[t]) ? e = e + ki(r[t]) : r[t] instanceof y ? e += "\\\\x" + r[t].toString("hex") : e += za(pt(r[t]));
    return e = e + "}", e;
  }
  a(ki, "arrayString");
  var pt = a(function(r, e) {
    if (r == null) return null;
    if (r instanceof y) return r;
    if (ArrayBuffer.isView(r)) {
      var t = y.from(r.buffer, r.byteOffset, r.byteLength);
      return t.length === r.byteLength ? t : t.slice(
        r.byteOffset,
        r.byteOffset + r.byteLength
      );
    }
    return r instanceof Date ? Ka.parseInputDatesAsUTC ? Ja(r) : Za(r) : Array.isArray(r) ? ki(r) : typeof r == "object" ? Ya(r, e) : r.toString();
  }, "prepareValue");
  function Ya(r, e) {
    if (r && typeof r.toPostgres == "function") {
      if (e = e || [], e.indexOf(r) !== -1) throw new Error('circular reference detected while preparing "' + r + '" for query');
      return e.push(r), pt(r.toPostgres(pt), e);
    }
    return JSON.stringify(r);
  }
  a(Ya, "prepareObject");
  function G(r, e) {
    for (r = "" + r; r.length < e; ) r = "0" + r;
    return r;
  }
  a(
    G,
    "pad"
  );
  function Za(r) {
    var e = -r.getTimezoneOffset(), t = r.getFullYear(), n = t < 1;
    n && (t = Math.abs(t) + 1);
    var i = G(t, 4) + "-" + G(r.getMonth() + 1, 2) + "-" + G(r.getDate(), 2) + "T" + G(r.getHours(), 2) + ":" + G(r.getMinutes(), 2) + ":" + G(r.getSeconds(), 2) + "." + G(
      r.getMilliseconds(),
      3
    );
    return e < 0 ? (i += "-", e *= -1) : i += "+", i += G(Math.floor(e / 60), 2) + ":" + G(e % 60, 2), n && (i += " BC"), i;
  }
  a(Za, "dateToString");
  function Ja(r) {
    var e = r.getUTCFullYear(), t = e < 1;
    t && (e = Math.abs(e) + 1);
    var n = G(e, 4) + "-" + G(r.getUTCMonth() + 1, 2) + "-" + G(r.getUTCDate(), 2) + "T" + G(r.getUTCHours(), 2) + ":" + G(r.getUTCMinutes(), 2) + ":" + G(r.getUTCSeconds(), 2) + "." + G(r.getUTCMilliseconds(), 3);
    return n += "+00:00", t && (n += " BC"), n;
  }
  a(Ja, "dateToStringUTC");
  function Xa(r, e, t) {
    return r = typeof r == "string" ? { text: r } : r, e && (typeof e == "function" ? r.callback = e : r.values = e), t && (r.callback = t), r;
  }
  a(Xa, "normalizeQueryConfig");
  var rr = a(function(r) {
    return Va.createHash("md5").update(r, "utf-8").digest("hex");
  }, "md5"), eu = a(function(r, e, t) {
    var n = rr(e + r), i = rr(y.concat([y.from(n), t]));
    return "md5" + i;
  }, "postgresMd5PasswordHash");
  Ui.exports = { prepareValue: a(function(e) {
    return pt(
      e
    );
  }, "prepareValueWrapper"), normalizeQueryConfig: Xa, postgresMd5PasswordHash: eu, md5: rr };
});
var ji = I((el, Qi) => {
  "use strict";
  p();
  var nr = (Ht(), O(Wt));
  function tu(r) {
    if (r.indexOf(
      "SCRAM-SHA-256"
    ) === -1) throw new Error("SASL: Only mechanism SCRAM-SHA-256 is currently supported");
    let e = nr.randomBytes(18).toString("base64");
    return { mechanism: "SCRAM-SHA-256", clientNonce: e, response: "n,,n=*,r=" + e, message: "SASLInitialResponse" };
  }
  a(tu, "startSession");
  function ru(r, e, t) {
    if (r.message !== "SASLInitialResponse") throw new Error(
      "SASL: Last message was not SASLInitialResponse"
    );
    if (typeof e != "string") throw new Error(
      "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string"
    );
    if (typeof t != "string") throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: serverData must be a string");
    let n = su(t);
    if (n.nonce.startsWith(r.clientNonce)) {
      if (n.nonce.length === r.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce");
    var i = y.from(n.salt, "base64"), s = uu(
      e,
      i,
      n.iteration
    ), o = De(s, "Client Key"), u = au(o), c = "n=*,r=" + r.clientNonce, h = "r=" + n.nonce + ",s=" + n.salt + ",i=" + n.iteration, l = "c=biws,r=" + n.nonce, d = c + "," + h + "," + l, b = De(u, d), C = qi(
      o,
      b
    ), B = C.toString("base64"), Q = De(s, "Server Key"), X = De(Q, d);
    r.message = "SASLResponse", r.serverSignature = X.toString("base64"), r.response = l + ",p=" + B;
  }
  a(ru, "continueSession");
  function nu(r, e) {
    if (r.message !== "SASLResponse") throw new Error("SASL: Last message was not SASLResponse");
    if (typeof e != "string") throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: serverData must be a string");
    let { serverSignature: t } = ou(
      e
    );
    if (t !== r.serverSignature) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature does not match");
  }
  a(nu, "finalizeSession");
  function iu(r) {
    if (typeof r != "string") throw new TypeError("SASL: text must be a string");
    return r.split("").map(
      (e, t) => r.charCodeAt(t)
    ).every((e) => e >= 33 && e <= 43 || e >= 45 && e <= 126);
  }
  a(iu, "isPrintableChars");
  function Oi(r) {
    return /^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(r);
  }
  a(Oi, "isBase64");
  function Ni(r) {
    if (typeof r != "string") throw new TypeError(
      "SASL: attribute pairs text must be a string"
    );
    return new Map(r.split(",").map((e) => {
      if (!/^.=/.test(e)) throw new Error("SASL: Invalid attribute pair entry");
      let t = e[0], n = e.substring(2);
      return [t, n];
    }));
  }
  a(Ni, "parseAttributePairs");
  function su(r) {
    let e = Ni(
      r
    ), t = e.get("r");
    if (t) {
      if (!iu(t)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce must only contain printable characters");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing");
    let n = e.get("s");
    if (n) {
      if (!Oi(n)) throw new Error(
        "SASL: SCRAM-SERVER-FIRST-MESSAGE: salt must be base64"
      );
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing");
    let i = e.get("i");
    if (i) {
      if (!/^[1-9][0-9]*$/.test(i)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: invalid iteration count");
    } else throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: iteration missing");
    let s = parseInt(i, 10);
    return { nonce: t, salt: n, iteration: s };
  }
  a(su, "parseServerFirstMessage");
  function ou(r) {
    let t = Ni(r).get("v");
    if (t) {
      if (!Oi(t)) throw new Error("SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature must be base64");
    } else throw new Error(
      "SASL: SCRAM-SERVER-FINAL-MESSAGE: server signature is missing"
    );
    return { serverSignature: t };
  }
  a(ou, "parseServerFinalMessage");
  function qi(r, e) {
    if (!y.isBuffer(r)) throw new TypeError(
      "first argument must be a Buffer"
    );
    if (!y.isBuffer(e)) throw new TypeError("second argument must be a Buffer");
    if (r.length !== e.length) throw new Error("Buffer lengths must match");
    if (r.length === 0) throw new Error("Buffers cannot be empty");
    return y.from(r.map((t, n) => r[n] ^ e[n]));
  }
  a(qi, "xorBuffers");
  function au(r) {
    return nr.createHash(
      "sha256"
    ).update(r).digest();
  }
  a(au, "sha256");
  function De(r, e) {
    return nr.createHmac(
      "sha256",
      r
    ).update(e).digest();
  }
  a(De, "hmacSha256");
  function uu(r, e, t) {
    for (var n = De(
      r,
      y.concat([e, y.from([0, 0, 0, 1])])
    ), i = n, s = 0; s < t - 1; s++) n = De(r, n), i = qi(i, n);
    return i;
  }
  a(uu, "Hi");
  Qi.exports = { startSession: tu, continueSession: ru, finalizeSession: nu };
});
var ir = {};
se(ir, { join: () => cu });
function cu(...r) {
  return r.join("/");
}
var sr = z(() => {
  "use strict";
  p();
  a(cu, "join");
});
var or = {};
se(or, { stat: () => hu });
function hu(r, e) {
  e(new Error("No filesystem"));
}
var ar = z(
  () => {
    "use strict";
    p();
    a(hu, "stat");
  }
);
var ur = {};
se(ur, { default: () => lu });
var lu;
var cr = z(() => {
  "use strict";
  p();
  lu = {};
});
var Wi = {};
se(Wi, { StringDecoder: () => hr });
var lr;
var hr;
var Hi = z(() => {
  "use strict";
  p();
  lr = class lr {
    constructor(e) {
      _(this, "td");
      this.td = new TextDecoder(e);
    }
    write(e) {
      return this.td.decode(e, { stream: true });
    }
    end(e) {
      return this.td.decode(e);
    }
  };
  a(lr, "StringDecoder");
  hr = lr;
});
var Ki = I((hl, Vi) => {
  "use strict";
  p();
  var { Transform: fu } = (cr(), O(ur)), { StringDecoder: pu } = (Hi(), O(Wi)), we = /* @__PURE__ */ Symbol("last"), dt = /* @__PURE__ */ Symbol("decoder");
  function du(r, e, t) {
    let n;
    if (this.overflow) {
      if (n = this[dt].write(r).split(this.matcher), n.length === 1) return t();
      n.shift(), this.overflow = false;
    } else this[we] += this[dt].write(r), n = this[we].split(this.matcher);
    this[we] = n.pop();
    for (let i = 0; i < n.length; i++) try {
      $i(this, this.mapper(n[i]));
    } catch (s) {
      return t(
        s
      );
    }
    if (this.overflow = this[we].length > this.maxLength, this.overflow && !this.skipOverflow) {
      t(new Error("maximum buffer reached"));
      return;
    }
    t();
  }
  a(du, "transform");
  function yu(r) {
    if (this[we] += this[dt].end(), this[we]) try {
      $i(this, this.mapper(this[we]));
    } catch (e) {
      return r(e);
    }
    r();
  }
  a(yu, "flush");
  function $i(r, e) {
    e !== void 0 && r.push(e);
  }
  a($i, "push");
  function Gi(r) {
    return r;
  }
  a(Gi, "noop");
  function mu(r, e, t) {
    switch (r = r || /\r?\n/, e = e || Gi, t = t || {}, arguments.length) {
      case 1:
        typeof r == "function" ? (e = r, r = /\r?\n/) : typeof r == "object" && !(r instanceof RegExp) && !r[Symbol.split] && (t = r, r = /\r?\n/);
        break;
      case 2:
        typeof r == "function" ? (t = e, e = r, r = /\r?\n/) : typeof e == "object" && (t = e, e = Gi);
    }
    t = Object.assign({}, t), t.autoDestroy = true, t.transform = du, t.flush = yu, t.readableObjectMode = true;
    let n = new fu(t);
    return n[we] = "", n[dt] = new pu("utf8"), n.matcher = r, n.mapper = e, n.maxLength = t.maxLength, n.skipOverflow = t.skipOverflow || false, n.overflow = false, n._destroy = function(i, s) {
      this._writableState.errorEmitted = false, s(i);
    }, n;
  }
  a(mu, "split");
  Vi.exports = mu;
});
var Zi = I((pl, fe) => {
  "use strict";
  p();
  var zi = (sr(), O(ir)), gu = (cr(), O(ur)).Stream, wu = Ki(), Yi = (Ge(), O(He)), bu = 5432, yt = m.platform === "win32", rt = m.stderr, Su = 56, xu = 7, Eu = 61440, vu = 32768;
  function _u(r) {
    return (r & Eu) == vu;
  }
  a(_u, "isRegFile");
  var ke = [
    "host",
    "port",
    "database",
    "user",
    "password"
  ], fr = ke.length, Au = ke[fr - 1];
  function pr() {
    var r = rt instanceof gu && rt.writable === true;
    if (r) {
      var e = Array.prototype.slice.call(arguments).concat(`
`);
      rt.write(Yi.format.apply(Yi, e));
    }
  }
  a(pr, "warn");
  Object.defineProperty(
    fe.exports,
    "isWin",
    { get: a(function() {
      return yt;
    }, "get"), set: a(function(r) {
      yt = r;
    }, "set") }
  );
  fe.exports.warnTo = function(r) {
    var e = rt;
    return rt = r, e;
  };
  fe.exports.getFileName = function(r) {
    var e = r || m.env, t = e.PGPASSFILE || (yt ? zi.join(e.APPDATA || "./", "postgresql", "pgpass.conf") : zi.join(e.HOME || "./", ".pgpass"));
    return t;
  };
  fe.exports.usePgPass = function(r, e) {
    return Object.prototype.hasOwnProperty.call(m.env, "PGPASSWORD") ? false : yt ? true : (e = e || "<unkn>", _u(r.mode) ? r.mode & (Su | xu) ? (pr('WARNING: password file "%s" has group or world access; permissions should be u=rw (0600) or less', e), false) : true : (pr('WARNING: password file "%s" is not a plain file', e), false));
  };
  var Cu = fe.exports.match = function(r, e) {
    return ke.slice(0, -1).reduce(function(t, n, i) {
      return i == 1 && Number(r[n] || bu) === Number(
        e[n]
      ) ? t && true : t && (e[n] === "*" || e[n] === r[n]);
    }, true);
  };
  fe.exports.getPassword = function(r, e, t) {
    var n, i = e.pipe(wu());
    function s(c) {
      var h = Tu(c);
      h && Iu(h) && Cu(r, h) && (n = h[Au], i.end());
    }
    a(s, "onLine");
    var o = a(function() {
      e.destroy(), t(n);
    }, "onEnd"), u = a(function(c) {
      e.destroy(), pr("WARNING: error on reading file: %s", c), t(void 0);
    }, "onErr");
    e.on("error", u), i.on("data", s).on("end", o).on("error", u);
  };
  var Tu = fe.exports.parseLine = function(r) {
    if (r.length < 11 || r.match(/^\s+#/)) return null;
    for (var e = "", t = "", n = 0, i = 0, s = 0, o = {}, u = false, c = a(function(l, d, b) {
      var C = r.substring(d, b);
      Object.hasOwnProperty.call(
        m.env,
        "PGPASS_NO_DEESCAPE"
      ) || (C = C.replace(/\\([:\\])/g, "$1")), o[ke[l]] = C;
    }, "addToObj"), h = 0; h < r.length - 1; h += 1) {
      if (e = r.charAt(h + 1), t = r.charAt(h), u = n == fr - 1, u) {
        c(n, i);
        break;
      }
      h >= 0 && e == ":" && t !== "\\" && (c(n, i, h + 1), i = h + 2, n += 1);
    }
    return o = Object.keys(o).length === fr ? o : null, o;
  }, Iu = fe.exports.isValidEntry = function(r) {
    for (var e = { 0: function(o) {
      return o.length > 0;
    }, 1: function(o) {
      return o === "*" ? true : (o = Number(o), isFinite(o) && o > 0 && o < 9007199254740992 && Math.floor(o) === o);
    }, 2: function(o) {
      return o.length > 0;
    }, 3: function(o) {
      return o.length > 0;
    }, 4: function(o) {
      return o.length > 0;
    } }, t = 0; t < ke.length; t += 1) {
      var n = e[t], i = r[ke[t]] || "", s = n(i);
      if (!s) return false;
    }
    return true;
  };
});
var Xi = I((gl, dr) => {
  "use strict";
  p();
  var ml = (sr(), O(ir)), Ji = (ar(), O(or)), mt = Zi();
  dr.exports = function(r, e) {
    var t = mt.getFileName();
    Ji.stat(t, function(n, i) {
      if (n || !mt.usePgPass(i, t)) return e(void 0);
      var s = Ji.createReadStream(t);
      mt.getPassword(
        r,
        s,
        e
      );
    });
  };
  dr.exports.warnTo = mt.warnTo;
});
var wt = I((bl, es) => {
  "use strict";
  p();
  var Pu = Xe();
  function gt(r) {
    this._types = r || Pu, this.text = {}, this.binary = {};
  }
  a(gt, "TypeOverrides");
  gt.prototype.getOverrides = function(r) {
    switch (r) {
      case "text":
        return this.text;
      case "binary":
        return this.binary;
      default:
        return {};
    }
  };
  gt.prototype.setTypeParser = function(r, e, t) {
    typeof e == "function" && (t = e, e = "text"), this.getOverrides(e)[r] = t;
  };
  gt.prototype.getTypeParser = function(r, e) {
    return e = e || "text", this.getOverrides(e)[r] || this._types.getTypeParser(r, e);
  };
  es.exports = gt;
});
var ts = {};
se(ts, { default: () => Bu });
var Bu;
var rs = z(() => {
  "use strict";
  p();
  Bu = {};
});
var ns = {};
se(ns, { parse: () => yr });
function yr(r, e = false) {
  let { protocol: t } = new URL(r), n = "http:" + r.substring(t.length), {
    username: i,
    password: s,
    host: o,
    hostname: u,
    port: c,
    pathname: h,
    search: l,
    searchParams: d,
    hash: b
  } = new URL(n);
  s = decodeURIComponent(s), i = decodeURIComponent(
    i
  ), h = decodeURIComponent(h);
  let C = i + ":" + s, B = e ? Object.fromEntries(d.entries()) : l;
  return {
    href: r,
    protocol: t,
    auth: C,
    username: i,
    password: s,
    host: o,
    hostname: u,
    port: c,
    pathname: h,
    search: l,
    query: B,
    hash: b
  };
}
var mr = z(() => {
  "use strict";
  p();
  a(yr, "parse");
});
var ss = I((Al, is) => {
  "use strict";
  p();
  var Lu = (mr(), O(ns)), gr = (ar(), O(or));
  function wr(r) {
    if (r.charAt(0) === "/") {
      var t = r.split(" ");
      return { host: t[0], database: t[1] };
    }
    var e = Lu.parse(/ |%[^a-f0-9]|%[a-f0-9][^a-f0-9]/i.test(r) ? encodeURI(r).replace(
      /\%25(\d\d)/g,
      "%$1"
    ) : r, true), t = e.query;
    for (var n in t) Array.isArray(t[n]) && (t[n] = t[n][t[n].length - 1]);
    var i = (e.auth || ":").split(":");
    if (t.user = i[0], t.password = i.splice(1).join(":"), t.port = e.port, e.protocol == "socket:") return t.host = decodeURI(e.pathname), t.database = e.query.db, t.client_encoding = e.query.encoding, t;
    t.host || (t.host = e.hostname);
    var s = e.pathname;
    if (!t.host && s && /^%2f/i.test(s)) {
      var o = s.split("/");
      t.host = decodeURIComponent(
        o[0]
      ), s = o.splice(1).join("/");
    }
    switch (s && s.charAt(0) === "/" && (s = s.slice(1) || null), t.database = s && decodeURI(s), (t.ssl === "true" || t.ssl === "1") && (t.ssl = true), t.ssl === "0" && (t.ssl = false), (t.sslcert || t.sslkey || t.sslrootcert || t.sslmode) && (t.ssl = {}), t.sslcert && (t.ssl.cert = gr.readFileSync(t.sslcert).toString()), t.sslkey && (t.ssl.key = gr.readFileSync(
      t.sslkey
    ).toString()), t.sslrootcert && (t.ssl.ca = gr.readFileSync(t.sslrootcert).toString()), t.sslmode) {
      case "disable": {
        t.ssl = false;
        break;
      }
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full":
        break;
      case "no-verify": {
        t.ssl.rejectUnauthorized = false;
        break;
      }
    }
    return t;
  }
  a(wr, "parse");
  is.exports = wr;
  wr.parse = wr;
});
var bt = I((Il, us) => {
  "use strict";
  p();
  var Ru = (rs(), O(ts)), as = et(), os = ss().parse, V = a(
    function(r, e, t) {
      return t === void 0 ? t = m.env["PG" + r.toUpperCase()] : t === false || (t = m.env[t]), e[r] || t || as[r];
    },
    "val"
  ), Fu = a(function() {
    switch (m.env.PGSSLMODE) {
      case "disable":
        return false;
      case "prefer":
      case "require":
      case "verify-ca":
      case "verify-full":
        return true;
      case "no-verify":
        return { rejectUnauthorized: false };
    }
    return as.ssl;
  }, "readSSLConfigFromEnvironment"), Ue = a(
    function(r) {
      return "'" + ("" + r).replace(/\\/g, "\\\\").replace(/'/g, "\\'") + "'";
    },
    "quoteParamValue"
  ), ie = a(function(r, e, t) {
    var n = e[t];
    n != null && r.push(t + "=" + Ue(n));
  }, "add"), Sr = class Sr {
    constructor(e) {
      e = typeof e == "string" ? os(e) : e || {}, e.connectionString && (e = Object.assign({}, e, os(e.connectionString))), this.user = V("user", e), this.database = V("database", e), this.database === void 0 && (this.database = this.user), this.port = parseInt(
        V("port", e),
        10
      ), this.host = V("host", e), Object.defineProperty(this, "password", {
        configurable: true,
        enumerable: false,
        writable: true,
        value: V("password", e)
      }), this.binary = V("binary", e), this.options = V("options", e), this.ssl = typeof e.ssl > "u" ? Fu() : e.ssl, typeof this.ssl == "string" && this.ssl === "true" && (this.ssl = true), this.ssl === "no-verify" && (this.ssl = { rejectUnauthorized: false }), this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this.client_encoding = V("client_encoding", e), this.replication = V("replication", e), this.isDomainSocket = !(this.host || "").indexOf("/"), this.application_name = V("application_name", e, "PGAPPNAME"), this.fallback_application_name = V("fallback_application_name", e, false), this.statement_timeout = V("statement_timeout", e, false), this.lock_timeout = V(
        "lock_timeout",
        e,
        false
      ), this.idle_in_transaction_session_timeout = V("idle_in_transaction_session_timeout", e, false), this.query_timeout = V("query_timeout", e, false), e.connectionTimeoutMillis === void 0 ? this.connect_timeout = m.env.PGCONNECT_TIMEOUT || 0 : this.connect_timeout = Math.floor(e.connectionTimeoutMillis / 1e3), e.keepAlive === false ? this.keepalives = 0 : e.keepAlive === true && (this.keepalives = 1), typeof e.keepAliveInitialDelayMillis == "number" && (this.keepalives_idle = Math.floor(e.keepAliveInitialDelayMillis / 1e3));
    }
    getLibpqConnectionString(e) {
      var t = [];
      ie(t, this, "user"), ie(t, this, "password"), ie(t, this, "port"), ie(t, this, "application_name"), ie(t, this, "fallback_application_name"), ie(t, this, "connect_timeout"), ie(
        t,
        this,
        "options"
      );
      var n = typeof this.ssl == "object" ? this.ssl : this.ssl ? { sslmode: this.ssl } : {};
      if (ie(t, n, "sslmode"), ie(t, n, "sslca"), ie(t, n, "sslkey"), ie(t, n, "sslcert"), ie(t, n, "sslrootcert"), this.database && t.push("dbname=" + Ue(this.database)), this.replication && t.push("replication=" + Ue(this.replication)), this.host && t.push("host=" + Ue(this.host)), this.isDomainSocket) return e(null, t.join(" "));
      this.client_encoding && t.push("client_encoding=" + Ue(this.client_encoding)), Ru.lookup(this.host, function(i, s) {
        return i ? e(i, null) : (t.push("hostaddr=" + Ue(s)), e(null, t.join(" ")));
      });
    }
  };
  a(Sr, "ConnectionParameters");
  var br = Sr;
  us.exports = br;
});
var ls = I((Ll, hs) => {
  "use strict";
  p();
  var Mu = Xe(), cs = /^([A-Za-z]+)(?: (\d+))?(?: (\d+))?/, Er = class Er {
    constructor(e, t) {
      this.command = null, this.rowCount = null, this.oid = null, this.rows = [], this.fields = [], this._parsers = void 0, this._types = t, this.RowCtor = null, this.rowAsArray = e === "array", this.rowAsArray && (this.parseRow = this._parseRowAsArray);
    }
    addCommandComplete(e) {
      var t;
      e.text ? t = cs.exec(e.text) : t = cs.exec(e.command), t && (this.command = t[1], t[3] ? (this.oid = parseInt(t[2], 10), this.rowCount = parseInt(t[3], 10)) : t[2] && (this.rowCount = parseInt(
        t[2],
        10
      )));
    }
    _parseRowAsArray(e) {
      for (var t = new Array(e.length), n = 0, i = e.length; n < i; n++) {
        var s = e[n];
        s !== null ? t[n] = this._parsers[n](s) : t[n] = null;
      }
      return t;
    }
    parseRow(e) {
      for (var t = {}, n = 0, i = e.length; n < i; n++) {
        var s = e[n], o = this.fields[n].name;
        s !== null ? t[o] = this._parsers[n](
          s
        ) : t[o] = null;
      }
      return t;
    }
    addRow(e) {
      this.rows.push(e);
    }
    addFields(e) {
      this.fields = e, this.fields.length && (this._parsers = new Array(e.length));
      for (var t = 0; t < e.length; t++) {
        var n = e[t];
        this._types ? this._parsers[t] = this._types.getTypeParser(n.dataTypeID, n.format || "text") : this._parsers[t] = Mu.getTypeParser(n.dataTypeID, n.format || "text");
      }
    }
  };
  a(Er, "Result");
  var xr = Er;
  hs.exports = xr;
});
var ys = I((Ml, ds) => {
  "use strict";
  p();
  var { EventEmitter: Du } = ge(), fs = ls(), ps = tt(), _r = class _r extends Du {
    constructor(e, t, n) {
      super(), e = ps.normalizeQueryConfig(e, t, n), this.text = e.text, this.values = e.values, this.rows = e.rows, this.types = e.types, this.name = e.name, this.binary = e.binary, this.portal = e.portal || "", this.callback = e.callback, this._rowMode = e.rowMode, m.domain && e.callback && (this.callback = m.domain.bind(e.callback)), this._result = new fs(this._rowMode, this.types), this._results = this._result, this.isPreparedStatement = false, this._canceledDueToError = false, this._promise = null;
    }
    requiresPreparation() {
      return this.name || this.rows ? true : !this.text || !this.values ? false : this.values.length > 0;
    }
    _checkForMultirow() {
      this._result.command && (Array.isArray(this._results) || (this._results = [this._result]), this._result = new fs(
        this._rowMode,
        this.types
      ), this._results.push(this._result));
    }
    handleRowDescription(e) {
      this._checkForMultirow(), this._result.addFields(e.fields), this._accumulateRows = this.callback || !this.listeners("row").length;
    }
    handleDataRow(e) {
      let t;
      if (!this._canceledDueToError) {
        try {
          t = this._result.parseRow(e.fields);
        } catch (n) {
          this._canceledDueToError = n;
          return;
        }
        this.emit("row", t, this._result), this._accumulateRows && this._result.addRow(t);
      }
    }
    handleCommandComplete(e, t) {
      this._checkForMultirow(), this._result.addCommandComplete(e), this.rows && t.sync();
    }
    handleEmptyQuery(e) {
      this.rows && e.sync();
    }
    handleError(e, t) {
      if (this._canceledDueToError && (e = this._canceledDueToError, this._canceledDueToError = false), this.callback) return this.callback(e);
      this.emit("error", e);
    }
    handleReadyForQuery(e) {
      if (this._canceledDueToError) return this.handleError(
        this._canceledDueToError,
        e
      );
      if (this.callback) try {
        this.callback(null, this._results);
      } catch (t) {
        m.nextTick(() => {
          throw t;
        });
      }
      this.emit("end", this._results);
    }
    submit(e) {
      if (typeof this.text != "string" && typeof this.name != "string") return new Error("A query must have either text or a name. Supplying neither is unsupported.");
      let t = e.parsedStatements[this.name];
      return this.text && t && this.text !== t ? new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`) : this.values && !Array.isArray(this.values) ? new Error("Query values must be an array") : (this.requiresPreparation() ? this.prepare(e) : e.query(this.text), null);
    }
    hasBeenParsed(e) {
      return this.name && e.parsedStatements[this.name];
    }
    handlePortalSuspended(e) {
      this._getRows(e, this.rows);
    }
    _getRows(e, t) {
      e.execute(
        { portal: this.portal, rows: t }
      ), t ? e.flush() : e.sync();
    }
    prepare(e) {
      this.isPreparedStatement = true, this.hasBeenParsed(e) || e.parse({ text: this.text, name: this.name, types: this.types });
      try {
        e.bind({ portal: this.portal, statement: this.name, values: this.values, binary: this.binary, valueMapper: ps.prepareValue });
      } catch (t) {
        this.handleError(t, e);
        return;
      }
      e.describe(
        { type: "P", name: this.portal || "" }
      ), this._getRows(e, this.rows);
    }
    handleCopyInResponse(e) {
      e.sendCopyFail("No source stream defined");
    }
    handleCopyData(e, t) {
    }
  };
  a(_r, "Query");
  var vr = _r;
  ds.exports = vr;
});
var ws = {};
se(ws, { Socket: () => _e, isIP: () => ku });
function ku(r) {
  return 0;
}
var gs;
var ms;
var v;
var _e;
var St = z(() => {
  "use strict";
  p();
  gs = Te(ge(), 1);
  a(ku, "isIP");
  ms = /^[^.]+\./, v = class v2 extends gs.EventEmitter {
    constructor() {
      super(...arguments);
      _(this, "opts", {});
      _(this, "connecting", false);
      _(this, "pending", true);
      _(this, "writable", true);
      _(this, "encrypted", false);
      _(this, "authorized", false);
      _(this, "destroyed", false);
      _(this, "ws", null);
      _(this, "writeBuffer");
      _(this, "tlsState", 0);
      _(
        this,
        "tlsRead"
      );
      _(this, "tlsWrite");
    }
    static get poolQueryViaFetch() {
      return v2.opts.poolQueryViaFetch ?? v2.defaults.poolQueryViaFetch;
    }
    static set poolQueryViaFetch(t) {
      v2.opts.poolQueryViaFetch = t;
    }
    static get fetchEndpoint() {
      return v2.opts.fetchEndpoint ?? v2.defaults.fetchEndpoint;
    }
    static set fetchEndpoint(t) {
      v2.opts.fetchEndpoint = t;
    }
    static get fetchConnectionCache() {
      return true;
    }
    static set fetchConnectionCache(t) {
      console.warn("The `fetchConnectionCache` option is deprecated (now always `true`)");
    }
    static get fetchFunction() {
      return v2.opts.fetchFunction ?? v2.defaults.fetchFunction;
    }
    static set fetchFunction(t) {
      v2.opts.fetchFunction = t;
    }
    static get webSocketConstructor() {
      return v2.opts.webSocketConstructor ?? v2.defaults.webSocketConstructor;
    }
    static set webSocketConstructor(t) {
      v2.opts.webSocketConstructor = t;
    }
    get webSocketConstructor() {
      return this.opts.webSocketConstructor ?? v2.webSocketConstructor;
    }
    set webSocketConstructor(t) {
      this.opts.webSocketConstructor = t;
    }
    static get wsProxy() {
      return v2.opts.wsProxy ?? v2.defaults.wsProxy;
    }
    static set wsProxy(t) {
      v2.opts.wsProxy = t;
    }
    get wsProxy() {
      return this.opts.wsProxy ?? v2.wsProxy;
    }
    set wsProxy(t) {
      this.opts.wsProxy = t;
    }
    static get coalesceWrites() {
      return v2.opts.coalesceWrites ?? v2.defaults.coalesceWrites;
    }
    static set coalesceWrites(t) {
      v2.opts.coalesceWrites = t;
    }
    get coalesceWrites() {
      return this.opts.coalesceWrites ?? v2.coalesceWrites;
    }
    set coalesceWrites(t) {
      this.opts.coalesceWrites = t;
    }
    static get useSecureWebSocket() {
      return v2.opts.useSecureWebSocket ?? v2.defaults.useSecureWebSocket;
    }
    static set useSecureWebSocket(t) {
      v2.opts.useSecureWebSocket = t;
    }
    get useSecureWebSocket() {
      return this.opts.useSecureWebSocket ?? v2.useSecureWebSocket;
    }
    set useSecureWebSocket(t) {
      this.opts.useSecureWebSocket = t;
    }
    static get forceDisablePgSSL() {
      return v2.opts.forceDisablePgSSL ?? v2.defaults.forceDisablePgSSL;
    }
    static set forceDisablePgSSL(t) {
      v2.opts.forceDisablePgSSL = t;
    }
    get forceDisablePgSSL() {
      return this.opts.forceDisablePgSSL ?? v2.forceDisablePgSSL;
    }
    set forceDisablePgSSL(t) {
      this.opts.forceDisablePgSSL = t;
    }
    static get disableSNI() {
      return v2.opts.disableSNI ?? v2.defaults.disableSNI;
    }
    static set disableSNI(t) {
      v2.opts.disableSNI = t;
    }
    get disableSNI() {
      return this.opts.disableSNI ?? v2.disableSNI;
    }
    set disableSNI(t) {
      this.opts.disableSNI = t;
    }
    static get pipelineConnect() {
      return v2.opts.pipelineConnect ?? v2.defaults.pipelineConnect;
    }
    static set pipelineConnect(t) {
      v2.opts.pipelineConnect = t;
    }
    get pipelineConnect() {
      return this.opts.pipelineConnect ?? v2.pipelineConnect;
    }
    set pipelineConnect(t) {
      this.opts.pipelineConnect = t;
    }
    static get subtls() {
      return v2.opts.subtls ?? v2.defaults.subtls;
    }
    static set subtls(t) {
      v2.opts.subtls = t;
    }
    get subtls() {
      return this.opts.subtls ?? v2.subtls;
    }
    set subtls(t) {
      this.opts.subtls = t;
    }
    static get pipelineTLS() {
      return v2.opts.pipelineTLS ?? v2.defaults.pipelineTLS;
    }
    static set pipelineTLS(t) {
      v2.opts.pipelineTLS = t;
    }
    get pipelineTLS() {
      return this.opts.pipelineTLS ?? v2.pipelineTLS;
    }
    set pipelineTLS(t) {
      this.opts.pipelineTLS = t;
    }
    static get rootCerts() {
      return v2.opts.rootCerts ?? v2.defaults.rootCerts;
    }
    static set rootCerts(t) {
      v2.opts.rootCerts = t;
    }
    get rootCerts() {
      return this.opts.rootCerts ?? v2.rootCerts;
    }
    set rootCerts(t) {
      this.opts.rootCerts = t;
    }
    wsProxyAddrForHost(t, n) {
      let i = this.wsProxy;
      if (i === void 0) throw new Error("No WebSocket proxy is configured. Please see https://github.com/neondatabase/serverless/blob/main/CONFIG.md#wsproxy-string--host-string-port-number--string--string");
      return typeof i == "function" ? i(t, n) : `${i}?address=${t}:${n}`;
    }
    setNoDelay() {
      return this;
    }
    setKeepAlive() {
      return this;
    }
    ref() {
      return this;
    }
    unref() {
      return this;
    }
    connect(t, n, i) {
      this.connecting = true, i && this.once("connect", i);
      let s = a(() => {
        this.connecting = false, this.pending = false, this.emit("connect"), this.emit("ready");
      }, "handleWebSocketOpen"), o = a((c, h = false) => {
        c.binaryType = "arraybuffer", c.addEventListener("error", (l) => {
          this.emit("error", l), this.emit("close");
        }), c.addEventListener("message", (l) => {
          if (this.tlsState === 0) {
            let d = y.from(l.data);
            this.emit(
              "data",
              d
            );
          }
        }), c.addEventListener("close", () => {
          this.emit("close");
        }), h ? s() : c.addEventListener(
          "open",
          s
        );
      }, "configureWebSocket"), u;
      try {
        u = this.wsProxyAddrForHost(n, typeof t == "string" ? parseInt(t, 10) : t);
      } catch (c) {
        this.emit("error", c), this.emit("close");
        return;
      }
      try {
        let h = (this.useSecureWebSocket ? "wss:" : "ws:") + "//" + u;
        if (this.webSocketConstructor !== void 0) this.ws = new this.webSocketConstructor(h), o(this.ws);
        else try {
          this.ws = new WebSocket(
            h
          ), o(this.ws);
        } catch {
          this.ws = new __unstable_WebSocket(h), o(this.ws);
        }
      } catch (c) {
        let l = (this.useSecureWebSocket ? "https:" : "http:") + "//" + u;
        fetch(l, { headers: { Upgrade: "websocket" } }).then((d) => {
          if (this.ws = d.webSocket, this.ws == null) throw c;
          this.ws.accept(), o(
            this.ws,
            true
          );
        }).catch((d) => {
          this.emit("error", new Error(`All attempts to open a WebSocket to connect to the database failed. Please refer to https://github.com/neondatabase/serverless/blob/main/CONFIG.md#websocketconstructor-typeof-websocket--undefined. Details: ${d.message}`)), this.emit("close");
        });
      }
    }
    async startTls(t) {
      if (this.subtls === void 0) throw new Error("For Postgres SSL connections, you must set `neonConfig.subtls` to the subtls library. See https://github.com/neondatabase/serverless/blob/main/CONFIG.md for more information.");
      this.tlsState = 1;
      let n = this.subtls.TrustedCert.fromPEM(this.rootCerts), i = new this.subtls.WebSocketReadQueue(this.ws), s = i.read.bind(
        i
      ), o = this.rawWrite.bind(this), [u, c] = await this.subtls.startTls(t, n, s, o, { useSNI: !this.disableSNI, expectPreData: this.pipelineTLS ? new Uint8Array([83]) : void 0 });
      this.tlsRead = u, this.tlsWrite = c, this.tlsState = 2, this.encrypted = true, this.authorized = true, this.emit(
        "secureConnection",
        this
      ), this.tlsReadLoop();
    }
    async tlsReadLoop() {
      for (; ; ) {
        let t = await this.tlsRead();
        if (t === void 0) break;
        {
          let n = y.from(t);
          this.emit("data", n);
        }
      }
    }
    rawWrite(t) {
      if (!this.coalesceWrites) {
        this.ws.send(t);
        return;
      }
      if (this.writeBuffer === void 0) this.writeBuffer = t, setTimeout(
        () => {
          this.ws.send(this.writeBuffer), this.writeBuffer = void 0;
        },
        0
      );
      else {
        let n = new Uint8Array(this.writeBuffer.length + t.length);
        n.set(this.writeBuffer), n.set(t, this.writeBuffer.length), this.writeBuffer = n;
      }
    }
    write(t, n = "utf8", i = (s) => {
    }) {
      return t.length === 0 ? (i(), true) : (typeof t == "string" && (t = y.from(t, n)), this.tlsState === 0 ? (this.rawWrite(t), i()) : this.tlsState === 1 ? this.once("secureConnection", () => {
        this.write(
          t,
          n,
          i
        );
      }) : (this.tlsWrite(t), i()), true);
    }
    end(t = y.alloc(0), n = "utf8", i = () => {
    }) {
      return this.write(t, n, () => {
        this.ws.close(), i();
      }), this;
    }
    destroy() {
      return this.destroyed = true, this.end();
    }
  };
  a(v, "Socket"), _(v, "defaults", {
    poolQueryViaFetch: false,
    fetchEndpoint: a((t, n, i) => {
      let s;
      return i?.jwtAuth ? s = t.replace(ms, "apiauth.") : s = t.replace(ms, "api."), "https://" + s + "/sql";
    }, "fetchEndpoint"),
    fetchConnectionCache: true,
    fetchFunction: void 0,
    webSocketConstructor: void 0,
    wsProxy: a((t) => t + "/v2", "wsProxy"),
    useSecureWebSocket: true,
    forceDisablePgSSL: true,
    coalesceWrites: true,
    pipelineConnect: "password",
    subtls: void 0,
    rootCerts: "",
    pipelineTLS: false,
    disableSNI: false
  }), _(v, "opts", {});
  _e = v;
});
var Xr = I((T) => {
  "use strict";
  p();
  Object.defineProperty(T, "__esModule", { value: true });
  T.NoticeMessage = T.DataRowMessage = T.CommandCompleteMessage = T.ReadyForQueryMessage = T.NotificationResponseMessage = T.BackendKeyDataMessage = T.AuthenticationMD5Password = T.ParameterStatusMessage = T.ParameterDescriptionMessage = T.RowDescriptionMessage = T.Field = T.CopyResponse = T.CopyDataMessage = T.DatabaseError = T.copyDone = T.emptyQuery = T.replicationStart = T.portalSuspended = T.noData = T.closeComplete = T.bindComplete = T.parseComplete = void 0;
  T.parseComplete = { name: "parseComplete", length: 5 };
  T.bindComplete = { name: "bindComplete", length: 5 };
  T.closeComplete = { name: "closeComplete", length: 5 };
  T.noData = { name: "noData", length: 5 };
  T.portalSuspended = { name: "portalSuspended", length: 5 };
  T.replicationStart = { name: "replicationStart", length: 4 };
  T.emptyQuery = { name: "emptyQuery", length: 4 };
  T.copyDone = { name: "copyDone", length: 4 };
  var Nr = class Nr extends Error {
    constructor(e, t, n) {
      super(
        e
      ), this.length = t, this.name = n;
    }
  };
  a(Nr, "DatabaseError");
  var Ar = Nr;
  T.DatabaseError = Ar;
  var qr = class qr {
    constructor(e, t) {
      this.length = e, this.chunk = t, this.name = "copyData";
    }
  };
  a(qr, "CopyDataMessage");
  var Cr = qr;
  T.CopyDataMessage = Cr;
  var Qr = class Qr {
    constructor(e, t, n, i) {
      this.length = e, this.name = t, this.binary = n, this.columnTypes = new Array(i);
    }
  };
  a(Qr, "CopyResponse");
  var Tr = Qr;
  T.CopyResponse = Tr;
  var jr = class jr {
    constructor(e, t, n, i, s, o, u) {
      this.name = e, this.tableID = t, this.columnID = n, this.dataTypeID = i, this.dataTypeSize = s, this.dataTypeModifier = o, this.format = u;
    }
  };
  a(jr, "Field");
  var Ir = jr;
  T.Field = Ir;
  var Wr = class Wr {
    constructor(e, t) {
      this.length = e, this.fieldCount = t, this.name = "rowDescription", this.fields = new Array(
        this.fieldCount
      );
    }
  };
  a(Wr, "RowDescriptionMessage");
  var Pr = Wr;
  T.RowDescriptionMessage = Pr;
  var Hr = class Hr {
    constructor(e, t) {
      this.length = e, this.parameterCount = t, this.name = "parameterDescription", this.dataTypeIDs = new Array(this.parameterCount);
    }
  };
  a(Hr, "ParameterDescriptionMessage");
  var Br = Hr;
  T.ParameterDescriptionMessage = Br;
  var Gr = class Gr {
    constructor(e, t, n) {
      this.length = e, this.parameterName = t, this.parameterValue = n, this.name = "parameterStatus";
    }
  };
  a(Gr, "ParameterStatusMessage");
  var Lr = Gr;
  T.ParameterStatusMessage = Lr;
  var $r = class $r {
    constructor(e, t) {
      this.length = e, this.salt = t, this.name = "authenticationMD5Password";
    }
  };
  a($r, "AuthenticationMD5Password");
  var Rr = $r;
  T.AuthenticationMD5Password = Rr;
  var Vr = class Vr {
    constructor(e, t, n) {
      this.length = e, this.processID = t, this.secretKey = n, this.name = "backendKeyData";
    }
  };
  a(
    Vr,
    "BackendKeyDataMessage"
  );
  var Fr = Vr;
  T.BackendKeyDataMessage = Fr;
  var Kr = class Kr {
    constructor(e, t, n, i) {
      this.length = e, this.processId = t, this.channel = n, this.payload = i, this.name = "notification";
    }
  };
  a(Kr, "NotificationResponseMessage");
  var Mr = Kr;
  T.NotificationResponseMessage = Mr;
  var zr = class zr {
    constructor(e, t) {
      this.length = e, this.status = t, this.name = "readyForQuery";
    }
  };
  a(zr, "ReadyForQueryMessage");
  var Dr = zr;
  T.ReadyForQueryMessage = Dr;
  var Yr = class Yr {
    constructor(e, t) {
      this.length = e, this.text = t, this.name = "commandComplete";
    }
  };
  a(Yr, "CommandCompleteMessage");
  var kr = Yr;
  T.CommandCompleteMessage = kr;
  var Zr = class Zr {
    constructor(e, t) {
      this.length = e, this.fields = t, this.name = "dataRow", this.fieldCount = t.length;
    }
  };
  a(Zr, "DataRowMessage");
  var Ur = Zr;
  T.DataRowMessage = Ur;
  var Jr = class Jr {
    constructor(e, t) {
      this.length = e, this.message = t, this.name = "notice";
    }
  };
  a(Jr, "NoticeMessage");
  var Or = Jr;
  T.NoticeMessage = Or;
});
var bs = I((xt) => {
  "use strict";
  p();
  Object.defineProperty(xt, "__esModule", { value: true });
  xt.Writer = void 0;
  var tn = class tn {
    constructor(e = 256) {
      this.size = e, this.offset = 5, this.headerPosition = 0, this.buffer = y.allocUnsafe(e);
    }
    ensure(e) {
      var t = this.buffer.length - this.offset;
      if (t < e) {
        var n = this.buffer, i = n.length + (n.length >> 1) + e;
        this.buffer = y.allocUnsafe(
          i
        ), n.copy(this.buffer);
      }
    }
    addInt32(e) {
      return this.ensure(4), this.buffer[this.offset++] = e >>> 24 & 255, this.buffer[this.offset++] = e >>> 16 & 255, this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
    }
    addInt16(e) {
      return this.ensure(2), this.buffer[this.offset++] = e >>> 8 & 255, this.buffer[this.offset++] = e >>> 0 & 255, this;
    }
    addCString(e) {
      if (!e) this.ensure(1);
      else {
        var t = y.byteLength(e);
        this.ensure(t + 1), this.buffer.write(
          e,
          this.offset,
          "utf-8"
        ), this.offset += t;
      }
      return this.buffer[this.offset++] = 0, this;
    }
    addString(e = "") {
      var t = y.byteLength(e);
      return this.ensure(t), this.buffer.write(e, this.offset), this.offset += t, this;
    }
    add(e) {
      return this.ensure(e.length), e.copy(this.buffer, this.offset), this.offset += e.length, this;
    }
    join(e) {
      if (e) {
        this.buffer[this.headerPosition] = e;
        let t = this.offset - (this.headerPosition + 1);
        this.buffer.writeInt32BE(t, this.headerPosition + 1);
      }
      return this.buffer.slice(e ? 0 : 5, this.offset);
    }
    flush(e) {
      var t = this.join(e);
      return this.offset = 5, this.headerPosition = 0, this.buffer = y.allocUnsafe(this.size), t;
    }
  };
  a(tn, "Writer");
  var en = tn;
  xt.Writer = en;
});
var xs = I((vt) => {
  "use strict";
  p();
  Object.defineProperty(vt, "__esModule", { value: true });
  vt.serialize = void 0;
  var rn = bs(), M = new rn.Writer(), Uu = a((r) => {
    M.addInt16(3).addInt16(
      0
    );
    for (let n of Object.keys(r)) M.addCString(n).addCString(r[n]);
    M.addCString("client_encoding").addCString("UTF8");
    var e = M.addCString("").flush(), t = e.length + 4;
    return new rn.Writer().addInt32(t).add(e).flush();
  }, "startup"), Ou = a(() => {
    let r = y.allocUnsafe(8);
    return r.writeInt32BE(8, 0), r.writeInt32BE(80877103, 4), r;
  }, "requestSsl"), Nu = a((r) => M.addCString(r).flush(112), "password"), qu = a(function(r, e) {
    return M.addCString(r).addInt32(
      y.byteLength(e)
    ).addString(e), M.flush(112);
  }, "sendSASLInitialResponseMessage"), Qu = a(
    function(r) {
      return M.addString(r).flush(112);
    },
    "sendSCRAMClientFinalMessage"
  ), ju = a(
    (r) => M.addCString(r).flush(81),
    "query"
  ), Ss = [], Wu = a((r) => {
    let e = r.name || "";
    e.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error("You supplied %s (%s)", e, e.length), console.error("This can cause conflicts and silent errors executing queries"));
    let t = r.types || Ss;
    for (var n = t.length, i = M.addCString(e).addCString(r.text).addInt16(n), s = 0; s < n; s++) i.addInt32(t[s]);
    return M.flush(80);
  }, "parse"), Oe = new rn.Writer(), Hu = a(function(r, e) {
    for (let t = 0; t < r.length; t++) {
      let n = e ? e(r[t], t) : r[t];
      n == null ? (M.addInt16(0), Oe.addInt32(-1)) : n instanceof y ? (M.addInt16(1), Oe.addInt32(n.length), Oe.add(n)) : (M.addInt16(0), Oe.addInt32(y.byteLength(
        n
      )), Oe.addString(n));
    }
  }, "writeValues"), Gu = a((r = {}) => {
    let e = r.portal || "", t = r.statement || "", n = r.binary || false, i = r.values || Ss, s = i.length;
    return M.addCString(e).addCString(t), M.addInt16(s), Hu(i, r.valueMapper), M.addInt16(s), M.add(Oe.flush()), M.addInt16(n ? 1 : 0), M.flush(66);
  }, "bind"), $u = y.from([69, 0, 0, 0, 9, 0, 0, 0, 0, 0]), Vu = a((r) => {
    if (!r || !r.portal && !r.rows) return $u;
    let e = r.portal || "", t = r.rows || 0, n = y.byteLength(e), i = 4 + n + 1 + 4, s = y.allocUnsafe(1 + i);
    return s[0] = 69, s.writeInt32BE(i, 1), s.write(e, 5, "utf-8"), s[n + 5] = 0, s.writeUInt32BE(t, s.length - 4), s;
  }, "execute"), Ku = a((r, e) => {
    let t = y.allocUnsafe(16);
    return t.writeInt32BE(16, 0), t.writeInt16BE(1234, 4), t.writeInt16BE(5678, 6), t.writeInt32BE(
      r,
      8
    ), t.writeInt32BE(e, 12), t;
  }, "cancel"), nn = a(
    (r, e) => {
      let n = 4 + y.byteLength(e) + 1, i = y.allocUnsafe(1 + n);
      return i[0] = r, i.writeInt32BE(n, 1), i.write(e, 5, "utf-8"), i[n] = 0, i;
    },
    "cstringMessage"
  ), zu = M.addCString("P").flush(68), Yu = M.addCString("S").flush(68), Zu = a((r) => r.name ? nn(68, `${r.type}${r.name || ""}`) : r.type === "P" ? zu : Yu, "describe"), Ju = a(
    (r) => {
      let e = `${r.type}${r.name || ""}`;
      return nn(67, e);
    },
    "close"
  ), Xu = a((r) => M.add(r).flush(
    100
  ), "copyData"), ec = a((r) => nn(102, r), "copyFail"), Et = a((r) => y.from([r, 0, 0, 0, 4]), "codeOnlyBuffer"), tc = Et(72), rc = Et(83), nc = Et(88), ic = Et(99), sc = {
    startup: Uu,
    password: Nu,
    requestSsl: Ou,
    sendSASLInitialResponseMessage: qu,
    sendSCRAMClientFinalMessage: Qu,
    query: ju,
    parse: Wu,
    bind: Gu,
    execute: Vu,
    describe: Zu,
    close: Ju,
    flush: a(() => tc, "flush"),
    sync: a(
      () => rc,
      "sync"
    ),
    end: a(() => nc, "end"),
    copyData: Xu,
    copyDone: a(() => ic, "copyDone"),
    copyFail: ec,
    cancel: Ku
  };
  vt.serialize = sc;
});
var Es = I((_t) => {
  "use strict";
  p();
  Object.defineProperty(_t, "__esModule", { value: true });
  _t.BufferReader = void 0;
  var oc = y.allocUnsafe(0), on = class on {
    constructor(e = 0) {
      this.offset = e, this.buffer = oc, this.encoding = "utf-8";
    }
    setBuffer(e, t) {
      this.offset = e, this.buffer = t;
    }
    int16() {
      let e = this.buffer.readInt16BE(this.offset);
      return this.offset += 2, e;
    }
    byte() {
      let e = this.buffer[this.offset];
      return this.offset++, e;
    }
    int32() {
      let e = this.buffer.readInt32BE(this.offset);
      return this.offset += 4, e;
    }
    string(e) {
      let t = this.buffer.toString(this.encoding, this.offset, this.offset + e);
      return this.offset += e, t;
    }
    cstring() {
      let e = this.offset, t = e;
      for (; this.buffer[t++] !== 0; ) ;
      return this.offset = t, this.buffer.toString(this.encoding, e, t - 1);
    }
    bytes(e) {
      let t = this.buffer.slice(this.offset, this.offset + e);
      return this.offset += e, t;
    }
  };
  a(on, "BufferReader");
  var sn = on;
  _t.BufferReader = sn;
});
var As = I((At) => {
  "use strict";
  p();
  Object.defineProperty(At, "__esModule", { value: true });
  At.Parser = void 0;
  var D = Xr(), ac = Es(), an = 1, uc = 4, vs = an + uc, _s = y.allocUnsafe(0), cn = class cn {
    constructor(e) {
      if (this.buffer = _s, this.bufferLength = 0, this.bufferOffset = 0, this.reader = new ac.BufferReader(), e?.mode === "binary") throw new Error("Binary mode not supported yet");
      this.mode = e?.mode || "text";
    }
    parse(e, t) {
      this.mergeBuffer(e);
      let n = this.bufferOffset + this.bufferLength, i = this.bufferOffset;
      for (; i + vs <= n; ) {
        let s = this.buffer[i], o = this.buffer.readUInt32BE(
          i + an
        ), u = an + o;
        if (u + i <= n) {
          let c = this.handlePacket(i + vs, s, o, this.buffer);
          t(c), i += u;
        } else
          break;
      }
      i === n ? (this.buffer = _s, this.bufferLength = 0, this.bufferOffset = 0) : (this.bufferLength = n - i, this.bufferOffset = i);
    }
    mergeBuffer(e) {
      if (this.bufferLength > 0) {
        let t = this.bufferLength + e.byteLength;
        if (t + this.bufferOffset > this.buffer.byteLength) {
          let i;
          if (t <= this.buffer.byteLength && this.bufferOffset >= this.bufferLength) i = this.buffer;
          else {
            let s = this.buffer.byteLength * 2;
            for (; t >= s; ) s *= 2;
            i = y.allocUnsafe(s);
          }
          this.buffer.copy(
            i,
            0,
            this.bufferOffset,
            this.bufferOffset + this.bufferLength
          ), this.buffer = i, this.bufferOffset = 0;
        }
        e.copy(this.buffer, this.bufferOffset + this.bufferLength), this.bufferLength = t;
      } else this.buffer = e, this.bufferOffset = 0, this.bufferLength = e.byteLength;
    }
    handlePacket(e, t, n, i) {
      switch (t) {
        case 50:
          return D.bindComplete;
        case 49:
          return D.parseComplete;
        case 51:
          return D.closeComplete;
        case 110:
          return D.noData;
        case 115:
          return D.portalSuspended;
        case 99:
          return D.copyDone;
        case 87:
          return D.replicationStart;
        case 73:
          return D.emptyQuery;
        case 68:
          return this.parseDataRowMessage(
            e,
            n,
            i
          );
        case 67:
          return this.parseCommandCompleteMessage(e, n, i);
        case 90:
          return this.parseReadyForQueryMessage(e, n, i);
        case 65:
          return this.parseNotificationMessage(
            e,
            n,
            i
          );
        case 82:
          return this.parseAuthenticationResponse(e, n, i);
        case 83:
          return this.parseParameterStatusMessage(e, n, i);
        case 75:
          return this.parseBackendKeyData(e, n, i);
        case 69:
          return this.parseErrorMessage(e, n, i, "error");
        case 78:
          return this.parseErrorMessage(
            e,
            n,
            i,
            "notice"
          );
        case 84:
          return this.parseRowDescriptionMessage(e, n, i);
        case 116:
          return this.parseParameterDescriptionMessage(e, n, i);
        case 71:
          return this.parseCopyInMessage(
            e,
            n,
            i
          );
        case 72:
          return this.parseCopyOutMessage(e, n, i);
        case 100:
          return this.parseCopyData(
            e,
            n,
            i
          );
        default:
          return new D.DatabaseError("received invalid response: " + t.toString(
            16
          ), n, "error");
      }
    }
    parseReadyForQueryMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.string(1);
      return new D.ReadyForQueryMessage(t, i);
    }
    parseCommandCompleteMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.cstring();
      return new D.CommandCompleteMessage(
        t,
        i
      );
    }
    parseCopyData(e, t, n) {
      let i = n.slice(e, e + (t - 4));
      return new D.CopyDataMessage(
        t,
        i
      );
    }
    parseCopyInMessage(e, t, n) {
      return this.parseCopyMessage(e, t, n, "copyInResponse");
    }
    parseCopyOutMessage(e, t, n) {
      return this.parseCopyMessage(e, t, n, "copyOutResponse");
    }
    parseCopyMessage(e, t, n, i) {
      this.reader.setBuffer(e, n);
      let s = this.reader.byte() !== 0, o = this.reader.int16(), u = new D.CopyResponse(t, i, s, o);
      for (let c = 0; c < o; c++) u.columnTypes[c] = this.reader.int16();
      return u;
    }
    parseNotificationMessage(e, t, n) {
      this.reader.setBuffer(
        e,
        n
      );
      let i = this.reader.int32(), s = this.reader.cstring(), o = this.reader.cstring();
      return new D.NotificationResponseMessage(t, i, s, o);
    }
    parseRowDescriptionMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int16(), s = new D.RowDescriptionMessage(t, i);
      for (let o = 0; o < i; o++) s.fields[o] = this.parseField();
      return s;
    }
    parseField() {
      let e = this.reader.cstring(), t = this.reader.int32(), n = this.reader.int16(), i = this.reader.int32(), s = this.reader.int16(), o = this.reader.int32(), u = this.reader.int16() === 0 ? "text" : "binary";
      return new D.Field(e, t, n, i, s, o, u);
    }
    parseParameterDescriptionMessage(e, t, n) {
      this.reader.setBuffer(
        e,
        n
      );
      let i = this.reader.int16(), s = new D.ParameterDescriptionMessage(t, i);
      for (let o = 0; o < i; o++) s.dataTypeIDs[o] = this.reader.int32();
      return s;
    }
    parseDataRowMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int16(), s = new Array(i);
      for (let o = 0; o < i; o++) {
        let u = this.reader.int32();
        s[o] = u === -1 ? null : this.reader.string(u);
      }
      return new D.DataRowMessage(
        t,
        s
      );
    }
    parseParameterStatusMessage(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.cstring(), s = this.reader.cstring();
      return new D.ParameterStatusMessage(t, i, s);
    }
    parseBackendKeyData(e, t, n) {
      this.reader.setBuffer(e, n);
      let i = this.reader.int32(), s = this.reader.int32();
      return new D.BackendKeyDataMessage(t, i, s);
    }
    parseAuthenticationResponse(e, t, n) {
      this.reader.setBuffer(
        e,
        n
      );
      let i = this.reader.int32(), s = { name: "authenticationOk", length: t };
      switch (i) {
        case 0:
          break;
        case 3:
          s.length === 8 && (s.name = "authenticationCleartextPassword");
          break;
        case 5:
          if (s.length === 12) {
            s.name = "authenticationMD5Password";
            let u = this.reader.bytes(4);
            return new D.AuthenticationMD5Password(t, u);
          }
          break;
        case 10:
          s.name = "authenticationSASL", s.mechanisms = [];
          let o;
          do
            o = this.reader.cstring(), o && s.mechanisms.push(o);
          while (o);
          break;
        case 11:
          s.name = "authenticationSASLContinue", s.data = this.reader.string(t - 8);
          break;
        case 12:
          s.name = "authenticationSASLFinal", s.data = this.reader.string(t - 8);
          break;
        default:
          throw new Error("Unknown authenticationOk message type " + i);
      }
      return s;
    }
    parseErrorMessage(e, t, n, i) {
      this.reader.setBuffer(e, n);
      let s = {}, o = this.reader.string(1);
      for (; o !== "\0"; ) s[o] = this.reader.cstring(), o = this.reader.string(1);
      let u = s.M, c = i === "notice" ? new D.NoticeMessage(
        t,
        u
      ) : new D.DatabaseError(u, t, i);
      return c.severity = s.S, c.code = s.C, c.detail = s.D, c.hint = s.H, c.position = s.P, c.internalPosition = s.p, c.internalQuery = s.q, c.where = s.W, c.schema = s.s, c.table = s.t, c.column = s.c, c.dataType = s.d, c.constraint = s.n, c.file = s.F, c.line = s.L, c.routine = s.R, c;
    }
  };
  a(cn, "Parser");
  var un = cn;
  At.Parser = un;
});
var hn = I((be) => {
  "use strict";
  p();
  Object.defineProperty(be, "__esModule", { value: true });
  be.DatabaseError = be.serialize = be.parse = void 0;
  var cc = Xr();
  Object.defineProperty(
    be,
    "DatabaseError",
    { enumerable: true, get: a(function() {
      return cc.DatabaseError;
    }, "get") }
  );
  var hc = xs();
  Object.defineProperty(be, "serialize", { enumerable: true, get: a(function() {
    return hc.serialize;
  }, "get") });
  var lc = As();
  function fc(r, e) {
    let t = new lc.Parser();
    return r.on("data", (n) => t.parse(n, e)), new Promise((n) => r.on("end", () => n()));
  }
  a(fc, "parse");
  be.parse = fc;
});
var Cs = {};
se(Cs, { connect: () => pc });
function pc({ socket: r, servername: e }) {
  return r.startTls(e), r;
}
var Ts = z(() => {
  "use strict";
  p();
  a(pc, "connect");
});
var pn = I((of, Bs) => {
  "use strict";
  p();
  var Is = (St(), O(ws)), dc = ge().EventEmitter, {
    parse: yc,
    serialize: q
  } = hn(), Ps = q.flush(), mc = q.sync(), gc = q.end(), fn = class fn extends dc {
    constructor(e) {
      super(), e = e || {}, this.stream = e.stream || new Is.Socket(), this._keepAlive = e.keepAlive, this._keepAliveInitialDelayMillis = e.keepAliveInitialDelayMillis, this.lastBuffer = false, this.parsedStatements = {}, this.ssl = e.ssl || false, this._ending = false, this._emitMessage = false;
      var t = this;
      this.on("newListener", function(n) {
        n === "message" && (t._emitMessage = true);
      });
    }
    connect(e, t) {
      var n = this;
      this._connecting = true, this.stream.setNoDelay(true), this.stream.connect(
        e,
        t
      ), this.stream.once("connect", function() {
        n._keepAlive && n.stream.setKeepAlive(
          true,
          n._keepAliveInitialDelayMillis
        ), n.emit("connect");
      });
      let i = a(function(s) {
        n._ending && (s.code === "ECONNRESET" || s.code === "EPIPE") || n.emit("error", s);
      }, "reportStreamError");
      if (this.stream.on("error", i), this.stream.on("close", function() {
        n.emit("end");
      }), !this.ssl) return this.attachListeners(this.stream);
      this.stream.once("data", function(s) {
        var o = s.toString("utf8");
        switch (o) {
          case "S":
            break;
          case "N":
            return n.stream.end(), n.emit("error", new Error("The server does not support SSL connections"));
          default:
            return n.stream.end(), n.emit("error", new Error("There was an error establishing an SSL connection"));
        }
        var u = (Ts(), O(Cs));
        let c = { socket: n.stream };
        n.ssl !== true && (Object.assign(
          c,
          n.ssl
        ), "key" in n.ssl && (c.key = n.ssl.key)), Is.isIP(t) === 0 && (c.servername = t);
        try {
          n.stream = u.connect(c);
        } catch (h) {
          return n.emit("error", h);
        }
        n.attachListeners(n.stream), n.stream.on("error", i), n.emit("sslconnect");
      });
    }
    attachListeners(e) {
      e.on("end", () => {
        this.emit("end");
      }), yc(e, (t) => {
        var n = t.name === "error" ? "errorMessage" : t.name;
        this._emitMessage && this.emit("message", t), this.emit(n, t);
      });
    }
    requestSsl() {
      this.stream.write(q.requestSsl());
    }
    startup(e) {
      this.stream.write(q.startup(e));
    }
    cancel(e, t) {
      this._send(q.cancel(e, t));
    }
    password(e) {
      this._send(q.password(e));
    }
    sendSASLInitialResponseMessage(e, t) {
      this._send(q.sendSASLInitialResponseMessage(
        e,
        t
      ));
    }
    sendSCRAMClientFinalMessage(e) {
      this._send(q.sendSCRAMClientFinalMessage(e));
    }
    _send(e) {
      return this.stream.writable ? this.stream.write(e) : false;
    }
    query(e) {
      this._send(q.query(
        e
      ));
    }
    parse(e) {
      this._send(q.parse(e));
    }
    bind(e) {
      this._send(q.bind(e));
    }
    execute(e) {
      this._send(q.execute(e));
    }
    flush() {
      this.stream.writable && this.stream.write(Ps);
    }
    sync() {
      this._ending = true, this._send(Ps), this._send(mc);
    }
    ref() {
      this.stream.ref();
    }
    unref() {
      this.stream.unref();
    }
    end() {
      if (this._ending = true, !this._connecting || !this.stream.writable) {
        this.stream.end();
        return;
      }
      return this.stream.write(gc, () => {
        this.stream.end();
      });
    }
    close(e) {
      this._send(q.close(e));
    }
    describe(e) {
      this._send(q.describe(e));
    }
    sendCopyFromChunk(e) {
      this._send(q.copyData(e));
    }
    endCopyFrom() {
      this._send(q.copyDone());
    }
    sendCopyFail(e) {
      this._send(q.copyFail(e));
    }
  };
  a(fn, "Connection");
  var ln = fn;
  Bs.exports = ln;
});
var Fs = I((hf, Rs) => {
  "use strict";
  p();
  var wc = ge().EventEmitter, cf = (Ge(), O(He)), bc = tt(), dn = ji(), Sc = Xi(), xc = wt(), Ec = bt(), Ls = ys(), vc = et(), _c = pn(), yn = class yn extends wc {
    constructor(e) {
      super(), this.connectionParameters = new Ec(e), this.user = this.connectionParameters.user, this.database = this.connectionParameters.database, this.port = this.connectionParameters.port, this.host = this.connectionParameters.host, Object.defineProperty(this, "password", { configurable: true, enumerable: false, writable: true, value: this.connectionParameters.password }), this.replication = this.connectionParameters.replication;
      var t = e || {};
      this._Promise = t.Promise || S.Promise, this._types = new xc(t.types), this._ending = false, this._connecting = false, this._connected = false, this._connectionError = false, this._queryable = true, this.connection = t.connection || new _c({ stream: t.stream, ssl: this.connectionParameters.ssl, keepAlive: t.keepAlive || false, keepAliveInitialDelayMillis: t.keepAliveInitialDelayMillis || 0, encoding: this.connectionParameters.client_encoding || "utf8" }), this.queryQueue = [], this.binary = t.binary || vc.binary, this.processID = null, this.secretKey = null, this.ssl = this.connectionParameters.ssl || false, this.ssl && this.ssl.key && Object.defineProperty(this.ssl, "key", { enumerable: false }), this._connectionTimeoutMillis = t.connectionTimeoutMillis || 0;
    }
    _errorAllQueries(e) {
      let t = a(
        (n) => {
          m.nextTick(() => {
            n.handleError(e, this.connection);
          });
        },
        "enqueueError"
      );
      this.activeQuery && (t(this.activeQuery), this.activeQuery = null), this.queryQueue.forEach(t), this.queryQueue.length = 0;
    }
    _connect(e) {
      var t = this, n = this.connection;
      if (this._connectionCallback = e, this._connecting || this._connected) {
        let i = new Error("Client has already been connected. You cannot reuse a client.");
        m.nextTick(() => {
          e(i);
        });
        return;
      }
      this._connecting = true, this.connectionTimeoutHandle, this._connectionTimeoutMillis > 0 && (this.connectionTimeoutHandle = setTimeout(() => {
        n._ending = true, n.stream.destroy(new Error("timeout expired"));
      }, this._connectionTimeoutMillis)), this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
        t.ssl ? n.requestSsl() : n.startup(t.getStartupConf());
      }), n.on("sslconnect", function() {
        n.startup(t.getStartupConf());
      }), this._attachListeners(n), n.once("end", () => {
        let i = this._ending ? new Error("Connection terminated") : new Error("Connection terminated unexpectedly");
        clearTimeout(this.connectionTimeoutHandle), this._errorAllQueries(i), this._ending || (this._connecting && !this._connectionError ? this._connectionCallback ? this._connectionCallback(i) : this._handleErrorEvent(i) : this._connectionError || this._handleErrorEvent(
          i
        )), m.nextTick(() => {
          this.emit("end");
        });
      });
    }
    connect(e) {
      if (e) {
        this._connect(e);
        return;
      }
      return new this._Promise((t, n) => {
        this._connect((i) => {
          i ? n(i) : t();
        });
      });
    }
    _attachListeners(e) {
      e.on("authenticationCleartextPassword", this._handleAuthCleartextPassword.bind(this)), e.on("authenticationMD5Password", this._handleAuthMD5Password.bind(this)), e.on("authenticationSASL", this._handleAuthSASL.bind(this)), e.on("authenticationSASLContinue", this._handleAuthSASLContinue.bind(this)), e.on("authenticationSASLFinal", this._handleAuthSASLFinal.bind(this)), e.on("backendKeyData", this._handleBackendKeyData.bind(this)), e.on("error", this._handleErrorEvent.bind(this)), e.on(
        "errorMessage",
        this._handleErrorMessage.bind(this)
      ), e.on("readyForQuery", this._handleReadyForQuery.bind(this)), e.on("notice", this._handleNotice.bind(this)), e.on("rowDescription", this._handleRowDescription.bind(this)), e.on("dataRow", this._handleDataRow.bind(this)), e.on("portalSuspended", this._handlePortalSuspended.bind(this)), e.on(
        "emptyQuery",
        this._handleEmptyQuery.bind(this)
      ), e.on("commandComplete", this._handleCommandComplete.bind(this)), e.on("parseComplete", this._handleParseComplete.bind(this)), e.on("copyInResponse", this._handleCopyInResponse.bind(this)), e.on("copyData", this._handleCopyData.bind(this)), e.on("notification", this._handleNotification.bind(this));
    }
    _checkPgPass(e) {
      let t = this.connection;
      typeof this.password == "function" ? this._Promise.resolve().then(
        () => this.password()
      ).then((n) => {
        if (n !== void 0) {
          if (typeof n != "string") {
            t.emit("error", new TypeError("Password must be a string"));
            return;
          }
          this.connectionParameters.password = this.password = n;
        } else this.connectionParameters.password = this.password = null;
        e();
      }).catch((n) => {
        t.emit("error", n);
      }) : this.password !== null ? e() : Sc(
        this.connectionParameters,
        (n) => {
          n !== void 0 && (this.connectionParameters.password = this.password = n), e();
        }
      );
    }
    _handleAuthCleartextPassword(e) {
      this._checkPgPass(() => {
        this.connection.password(this.password);
      });
    }
    _handleAuthMD5Password(e) {
      this._checkPgPass(() => {
        let t = bc.postgresMd5PasswordHash(
          this.user,
          this.password,
          e.salt
        );
        this.connection.password(t);
      });
    }
    _handleAuthSASL(e) {
      this._checkPgPass(() => {
        this.saslSession = dn.startSession(e.mechanisms), this.connection.sendSASLInitialResponseMessage(
          this.saslSession.mechanism,
          this.saslSession.response
        );
      });
    }
    _handleAuthSASLContinue(e) {
      dn.continueSession(this.saslSession, this.password, e.data), this.connection.sendSCRAMClientFinalMessage(
        this.saslSession.response
      );
    }
    _handleAuthSASLFinal(e) {
      dn.finalizeSession(
        this.saslSession,
        e.data
      ), this.saslSession = null;
    }
    _handleBackendKeyData(e) {
      this.processID = e.processID, this.secretKey = e.secretKey;
    }
    _handleReadyForQuery(e) {
      this._connecting && (this._connecting = false, this._connected = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback && (this._connectionCallback(null, this), this._connectionCallback = null), this.emit("connect"));
      let { activeQuery: t } = this;
      this.activeQuery = null, this.readyForQuery = true, t && t.handleReadyForQuery(this.connection), this._pulseQueryQueue();
    }
    _handleErrorWhileConnecting(e) {
      if (!this._connectionError) {
        if (this._connectionError = true, clearTimeout(this.connectionTimeoutHandle), this._connectionCallback) return this._connectionCallback(e);
        this.emit("error", e);
      }
    }
    _handleErrorEvent(e) {
      if (this._connecting) return this._handleErrorWhileConnecting(e);
      this._queryable = false, this._errorAllQueries(e), this.emit("error", e);
    }
    _handleErrorMessage(e) {
      if (this._connecting)
        return this._handleErrorWhileConnecting(e);
      let t = this.activeQuery;
      if (!t) {
        this._handleErrorEvent(
          e
        );
        return;
      }
      this.activeQuery = null, t.handleError(e, this.connection);
    }
    _handleRowDescription(e) {
      this.activeQuery.handleRowDescription(e);
    }
    _handleDataRow(e) {
      this.activeQuery.handleDataRow(
        e
      );
    }
    _handlePortalSuspended(e) {
      this.activeQuery.handlePortalSuspended(this.connection);
    }
    _handleEmptyQuery(e) {
      this.activeQuery.handleEmptyQuery(this.connection);
    }
    _handleCommandComplete(e) {
      this.activeQuery.handleCommandComplete(e, this.connection);
    }
    _handleParseComplete(e) {
      this.activeQuery.name && (this.connection.parsedStatements[this.activeQuery.name] = this.activeQuery.text);
    }
    _handleCopyInResponse(e) {
      this.activeQuery.handleCopyInResponse(
        this.connection
      );
    }
    _handleCopyData(e) {
      this.activeQuery.handleCopyData(e, this.connection);
    }
    _handleNotification(e) {
      this.emit("notification", e);
    }
    _handleNotice(e) {
      this.emit("notice", e);
    }
    getStartupConf() {
      var e = this.connectionParameters, t = { user: e.user, database: e.database }, n = e.application_name || e.fallback_application_name;
      return n && (t.application_name = n), e.replication && (t.replication = "" + e.replication), e.statement_timeout && (t.statement_timeout = String(parseInt(
        e.statement_timeout,
        10
      ))), e.lock_timeout && (t.lock_timeout = String(parseInt(e.lock_timeout, 10))), e.idle_in_transaction_session_timeout && (t.idle_in_transaction_session_timeout = String(parseInt(
        e.idle_in_transaction_session_timeout,
        10
      ))), e.options && (t.options = e.options), t;
    }
    cancel(e, t) {
      if (e.activeQuery === t) {
        var n = this.connection;
        this.host && this.host.indexOf("/") === 0 ? n.connect(this.host + "/.s.PGSQL." + this.port) : n.connect(this.port, this.host), n.on("connect", function() {
          n.cancel(
            e.processID,
            e.secretKey
          );
        });
      } else e.queryQueue.indexOf(t) !== -1 && e.queryQueue.splice(e.queryQueue.indexOf(t), 1);
    }
    setTypeParser(e, t, n) {
      return this._types.setTypeParser(e, t, n);
    }
    getTypeParser(e, t) {
      return this._types.getTypeParser(e, t);
    }
    escapeIdentifier(e) {
      return '"' + e.replace(
        /"/g,
        '""'
      ) + '"';
    }
    escapeLiteral(e) {
      for (var t = false, n = "'", i = 0; i < e.length; i++) {
        var s = e[i];
        s === "'" ? n += s + s : s === "\\" ? (n += s + s, t = true) : n += s;
      }
      return n += "'", t === true && (n = " E" + n), n;
    }
    _pulseQueryQueue() {
      if (this.readyForQuery === true) if (this.activeQuery = this.queryQueue.shift(), this.activeQuery) {
        this.readyForQuery = false, this.hasExecuted = true;
        let e = this.activeQuery.submit(this.connection);
        e && m.nextTick(() => {
          this.activeQuery.handleError(e, this.connection), this.readyForQuery = true, this._pulseQueryQueue();
        });
      } else this.hasExecuted && (this.activeQuery = null, this.emit("drain"));
    }
    query(e, t, n) {
      var i, s, o, u, c;
      if (e == null) throw new TypeError("Client was passed a null or undefined query");
      return typeof e.submit == "function" ? (o = e.query_timeout || this.connectionParameters.query_timeout, s = i = e, typeof t == "function" && (i.callback = i.callback || t)) : (o = this.connectionParameters.query_timeout, i = new Ls(
        e,
        t,
        n
      ), i.callback || (s = new this._Promise((h, l) => {
        i.callback = (d, b) => d ? l(d) : h(b);
      }))), o && (c = i.callback, u = setTimeout(() => {
        var h = new Error("Query read timeout");
        m.nextTick(
          () => {
            i.handleError(h, this.connection);
          }
        ), c(h), i.callback = () => {
        };
        var l = this.queryQueue.indexOf(i);
        l > -1 && this.queryQueue.splice(l, 1), this._pulseQueryQueue();
      }, o), i.callback = (h, l) => {
        clearTimeout(u), c(h, l);
      }), this.binary && !i.binary && (i.binary = true), i._result && !i._result._types && (i._result._types = this._types), this._queryable ? this._ending ? (m.nextTick(() => {
        i.handleError(
          new Error("Client was closed and is not queryable"),
          this.connection
        );
      }), s) : (this.queryQueue.push(i), this._pulseQueryQueue(), s) : (m.nextTick(
        () => {
          i.handleError(new Error("Client has encountered a connection error and is not queryable"), this.connection);
        }
      ), s);
    }
    ref() {
      this.connection.ref();
    }
    unref() {
      this.connection.unref();
    }
    end(e) {
      if (this._ending = true, !this.connection._connecting) if (e) e();
      else return this._Promise.resolve();
      if (this.activeQuery || !this._queryable ? this.connection.stream.destroy() : this.connection.end(), e) this.connection.once("end", e);
      else return new this._Promise((t) => {
        this.connection.once("end", t);
      });
    }
  };
  a(yn, "Client");
  var Ct = yn;
  Ct.Query = Ls;
  Rs.exports = Ct;
});
var Us = I((pf, ks) => {
  "use strict";
  p();
  var Ac = ge().EventEmitter, Ms = a(function() {
  }, "NOOP"), Ds = a(
    (r, e) => {
      let t = r.findIndex(e);
      return t === -1 ? void 0 : r.splice(t, 1)[0];
    },
    "removeWhere"
  ), wn = class wn {
    constructor(e, t, n) {
      this.client = e, this.idleListener = t, this.timeoutId = n;
    }
  };
  a(wn, "IdleItem");
  var mn = wn, bn = class bn {
    constructor(e) {
      this.callback = e;
    }
  };
  a(bn, "PendingItem");
  var Ne = bn;
  function Cc() {
    throw new Error("Release called on client which has already been released to the pool.");
  }
  a(Cc, "throwOnDoubleRelease");
  function Tt(r, e) {
    if (e) return { callback: e, result: void 0 };
    let t, n, i = a(function(o, u) {
      o ? t(o) : n(u);
    }, "cb"), s = new r(function(o, u) {
      n = o, t = u;
    }).catch((o) => {
      throw Error.captureStackTrace(
        o
      ), o;
    });
    return { callback: i, result: s };
  }
  a(Tt, "promisify");
  function Tc(r, e) {
    return a(
      function t(n) {
        n.client = e, e.removeListener("error", t), e.on("error", () => {
          r.log("additional client error after disconnection due to error", n);
        }), r._remove(e), r.emit("error", n, e);
      },
      "idleListener"
    );
  }
  a(Tc, "makeIdleListener");
  var Sn = class Sn extends Ac {
    constructor(e, t) {
      super(), this.options = Object.assign({}, e), e != null && "password" in e && Object.defineProperty(
        this.options,
        "password",
        { configurable: true, enumerable: false, writable: true, value: e.password }
      ), e != null && e.ssl && e.ssl.key && Object.defineProperty(this.options.ssl, "key", { enumerable: false }), this.options.max = this.options.max || this.options.poolSize || 10, this.options.maxUses = this.options.maxUses || 1 / 0, this.options.allowExitOnIdle = this.options.allowExitOnIdle || false, this.options.maxLifetimeSeconds = this.options.maxLifetimeSeconds || 0, this.log = this.options.log || function() {
      }, this.Client = this.options.Client || t || It().Client, this.Promise = this.options.Promise || S.Promise, typeof this.options.idleTimeoutMillis > "u" && (this.options.idleTimeoutMillis = 1e4), this._clients = [], this._idle = [], this._expired = /* @__PURE__ */ new WeakSet(), this._pendingQueue = [], this._endCallback = void 0, this.ending = false, this.ended = false;
    }
    _isFull() {
      return this._clients.length >= this.options.max;
    }
    _pulseQueue() {
      if (this.log("pulse queue"), this.ended) {
        this.log("pulse queue ended");
        return;
      }
      if (this.ending) {
        this.log(
          "pulse queue on ending"
        ), this._idle.length && this._idle.slice().map((t) => {
          this._remove(
            t.client
          );
        }), this._clients.length || (this.ended = true, this._endCallback());
        return;
      }
      if (!this._pendingQueue.length) {
        this.log("no queued requests");
        return;
      }
      if (!this._idle.length && this._isFull()) return;
      let e = this._pendingQueue.shift();
      if (this._idle.length) {
        let t = this._idle.pop();
        clearTimeout(t.timeoutId);
        let n = t.client;
        n.ref && n.ref();
        let i = t.idleListener;
        return this._acquireClient(n, e, i, false);
      }
      if (!this._isFull()) return this.newClient(e);
      throw new Error("unexpected condition");
    }
    _remove(e) {
      let t = Ds(this._idle, (n) => n.client === e);
      t !== void 0 && clearTimeout(t.timeoutId), this._clients = this._clients.filter((n) => n !== e), e.end(), this.emit("remove", e);
    }
    connect(e) {
      if (this.ending) {
        let i = new Error("Cannot use a pool after calling end on the pool");
        return e ? e(i) : this.Promise.reject(
          i
        );
      }
      let t = Tt(this.Promise, e), n = t.result;
      if (this._isFull() || this._idle.length) {
        if (this._idle.length && m.nextTick(() => this._pulseQueue()), !this.options.connectionTimeoutMillis)
          return this._pendingQueue.push(new Ne(t.callback)), n;
        let i = a((u, c, h) => {
          clearTimeout(
            o
          ), t.callback(u, c, h);
        }, "queueCallback"), s = new Ne(i), o = setTimeout(() => {
          Ds(
            this._pendingQueue,
            (u) => u.callback === i
          ), s.timedOut = true, t.callback(new Error("timeout exceeded when trying to connect"));
        }, this.options.connectionTimeoutMillis);
        return this._pendingQueue.push(s), n;
      }
      return this.newClient(new Ne(t.callback)), n;
    }
    newClient(e) {
      let t = new this.Client(this.options);
      this._clients.push(t);
      let n = Tc(this, t);
      this.log("checking client timeout");
      let i, s = false;
      this.options.connectionTimeoutMillis && (i = setTimeout(() => {
        this.log("ending client due to timeout"), s = true, t.connection ? t.connection.stream.destroy() : t.end();
      }, this.options.connectionTimeoutMillis)), this.log("connecting new client"), t.connect((o) => {
        if (i && clearTimeout(i), t.on("error", n), o) this.log("client failed to connect", o), this._clients = this._clients.filter((u) => u !== t), s && (o.message = "Connection terminated due to connection timeout"), this._pulseQueue(), e.timedOut || e.callback(
          o,
          void 0,
          Ms
        );
        else {
          if (this.log("new client connected"), this.options.maxLifetimeSeconds !== 0) {
            let u = setTimeout(() => {
              this.log("ending client due to expired lifetime"), this._expired.add(t), this._idle.findIndex((h) => h.client === t) !== -1 && this._acquireClient(
                t,
                new Ne((h, l, d) => d()),
                n,
                false
              );
            }, this.options.maxLifetimeSeconds * 1e3);
            u.unref(), t.once(
              "end",
              () => clearTimeout(u)
            );
          }
          return this._acquireClient(t, e, n, true);
        }
      });
    }
    _acquireClient(e, t, n, i) {
      i && this.emit("connect", e), this.emit("acquire", e), e.release = this._releaseOnce(e, n), e.removeListener("error", n), t.timedOut ? i && this.options.verify ? this.options.verify(
        e,
        e.release
      ) : e.release() : i && this.options.verify ? this.options.verify(e, (s) => {
        if (s) return e.release(s), t.callback(s, void 0, Ms);
        t.callback(void 0, e, e.release);
      }) : t.callback(
        void 0,
        e,
        e.release
      );
    }
    _releaseOnce(e, t) {
      let n = false;
      return (i) => {
        n && Cc(), n = true, this._release(
          e,
          t,
          i
        );
      };
    }
    _release(e, t, n) {
      if (e.on("error", t), e._poolUseCount = (e._poolUseCount || 0) + 1, this.emit("release", n, e), n || this.ending || !e._queryable || e._ending || e._poolUseCount >= this.options.maxUses) {
        e._poolUseCount >= this.options.maxUses && this.log("remove expended client"), this._remove(e), this._pulseQueue();
        return;
      }
      if (this._expired.has(e)) {
        this.log("remove expired client"), this._expired.delete(e), this._remove(e), this._pulseQueue();
        return;
      }
      let s;
      this.options.idleTimeoutMillis && (s = setTimeout(() => {
        this.log("remove idle client"), this._remove(e);
      }, this.options.idleTimeoutMillis), this.options.allowExitOnIdle && s.unref()), this.options.allowExitOnIdle && e.unref(), this._idle.push(new mn(e, t, s)), this._pulseQueue();
    }
    query(e, t, n) {
      if (typeof e == "function") {
        let s = Tt(this.Promise, e);
        return x(function() {
          return s.callback(new Error("Passing a function as the first parameter to pool.query is not supported"));
        }), s.result;
      }
      typeof t == "function" && (n = t, t = void 0);
      let i = Tt(this.Promise, n);
      return n = i.callback, this.connect((s, o) => {
        if (s)
          return n(s);
        let u = false, c = a((h) => {
          u || (u = true, o.release(h), n(h));
        }, "onError");
        o.once("error", c), this.log("dispatching query");
        try {
          o.query(e, t, (h, l) => {
            if (this.log("query dispatched"), o.removeListener("error", c), !u) return u = true, o.release(h), h ? n(h) : n(
              void 0,
              l
            );
          });
        } catch (h) {
          return o.release(h), n(h);
        }
      }), i.result;
    }
    end(e) {
      if (this.log("ending"), this.ending) {
        let n = new Error("Called end on pool more than once");
        return e ? e(n) : this.Promise.reject(n);
      }
      this.ending = true;
      let t = Tt(this.Promise, e);
      return this._endCallback = t.callback, this._pulseQueue(), t.result;
    }
    get waitingCount() {
      return this._pendingQueue.length;
    }
    get idleCount() {
      return this._idle.length;
    }
    get expiredCount() {
      return this._clients.reduce((e, t) => e + (this._expired.has(t) ? 1 : 0), 0);
    }
    get totalCount() {
      return this._clients.length;
    }
  };
  a(Sn, "Pool");
  var gn = Sn;
  ks.exports = gn;
});
var Os = {};
se(Os, { default: () => Ic });
var Ic;
var Ns = z(() => {
  "use strict";
  p();
  Ic = {};
});
var qs = I((gf, Pc) => {
  Pc.exports = { name: "pg", version: "8.8.0", description: "PostgreSQL client - pure javascript & libpq with the same API", keywords: [
    "database",
    "libpq",
    "pg",
    "postgre",
    "postgres",
    "postgresql",
    "rdbms"
  ], homepage: "https://github.com/brianc/node-postgres", repository: { type: "git", url: "git://github.com/brianc/node-postgres.git", directory: "packages/pg" }, author: "Brian Carlson <brian.m.carlson@gmail.com>", main: "./lib", dependencies: {
    "buffer-writer": "2.0.0",
    "packet-reader": "1.0.0",
    "pg-connection-string": "^2.5.0",
    "pg-pool": "^3.5.2",
    "pg-protocol": "^1.5.0",
    "pg-types": "^2.1.0",
    pgpass: "1.x"
  }, devDependencies: { async: "2.6.4", bluebird: "3.5.2", co: "4.6.0", "pg-copy-streams": "0.3.0" }, peerDependencies: { "pg-native": ">=3.0.1" }, peerDependenciesMeta: {
    "pg-native": { optional: true }
  }, scripts: { test: "make test-all" }, files: ["lib", "SPONSORS.md"], license: "MIT", engines: { node: ">= 8.0.0" }, gitHead: "c99fb2c127ddf8d712500db2c7b9a5491a178655" };
});
var Ws = I((wf, js) => {
  "use strict";
  p();
  var Qs = ge().EventEmitter, Bc = (Ge(), O(He)), xn = tt(), qe = js.exports = function(r, e, t) {
    Qs.call(this), r = xn.normalizeQueryConfig(r, e, t), this.text = r.text, this.values = r.values, this.name = r.name, this.callback = r.callback, this.state = "new", this._arrayMode = r.rowMode === "array", this._emitRowEvents = false, this.on("newListener", function(n) {
      n === "row" && (this._emitRowEvents = true);
    }.bind(this));
  };
  Bc.inherits(
    qe,
    Qs
  );
  var Lc = { sqlState: "code", statementPosition: "position", messagePrimary: "message", context: "where", schemaName: "schema", tableName: "table", columnName: "column", dataTypeName: "dataType", constraintName: "constraint", sourceFile: "file", sourceLine: "line", sourceFunction: "routine" };
  qe.prototype.handleError = function(r) {
    var e = this.native.pq.resultErrorFields();
    if (e) for (var t in e) {
      var n = Lc[t] || t;
      r[n] = e[t];
    }
    this.callback ? this.callback(r) : this.emit("error", r), this.state = "error";
  };
  qe.prototype.then = function(r, e) {
    return this._getPromise().then(r, e);
  };
  qe.prototype.catch = function(r) {
    return this._getPromise().catch(r);
  };
  qe.prototype._getPromise = function() {
    return this._promise ? this._promise : (this._promise = new Promise(function(r, e) {
      this._once("end", r), this._once(
        "error",
        e
      );
    }.bind(this)), this._promise);
  };
  qe.prototype.submit = function(r) {
    this.state = "running";
    var e = this;
    this.native = r.native, r.native.arrayMode = this._arrayMode;
    var t = a(
      function(s, o, u) {
        if (r.native.arrayMode = false, x(function() {
          e.emit("_done");
        }), s) return e.handleError(s);
        e._emitRowEvents && (u.length > 1 ? o.forEach((c, h) => {
          c.forEach((l) => {
            e.emit(
              "row",
              l,
              u[h]
            );
          });
        }) : o.forEach(function(c) {
          e.emit("row", c, u);
        })), e.state = "end", e.emit(
          "end",
          u
        ), e.callback && e.callback(null, u);
      },
      "after"
    );
    if (m.domain && (t = m.domain.bind(
      t
    )), this.name) {
      this.name.length > 63 && (console.error("Warning! Postgres only supports 63 characters for query names."), console.error(
        "You supplied %s (%s)",
        this.name,
        this.name.length
      ), console.error("This can cause conflicts and silent errors executing queries"));
      var n = (this.values || []).map(xn.prepareValue);
      if (r.namedQueries[this.name]) {
        if (this.text && r.namedQueries[this.name] !== this.text) {
          let s = new Error(`Prepared statements must be unique - '${this.name}' was used for a different statement`);
          return t(s);
        }
        return r.native.execute(this.name, n, t);
      }
      return r.native.prepare(
        this.name,
        this.text,
        n.length,
        function(s) {
          return s ? t(s) : (r.namedQueries[e.name] = e.text, e.native.execute(e.name, n, t));
        }
      );
    } else if (this.values) {
      if (!Array.isArray(this.values)) {
        let s = new Error("Query values must be an array");
        return t(s);
      }
      var i = this.values.map(xn.prepareValue);
      r.native.query(this.text, i, t);
    } else r.native.query(this.text, t);
  };
});
var Vs = I((Ef, $s) => {
  "use strict";
  p();
  var Rc = (Ns(), O(Os)), Fc = wt(), xf = qs(), Hs = ge().EventEmitter, Mc = (Ge(), O(He)), Dc = bt(), Gs = Ws(), J = $s.exports = function(r) {
    Hs.call(this), r = r || {}, this._Promise = r.Promise || S.Promise, this._types = new Fc(r.types), this.native = new Rc({ types: this._types }), this._queryQueue = [], this._ending = false, this._connecting = false, this._connected = false, this._queryable = true;
    var e = this.connectionParameters = new Dc(
      r
    );
    this.user = e.user, Object.defineProperty(this, "password", {
      configurable: true,
      enumerable: false,
      writable: true,
      value: e.password
    }), this.database = e.database, this.host = e.host, this.port = e.port, this.namedQueries = {};
  };
  J.Query = Gs;
  Mc.inherits(J, Hs);
  J.prototype._errorAllQueries = function(r) {
    let e = a(
      (t) => {
        m.nextTick(() => {
          t.native = this.native, t.handleError(r);
        });
      },
      "enqueueError"
    );
    this._hasActiveQuery() && (e(this._activeQuery), this._activeQuery = null), this._queryQueue.forEach(e), this._queryQueue.length = 0;
  };
  J.prototype._connect = function(r) {
    var e = this;
    if (this._connecting) {
      m.nextTick(() => r(new Error("Client has already been connected. You cannot reuse a client.")));
      return;
    }
    this._connecting = true, this.connectionParameters.getLibpqConnectionString(function(t, n) {
      if (t) return r(
        t
      );
      e.native.connect(n, function(i) {
        if (i) return e.native.end(), r(i);
        e._connected = true, e.native.on("error", function(s) {
          e._queryable = false, e._errorAllQueries(s), e.emit("error", s);
        }), e.native.on("notification", function(s) {
          e.emit("notification", { channel: s.relname, payload: s.extra });
        }), e.emit("connect"), e._pulseQueryQueue(true), r();
      });
    });
  };
  J.prototype.connect = function(r) {
    if (r) {
      this._connect(r);
      return;
    }
    return new this._Promise(
      (e, t) => {
        this._connect((n) => {
          n ? t(n) : e();
        });
      }
    );
  };
  J.prototype.query = function(r, e, t) {
    var n, i, s, o, u;
    if (r == null) throw new TypeError("Client was passed a null or undefined query");
    if (typeof r.submit == "function") s = r.query_timeout || this.connectionParameters.query_timeout, i = n = r, typeof e == "function" && (r.callback = e);
    else if (s = this.connectionParameters.query_timeout, n = new Gs(r, e, t), !n.callback) {
      let c, h;
      i = new this._Promise((l, d) => {
        c = l, h = d;
      }), n.callback = (l, d) => l ? h(l) : c(d);
    }
    return s && (u = n.callback, o = setTimeout(() => {
      var c = new Error("Query read timeout");
      m.nextTick(() => {
        n.handleError(c, this.connection);
      }), u(c), n.callback = () => {
      };
      var h = this._queryQueue.indexOf(n);
      h > -1 && this._queryQueue.splice(h, 1), this._pulseQueryQueue();
    }, s), n.callback = (c, h) => {
      clearTimeout(o), u(c, h);
    }), this._queryable ? this._ending ? (n.native = this.native, m.nextTick(() => {
      n.handleError(
        new Error("Client was closed and is not queryable")
      );
    }), i) : (this._queryQueue.push(
      n
    ), this._pulseQueryQueue(), i) : (n.native = this.native, m.nextTick(() => {
      n.handleError(
        new Error("Client has encountered a connection error and is not queryable")
      );
    }), i);
  };
  J.prototype.end = function(r) {
    var e = this;
    this._ending = true, this._connected || this.once(
      "connect",
      this.end.bind(this, r)
    );
    var t;
    return r || (t = new this._Promise(function(n, i) {
      r = a((s) => s ? i(s) : n(), "cb");
    })), this.native.end(function() {
      e._errorAllQueries(new Error(
        "Connection terminated"
      )), m.nextTick(() => {
        e.emit("end"), r && r();
      });
    }), t;
  };
  J.prototype._hasActiveQuery = function() {
    return this._activeQuery && this._activeQuery.state !== "error" && this._activeQuery.state !== "end";
  };
  J.prototype._pulseQueryQueue = function(r) {
    if (this._connected && !this._hasActiveQuery()) {
      var e = this._queryQueue.shift();
      if (!e) {
        r || this.emit("drain");
        return;
      }
      this._activeQuery = e, e.submit(this);
      var t = this;
      e.once(
        "_done",
        function() {
          t._pulseQueryQueue();
        }
      );
    }
  };
  J.prototype.cancel = function(r) {
    this._activeQuery === r ? this.native.cancel(function() {
    }) : this._queryQueue.indexOf(r) !== -1 && this._queryQueue.splice(this._queryQueue.indexOf(r), 1);
  };
  J.prototype.ref = function() {
  };
  J.prototype.unref = function() {
  };
  J.prototype.setTypeParser = function(r, e, t) {
    return this._types.setTypeParser(r, e, t);
  };
  J.prototype.getTypeParser = function(r, e) {
    return this._types.getTypeParser(r, e);
  };
});
var En = I((Af, Ks) => {
  "use strict";
  p();
  Ks.exports = Vs();
});
var It = I((Tf, nt) => {
  "use strict";
  p();
  var kc = Fs(), Uc = et(), Oc = pn(), Nc = Us(), { DatabaseError: qc } = hn(), Qc = a((r) => {
    var e;
    return e = class extends Nc {
      constructor(n) {
        super(n, r);
      }
    }, a(e, "BoundPool"), e;
  }, "poolFactory"), vn = a(function(r) {
    this.defaults = Uc, this.Client = r, this.Query = this.Client.Query, this.Pool = Qc(this.Client), this._pools = [], this.Connection = Oc, this.types = Xe(), this.DatabaseError = qc;
  }, "PG");
  typeof m.env.NODE_PG_FORCE_NATIVE < "u" ? nt.exports = new vn(En()) : (nt.exports = new vn(kc), Object.defineProperty(nt.exports, "native", { configurable: true, enumerable: false, get() {
    var r = null;
    try {
      r = new vn(En());
    } catch (e) {
      if (e.code !== "MODULE_NOT_FOUND") throw e;
    }
    return Object.defineProperty(nt.exports, "native", { value: r }), r;
  } }));
});
p();
var Bt = Te(It());
St();
p();
St();
mr();
var Zs = Te(tt());
var Js = Te(wt());
function jc(r) {
  return r instanceof y ? "\\x" + r.toString("hex") : r;
}
a(jc, "encodeBuffersAsBytea");
var Pt = class Pt2 extends Error {
  constructor(t) {
    super(t);
    _(
      this,
      "name",
      "NeonDbError"
    );
    _(this, "severity");
    _(this, "code");
    _(this, "detail");
    _(this, "hint");
    _(this, "position");
    _(this, "internalPosition");
    _(this, "internalQuery");
    _(this, "where");
    _(this, "schema");
    _(this, "table");
    _(this, "column");
    _(this, "dataType");
    _(
      this,
      "constraint"
    );
    _(this, "file");
    _(this, "line");
    _(this, "routine");
    _(this, "sourceError");
    "captureStackTrace" in Error && typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, Pt2);
  }
};
a(Pt, "NeonDbError");
var pe = Pt;
var zs = "transaction() expects an array of queries, or a function returning an array of queries";
var Wc = ["severity", "code", "detail", "hint", "position", "internalPosition", "internalQuery", "where", "schema", "table", "column", "dataType", "constraint", "file", "line", "routine"];
function Xs(r, {
  arrayMode: e,
  fullResults: t,
  fetchOptions: n,
  isolationLevel: i,
  readOnly: s,
  deferrable: o,
  queryCallback: u,
  resultCallback: c,
  authToken: h
} = {}) {
  if (!r) throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");
  let l;
  try {
    l = yr(r);
  } catch {
    throw new Error("Database connection string provided to `neon()` is not a valid URL. Connection string: " + String(r));
  }
  let { protocol: d, username: b, hostname: C, port: B, pathname: Q } = l;
  if (d !== "postgres:" && d !== "postgresql:" || !b || !C || !Q) throw new Error("Database connection string format for `neon()` should be: postgresql://user:password@host.tld/dbname?option=value");
  function X(A, ...g) {
    let P, K;
    if (typeof A == "string") P = A, K = g[1], g = g[0] ?? [];
    else {
      P = "";
      for (let j = 0; j < A.length; j++)
        P += A[j], j < g.length && (P += "$" + (j + 1));
    }
    g = g.map((j) => jc((0, Zs.prepareValue)(j)));
    let k = {
      query: P,
      params: g
    };
    return u && u(k), Hc(de, k, K);
  }
  a(X, "resolve"), X.transaction = async (A, g) => {
    if (typeof A == "function" && (A = A(X)), !Array.isArray(A)) throw new Error(zs);
    A.forEach(
      (k) => {
        if (k[Symbol.toStringTag] !== "NeonQueryPromise") throw new Error(zs);
      }
    );
    let P = A.map((k) => k.parameterizedQuery), K = A.map((k) => k.opts ?? {});
    return de(P, K, g);
  };
  async function de(A, g, P) {
    let { fetchEndpoint: K, fetchFunction: k } = _e, j = Array.isArray(A) ? { queries: A } : A, ee = n ?? {}, oe = e ?? false, R = t ?? false, $ = i, ce = s, ye = o;
    P !== void 0 && (P.fetchOptions !== void 0 && (ee = {
      ...ee,
      ...P.fetchOptions
    }), P.arrayMode !== void 0 && (oe = P.arrayMode), P.fullResults !== void 0 && (R = P.fullResults), P.isolationLevel !== void 0 && ($ = P.isolationLevel), P.readOnly !== void 0 && (ce = P.readOnly), P.deferrable !== void 0 && (ye = P.deferrable)), g !== void 0 && !Array.isArray(
      g
    ) && g.fetchOptions !== void 0 && (ee = { ...ee, ...g.fetchOptions });
    let Se = h;
    !Array.isArray(
      g
    ) && g?.authToken !== void 0 && (Se = g.authToken);
    let je = typeof K == "function" ? K(C, B, { jwtAuth: Se !== void 0 }) : K, he = { "Neon-Connection-String": r, "Neon-Raw-Text-Output": "true", "Neon-Array-Mode": "true" }, it = await Gc(Se);
    it && (he.Authorization = `Bearer ${it}`), Array.isArray(
      A
    ) && ($ !== void 0 && (he["Neon-Batch-Isolation-Level"] = $), ce !== void 0 && (he["Neon-Batch-Read-Only"] = String(ce)), ye !== void 0 && (he["Neon-Batch-Deferrable"] = String(ye)));
    let te;
    try {
      te = await (k ?? fetch)(je, {
        method: "POST",
        body: JSON.stringify(j),
        headers: he,
        ...ee
      });
    } catch (W) {
      let H = new pe(`Error connecting to database: ${W.message}`);
      throw H.sourceError = W, H;
    }
    if (te.ok) {
      let W = await te.json();
      if (Array.isArray(A)) {
        let H = W.results;
        if (!Array.isArray(H)) throw new pe("Neon internal error: unexpected result format");
        return H.map((Ae, xe) => {
          let Lt = g[xe] ?? {}, ro = Lt.arrayMode ?? oe, no = Lt.fullResults ?? R;
          return Ys(Ae, {
            arrayMode: ro,
            fullResults: no,
            parameterizedQuery: A[xe],
            resultCallback: c,
            types: Lt.types
          });
        });
      } else {
        let H = g ?? {}, Ae = H.arrayMode ?? oe, xe = H.fullResults ?? R;
        return Ys(
          W,
          { arrayMode: Ae, fullResults: xe, parameterizedQuery: A, resultCallback: c, types: H.types }
        );
      }
    } else {
      let { status: W } = te;
      if (W === 400) {
        let H = await te.json(), Ae = new pe(H.message);
        for (let xe of Wc)
          Ae[xe] = H[xe] ?? void 0;
        throw Ae;
      } else {
        let H = await te.text();
        throw new pe(`Server error (HTTP status ${W}): ${H}`);
      }
    }
  }
  return a(de, "execute"), X;
}
a(Xs, "neon");
function Hc(r, e, t) {
  return { [Symbol.toStringTag]: "NeonQueryPromise", parameterizedQuery: e, opts: t, then: a(
    (n, i) => r(e, t).then(n, i),
    "then"
  ), catch: a((n) => r(e, t).catch(n), "catch"), finally: a((n) => r(
    e,
    t
  ).finally(n), "finally") };
}
a(Hc, "createNeonQueryPromise");
function Ys(r, {
  arrayMode: e,
  fullResults: t,
  parameterizedQuery: n,
  resultCallback: i,
  types: s
}) {
  let o = new Js.default(
    s
  ), u = r.fields.map((l) => l.name), c = r.fields.map((l) => o.getTypeParser(l.dataTypeID)), h = e === true ? r.rows.map((l) => l.map((d, b) => d === null ? null : c[b](d))) : r.rows.map((l) => Object.fromEntries(
    l.map((d, b) => [u[b], d === null ? null : c[b](d)])
  ));
  return i && i(n, r, h, { arrayMode: e, fullResults: t }), t ? (r.viaNeonFetch = true, r.rowAsArray = e, r.rows = h, r._parsers = c, r._types = o, r) : h;
}
a(Ys, "processQueryResult");
async function Gc(r) {
  if (typeof r == "string") return r;
  if (typeof r == "function") try {
    return await Promise.resolve(r());
  } catch (e) {
    let t = new pe("Error getting auth token.");
    throw e instanceof Error && (t = new pe(`Error getting auth token: ${e.message}`)), t;
  }
}
a(Gc, "getAuthToken");
var to = Te(bt());
var Qe = Te(It());
var An = class An2 extends Bt.Client {
  constructor(t) {
    super(t);
    this.config = t;
  }
  get neonConfig() {
    return this.connection.stream;
  }
  connect(t) {
    let { neonConfig: n } = this;
    n.forceDisablePgSSL && (this.ssl = this.connection.ssl = false), this.ssl && n.useSecureWebSocket && console.warn("SSL is enabled for both Postgres (e.g. ?sslmode=require in the connection string + forceDisablePgSSL = false) and the WebSocket tunnel (useSecureWebSocket = true). Double encryption will increase latency and CPU usage. It may be appropriate to disable SSL in the Postgres connection parameters or set forceDisablePgSSL = true.");
    let i = this.config?.host !== void 0 || this.config?.connectionString !== void 0 || m.env.PGHOST !== void 0, s = m.env.USER ?? m.env.USERNAME;
    if (!i && this.host === "localhost" && this.user === s && this.database === s && this.password === null) throw new Error(`No database host or connection string was set, and key parameters have default values (host: localhost, user: ${s}, db: ${s}, password: null). Is an environment variable missing? Alternatively, if you intended to connect with these parameters, please set the host to 'localhost' explicitly.`);
    let o = super.connect(t), u = n.pipelineTLS && this.ssl, c = n.pipelineConnect === "password";
    if (!u && !n.pipelineConnect) return o;
    let h = this.connection;
    if (u && h.on("connect", () => h.stream.emit("data", "S")), c) {
      h.removeAllListeners(
        "authenticationCleartextPassword"
      ), h.removeAllListeners("readyForQuery"), h.once(
        "readyForQuery",
        () => h.on("readyForQuery", this._handleReadyForQuery.bind(this))
      );
      let l = this.ssl ? "sslconnect" : "connect";
      h.on(l, () => {
        this._handleAuthCleartextPassword(), this._handleReadyForQuery();
      });
    }
    return o;
  }
  async _handleAuthSASLContinue(t) {
    let n = this.saslSession, i = this.password, s = t.data;
    if (n.message !== "SASLInitialResponse" || typeof i != "string" || typeof s != "string") throw new Error("SASL: protocol error");
    let o = Object.fromEntries(s.split(",").map((te) => {
      if (!/^.=/.test(te)) throw new Error("SASL: Invalid attribute pair entry");
      let W = te[0], H = te.substring(2);
      return [W, H];
    })), u = o.r, c = o.s, h = o.i;
    if (!u || !/^[!-+--~]+$/.test(u)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: nonce missing/unprintable");
    if (!c || !/^(?:[a-zA-Z0-9+/]{4})*(?:[a-zA-Z0-9+/]{2}==|[a-zA-Z0-9+/]{3}=)?$/.test(c)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: salt missing/not base64");
    if (!h || !/^[1-9][0-9]*$/.test(h)) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: missing/invalid iteration count");
    if (!u.startsWith(n.clientNonce)) throw new Error(
      "SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce does not start with client nonce"
    );
    if (u.length === n.clientNonce.length) throw new Error("SASL: SCRAM-SERVER-FIRST-MESSAGE: server nonce is too short");
    let l = parseInt(h, 10), d = y.from(c, "base64"), b = new TextEncoder(), C = b.encode(i), B = await w.subtle.importKey("raw", C, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]), Q = new Uint8Array(await w.subtle.sign("HMAC", B, y.concat([d, y.from(
      [0, 0, 0, 1]
    )]))), X = Q;
    for (var de = 0; de < l - 1; de++) Q = new Uint8Array(await w.subtle.sign(
      "HMAC",
      B,
      Q
    )), X = y.from(X.map((te, W) => X[W] ^ Q[W]));
    let A = X, g = await w.subtle.importKey(
      "raw",
      A,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    ), P = new Uint8Array(await w.subtle.sign("HMAC", g, b.encode("Client Key"))), K = await w.subtle.digest(
      "SHA-256",
      P
    ), k = "n=*,r=" + n.clientNonce, j = "r=" + u + ",s=" + c + ",i=" + l, ee = "c=biws,r=" + u, oe = k + "," + j + "," + ee, R = await w.subtle.importKey(
      "raw",
      K,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );
    var $ = new Uint8Array(await w.subtle.sign("HMAC", R, b.encode(oe))), ce = y.from(P.map((te, W) => P[W] ^ $[W])), ye = ce.toString("base64");
    let Se = await w.subtle.importKey(
      "raw",
      A,
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    ), je = await w.subtle.sign(
      "HMAC",
      Se,
      b.encode("Server Key")
    ), he = await w.subtle.importKey("raw", je, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign"]);
    var it = y.from(await w.subtle.sign(
      "HMAC",
      he,
      b.encode(oe)
    ));
    n.message = "SASLResponse", n.serverSignature = it.toString("base64"), n.response = ee + ",p=" + ye, this.connection.sendSCRAMClientFinalMessage(this.saslSession.response);
  }
};
a(An, "NeonClient");
var _n = An;
function $c(r, e) {
  if (e) return {
    callback: e,
    result: void 0
  };
  let t, n, i = a(function(o, u) {
    o ? t(o) : n(u);
  }, "cb"), s = new r(function(o, u) {
    n = o, t = u;
  });
  return { callback: i, result: s };
}
a($c, "promisify");
var Cn = class Cn2 extends Bt.Pool {
  constructor() {
    super(...arguments);
    _(this, "Client", _n);
    _(this, "hasFetchUnsupportedListeners", false);
  }
  on(t, n) {
    return t !== "error" && (this.hasFetchUnsupportedListeners = true), super.on(t, n);
  }
  query(t, n, i) {
    if (!_e.poolQueryViaFetch || this.hasFetchUnsupportedListeners || typeof t == "function")
      return super.query(t, n, i);
    typeof n == "function" && (i = n, n = void 0);
    let s = $c(
      this.Promise,
      i
    );
    i = s.callback;
    try {
      let o = new to.default(this.options), u = encodeURIComponent, c = encodeURI, h = `postgresql://${u(o.user)}:${u(o.password)}@${u(o.host)}/${c(o.database)}`, l = typeof t == "string" ? t : t.text, d = n ?? t.values ?? [];
      Xs(h, { fullResults: true, arrayMode: t.rowMode === "array" })(l, d, { types: t.types ?? this.options?.types }).then((C) => i(void 0, C)).catch((C) => i(
        C
      ));
    } catch (o) {
      i(o);
    }
    return s.result;
  }
};
a(Cn, "NeonPool");
var eo = Cn;
var export_ClientBase = Qe.ClientBase;
var export_Connection = Qe.Connection;
var export_DatabaseError = Qe.DatabaseError;
var export_Query = Qe.Query;
var export_defaults = Qe.defaults;
var export_types = Qe.types;

// ../../packages/db/node_modules/@prisma/driver-adapter-utils/dist/index.mjs
var import_debug = __toESM(require_dist(), 1);
function ok2(value) {
  return {
    ok: true,
    value,
    map(fn) {
      return ok2(fn(value));
    },
    flatMap(fn) {
      return fn(value);
    }
  };
}
function err(error) {
  return {
    ok: false,
    error,
    map() {
      return err(error);
    },
    flatMap() {
      return err(error);
    }
  };
}
var ColumnTypeEnum = {
  // Scalars
  Int32: 0,
  Int64: 1,
  Float: 2,
  Double: 3,
  Numeric: 4,
  Boolean: 5,
  Character: 6,
  Text: 7,
  Date: 8,
  Time: 9,
  DateTime: 10,
  Json: 11,
  Enum: 12,
  Bytes: 13,
  Set: 14,
  Uuid: 15,
  // Arrays
  Int32Array: 64,
  Int64Array: 65,
  FloatArray: 66,
  DoubleArray: 67,
  NumericArray: 68,
  BooleanArray: 69,
  CharacterArray: 70,
  TextArray: 71,
  DateArray: 72,
  TimeArray: 73,
  DateTimeArray: 74,
  JsonArray: 75,
  EnumArray: 76,
  BytesArray: 77,
  UuidArray: 78,
  // Custom
  UnknownNumber: 128
};

// ../../packages/db/node_modules/@prisma/adapter-neon/dist/index.mjs
var import_postgres_array = __toESM(require_postgres_array(), 1);
var name = "@prisma/adapter-neon";
var { builtins: ScalarColumnType, getTypeParser } = export_types;
var ArrayColumnType = {
  BIT_ARRAY: 1561,
  BOOL_ARRAY: 1e3,
  BYTEA_ARRAY: 1001,
  BPCHAR_ARRAY: 1014,
  CHAR_ARRAY: 1002,
  CIDR_ARRAY: 651,
  DATE_ARRAY: 1182,
  FLOAT4_ARRAY: 1021,
  FLOAT8_ARRAY: 1022,
  INET_ARRAY: 1041,
  INT2_ARRAY: 1005,
  INT4_ARRAY: 1007,
  INT8_ARRAY: 1016,
  JSONB_ARRAY: 3807,
  JSON_ARRAY: 199,
  MONEY_ARRAY: 791,
  NUMERIC_ARRAY: 1231,
  OID_ARRAY: 1028,
  TEXT_ARRAY: 1009,
  TIMESTAMP_ARRAY: 1115,
  TIME_ARRAY: 1183,
  UUID_ARRAY: 2951,
  VARBIT_ARRAY: 1563,
  VARCHAR_ARRAY: 1015,
  XML_ARRAY: 143
};
var _UnsupportedNativeDataType = class _UnsupportedNativeDataType2 extends Error {
  constructor(code) {
    super();
    this.type = _UnsupportedNativeDataType2.typeNames[code] || "Unknown";
    this.message = `Unsupported column type ${this.type}`;
  }
};
_UnsupportedNativeDataType.typeNames = {
  16: "bool",
  17: "bytea",
  18: "char",
  19: "name",
  20: "int8",
  21: "int2",
  22: "int2vector",
  23: "int4",
  24: "regproc",
  25: "text",
  26: "oid",
  27: "tid",
  28: "xid",
  29: "cid",
  30: "oidvector",
  32: "pg_ddl_command",
  71: "pg_type",
  75: "pg_attribute",
  81: "pg_proc",
  83: "pg_class",
  114: "json",
  142: "xml",
  194: "pg_node_tree",
  269: "table_am_handler",
  325: "index_am_handler",
  600: "point",
  601: "lseg",
  602: "path",
  603: "box",
  604: "polygon",
  628: "line",
  650: "cidr",
  700: "float4",
  701: "float8",
  705: "unknown",
  718: "circle",
  774: "macaddr8",
  790: "money",
  829: "macaddr",
  869: "inet",
  1033: "aclitem",
  1042: "bpchar",
  1043: "varchar",
  1082: "date",
  1083: "time",
  1114: "timestamp",
  1184: "timestamptz",
  1186: "interval",
  1266: "timetz",
  1560: "bit",
  1562: "varbit",
  1700: "numeric",
  1790: "refcursor",
  2202: "regprocedure",
  2203: "regoper",
  2204: "regoperator",
  2205: "regclass",
  2206: "regtype",
  2249: "record",
  2275: "cstring",
  2276: "any",
  2277: "anyarray",
  2278: "void",
  2279: "trigger",
  2280: "language_handler",
  2281: "internal",
  2283: "anyelement",
  2287: "_record",
  2776: "anynonarray",
  2950: "uuid",
  2970: "txid_snapshot",
  3115: "fdw_handler",
  3220: "pg_lsn",
  3310: "tsm_handler",
  3361: "pg_ndistinct",
  3402: "pg_dependencies",
  3500: "anyenum",
  3614: "tsvector",
  3615: "tsquery",
  3642: "gtsvector",
  3734: "regconfig",
  3769: "regdictionary",
  3802: "jsonb",
  3831: "anyrange",
  3838: "event_trigger",
  3904: "int4range",
  3906: "numrange",
  3908: "tsrange",
  3910: "tstzrange",
  3912: "daterange",
  3926: "int8range",
  4072: "jsonpath",
  4089: "regnamespace",
  4096: "regrole",
  4191: "regcollation",
  4451: "int4multirange",
  4532: "nummultirange",
  4533: "tsmultirange",
  4534: "tstzmultirange",
  4535: "datemultirange",
  4536: "int8multirange",
  4537: "anymultirange",
  4538: "anycompatiblemultirange",
  4600: "pg_brin_bloom_summary",
  4601: "pg_brin_minmax_multi_summary",
  5017: "pg_mcv_list",
  5038: "pg_snapshot",
  5069: "xid8",
  5077: "anycompatible",
  5078: "anycompatiblearray",
  5079: "anycompatiblenonarray",
  5080: "anycompatiblerange"
};
var UnsupportedNativeDataType = _UnsupportedNativeDataType;
function fieldToColumnType(fieldTypeId) {
  switch (fieldTypeId) {
    case ScalarColumnType.INT2:
    case ScalarColumnType.INT4:
      return ColumnTypeEnum.Int32;
    case ScalarColumnType.INT8:
      return ColumnTypeEnum.Int64;
    case ScalarColumnType.FLOAT4:
      return ColumnTypeEnum.Float;
    case ScalarColumnType.FLOAT8:
      return ColumnTypeEnum.Double;
    case ScalarColumnType.BOOL:
      return ColumnTypeEnum.Boolean;
    case ScalarColumnType.DATE:
      return ColumnTypeEnum.Date;
    case ScalarColumnType.TIME:
    case ScalarColumnType.TIMETZ:
      return ColumnTypeEnum.Time;
    case ScalarColumnType.TIMESTAMP:
    case ScalarColumnType.TIMESTAMPTZ:
      return ColumnTypeEnum.DateTime;
    case ScalarColumnType.NUMERIC:
    case ScalarColumnType.MONEY:
      return ColumnTypeEnum.Numeric;
    case ScalarColumnType.JSON:
    case ScalarColumnType.JSONB:
      return ColumnTypeEnum.Json;
    case ScalarColumnType.UUID:
      return ColumnTypeEnum.Uuid;
    case ScalarColumnType.OID:
      return ColumnTypeEnum.Int64;
    case ScalarColumnType.BPCHAR:
    case ScalarColumnType.TEXT:
    case ScalarColumnType.VARCHAR:
    case ScalarColumnType.BIT:
    case ScalarColumnType.VARBIT:
    case ScalarColumnType.INET:
    case ScalarColumnType.CIDR:
    case ScalarColumnType.XML:
      return ColumnTypeEnum.Text;
    case ScalarColumnType.BYTEA:
      return ColumnTypeEnum.Bytes;
    case ArrayColumnType.INT2_ARRAY:
    case ArrayColumnType.INT4_ARRAY:
      return ColumnTypeEnum.Int32Array;
    case ArrayColumnType.FLOAT4_ARRAY:
      return ColumnTypeEnum.FloatArray;
    case ArrayColumnType.FLOAT8_ARRAY:
      return ColumnTypeEnum.DoubleArray;
    case ArrayColumnType.NUMERIC_ARRAY:
    case ArrayColumnType.MONEY_ARRAY:
      return ColumnTypeEnum.NumericArray;
    case ArrayColumnType.BOOL_ARRAY:
      return ColumnTypeEnum.BooleanArray;
    case ArrayColumnType.CHAR_ARRAY:
      return ColumnTypeEnum.CharacterArray;
    case ArrayColumnType.BPCHAR_ARRAY:
    case ArrayColumnType.TEXT_ARRAY:
    case ArrayColumnType.VARCHAR_ARRAY:
    case ArrayColumnType.VARBIT_ARRAY:
    case ArrayColumnType.BIT_ARRAY:
    case ArrayColumnType.INET_ARRAY:
    case ArrayColumnType.CIDR_ARRAY:
    case ArrayColumnType.XML_ARRAY:
      return ColumnTypeEnum.TextArray;
    case ArrayColumnType.DATE_ARRAY:
      return ColumnTypeEnum.DateArray;
    case ArrayColumnType.TIME_ARRAY:
      return ColumnTypeEnum.TimeArray;
    case ArrayColumnType.TIMESTAMP_ARRAY:
      return ColumnTypeEnum.DateTimeArray;
    case ArrayColumnType.JSON_ARRAY:
    case ArrayColumnType.JSONB_ARRAY:
      return ColumnTypeEnum.JsonArray;
    case ArrayColumnType.BYTEA_ARRAY:
      return ColumnTypeEnum.BytesArray;
    case ArrayColumnType.UUID_ARRAY:
      return ColumnTypeEnum.UuidArray;
    case ArrayColumnType.INT8_ARRAY:
    case ArrayColumnType.OID_ARRAY:
      return ColumnTypeEnum.Int64Array;
    default:
      if (fieldTypeId >= 1e4) {
        return ColumnTypeEnum.Text;
      }
      throw new UnsupportedNativeDataType(fieldTypeId);
  }
}
function normalize_array(element_normalizer) {
  return (str) => (0, import_postgres_array.parse)(str, element_normalizer);
}
function normalize_numeric(numeric) {
  return numeric;
}
function normalize_date(date) {
  return date;
}
function normalize_timestamp(time2) {
  return time2;
}
function normalize_timestampz(time2) {
  return time2.split("+")[0];
}
function normalize_time(time2) {
  return time2;
}
function normalize_timez(time2) {
  return time2.split("+")[0];
}
function normalize_money(money) {
  return money.slice(1);
}
function normalize_xml(xml) {
  return xml;
}
function toJson(json) {
  return json;
}
function encodeBuffer(buffer) {
  return Array.from(new Uint8Array(buffer));
}
var parsePgBytes = getTypeParser(ScalarColumnType.BYTEA);
var parseBytesArray = getTypeParser(ArrayColumnType.BYTEA_ARRAY);
function normalizeByteaArray(serializedBytesArray) {
  const buffers = parseBytesArray(serializedBytesArray);
  return buffers.map((buf) => buf ? encodeBuffer(buf) : null);
}
function convertBytes(serializedBytes) {
  const buffer = parsePgBytes(serializedBytes);
  return encodeBuffer(buffer);
}
function normalizeBit(bit) {
  return bit;
}
var customParsers = {
  [ScalarColumnType.NUMERIC]: normalize_numeric,
  [ArrayColumnType.NUMERIC_ARRAY]: normalize_array(normalize_numeric),
  [ScalarColumnType.TIME]: normalize_time,
  [ArrayColumnType.TIME_ARRAY]: normalize_array(normalize_time),
  [ScalarColumnType.TIMETZ]: normalize_timez,
  [ScalarColumnType.DATE]: normalize_date,
  [ArrayColumnType.DATE_ARRAY]: normalize_array(normalize_date),
  [ScalarColumnType.TIMESTAMP]: normalize_timestamp,
  [ArrayColumnType.TIMESTAMP_ARRAY]: normalize_array(normalize_timestamp),
  [ScalarColumnType.TIMESTAMPTZ]: normalize_timestampz,
  [ScalarColumnType.MONEY]: normalize_money,
  [ArrayColumnType.MONEY_ARRAY]: normalize_array(normalize_money),
  [ScalarColumnType.JSON]: toJson,
  [ScalarColumnType.JSONB]: toJson,
  [ScalarColumnType.BYTEA]: convertBytes,
  [ArrayColumnType.BYTEA_ARRAY]: normalizeByteaArray,
  [ArrayColumnType.BIT_ARRAY]: normalize_array(normalizeBit),
  [ArrayColumnType.VARBIT_ARRAY]: normalize_array(normalizeBit),
  [ArrayColumnType.XML_ARRAY]: normalize_array(normalize_xml)
};
function fixArrayBufferValues(values) {
  for (let i = 0; i < values.length; i++) {
    const list = values[i];
    if (!Array.isArray(list)) {
      continue;
    }
    for (let j = 0; j < list.length; j++) {
      const listItem = list[j];
      if (ArrayBuffer.isView(listItem)) {
        list[j] = Buffer.from(listItem.buffer, listItem.byteOffset, listItem.byteLength);
      }
    }
  }
  return values;
}
var debug = (0, import_debug.Debug)("prisma:driver-adapter:neon");
var NeonQueryable = class {
  constructor() {
    this.provider = "postgres";
    this.adapterName = name;
  }
  /**
   * Execute a query given as SQL, interpolating the given parameters.
   */
  async queryRaw(query) {
    const tag = "[js::query_raw]";
    debug(`${tag} %O`, query);
    const res = await this.performIO(query);
    if (!res.ok) {
      return err(res.error);
    }
    const { fields, rows } = res.value;
    const columnNames = fields.map((field) => field.name);
    let columnTypes = [];
    try {
      columnTypes = fields.map((field) => fieldToColumnType(field.dataTypeID));
    } catch (e) {
      if (e instanceof UnsupportedNativeDataType) {
        return err({
          kind: "UnsupportedNativeDataType",
          type: e.type
        });
      }
      throw e;
    }
    return ok2({
      columnNames,
      columnTypes,
      rows
    });
  }
  /**
   * Execute a query given as SQL, interpolating the given parameters and
   * returning the number of affected rows.
   * Note: Queryable expects a u64, but napi.rs only supports u32.
   */
  async executeRaw(query) {
    const tag = "[js::execute_raw]";
    debug(`${tag} %O`, query);
    return (await this.performIO(query)).map((r) => r.rowCount ?? 0);
  }
};
var NeonWsQueryable = class extends NeonQueryable {
  constructor(client) {
    super();
    this.client = client;
  }
  async performIO(query) {
    const { sql, args: values } = query;
    try {
      const result = await this.client.query(
        {
          text: sql,
          values: fixArrayBufferValues(values),
          rowMode: "array",
          types: {
            // This is the error expected:
            // No overload matches this call.
            // The last overload gave the following error.
            //   Type '(oid: number, format?: any) => (json: string) => unknown' is not assignable to type '{ <T>(oid: number): TypeParser<string, string | T>; <T>(oid: number, format: "text"): TypeParser<string, string | T>; <T>(oid: number, format: "binary"): TypeParser<...>; }'.
            //     Type '(json: string) => unknown' is not assignable to type 'TypeParser<Buffer, any>'.
            //       Types of parameters 'json' and 'value' are incompatible.
            //         Type 'Buffer' is not assignable to type 'string'.ts(2769)
            //
            // Because pg-types types expect us to handle both binary and text protocol versions,
            // where as far we can see, pg will ever pass only text version.
            //
            // @ts-expect-error
            getTypeParser: (oid, format) => {
              if (format === "text" && customParsers[oid]) {
                return customParsers[oid];
              }
              return export_types.getTypeParser(oid, format);
            }
          }
        },
        fixArrayBufferValues(values)
      );
      return ok2(result);
    } catch (e) {
      debug("Error in performIO: %O", e);
      if (e && typeof e.code === "string" && typeof e.severity === "string" && typeof e.message === "string") {
        return err({
          kind: "Postgres",
          code: e.code,
          severity: e.severity,
          message: e.message,
          detail: e.detail,
          column: e.column,
          hint: e.hint
        });
      }
      throw e;
    }
  }
};
var NeonTransaction = class extends NeonWsQueryable {
  constructor(client, options) {
    super(client);
    this.options = options;
  }
  async commit() {
    debug(`[js::commit]`);
    this.client.release();
    return Promise.resolve(ok2(void 0));
  }
  async rollback() {
    debug(`[js::rollback]`);
    this.client.release();
    return Promise.resolve(ok2(void 0));
  }
};
var NeonTransactionContext = class extends NeonWsQueryable {
  constructor(conn) {
    super(conn);
    this.conn = conn;
  }
  async startTransaction() {
    const options = {
      usePhantomQuery: false
    };
    const tag = "[js::startTransaction]";
    debug("%s options: %O", tag, options);
    return ok2(new NeonTransaction(this.conn, options));
  }
};
var PrismaNeon = class extends NeonWsQueryable {
  constructor(pool, options) {
    if (!(pool instanceof eo)) {
      throw new TypeError(`PrismaNeon must be initialized with an instance of Pool:
import { Pool } from '@neondatabase/serverless'
const pool = new Pool({ connectionString: url })
const adapter = new PrismaNeon(pool)
`);
    }
    super(pool);
    this.options = options;
    this.isRunning = true;
  }
  getConnectionInfo() {
    return ok2({
      schemaName: this.options?.schema
    });
  }
  async transactionContext() {
    const conn = await this.client.connect();
    return ok2(new NeonTransactionContext(conn));
  }
  async close() {
    if (this.isRunning) {
      await this.client.end();
      this.isRunning = false;
    }
    return ok2(void 0);
  }
};

// ../../packages/db/src/index.ts
__reExport(src_exports, require("@prisma/client"));
function createPrismaClient() {
  const databaseUrl = process.env["DATABASE_URL"];
  const isServerless = !!process.env["VERCEL"] || !!process.env["AWS_LAMBDA_FUNCTION_NAME"] || process.env["PRISMA_USE_NEON_ADAPTER"] === "1";
  if (databaseUrl && isServerless) {
    const pool = new eo({ connectionString: databaseUrl });
    const adapter = new PrismaNeon(pool);
    return new import_client.PrismaClient({
      adapter,
      log: process.env["NODE_ENV"] === "development" ? ["error", "warn"] : ["error"]
    });
  }
  return new import_client.PrismaClient({
    log: process.env["NODE_ENV"] === "development" ? ["error", "warn"] : ["error"]
  });
}
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env["NODE_ENV"] !== "production") globalForPrisma.prisma = prisma;
var db = prisma;

// src/lib/jwt.ts
var import_jsonwebtoken = __toESM(require_jsonwebtoken());
var SECRET = process.env.JWT_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";
if (!SECRET) {
  console.warn(
    "[jwt] WARNING: neither JWT_SECRET nor NEXTAUTH_SECRET is set. Tokens will be insecure."
  );
}
var FALLBACK = "speedy-van-insecure-fallback-secret-change-me";
function signToken(payload) {
  return import_jsonwebtoken.default.sign(payload, SECRET || FALLBACK, { expiresIn: "7d" });
}
function verifyToken(token) {
  return import_jsonwebtoken.default.verify(token, SECRET || FALLBACK);
}

// src/middleware/auth.ts
async function authenticate(c) {
  const header = c.req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return { ok: false, status: 401, message: "Missing or malformed Authorization header" };
  }
  const token = header.slice(7);
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return { ok: false, status: 401, message: "Invalid or expired token" };
  }
  const user = await db.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isActive) {
    return { ok: false, status: 401, message: "User not found or inactive" };
  }
  return { ok: true, userId: user.id, role: user.role, email: user.email };
}
async function requireAuth(c, next) {
  const result = await authenticate(c);
  if (!result.ok) return c.json(fail(result.message, "UNAUTHORIZED"), 401);
  c.set("userId", result.userId);
  c.set("userRole", result.role);
  c.set("userEmail", result.email);
  await next();
}
function requireRole(...roles) {
  return async (c, next) => {
    const result = await authenticate(c);
    if (!result.ok) return c.json(fail(result.message, "UNAUTHORIZED"), 401);
    if (!roles.includes(result.role)) {
      return c.json(fail("Forbidden", "FORBIDDEN"), 403);
    }
    c.set("userId", result.userId);
    c.set("userRole", result.role);
    c.set("userEmail", result.email);
    await next();
  };
}
var requireAdmin = requireRole("ADMIN");
var requireDriver = requireRole("DRIVER");
var requireCustomer = requireRole("CUSTOMER");

// src/services/email.service.ts
var apiKey = process.env.RESEND_API_KEY;
var FROM = process.env.EMAIL_FROM ?? `Speedy Van <noreply@${SITE.domain}>`;
async function send(to2, subject, html) {
  if (!apiKey) {
    console.log(`[email] (no-key) \u2192 ${to2} | ${subject}`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ from: FROM, to: to2, subject, html })
    });
    if (!res.ok) {
      console.error(`[email] failed ${res.status}: ${await res.text()}`);
    }
  } catch (err2) {
    console.error("[email] send error:", err2);
  }
}
var baseTemplate = (heading, body) => `
<!doctype html>
<html><body style="font-family:-apple-system,system-ui,sans-serif;background:#f5f5f5;padding:40px;">
  <div style="max-width:560px;margin:auto;background:white;padding:32px;border-radius:8px;">
    <h1 style="color:#4f46e5;margin:0 0 16px;font-size:22px;">${heading}</h1>
    ${body}
    <hr style="margin:32px 0;border:none;border-top:1px solid #eee;">
    <p style="color:#777;font-size:12px;">${SITE.name} \u2014 ${SITE.email}</p>
  </div>
</body></html>`;
async function sendBookingConfirmation(booking) {
  await send(
    booking.customerEmail,
    `Booking confirmed \u2014 ${booking.reference}`,
    baseTemplate(
      "Booking confirmed!",
      `<p>Hi ${booking.customerName},</p>
       <p>Your booking <strong>${booking.reference}</strong> for ${booking.serviceName}
       on ${booking.scheduledAt.toUTCString()} is confirmed.</p>
       <p>Total paid: \xA3${booking.totalPrice.toFixed(2)}</p>`
    )
  );
}
async function sendDriverAssigned(booking, driverName) {
  await send(
    booking.customerEmail,
    `Driver assigned \u2014 ${booking.reference}`,
    baseTemplate(
      "Your driver is on the way",
      `<p>Your driver <strong>${driverName}</strong> has been assigned to booking
       <strong>${booking.reference}</strong>. You'll receive live updates as they progress.</p>`
    )
  );
}
async function sendJobCompleted(booking) {
  await send(
    booking.customerEmail,
    `Job completed \u2014 ${booking.reference}`,
    baseTemplate(
      "Move complete!",
      `<p>Booking <strong>${booking.reference}</strong> is now complete.
       We'd love to hear how it went \u2014 please reply to this email with feedback.</p>`
    )
  );
}
async function sendBookingCancelled(booking, refundAmount) {
  await send(
    booking.customerEmail,
    `Booking cancelled \u2014 ${booking.reference}`,
    baseTemplate(
      "Booking cancelled",
      `<p>Booking <strong>${booking.reference}</strong> has been cancelled.</p>
       <p>Refund amount: \xA3${refundAmount.toFixed(2)}</p>`
    )
  );
}
async function sendDriverWelcome(driver, tempPassword) {
  await send(
    driver.email,
    "Welcome to Speedy Van",
    baseTemplate(
      "Welcome aboard",
      `<p>Hi ${driver.name},</p>
       <p>Your driver account is ready. Login with:</p>
       <p>Email: <strong>${driver.email}</strong><br>Temporary password: <strong>${tempPassword}</strong></p>
       <p>Please change your password on first login.</p>`
    )
  );
}
async function sendPasswordReset(email, resetUrl) {
  await send(
    email,
    "Reset your Speedy Van password",
    baseTemplate(
      "Password reset",
      `<p>Click the link below to set a new password (expires in 1 hour):</p>
       <p><a href="${resetUrl}" style="color:#4f46e5;">${resetUrl}</a></p>`
    )
  );
}
async function sendNewMessage(recipientEmail, senderName, preview, bookingRef) {
  await send(
    recipientEmail,
    `New message \u2014 ${bookingRef}`,
    baseTemplate(
      `Message from ${senderName}`,
      `<p>${preview.replace(/</g, "&lt;").slice(0, 200)}</p>
       <p>Open the chat for booking <strong>${bookingRef}</strong> to reply.</p>`
    )
  );
}
var escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
var ADMIN_ENQUIRY_EMAIL = process.env.ADMIN_ENQUIRY_EMAIL ?? SITE.supportEmail ?? `support@${SITE.domain}`;
async function sendEuropeanEnquiryConfirmation(enquiry) {
  await send(
    enquiry.customerEmail,
    "We've received your European move enquiry",
    baseTemplate(
      "Thanks \u2014 your enquiry is in",
      `<p>Hi ${escapeHtml(enquiry.customerName)},</p>
       <p>Thank you for contacting Speedy Van about your move from
       <strong>Scotland to ${escapeHtml(enquiry.toCity)}, ${escapeHtml(enquiry.toCountry)}</strong>.</p>
       <p>One of our European removals specialists will review your details and
       send you a detailed, fixed-price quote <strong>within 24 hours</strong>.</p>
       <p>If anything is urgent, you can reply to this email or call us on
       <strong>+44 7909 032889</strong>.</p>`
    )
  );
}
async function sendEuropeanEnquiryAdminAlert(enquiry) {
  const fmtDate = enquiry.preferredDate ? enquiry.preferredDate.toUTCString() : enquiry.flexibleDate ? `Flexible${enquiry.flexibleMonth ? ` (${escapeHtml(enquiry.flexibleMonth)})` : ""}` : "\u2014";
  const row = (k, v2) => `<tr><td style="padding:4px 8px;color:#475569;font-weight:600;width:160px;">${k}</td><td style="padding:4px 8px;color:#0f172a;">${v2}</td></tr>`;
  await send(
    ADMIN_ENQUIRY_EMAIL,
    `\u{1F1EA}\u{1F1FA} New European Move Enquiry \u2014 ${enquiry.toCountry}`,
    baseTemplate(
      "New European removals enquiry",
      `<p>A new European removals enquiry has just been submitted.</p>
       <table style="border-collapse:collapse;width:100%;font-size:14px;">
         ${row("Customer", escapeHtml(enquiry.customerName))}
         ${row("Email", `<a href="mailto:${escapeHtml(enquiry.customerEmail)}">${escapeHtml(enquiry.customerEmail)}</a>`)}
         ${row("Phone", `<a href="tel:${escapeHtml(enquiry.customerPhone)}">${escapeHtml(enquiry.customerPhone)}</a>`)}
         ${row("From", escapeHtml(enquiry.fromAddress))}
         ${row("Property", `${escapeHtml(enquiry.propertyType)}${enquiry.bedrooms > 0 ? ` \xB7 ${enquiry.bedrooms} bedroom${enquiry.bedrooms === 1 ? "" : "s"}` : ""}`)}
         ${row("Destination", `${escapeHtml(enquiry.toCity)}, ${escapeHtml(enquiry.toCountry)}`)}
         ${row("Preferred date", fmtDate)}
         ${row("Packing", enquiry.needsPacking ? "Yes" : "No")}
         ${row("Storage", enquiry.needsStorage ? "Yes" : "No")}
         ${row("Notes", enquiry.notes ? escapeHtml(enquiry.notes).replace(/\n/g, "<br>") : "\u2014")}
       </table>
       <p style="margin-top:24px;">
         <a href="https://www.speedyvan.uk/admin/enquiries"
            style="background:#4f46e5;color:#ffffff;padding:10px 16px;border-radius:6px;text-decoration:none;font-weight:700;">
           Open in admin \u2192
         </a>
       </p>`
    )
  );
}
async function sendEuropeanEnquiryQuote(quote) {
  await send(
    quote.customerEmail,
    `Your European move quote \u2014 Scotland \u2192 ${quote.toCity}, ${quote.toCountry}`,
    baseTemplate(
      "Your quote is ready",
      `<p>Hi ${escapeHtml(quote.customerName)},</p>
       <p>Thanks for your patience. Based on the details you shared, here is our
       fixed-price quote for your move from Scotland to
       <strong>${escapeHtml(quote.toCity)}, ${escapeHtml(quote.toCountry)}</strong>:</p>
       <p style="font-size:28px;font-weight:800;color:#0f172a;margin:16px 0;">
         \xA3${quote.quotedPrice.toFixed(2)}
       </p>
       <p style="color:#475569;font-size:13px;">
         Includes packing materials, transport, customs handling and
         goods-in-transit insurance.
       </p>
       ${quote.adminNotes ? `<p><strong>Notes:</strong><br>${escapeHtml(quote.adminNotes).replace(/\n/g, "<br>")}</p>` : ""}
       <p>To accept this quote or ask any questions, simply reply to this email
       or call us on <strong>+44 7909 032889</strong>.</p>`
    )
  );
}

// src/routes/auth.ts
var app2 = new Hono2();
app2.post("/login", zValidator("json", LoginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    return c.json(fail("Invalid credentials", "INVALID_CREDENTIALS"), 401);
  }
  const okPw = await import_bcryptjs.default.compare(password, user.password);
  if (!okPw) return c.json(fail("Invalid credentials", "INVALID_CREDENTIALS"), 401);
  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  return c.json(
    ok({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  );
});
app2.post("/register", zValidator("json", RegisterSchema), async (c) => {
  const { name: name2, email, phone, password } = c.req.valid("json");
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return c.json(fail("Email already in use", "EMAIL_TAKEN"), 409);
  const hashed = password ? await import_bcryptjs.default.hash(password, 10) : await import_bcryptjs.default.hash(`guest-${Date.now()}-${Math.random()}`, 10);
  const user = await db.user.create({
    data: { name: name2, email, phone, password: hashed, role: "CUSTOMER" }
  });
  const token = signToken({ userId: user.id, email: user.email, role: user.role });
  return c.json(
    ok({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    }),
    201
  );
});
app2.post("/forgot-password", zValidator("json", ForgotPasswordSchema), async (c) => {
  const { email } = c.req.valid("json");
  const user = await db.user.findUnique({ where: { email } });
  if (user && user.isActive) {
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1e3);
    await db.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt }
    });
    const resetUrl = `${SITE.url}/auth/reset?token=${token}`;
    await sendPasswordReset(user.email, resetUrl).catch(() => {
    });
  }
  return c.json(ok({ success: true }));
});
app2.post("/reset-password", zValidator("json", ResetPasswordSchema), async (c) => {
  const { token, newPassword } = c.req.valid("json");
  const resetToken = await db.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < /* @__PURE__ */ new Date()) {
    return c.json(fail("Invalid or expired token", "INVALID_TOKEN"), 400);
  }
  const hashed = await import_bcryptjs.default.hash(newPassword, 10);
  await db.$transaction([
    db.user.update({ where: { id: resetToken.userId }, data: { password: hashed } }),
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: /* @__PURE__ */ new Date() }
    })
  ]);
  return c.json(ok({ success: true }));
});
app2.get("/me", requireAuth, async (c) => {
  const userId = c.get("userId");
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true
    }
  });
  if (!user) return c.json(fail("User not found", "NOT_FOUND"), 404);
  return c.json(ok({ user }));
});
var auth_default = app2;

// src/routes/booking.ts
var import_pdfkit = __toESM(require("pdfkit"));

// src/services/booking.service.ts
var import_bcryptjs2 = __toESM(require_bcryptjs());

// ../../node_modules/stripe/esm/platform/NodePlatformFunctions.js
var crypto3 = __toESM(require("crypto"), 1);
var import_events = require("events");

// ../../node_modules/stripe/esm/crypto/NodeCryptoProvider.js
var crypto2 = __toESM(require("crypto"), 1);

// ../../node_modules/stripe/esm/crypto/CryptoProvider.js
var CryptoProvider = class {
  /**
   * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
   * The output HMAC should be encoded in hexadecimal.
   *
   * Sample values for implementations:
   * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
   * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
   */
  computeHMACSignature(payload, secret2) {
    throw new Error("computeHMACSignature not implemented.");
  }
  /**
   * Asynchronous version of `computeHMACSignature`. Some implementations may
   * only allow support async signature computation.
   *
   * Computes a SHA-256 HMAC given a secret and a payload (encoded in UTF-8).
   * The output HMAC should be encoded in hexadecimal.
   *
   * Sample values for implementations:
   * - computeHMACSignature('', 'test_secret') => 'f7f9bd47fb987337b5796fdc1fdb9ba221d0d5396814bfcaf9521f43fd8927fd'
   * - computeHMACSignature('\ud83d\ude00', 'test_secret') => '837da296d05c4fe31f61d5d7ead035099d9585a5bcde87de952012a78f0b0c43
   */
  computeHMACSignatureAsync(payload, secret2) {
    throw new Error("computeHMACSignatureAsync not implemented.");
  }
  /**
   * Computes a SHA-256 hash of the data.
   */
  computeSHA256Async(data) {
    throw new Error("computeSHA256 not implemented.");
  }
};
var CryptoProviderOnlySupportsAsyncError = class extends Error {
};

// ../../node_modules/stripe/esm/crypto/NodeCryptoProvider.js
var NodeCryptoProvider = class extends CryptoProvider {
  /** @override */
  computeHMACSignature(payload, secret2) {
    return crypto2.createHmac("sha256", secret2).update(payload, "utf8").digest("hex");
  }
  /** @override */
  async computeHMACSignatureAsync(payload, secret2) {
    const signature = await this.computeHMACSignature(payload, secret2);
    return signature;
  }
  /** @override */
  async computeSHA256Async(data) {
    return new Uint8Array(await crypto2.createHash("sha256").update(data).digest());
  }
};

// ../../node_modules/stripe/esm/net/NodeHttpClient.js
var http_ = __toESM(require("http"), 1);
var https_ = __toESM(require("https"), 1);

// ../../node_modules/stripe/esm/net/HttpClient.js
var HttpClient = class _HttpClient {
  /** The client name used for diagnostics. */
  getClientName() {
    throw new Error("getClientName not implemented.");
  }
  makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
    throw new Error("makeRequest not implemented.");
  }
  /** Helper to make a consistent timeout error across implementations. */
  static makeTimeoutError() {
    const timeoutErr = new TypeError(_HttpClient.TIMEOUT_ERROR_CODE);
    timeoutErr.code = _HttpClient.TIMEOUT_ERROR_CODE;
    return timeoutErr;
  }
};
HttpClient.CONNECTION_CLOSED_ERROR_CODES = ["ECONNRESET", "EPIPE"];
HttpClient.TIMEOUT_ERROR_CODE = "ETIMEDOUT";
var HttpClientResponse = class {
  constructor(statusCode, headers) {
    this._statusCode = statusCode;
    this._headers = headers;
  }
  getStatusCode() {
    return this._statusCode;
  }
  getHeaders() {
    return this._headers;
  }
  getRawResponse() {
    throw new Error("getRawResponse not implemented.");
  }
  toStream(streamCompleteCallback) {
    throw new Error("toStream not implemented.");
  }
  toJSON() {
    throw new Error("toJSON not implemented.");
  }
};

// ../../node_modules/stripe/esm/net/NodeHttpClient.js
var http = http_.default || http_;
var https = https_.default || https_;
var defaultHttpAgent = new http.Agent({ keepAlive: true });
var defaultHttpsAgent = new https.Agent({ keepAlive: true });
var NodeHttpClient = class extends HttpClient {
  constructor(agent) {
    super();
    this._agent = agent;
  }
  /** @override. */
  getClientName() {
    return "node";
  }
  makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
    const isInsecureConnection = protocol === "http";
    let agent = this._agent;
    if (!agent) {
      agent = isInsecureConnection ? defaultHttpAgent : defaultHttpsAgent;
    }
    const requestPromise = new Promise((resolve, reject) => {
      const req = (isInsecureConnection ? http : https).request({
        host,
        port,
        path,
        method,
        agent,
        headers,
        ciphers: "DEFAULT:!aNULL:!eNULL:!LOW:!EXPORT:!SSLv2:!MD5"
      });
      req.setTimeout(timeout, () => {
        req.destroy(HttpClient.makeTimeoutError());
      });
      req.on("response", (res) => {
        resolve(new NodeHttpClientResponse(res));
      });
      req.on("error", (error) => {
        reject(error);
      });
      req.once("socket", (socket) => {
        if (socket.connecting) {
          socket.once(isInsecureConnection ? "connect" : "secureConnect", () => {
            req.write(requestData);
            req.end();
          });
        } else {
          req.write(requestData);
          req.end();
        }
      });
    });
    return requestPromise;
  }
};
var NodeHttpClientResponse = class extends HttpClientResponse {
  constructor(res) {
    super(res.statusCode, res.headers || {});
    this._res = res;
  }
  getRawResponse() {
    return this._res;
  }
  toStream(streamCompleteCallback) {
    this._res.once("end", () => streamCompleteCallback());
    return this._res;
  }
  toJSON() {
    return new Promise((resolve, reject) => {
      let response = "";
      this._res.setEncoding("utf8");
      this._res.on("data", (chunk) => {
        response += chunk;
      });
      this._res.once("end", () => {
        try {
          resolve(JSON.parse(response));
        } catch (e) {
          reject(e);
        }
      });
    });
  }
};

// ../../node_modules/stripe/esm/net/FetchHttpClient.js
var FetchHttpClient = class _FetchHttpClient extends HttpClient {
  constructor(fetchFn) {
    super();
    if (!fetchFn) {
      if (!globalThis.fetch) {
        throw new Error("fetch() function not provided and is not defined in the global scope. You must provide a fetch implementation.");
      }
      fetchFn = globalThis.fetch;
    }
    if (globalThis.AbortController) {
      this._fetchFn = _FetchHttpClient.makeFetchWithAbortTimeout(fetchFn);
    } else {
      this._fetchFn = _FetchHttpClient.makeFetchWithRaceTimeout(fetchFn);
    }
  }
  static makeFetchWithRaceTimeout(fetchFn) {
    return (url, init2, timeout) => {
      let pendingTimeoutId;
      const timeoutPromise = new Promise((_2, reject) => {
        pendingTimeoutId = setTimeout(() => {
          pendingTimeoutId = null;
          reject(HttpClient.makeTimeoutError());
        }, timeout);
      });
      const fetchPromise = fetchFn(url, init2);
      return Promise.race([fetchPromise, timeoutPromise]).finally(() => {
        if (pendingTimeoutId) {
          clearTimeout(pendingTimeoutId);
        }
      });
    };
  }
  static makeFetchWithAbortTimeout(fetchFn) {
    return async (url, init2, timeout) => {
      const abort = new AbortController();
      let timeoutId = setTimeout(() => {
        timeoutId = null;
        abort.abort(HttpClient.makeTimeoutError());
      }, timeout);
      try {
        return await fetchFn(url, Object.assign(Object.assign({}, init2), { signal: abort.signal }));
      } catch (err2) {
        if (err2.name === "AbortError") {
          throw HttpClient.makeTimeoutError();
        } else {
          throw err2;
        }
      } finally {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };
  }
  /** @override. */
  getClientName() {
    return "fetch";
  }
  async makeRequest(host, port, path, method, headers, requestData, protocol, timeout) {
    const isInsecureConnection = protocol === "http";
    const url = new URL(path, `${isInsecureConnection ? "http" : "https"}://${host}`);
    url.port = port;
    const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
    const body = requestData || (methodHasPayload ? "" : void 0);
    const res = await this._fetchFn(url.toString(), {
      method,
      // @ts-ignore
      headers,
      // @ts-ignore
      body
    }, timeout);
    return new FetchHttpClientResponse(res);
  }
};
var FetchHttpClientResponse = class _FetchHttpClientResponse extends HttpClientResponse {
  constructor(res) {
    super(res.status, _FetchHttpClientResponse._transformHeadersToObject(res.headers));
    this._res = res;
  }
  getRawResponse() {
    return this._res;
  }
  toStream(streamCompleteCallback) {
    streamCompleteCallback();
    return this._res.body;
  }
  toJSON() {
    return this._res.json();
  }
  static _transformHeadersToObject(headers) {
    const headersObj = {};
    for (const entry of headers) {
      if (!Array.isArray(entry) || entry.length != 2) {
        throw new Error("Response objects produced by the fetch function given to FetchHttpClient do not have an iterable headers map. Response#headers should be an iterable object.");
      }
      headersObj[entry[0]] = entry[1];
    }
    return headersObj;
  }
};

// ../../node_modules/stripe/esm/crypto/SubtleCryptoProvider.js
var SubtleCryptoProvider = class extends CryptoProvider {
  constructor(subtleCrypto) {
    super();
    this.subtleCrypto = subtleCrypto || crypto.subtle;
  }
  /** @override */
  computeHMACSignature(payload, secret2) {
    throw new CryptoProviderOnlySupportsAsyncError("SubtleCryptoProvider cannot be used in a synchronous context.");
  }
  /** @override */
  async computeHMACSignatureAsync(payload, secret2) {
    const encoder = new TextEncoder();
    const key3 = await this.subtleCrypto.importKey("raw", encoder.encode(secret2), {
      name: "HMAC",
      hash: { name: "SHA-256" }
    }, false, ["sign"]);
    const signatureBuffer = await this.subtleCrypto.sign("hmac", key3, encoder.encode(payload));
    const signatureBytes = new Uint8Array(signatureBuffer);
    const signatureHexCodes = new Array(signatureBytes.length);
    for (let i = 0; i < signatureBytes.length; i++) {
      signatureHexCodes[i] = byteHexMapping[signatureBytes[i]];
    }
    return signatureHexCodes.join("");
  }
  /** @override */
  async computeSHA256Async(data) {
    return new Uint8Array(await this.subtleCrypto.digest("SHA-256", data));
  }
};
var byteHexMapping = new Array(256);
for (let i = 0; i < byteHexMapping.length; i++) {
  byteHexMapping[i] = i.toString(16).padStart(2, "0");
}

// ../../node_modules/stripe/esm/platform/PlatformFunctions.js
var PlatformFunctions = class {
  constructor() {
    this._fetchFn = null;
    this._agent = null;
  }
  /**
   * Gets uname with Node's built-in `exec` function, if available.
   */
  getUname() {
    throw new Error("getUname not implemented.");
  }
  /**
   * Generates a v4 UUID. See https://stackoverflow.com/a/2117523
   */
  uuid4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v2 = c === "x" ? r : r & 3 | 8;
      return v2.toString(16);
    });
  }
  /**
   * Compares strings in constant time.
   */
  secureCompare(a2, b) {
    if (a2.length !== b.length) {
      return false;
    }
    const len = a2.length;
    let result = 0;
    for (let i = 0; i < len; ++i) {
      result |= a2.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
  /**
   * Creates an event emitter.
   */
  createEmitter() {
    throw new Error("createEmitter not implemented.");
  }
  /**
   * Checks if the request data is a stream. If so, read the entire stream
   * to a buffer and return the buffer.
   */
  tryBufferData(data) {
    throw new Error("tryBufferData not implemented.");
  }
  /**
   * Creates an HTTP client which uses the Node `http` and `https` packages
   * to issue requests.
   */
  createNodeHttpClient(agent) {
    throw new Error("createNodeHttpClient not implemented.");
  }
  /**
   * Creates an HTTP client for issuing Stripe API requests which uses the Web
   * Fetch API.
   *
   * A fetch function can optionally be passed in as a parameter. If none is
   * passed, will default to the default `fetch` function in the global scope.
   */
  createFetchHttpClient(fetchFn) {
    return new FetchHttpClient(fetchFn);
  }
  /**
   * Creates an HTTP client using runtime-specific APIs.
   */
  createDefaultHttpClient() {
    throw new Error("createDefaultHttpClient not implemented.");
  }
  /**
   * Creates a CryptoProvider which uses the Node `crypto` package for its computations.
   */
  createNodeCryptoProvider() {
    throw new Error("createNodeCryptoProvider not implemented.");
  }
  /**
   * Creates a CryptoProvider which uses the SubtleCrypto interface of the Web Crypto API.
   */
  createSubtleCryptoProvider(subtleCrypto) {
    return new SubtleCryptoProvider(subtleCrypto);
  }
  createDefaultCryptoProvider() {
    throw new Error("createDefaultCryptoProvider not implemented.");
  }
};

// ../../node_modules/stripe/esm/Error.js
var Error_exports = {};
__export(Error_exports, {
  StripeAPIError: () => StripeAPIError,
  StripeAuthenticationError: () => StripeAuthenticationError,
  StripeCardError: () => StripeCardError,
  StripeConnectionError: () => StripeConnectionError,
  StripeError: () => StripeError,
  StripeIdempotencyError: () => StripeIdempotencyError,
  StripeInvalidGrantError: () => StripeInvalidGrantError,
  StripeInvalidRequestError: () => StripeInvalidRequestError,
  StripePermissionError: () => StripePermissionError,
  StripeRateLimitError: () => StripeRateLimitError,
  StripeSignatureVerificationError: () => StripeSignatureVerificationError,
  StripeUnknownError: () => StripeUnknownError,
  TemporarySessionExpiredError: () => TemporarySessionExpiredError,
  generateV1Error: () => generateV1Error,
  generateV2Error: () => generateV2Error
});
var generateV1Error = (rawStripeError) => {
  switch (rawStripeError.type) {
    case "card_error":
      return new StripeCardError(rawStripeError);
    case "invalid_request_error":
      return new StripeInvalidRequestError(rawStripeError);
    case "api_error":
      return new StripeAPIError(rawStripeError);
    case "authentication_error":
      return new StripeAuthenticationError(rawStripeError);
    case "rate_limit_error":
      return new StripeRateLimitError(rawStripeError);
    case "idempotency_error":
      return new StripeIdempotencyError(rawStripeError);
    case "invalid_grant":
      return new StripeInvalidGrantError(rawStripeError);
    default:
      return new StripeUnknownError(rawStripeError);
  }
};
var generateV2Error = (rawStripeError) => {
  switch (rawStripeError.type) {
    // switchCases: The beginning of the section generated from our OpenAPI spec
    case "temporary_session_expired":
      return new TemporarySessionExpiredError(rawStripeError);
  }
  switch (rawStripeError.code) {
    case "invalid_fields":
      return new StripeInvalidRequestError(rawStripeError);
  }
  return generateV1Error(rawStripeError);
};
var StripeError = class extends Error {
  constructor(raw2 = {}, type = null) {
    super(raw2.message);
    this.type = type || this.constructor.name;
    this.raw = raw2;
    this.rawType = raw2.type;
    this.code = raw2.code;
    this.doc_url = raw2.doc_url;
    this.param = raw2.param;
    this.detail = raw2.detail;
    this.headers = raw2.headers;
    this.requestId = raw2.requestId;
    this.statusCode = raw2.statusCode;
    this.message = raw2.message;
    this.userMessage = raw2.user_message;
    this.charge = raw2.charge;
    this.decline_code = raw2.decline_code;
    this.payment_intent = raw2.payment_intent;
    this.payment_method = raw2.payment_method;
    this.payment_method_type = raw2.payment_method_type;
    this.setup_intent = raw2.setup_intent;
    this.source = raw2.source;
  }
};
StripeError.generate = generateV1Error;
var StripeCardError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripeCardError");
  }
};
var StripeInvalidRequestError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripeInvalidRequestError");
  }
};
var StripeAPIError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripeAPIError");
  }
};
var StripeAuthenticationError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripeAuthenticationError");
  }
};
var StripePermissionError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripePermissionError");
  }
};
var StripeRateLimitError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripeRateLimitError");
  }
};
var StripeConnectionError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripeConnectionError");
  }
};
var StripeSignatureVerificationError = class extends StripeError {
  constructor(header, payload, raw2 = {}) {
    super(raw2, "StripeSignatureVerificationError");
    this.header = header;
    this.payload = payload;
  }
};
var StripeIdempotencyError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripeIdempotencyError");
  }
};
var StripeInvalidGrantError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripeInvalidGrantError");
  }
};
var StripeUnknownError = class extends StripeError {
  constructor(raw2 = {}) {
    super(raw2, "StripeUnknownError");
  }
};
var TemporarySessionExpiredError = class extends StripeError {
  constructor(rawStripeError = {}) {
    super(rawStripeError, "TemporarySessionExpiredError");
  }
};

// ../../node_modules/stripe/esm/utils.js
var qs2 = __toESM(require_lib(), 1);
var OPTIONS_KEYS = [
  "apiKey",
  "idempotencyKey",
  "stripeAccount",
  "apiVersion",
  "maxNetworkRetries",
  "timeout",
  "host",
  "authenticator",
  "stripeContext",
  "additionalHeaders"
];
function isOptionsHash(o) {
  return o && typeof o === "object" && OPTIONS_KEYS.some((prop) => Object.prototype.hasOwnProperty.call(o, prop));
}
function queryStringifyRequestData(data, apiMode) {
  return qs2.stringify(data, {
    serializeDate: (d) => Math.floor(d.getTime() / 1e3).toString(),
    arrayFormat: apiMode == "v2" ? "repeat" : "indices"
  }).replace(/%5B/g, "[").replace(/%5D/g, "]");
}
var makeURLInterpolator = /* @__PURE__ */ (() => {
  const rc = {
    "\n": "\\n",
    '"': '\\"',
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  return (str) => {
    const cleanString = str.replace(/["\n\r\u2028\u2029]/g, ($0) => rc[$0]);
    return (outputs) => {
      return cleanString.replace(/\{([\s\S]+?)\}/g, ($0, $1) => (
        // @ts-ignore
        encodeURIComponent(outputs[$1] || "")
      ));
    };
  };
})();
function extractUrlParams(path) {
  const params = path.match(/\{\w+\}/g);
  if (!params) {
    return [];
  }
  return params.map((param) => param.replace(/[{}]/g, ""));
}
function getDataFromArgs(args) {
  if (!Array.isArray(args) || !args[0] || typeof args[0] !== "object") {
    return {};
  }
  if (!isOptionsHash(args[0])) {
    return args.shift();
  }
  const argKeys = Object.keys(args[0]);
  const optionKeysInArgs = argKeys.filter((key3) => OPTIONS_KEYS.includes(key3));
  if (optionKeysInArgs.length > 0 && optionKeysInArgs.length !== argKeys.length) {
    emitWarning(`Options found in arguments (${optionKeysInArgs.join(", ")}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options.`);
  }
  return {};
}
function getOptionsFromArgs(args) {
  const opts = {
    host: null,
    headers: {},
    settings: {}
  };
  if (args.length > 0) {
    const arg = args[args.length - 1];
    if (typeof arg === "string") {
      opts.authenticator = createApiKeyAuthenticator(args.pop());
    } else if (isOptionsHash(arg)) {
      const params = Object.assign({}, args.pop());
      const extraKeys = Object.keys(params).filter((key3) => !OPTIONS_KEYS.includes(key3));
      if (extraKeys.length) {
        emitWarning(`Invalid options found (${extraKeys.join(", ")}); ignoring.`);
      }
      if (params.apiKey) {
        opts.authenticator = createApiKeyAuthenticator(params.apiKey);
      }
      if (params.idempotencyKey) {
        opts.headers["Idempotency-Key"] = params.idempotencyKey;
      }
      if (params.stripeAccount) {
        opts.headers["Stripe-Account"] = params.stripeAccount;
      }
      if (params.stripeContext) {
        if (opts.headers["Stripe-Account"]) {
          throw new Error("Can't specify both stripeAccount and stripeContext.");
        }
        opts.headers["Stripe-Context"] = params.stripeContext;
      }
      if (params.apiVersion) {
        opts.headers["Stripe-Version"] = params.apiVersion;
      }
      if (Number.isInteger(params.maxNetworkRetries)) {
        opts.settings.maxNetworkRetries = params.maxNetworkRetries;
      }
      if (Number.isInteger(params.timeout)) {
        opts.settings.timeout = params.timeout;
      }
      if (params.host) {
        opts.host = params.host;
      }
      if (params.authenticator) {
        if (params.apiKey) {
          throw new Error("Can't specify both apiKey and authenticator.");
        }
        if (typeof params.authenticator !== "function") {
          throw new Error("The authenticator must be a function receiving a request as the first parameter.");
        }
        opts.authenticator = params.authenticator;
      }
      if (params.additionalHeaders) {
        opts.headers = params.additionalHeaders;
      }
    }
  }
  return opts;
}
function protoExtend(sub) {
  const Super = this;
  const Constructor = Object.prototype.hasOwnProperty.call(sub, "constructor") ? sub.constructor : function(...args) {
    Super.apply(this, args);
  };
  Object.assign(Constructor, Super);
  Constructor.prototype = Object.create(Super.prototype);
  Object.assign(Constructor.prototype, sub);
  return Constructor;
}
function removeNullish(obj) {
  if (typeof obj !== "object") {
    throw new Error("Argument must be an object");
  }
  return Object.keys(obj).reduce((result, key3) => {
    if (obj[key3] != null) {
      result[key3] = obj[key3];
    }
    return result;
  }, {});
}
function normalizeHeaders(obj) {
  if (!(obj && typeof obj === "object")) {
    return obj;
  }
  return Object.keys(obj).reduce((result, header) => {
    result[normalizeHeader(header)] = obj[header];
    return result;
  }, {});
}
function normalizeHeader(header) {
  return header.split("-").map((text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase()).join("-");
}
function callbackifyPromiseWithTimeout(promise, callback) {
  if (callback) {
    return promise.then((res) => {
      setTimeout(() => {
        callback(null, res);
      }, 0);
    }, (err2) => {
      setTimeout(() => {
        callback(err2, null);
      }, 0);
    });
  }
  return promise;
}
function pascalToCamelCase(name2) {
  if (name2 === "OAuth") {
    return "oauth";
  } else {
    return name2[0].toLowerCase() + name2.substring(1);
  }
}
function emitWarning(warning) {
  if (typeof process.emitWarning !== "function") {
    return console.warn(`Stripe: ${warning}`);
  }
  return process.emitWarning(warning, "Stripe");
}
function isObject(obj) {
  const type = typeof obj;
  return (type === "function" || type === "object") && !!obj;
}
function flattenAndStringify(data) {
  const result = {};
  const step = (obj, prevKey) => {
    Object.entries(obj).forEach(([key3, value]) => {
      const newKey = prevKey ? `${prevKey}[${key3}]` : key3;
      if (isObject(value)) {
        if (!(value instanceof Uint8Array) && !Object.prototype.hasOwnProperty.call(value, "data")) {
          return step(value, newKey);
        } else {
          result[newKey] = value;
        }
      } else {
        result[newKey] = String(value);
      }
    });
  };
  step(data, null);
  return result;
}
function validateInteger(name2, n, defaultVal) {
  if (!Number.isInteger(n)) {
    if (defaultVal !== void 0) {
      return defaultVal;
    } else {
      throw new Error(`${name2} must be an integer`);
    }
  }
  return n;
}
function determineProcessUserAgentProperties() {
  return typeof process === "undefined" ? {} : {
    lang_version: process.version,
    platform: process.platform
  };
}
function createApiKeyAuthenticator(apiKey2) {
  const authenticator = (request) => {
    request.headers.Authorization = "Bearer " + apiKey2;
    return Promise.resolve();
  };
  authenticator._apiKey = apiKey2;
  return authenticator;
}
function concat(arrays) {
  const totalLength = arrays.reduce((len, array) => len + array.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  arrays.forEach((array) => {
    merged.set(array, offset);
    offset += array.length;
  });
  return merged;
}
function dateTimeReplacer(key3, value) {
  if (this[key3] instanceof Date) {
    return Math.floor(this[key3].getTime() / 1e3).toString();
  }
  return value;
}
function jsonStringifyRequestData(data) {
  return JSON.stringify(data, dateTimeReplacer);
}
function getAPIMode(path) {
  if (!path) {
    return "v1";
  }
  return path.startsWith("/v2") ? "v2" : "v1";
}

// ../../node_modules/stripe/esm/platform/NodePlatformFunctions.js
var import_child_process = require("child_process");
var StreamProcessingError = class extends StripeError {
};
var NodePlatformFunctions = class extends PlatformFunctions {
  constructor() {
    super();
    this._exec = import_child_process.exec;
    this._UNAME_CACHE = null;
  }
  /** @override */
  uuid4() {
    if (crypto3.randomUUID) {
      return crypto3.randomUUID();
    }
    return super.uuid4();
  }
  /**
   * @override
   * Node's built in `exec` function sometimes throws outright,
   * and sometimes has a callback with an error,
   * depending on the type of error.
   *
   * This unifies that interface by resolving with a null uname
   * if an error is encountered.
   */
  getUname() {
    if (!this._UNAME_CACHE) {
      this._UNAME_CACHE = new Promise((resolve, reject) => {
        try {
          this._exec("uname -a", (err2, uname) => {
            if (err2) {
              return resolve(null);
            }
            resolve(uname);
          });
        } catch (e) {
          resolve(null);
        }
      });
    }
    return this._UNAME_CACHE;
  }
  /**
   * @override
   * Secure compare, from https://github.com/freewil/scmp
   */
  secureCompare(a2, b) {
    if (!a2 || !b) {
      throw new Error("secureCompare must receive two arguments");
    }
    if (a2.length !== b.length) {
      return false;
    }
    if (crypto3.timingSafeEqual) {
      const textEncoder = new TextEncoder();
      const aEncoded = textEncoder.encode(a2);
      const bEncoded = textEncoder.encode(b);
      return crypto3.timingSafeEqual(aEncoded, bEncoded);
    }
    return super.secureCompare(a2, b);
  }
  createEmitter() {
    return new import_events.EventEmitter();
  }
  /** @override */
  tryBufferData(data) {
    if (!(data.file.data instanceof import_events.EventEmitter)) {
      return Promise.resolve(data);
    }
    const bufferArray = [];
    return new Promise((resolve, reject) => {
      data.file.data.on("data", (line) => {
        bufferArray.push(line);
      }).once("end", () => {
        const bufferData = Object.assign({}, data);
        bufferData.file.data = concat(bufferArray);
        resolve(bufferData);
      }).on("error", (err2) => {
        reject(new StreamProcessingError({
          message: "An error occurred while attempting to process the file for upload.",
          detail: err2
        }));
      });
    });
  }
  /** @override */
  createNodeHttpClient(agent) {
    return new NodeHttpClient(agent);
  }
  /** @override */
  createDefaultHttpClient() {
    return new NodeHttpClient();
  }
  /** @override */
  createNodeCryptoProvider() {
    return new NodeCryptoProvider();
  }
  /** @override */
  createDefaultCryptoProvider() {
    return this.createNodeCryptoProvider();
  }
};

// ../../node_modules/stripe/esm/RequestSender.js
var MAX_RETRY_AFTER_WAIT = 60;
var RequestSender = class _RequestSender {
  constructor(stripe2, maxBufferedRequestMetric) {
    this._stripe = stripe2;
    this._maxBufferedRequestMetric = maxBufferedRequestMetric;
  }
  _addHeadersDirectlyToObject(obj, headers) {
    obj.requestId = headers["request-id"];
    obj.stripeAccount = obj.stripeAccount || headers["stripe-account"];
    obj.apiVersion = obj.apiVersion || headers["stripe-version"];
    obj.idempotencyKey = obj.idempotencyKey || headers["idempotency-key"];
  }
  _makeResponseEvent(requestEvent, statusCode, headers) {
    const requestEndTime = Date.now();
    const requestDurationMs = requestEndTime - requestEvent.request_start_time;
    return removeNullish({
      api_version: headers["stripe-version"],
      account: headers["stripe-account"],
      idempotency_key: headers["idempotency-key"],
      method: requestEvent.method,
      path: requestEvent.path,
      status: statusCode,
      request_id: this._getRequestId(headers),
      elapsed: requestDurationMs,
      request_start_time: requestEvent.request_start_time,
      request_end_time: requestEndTime
    });
  }
  _getRequestId(headers) {
    return headers["request-id"];
  }
  /**
   * Used by methods with spec.streaming === true. For these methods, we do not
   * buffer successful responses into memory or do parse them into stripe
   * objects, we delegate that all of that to the user and pass back the raw
   * http.Response object to the callback.
   *
   * (Unsuccessful responses shouldn't make it here, they should
   * still be buffered/parsed and handled by _jsonResponseHandler -- see
   * makeRequest)
   */
  _streamingResponseHandler(requestEvent, usage, callback) {
    return (res) => {
      const headers = res.getHeaders();
      const streamCompleteCallback = () => {
        const responseEvent = this._makeResponseEvent(requestEvent, res.getStatusCode(), headers);
        this._stripe._emitter.emit("response", responseEvent);
        this._recordRequestMetrics(this._getRequestId(headers), responseEvent.elapsed, usage);
      };
      const stream = res.toStream(streamCompleteCallback);
      this._addHeadersDirectlyToObject(stream, headers);
      return callback(null, stream);
    };
  }
  /**
   * Default handler for Stripe responses. Buffers the response into memory,
   * parses the JSON and returns it (i.e. passes it to the callback) if there
   * is no "error" field. Otherwise constructs/passes an appropriate Error.
   */
  _jsonResponseHandler(requestEvent, apiMode, usage, callback) {
    return (res) => {
      const headers = res.getHeaders();
      const requestId = this._getRequestId(headers);
      const statusCode = res.getStatusCode();
      const responseEvent = this._makeResponseEvent(requestEvent, statusCode, headers);
      this._stripe._emitter.emit("response", responseEvent);
      res.toJSON().then((jsonResponse) => {
        if (jsonResponse.error) {
          let err2;
          if (typeof jsonResponse.error === "string") {
            jsonResponse.error = {
              type: jsonResponse.error,
              message: jsonResponse.error_description
            };
          }
          jsonResponse.error.headers = headers;
          jsonResponse.error.statusCode = statusCode;
          jsonResponse.error.requestId = requestId;
          if (statusCode === 401) {
            err2 = new StripeAuthenticationError(jsonResponse.error);
          } else if (statusCode === 403) {
            err2 = new StripePermissionError(jsonResponse.error);
          } else if (statusCode === 429) {
            err2 = new StripeRateLimitError(jsonResponse.error);
          } else if (apiMode === "v2") {
            err2 = generateV2Error(jsonResponse.error);
          } else {
            err2 = generateV1Error(jsonResponse.error);
          }
          throw err2;
        }
        return jsonResponse;
      }, (e) => {
        throw new StripeAPIError({
          message: "Invalid JSON received from the Stripe API",
          exception: e,
          requestId: headers["request-id"]
        });
      }).then((jsonResponse) => {
        this._recordRequestMetrics(requestId, responseEvent.elapsed, usage);
        const rawResponse = res.getRawResponse();
        this._addHeadersDirectlyToObject(rawResponse, headers);
        Object.defineProperty(jsonResponse, "lastResponse", {
          enumerable: false,
          writable: false,
          value: rawResponse
        });
        callback(null, jsonResponse);
      }, (e) => callback(e, null));
    };
  }
  static _generateConnectionErrorMessage(requestRetries) {
    return `An error occurred with our connection to Stripe.${requestRetries > 0 ? ` Request was retried ${requestRetries} times.` : ""}`;
  }
  // For more on when and how to retry API requests, see https://stripe.com/docs/error-handling#safely-retrying-requests-with-idempotency
  static _shouldRetry(res, numRetries, maxRetries, error) {
    if (error && numRetries === 0 && HttpClient.CONNECTION_CLOSED_ERROR_CODES.includes(error.code)) {
      return true;
    }
    if (numRetries >= maxRetries) {
      return false;
    }
    if (!res) {
      return true;
    }
    if (res.getHeaders()["stripe-should-retry"] === "false") {
      return false;
    }
    if (res.getHeaders()["stripe-should-retry"] === "true") {
      return true;
    }
    if (res.getStatusCode() === 409) {
      return true;
    }
    if (res.getStatusCode() >= 500) {
      return true;
    }
    return false;
  }
  _getSleepTimeInMS(numRetries, retryAfter = null) {
    const initialNetworkRetryDelay = this._stripe.getInitialNetworkRetryDelay();
    const maxNetworkRetryDelay = this._stripe.getMaxNetworkRetryDelay();
    let sleepSeconds = Math.min(initialNetworkRetryDelay * Math.pow(2, numRetries - 1), maxNetworkRetryDelay);
    sleepSeconds *= 0.5 * (1 + Math.random());
    sleepSeconds = Math.max(initialNetworkRetryDelay, sleepSeconds);
    if (Number.isInteger(retryAfter) && retryAfter <= MAX_RETRY_AFTER_WAIT) {
      sleepSeconds = Math.max(sleepSeconds, retryAfter);
    }
    return sleepSeconds * 1e3;
  }
  // Max retries can be set on a per request basis. Favor those over the global setting
  _getMaxNetworkRetries(settings = {}) {
    return settings.maxNetworkRetries !== void 0 && Number.isInteger(settings.maxNetworkRetries) ? settings.maxNetworkRetries : this._stripe.getMaxNetworkRetries();
  }
  _defaultIdempotencyKey(method, settings, apiMode) {
    const maxRetries = this._getMaxNetworkRetries(settings);
    const genKey = () => `stripe-node-retry-${this._stripe._platformFunctions.uuid4()}`;
    if (apiMode === "v2") {
      if (method === "POST" || method === "DELETE") {
        return genKey();
      }
    } else if (apiMode === "v1") {
      if (method === "POST" && maxRetries > 0) {
        return genKey();
      }
    }
    return null;
  }
  _makeHeaders({ contentType, contentLength, apiVersion, clientUserAgent, method, userSuppliedHeaders, userSuppliedSettings, stripeAccount, stripeContext, apiMode }) {
    const defaultHeaders = {
      Accept: "application/json",
      "Content-Type": contentType,
      "User-Agent": this._getUserAgentString(apiMode),
      "X-Stripe-Client-User-Agent": clientUserAgent,
      "X-Stripe-Client-Telemetry": this._getTelemetryHeader(),
      "Stripe-Version": apiVersion,
      "Stripe-Account": stripeAccount,
      "Stripe-Context": stripeContext,
      "Idempotency-Key": this._defaultIdempotencyKey(method, userSuppliedSettings, apiMode)
    };
    const methodHasPayload = method == "POST" || method == "PUT" || method == "PATCH";
    if (methodHasPayload || contentLength) {
      if (!methodHasPayload) {
        emitWarning(`${method} method had non-zero contentLength but no payload is expected for this verb`);
      }
      defaultHeaders["Content-Length"] = contentLength;
    }
    return Object.assign(
      removeNullish(defaultHeaders),
      // If the user supplied, say 'idempotency-key', override instead of appending by ensuring caps are the same.
      normalizeHeaders(userSuppliedHeaders)
    );
  }
  _getUserAgentString(apiMode) {
    const packageVersion = this._stripe.getConstant("PACKAGE_VERSION");
    const appInfo = this._stripe._appInfo ? this._stripe.getAppInfoAsString() : "";
    return `Stripe/${apiMode} NodeBindings/${packageVersion} ${appInfo}`.trim();
  }
  _getTelemetryHeader() {
    if (this._stripe.getTelemetryEnabled() && this._stripe._prevRequestMetrics.length > 0) {
      const metrics = this._stripe._prevRequestMetrics.shift();
      return JSON.stringify({
        last_request_metrics: metrics
      });
    }
  }
  _recordRequestMetrics(requestId, requestDurationMs, usage) {
    if (this._stripe.getTelemetryEnabled() && requestId) {
      if (this._stripe._prevRequestMetrics.length > this._maxBufferedRequestMetric) {
        emitWarning("Request metrics buffer is full, dropping telemetry message.");
      } else {
        const m2 = {
          request_id: requestId,
          request_duration_ms: requestDurationMs
        };
        if (usage && usage.length > 0) {
          m2.usage = usage;
        }
        this._stripe._prevRequestMetrics.push(m2);
      }
    }
  }
  _rawRequest(method, path, params, options) {
    const requestPromise = new Promise((resolve, reject) => {
      let opts;
      try {
        const requestMethod = method.toUpperCase();
        if (requestMethod !== "POST" && params && Object.keys(params).length !== 0) {
          throw new Error("rawRequest only supports params on POST requests. Please pass null and add your parameters to path.");
        }
        const args = [].slice.call([params, options]);
        const dataFromArgs = getDataFromArgs(args);
        const data = Object.assign({}, dataFromArgs);
        const calculatedOptions = getOptionsFromArgs(args);
        const headers2 = calculatedOptions.headers;
        const authenticator2 = calculatedOptions.authenticator;
        opts = {
          requestMethod,
          requestPath: path,
          bodyData: data,
          queryData: {},
          authenticator: authenticator2,
          headers: headers2,
          host: null,
          streaming: false,
          settings: {},
          usage: ["raw_request"]
        };
      } catch (err2) {
        reject(err2);
        return;
      }
      function requestCallback(err2, response) {
        if (err2) {
          reject(err2);
        } else {
          resolve(response);
        }
      }
      const { headers, settings } = opts;
      const authenticator = opts.authenticator;
      this._request(opts.requestMethod, opts.host, path, opts.bodyData, authenticator, { headers, settings, streaming: opts.streaming }, opts.usage, requestCallback);
    });
    return requestPromise;
  }
  _request(method, host, path, data, authenticator, options, usage = [], callback, requestDataProcessor = null) {
    var _a;
    let requestData;
    authenticator = (_a = authenticator !== null && authenticator !== void 0 ? authenticator : this._stripe._authenticator) !== null && _a !== void 0 ? _a : null;
    const apiMode = getAPIMode(path);
    const retryRequest = (requestFn, apiVersion, headers, requestRetries, retryAfter) => {
      return setTimeout(requestFn, this._getSleepTimeInMS(requestRetries, retryAfter), apiVersion, headers, requestRetries + 1);
    };
    const makeRequest = (apiVersion, headers, numRetries) => {
      const timeout = options.settings && options.settings.timeout && Number.isInteger(options.settings.timeout) && options.settings.timeout >= 0 ? options.settings.timeout : this._stripe.getApiField("timeout");
      const request = {
        host: host || this._stripe.getApiField("host"),
        port: this._stripe.getApiField("port"),
        path,
        method,
        headers: Object.assign({}, headers),
        body: requestData,
        protocol: this._stripe.getApiField("protocol")
      };
      authenticator(request).then(() => {
        const req = this._stripe.getApiField("httpClient").makeRequest(request.host, request.port, request.path, request.method, request.headers, request.body, request.protocol, timeout);
        const requestStartTime = Date.now();
        const requestEvent = removeNullish({
          api_version: apiVersion,
          account: headers["Stripe-Account"],
          idempotency_key: headers["Idempotency-Key"],
          method,
          path,
          request_start_time: requestStartTime
        });
        const requestRetries = numRetries || 0;
        const maxRetries = this._getMaxNetworkRetries(options.settings || {});
        this._stripe._emitter.emit("request", requestEvent);
        req.then((res) => {
          if (_RequestSender._shouldRetry(res, requestRetries, maxRetries)) {
            return retryRequest(
              makeRequest,
              apiVersion,
              headers,
              requestRetries,
              // @ts-ignore
              res.getHeaders()["retry-after"]
            );
          } else if (options.streaming && res.getStatusCode() < 400) {
            return this._streamingResponseHandler(requestEvent, usage, callback)(res);
          } else {
            return this._jsonResponseHandler(requestEvent, apiMode, usage, callback)(res);
          }
        }).catch((error) => {
          if (_RequestSender._shouldRetry(null, requestRetries, maxRetries, error)) {
            return retryRequest(makeRequest, apiVersion, headers, requestRetries, null);
          } else {
            const isTimeoutError = error.code && error.code === HttpClient.TIMEOUT_ERROR_CODE;
            return callback(new StripeConnectionError({
              message: isTimeoutError ? `Request aborted due to timeout being reached (${timeout}ms)` : _RequestSender._generateConnectionErrorMessage(requestRetries),
              // @ts-ignore
              detail: error
            }));
          }
        });
      }).catch((e) => {
        throw new StripeError({
          message: "Unable to authenticate the request",
          exception: e
        });
      });
    };
    const prepareAndMakeRequest = (error, data2) => {
      if (error) {
        return callback(error);
      }
      requestData = data2;
      this._stripe.getClientUserAgent((clientUserAgent) => {
        const apiVersion = this._stripe.getApiField("version");
        const headers = this._makeHeaders({
          contentType: apiMode == "v2" ? "application/json" : "application/x-www-form-urlencoded",
          contentLength: requestData.length,
          apiVersion,
          clientUserAgent,
          method,
          userSuppliedHeaders: options.headers,
          userSuppliedSettings: options.settings,
          stripeAccount: apiMode == "v2" ? null : this._stripe.getApiField("stripeAccount"),
          stripeContext: apiMode == "v2" ? this._stripe.getApiField("stripeContext") : null,
          apiMode
        });
        makeRequest(apiVersion, headers, 0);
      });
    };
    if (requestDataProcessor) {
      requestDataProcessor(method, data, options.headers, prepareAndMakeRequest);
    } else {
      let stringifiedData;
      if (apiMode == "v2") {
        stringifiedData = data ? jsonStringifyRequestData(data) : "";
      } else {
        stringifiedData = queryStringifyRequestData(data || {}, apiMode);
      }
      prepareAndMakeRequest(null, stringifiedData);
    }
  }
};

// ../../node_modules/stripe/esm/autoPagination.js
var V1Iterator = class {
  constructor(firstPagePromise, requestArgs, spec, stripeResource) {
    this.index = 0;
    this.pagePromise = firstPagePromise;
    this.promiseCache = { currentPromise: null };
    this.requestArgs = requestArgs;
    this.spec = spec;
    this.stripeResource = stripeResource;
  }
  async iterate(pageResult) {
    if (!(pageResult && pageResult.data && typeof pageResult.data.length === "number")) {
      throw Error("Unexpected: Stripe API response does not have a well-formed `data` array.");
    }
    const reverseIteration = isReverseIteration(this.requestArgs);
    if (this.index < pageResult.data.length) {
      const idx = reverseIteration ? pageResult.data.length - 1 - this.index : this.index;
      const value = pageResult.data[idx];
      this.index += 1;
      return { value, done: false };
    } else if (pageResult.has_more) {
      this.index = 0;
      this.pagePromise = this.getNextPage(pageResult);
      const nextPageResult = await this.pagePromise;
      return this.iterate(nextPageResult);
    }
    return { done: true, value: void 0 };
  }
  /** @abstract */
  getNextPage(_pageResult) {
    throw new Error("Unimplemented");
  }
  async _next() {
    return this.iterate(await this.pagePromise);
  }
  next() {
    if (this.promiseCache.currentPromise) {
      return this.promiseCache.currentPromise;
    }
    const nextPromise = (async () => {
      const ret = await this._next();
      this.promiseCache.currentPromise = null;
      return ret;
    })();
    this.promiseCache.currentPromise = nextPromise;
    return nextPromise;
  }
};
var V1ListIterator = class extends V1Iterator {
  getNextPage(pageResult) {
    const reverseIteration = isReverseIteration(this.requestArgs);
    const lastId = getLastId(pageResult, reverseIteration);
    return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
      [reverseIteration ? "ending_before" : "starting_after"]: lastId
    });
  }
};
var V1SearchIterator = class extends V1Iterator {
  getNextPage(pageResult) {
    if (!pageResult.next_page) {
      throw Error("Unexpected: Stripe API response does not have a well-formed `next_page` field, but `has_more` was true.");
    }
    return this.stripeResource._makeRequest(this.requestArgs, this.spec, {
      page: pageResult.next_page
    });
  }
};
var V2ListIterator = class {
  constructor(firstPagePromise, requestArgs, spec, stripeResource) {
    this.currentPageIterator = (async () => {
      const page = await firstPagePromise;
      return page.data[Symbol.iterator]();
    })();
    this.nextPageUrl = (async () => {
      const page = await firstPagePromise;
      return page.next_page_url || null;
    })();
    this.requestArgs = requestArgs;
    this.spec = spec;
    this.stripeResource = stripeResource;
  }
  async turnPage() {
    const nextPageUrl = await this.nextPageUrl;
    if (!nextPageUrl)
      return null;
    this.spec.fullPath = nextPageUrl;
    const page = await this.stripeResource._makeRequest([], this.spec, {});
    this.nextPageUrl = Promise.resolve(page.next_page_url);
    this.currentPageIterator = Promise.resolve(page.data[Symbol.iterator]());
    return this.currentPageIterator;
  }
  async next() {
    {
      const result2 = (await this.currentPageIterator).next();
      if (!result2.done)
        return { done: false, value: result2.value };
    }
    const nextPageIterator = await this.turnPage();
    if (!nextPageIterator) {
      return { done: true, value: void 0 };
    }
    const result = nextPageIterator.next();
    if (!result.done)
      return { done: false, value: result.value };
    return { done: true, value: void 0 };
  }
};
var makeAutoPaginationMethods = (stripeResource, requestArgs, spec, firstPagePromise) => {
  const apiMode = getAPIMode(spec.fullPath || spec.path);
  if (apiMode !== "v2" && spec.methodType === "search") {
    return makeAutoPaginationMethodsFromIterator(new V1SearchIterator(firstPagePromise, requestArgs, spec, stripeResource));
  }
  if (apiMode !== "v2" && spec.methodType === "list") {
    return makeAutoPaginationMethodsFromIterator(new V1ListIterator(firstPagePromise, requestArgs, spec, stripeResource));
  }
  if (apiMode === "v2" && spec.methodType === "list") {
    return makeAutoPaginationMethodsFromIterator(new V2ListIterator(firstPagePromise, requestArgs, spec, stripeResource));
  }
  return null;
};
var makeAutoPaginationMethodsFromIterator = (iterator) => {
  const autoPagingEach = makeAutoPagingEach((...args) => iterator.next(...args));
  const autoPagingToArray = makeAutoPagingToArray(autoPagingEach);
  const autoPaginationMethods = {
    autoPagingEach,
    autoPagingToArray,
    // Async iterator functions:
    next: () => iterator.next(),
    return: () => {
      return {};
    },
    [getAsyncIteratorSymbol()]: () => {
      return autoPaginationMethods;
    }
  };
  return autoPaginationMethods;
};
function getAsyncIteratorSymbol() {
  if (typeof Symbol !== "undefined" && Symbol.asyncIterator) {
    return Symbol.asyncIterator;
  }
  return "@@asyncIterator";
}
function getDoneCallback(args) {
  if (args.length < 2) {
    return null;
  }
  const onDone = args[1];
  if (typeof onDone !== "function") {
    throw Error(`The second argument to autoPagingEach, if present, must be a callback function; received ${typeof onDone}`);
  }
  return onDone;
}
function getItemCallback(args) {
  if (args.length === 0) {
    return void 0;
  }
  const onItem = args[0];
  if (typeof onItem !== "function") {
    throw Error(`The first argument to autoPagingEach, if present, must be a callback function; received ${typeof onItem}`);
  }
  if (onItem.length === 2) {
    return onItem;
  }
  if (onItem.length > 2) {
    throw Error(`The \`onItem\` callback function passed to autoPagingEach must accept at most two arguments; got ${onItem}`);
  }
  return function _onItem(item, next) {
    const shouldContinue = onItem(item);
    next(shouldContinue);
  };
}
function getLastId(listResult, reverseIteration) {
  const lastIdx = reverseIteration ? 0 : listResult.data.length - 1;
  const lastItem = listResult.data[lastIdx];
  const lastId = lastItem && lastItem.id;
  if (!lastId) {
    throw Error("Unexpected: No `id` found on the last item while auto-paging a list.");
  }
  return lastId;
}
function makeAutoPagingEach(asyncIteratorNext) {
  return function autoPagingEach() {
    const args = [].slice.call(arguments);
    const onItem = getItemCallback(args);
    const onDone = getDoneCallback(args);
    if (args.length > 2) {
      throw Error(`autoPagingEach takes up to two arguments; received ${args}`);
    }
    const autoPagePromise = wrapAsyncIteratorWithCallback(
      asyncIteratorNext,
      // @ts-ignore we might need a null check
      onItem
    );
    return callbackifyPromiseWithTimeout(autoPagePromise, onDone);
  };
}
function makeAutoPagingToArray(autoPagingEach) {
  return function autoPagingToArray(opts, onDone) {
    const limit = opts && opts.limit;
    if (!limit) {
      throw Error("You must pass a `limit` option to autoPagingToArray, e.g., `autoPagingToArray({limit: 1000});`.");
    }
    if (limit > 1e4) {
      throw Error("You cannot specify a limit of more than 10,000 items to fetch in `autoPagingToArray`; use `autoPagingEach` to iterate through longer lists.");
    }
    const promise = new Promise((resolve, reject) => {
      const items = [];
      autoPagingEach((item) => {
        items.push(item);
        if (items.length >= limit) {
          return false;
        }
      }).then(() => {
        resolve(items);
      }).catch(reject);
    });
    return callbackifyPromiseWithTimeout(promise, onDone);
  };
}
function wrapAsyncIteratorWithCallback(asyncIteratorNext, onItem) {
  return new Promise((resolve, reject) => {
    function handleIteration(iterResult) {
      if (iterResult.done) {
        resolve();
        return;
      }
      const item = iterResult.value;
      return new Promise((next) => {
        onItem(item, next);
      }).then((shouldContinue) => {
        if (shouldContinue === false) {
          return handleIteration({ done: true, value: void 0 });
        } else {
          return asyncIteratorNext().then(handleIteration);
        }
      });
    }
    asyncIteratorNext().then(handleIteration).catch(reject);
  });
}
function isReverseIteration(requestArgs) {
  const args = [].slice.call(requestArgs);
  const dataFromArgs = getDataFromArgs(args);
  return !!dataFromArgs.ending_before;
}

// ../../node_modules/stripe/esm/StripeMethod.js
function stripeMethod(spec) {
  if (spec.path !== void 0 && spec.fullPath !== void 0) {
    throw new Error(`Method spec specified both a 'path' (${spec.path}) and a 'fullPath' (${spec.fullPath}).`);
  }
  return function(...args) {
    const callback = typeof args[args.length - 1] == "function" && args.pop();
    spec.urlParams = extractUrlParams(spec.fullPath || this.createResourcePathWithSymbols(spec.path || ""));
    const requestPromise = callbackifyPromiseWithTimeout(this._makeRequest(args, spec, {}), callback);
    Object.assign(requestPromise, makeAutoPaginationMethods(this, args, spec, requestPromise));
    return requestPromise;
  };
}

// ../../node_modules/stripe/esm/StripeResource.js
StripeResource.extend = protoExtend;
StripeResource.method = stripeMethod;
StripeResource.MAX_BUFFERED_REQUEST_METRICS = 100;
function StripeResource(stripe2, deprecatedUrlData) {
  this._stripe = stripe2;
  if (deprecatedUrlData) {
    throw new Error("Support for curried url params was dropped in stripe-node v7.0.0. Instead, pass two ids.");
  }
  this.basePath = makeURLInterpolator(
    // @ts-ignore changing type of basePath
    this.basePath || stripe2.getApiField("basePath")
  );
  this.resourcePath = this.path;
  this.path = makeURLInterpolator(this.path);
  this.initialize(...arguments);
}
StripeResource.prototype = {
  _stripe: null,
  // @ts-ignore the type of path changes in ctor
  path: "",
  resourcePath: "",
  // Methods that don't use the API's default '/v1' path can override it with this setting.
  basePath: null,
  initialize() {
  },
  // Function to override the default data processor. This allows full control
  // over how a StripeResource's request data will get converted into an HTTP
  // body. This is useful for non-standard HTTP requests. The function should
  // take method name, data, and headers as arguments.
  requestDataProcessor: null,
  // Function to add a validation checks before sending the request, errors should
  // be thrown, and they will be passed to the callback/promise.
  validateRequest: null,
  createFullPath(commandPath, urlData) {
    const urlParts = [this.basePath(urlData), this.path(urlData)];
    if (typeof commandPath === "function") {
      const computedCommandPath = commandPath(urlData);
      if (computedCommandPath) {
        urlParts.push(computedCommandPath);
      }
    } else {
      urlParts.push(commandPath);
    }
    return this._joinUrlParts(urlParts);
  },
  // Creates a relative resource path with symbols left in (unlike
  // createFullPath which takes some data to replace them with). For example it
  // might produce: /invoices/{id}
  createResourcePathWithSymbols(pathWithSymbols) {
    if (pathWithSymbols) {
      return `/${this._joinUrlParts([this.resourcePath, pathWithSymbols])}`;
    } else {
      return `/${this.resourcePath}`;
    }
  },
  _joinUrlParts(parts) {
    return parts.join("/").replace(/\/{2,}/g, "/");
  },
  _getRequestOpts(requestArgs, spec, overrideData) {
    var _a;
    const requestMethod = (spec.method || "GET").toUpperCase();
    const usage = spec.usage || [];
    const urlParams = spec.urlParams || [];
    const encode = spec.encode || ((data2) => data2);
    const isUsingFullPath = !!spec.fullPath;
    const commandPath = makeURLInterpolator(isUsingFullPath ? spec.fullPath : spec.path || "");
    const path = isUsingFullPath ? spec.fullPath : this.createResourcePathWithSymbols(spec.path);
    const args = [].slice.call(requestArgs);
    const urlData = urlParams.reduce((urlData2, param) => {
      const arg = args.shift();
      if (typeof arg !== "string") {
        throw new Error(`Stripe: Argument "${param}" must be a string, but got: ${arg} (on API request to \`${requestMethod} ${path}\`)`);
      }
      urlData2[param] = arg;
      return urlData2;
    }, {});
    const dataFromArgs = getDataFromArgs(args);
    const data = encode(Object.assign({}, dataFromArgs, overrideData));
    const options = getOptionsFromArgs(args);
    const host = options.host || spec.host;
    const streaming = !!spec.streaming;
    if (args.filter((x2) => x2 != null).length) {
      throw new Error(`Stripe: Unknown arguments (${args}). Did you mean to pass an options object? See https://github.com/stripe/stripe-node/wiki/Passing-Options. (on API request to ${requestMethod} \`${path}\`)`);
    }
    const requestPath = isUsingFullPath ? commandPath(urlData) : this.createFullPath(commandPath, urlData);
    const headers = Object.assign(options.headers, spec.headers);
    if (spec.validator) {
      spec.validator(data, { headers });
    }
    const dataInQuery = spec.method === "GET" || spec.method === "DELETE";
    const bodyData = dataInQuery ? null : data;
    const queryData = dataInQuery ? data : {};
    return {
      requestMethod,
      requestPath,
      bodyData,
      queryData,
      authenticator: (_a = options.authenticator) !== null && _a !== void 0 ? _a : null,
      headers,
      host: host !== null && host !== void 0 ? host : null,
      streaming,
      settings: options.settings,
      usage
    };
  },
  _makeRequest(requestArgs, spec, overrideData) {
    return new Promise((resolve, reject) => {
      var _a;
      let opts;
      try {
        opts = this._getRequestOpts(requestArgs, spec, overrideData);
      } catch (err2) {
        reject(err2);
        return;
      }
      function requestCallback(err2, response) {
        if (err2) {
          reject(err2);
        } else {
          resolve(spec.transformResponseData ? spec.transformResponseData(response) : response);
        }
      }
      const emptyQuery = Object.keys(opts.queryData).length === 0;
      const path = [
        opts.requestPath,
        emptyQuery ? "" : "?",
        queryStringifyRequestData(opts.queryData, getAPIMode(opts.requestPath))
      ].join("");
      const { headers, settings } = opts;
      this._stripe._requestSender._request(opts.requestMethod, opts.host, path, opts.bodyData, opts.authenticator, {
        headers,
        settings,
        streaming: opts.streaming
      }, opts.usage, requestCallback, (_a = this.requestDataProcessor) === null || _a === void 0 ? void 0 : _a.bind(this));
    });
  }
};

// ../../node_modules/stripe/esm/Webhooks.js
function createWebhooks(platformFunctions) {
  const Webhook = {
    DEFAULT_TOLERANCE: 300,
    // @ts-ignore
    signature: null,
    constructEvent(payload, header, secret2, tolerance, cryptoProvider, receivedAt) {
      try {
        this.signature.verifyHeader(payload, header, secret2, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
      } catch (e) {
        if (e instanceof CryptoProviderOnlySupportsAsyncError) {
          e.message += "\nUse `await constructEventAsync(...)` instead of `constructEvent(...)`";
        }
        throw e;
      }
      const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
      return jsonPayload;
    },
    async constructEventAsync(payload, header, secret2, tolerance, cryptoProvider, receivedAt) {
      await this.signature.verifyHeaderAsync(payload, header, secret2, tolerance || Webhook.DEFAULT_TOLERANCE, cryptoProvider, receivedAt);
      const jsonPayload = payload instanceof Uint8Array ? JSON.parse(new TextDecoder("utf8").decode(payload)) : JSON.parse(payload);
      return jsonPayload;
    },
    /**
     * Generates a header to be used for webhook mocking
     *
     * @typedef {object} opts
     * @property {number} timestamp - Timestamp of the header. Defaults to Date.now()
     * @property {string} payload - JSON stringified payload object, containing the 'id' and 'object' parameters
     * @property {string} secret - Stripe webhook secret 'whsec_...'
     * @property {string} scheme - Version of API to hit. Defaults to 'v1'.
     * @property {string} signature - Computed webhook signature
     * @property {CryptoProvider} cryptoProvider - Crypto provider to use for computing the signature if none was provided. Defaults to NodeCryptoProvider.
     */
    generateTestHeaderString: function(opts) {
      const preparedOpts = prepareOptions(opts);
      const signature2 = preparedOpts.signature || preparedOpts.cryptoProvider.computeHMACSignature(preparedOpts.payloadString, preparedOpts.secret);
      return preparedOpts.generateHeaderString(signature2);
    },
    generateTestHeaderStringAsync: async function(opts) {
      const preparedOpts = prepareOptions(opts);
      const signature2 = preparedOpts.signature || await preparedOpts.cryptoProvider.computeHMACSignatureAsync(preparedOpts.payloadString, preparedOpts.secret);
      return preparedOpts.generateHeaderString(signature2);
    }
  };
  const signature = {
    EXPECTED_SCHEME: "v1",
    verifyHeader(encodedPayload, encodedHeader, secret2, tolerance, cryptoProvider, receivedAt) {
      const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
      const secretContainsWhitespace = /\s/.test(secret2);
      cryptoProvider = cryptoProvider || getCryptoProvider();
      const expectedSignature = cryptoProvider.computeHMACSignature(makeHMACContent(payload, details), secret2);
      validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
      return true;
    },
    async verifyHeaderAsync(encodedPayload, encodedHeader, secret2, tolerance, cryptoProvider, receivedAt) {
      const { decodedHeader: header, decodedPayload: payload, details, suspectPayloadType } = parseEventDetails(encodedPayload, encodedHeader, this.EXPECTED_SCHEME);
      const secretContainsWhitespace = /\s/.test(secret2);
      cryptoProvider = cryptoProvider || getCryptoProvider();
      const expectedSignature = await cryptoProvider.computeHMACSignatureAsync(makeHMACContent(payload, details), secret2);
      return validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt);
    }
  };
  function makeHMACContent(payload, details) {
    return `${details.timestamp}.${payload}`;
  }
  function parseEventDetails(encodedPayload, encodedHeader, expectedScheme) {
    if (!encodedPayload) {
      throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
        message: "No webhook payload was provided."
      });
    }
    const suspectPayloadType = typeof encodedPayload != "string" && !(encodedPayload instanceof Uint8Array);
    const textDecoder = new TextDecoder("utf8");
    const decodedPayload = encodedPayload instanceof Uint8Array ? textDecoder.decode(encodedPayload) : encodedPayload;
    if (Array.isArray(encodedHeader)) {
      throw new Error("Unexpected: An array was passed as a header, which should not be possible for the stripe-signature header.");
    }
    if (encodedHeader == null || encodedHeader == "") {
      throw new StripeSignatureVerificationError(encodedHeader, encodedPayload, {
        message: "No stripe-signature header value was provided."
      });
    }
    const decodedHeader = encodedHeader instanceof Uint8Array ? textDecoder.decode(encodedHeader) : encodedHeader;
    const details = parseHeader(decodedHeader, expectedScheme);
    if (!details || details.timestamp === -1) {
      throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
        message: "Unable to extract timestamp and signatures from header"
      });
    }
    if (!details.signatures.length) {
      throw new StripeSignatureVerificationError(decodedHeader, decodedPayload, {
        message: "No signatures found with expected scheme"
      });
    }
    return {
      decodedPayload,
      decodedHeader,
      details,
      suspectPayloadType
    };
  }
  function validateComputedSignature(payload, header, details, expectedSignature, tolerance, suspectPayloadType, secretContainsWhitespace, receivedAt) {
    const signatureFound = !!details.signatures.filter(platformFunctions.secureCompare.bind(platformFunctions, expectedSignature)).length;
    const docsLocation = "\nLearn more about webhook signing and explore webhook integration examples for various frameworks at https://docs.stripe.com/webhooks/signature";
    const whitespaceMessage = secretContainsWhitespace ? "\n\nNote: The provided signing secret contains whitespace. This often indicates an extra newline or space is in the value" : "";
    if (!signatureFound) {
      if (suspectPayloadType) {
        throw new StripeSignatureVerificationError(header, payload, {
          message: "Webhook payload must be provided as a string or a Buffer (https://nodejs.org/api/buffer.html) instance representing the _raw_ request body.Payload was provided as a parsed JavaScript object instead. \nSignature verification is impossible without access to the original signed material. \n" + docsLocation + "\n" + whitespaceMessage
        });
      }
      throw new StripeSignatureVerificationError(header, payload, {
        message: "No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? \n If a webhook request is being forwarded by a third-party tool, ensure that the exact request body, including JSON formatting and new line style, is preserved.\n" + docsLocation + "\n" + whitespaceMessage
      });
    }
    const timestampAge = Math.floor((typeof receivedAt === "number" ? receivedAt : Date.now()) / 1e3) - details.timestamp;
    if (tolerance > 0 && timestampAge > tolerance) {
      throw new StripeSignatureVerificationError(header, payload, {
        message: "Timestamp outside the tolerance zone"
      });
    }
    return true;
  }
  function parseHeader(header, scheme) {
    if (typeof header !== "string") {
      return null;
    }
    return header.split(",").reduce((accum, item) => {
      const kv = item.split("=");
      if (kv[0] === "t") {
        accum.timestamp = parseInt(kv[1], 10);
      }
      if (kv[0] === scheme) {
        accum.signatures.push(kv[1]);
      }
      return accum;
    }, {
      timestamp: -1,
      signatures: []
    });
  }
  let webhooksCryptoProviderInstance = null;
  function getCryptoProvider() {
    if (!webhooksCryptoProviderInstance) {
      webhooksCryptoProviderInstance = platformFunctions.createDefaultCryptoProvider();
    }
    return webhooksCryptoProviderInstance;
  }
  function prepareOptions(opts) {
    if (!opts) {
      throw new StripeError({
        message: "Options are required"
      });
    }
    const timestamp = Math.floor(opts.timestamp) || Math.floor(Date.now() / 1e3);
    const scheme = opts.scheme || signature.EXPECTED_SCHEME;
    const cryptoProvider = opts.cryptoProvider || getCryptoProvider();
    const payloadString = `${timestamp}.${opts.payload}`;
    const generateHeaderString = (signature2) => {
      return `t=${timestamp},${scheme}=${signature2}`;
    };
    return Object.assign(Object.assign({}, opts), {
      timestamp,
      scheme,
      cryptoProvider,
      payloadString,
      generateHeaderString
    });
  }
  Webhook.signature = signature;
  return Webhook;
}

// ../../node_modules/stripe/esm/apiVersion.js
var ApiVersion = "2025-02-24.acacia";

// ../../node_modules/stripe/esm/resources.js
var resources_exports = {};
__export(resources_exports, {
  Account: () => Accounts2,
  AccountLinks: () => AccountLinks,
  AccountSessions: () => AccountSessions,
  Accounts: () => Accounts2,
  ApplePayDomains: () => ApplePayDomains,
  ApplicationFees: () => ApplicationFees,
  Apps: () => Apps,
  Balance: () => Balance,
  BalanceTransactions: () => BalanceTransactions,
  Billing: () => Billing,
  BillingPortal: () => BillingPortal,
  Charges: () => Charges,
  Checkout: () => Checkout,
  Climate: () => Climate,
  ConfirmationTokens: () => ConfirmationTokens2,
  CountrySpecs: () => CountrySpecs,
  Coupons: () => Coupons,
  CreditNotes: () => CreditNotes,
  CustomerSessions: () => CustomerSessions,
  Customers: () => Customers2,
  Disputes: () => Disputes2,
  Entitlements: () => Entitlements,
  EphemeralKeys: () => EphemeralKeys,
  Events: () => Events2,
  ExchangeRates: () => ExchangeRates,
  FileLinks: () => FileLinks,
  Files: () => Files,
  FinancialConnections: () => FinancialConnections,
  Forwarding: () => Forwarding,
  Identity: () => Identity,
  InvoiceItems: () => InvoiceItems,
  InvoiceRenderingTemplates: () => InvoiceRenderingTemplates,
  Invoices: () => Invoices,
  Issuing: () => Issuing,
  Mandates: () => Mandates,
  OAuth: () => OAuth,
  PaymentIntents: () => PaymentIntents,
  PaymentLinks: () => PaymentLinks,
  PaymentMethodConfigurations: () => PaymentMethodConfigurations,
  PaymentMethodDomains: () => PaymentMethodDomains,
  PaymentMethods: () => PaymentMethods,
  Payouts: () => Payouts,
  Plans: () => Plans,
  Prices: () => Prices,
  Products: () => Products2,
  PromotionCodes: () => PromotionCodes,
  Quotes: () => Quotes,
  Radar: () => Radar,
  Refunds: () => Refunds2,
  Reporting: () => Reporting,
  Reviews: () => Reviews,
  SetupAttempts: () => SetupAttempts,
  SetupIntents: () => SetupIntents,
  ShippingRates: () => ShippingRates,
  Sigma: () => Sigma,
  Sources: () => Sources,
  SubscriptionItems: () => SubscriptionItems,
  SubscriptionSchedules: () => SubscriptionSchedules,
  Subscriptions: () => Subscriptions,
  Tax: () => Tax,
  TaxCodes: () => TaxCodes,
  TaxIds: () => TaxIds,
  TaxRates: () => TaxRates,
  Terminal: () => Terminal,
  TestHelpers: () => TestHelpers,
  Tokens: () => Tokens2,
  Topups: () => Topups,
  Transfers: () => Transfers,
  Treasury: () => Treasury,
  V2: () => V2,
  WebhookEndpoints: () => WebhookEndpoints
});

// ../../node_modules/stripe/esm/ResourceNamespace.js
function ResourceNamespace(stripe2, resources) {
  for (const name2 in resources) {
    if (!Object.prototype.hasOwnProperty.call(resources, name2)) {
      continue;
    }
    const camelCaseName = name2[0].toLowerCase() + name2.substring(1);
    const resource = new resources[name2](stripe2);
    this[camelCaseName] = resource;
  }
}
function resourceNamespace(namespace, resources) {
  return function(stripe2) {
    return new ResourceNamespace(stripe2, resources);
  };
}

// ../../node_modules/stripe/esm/resources/FinancialConnections/Accounts.js
var stripeMethod2 = StripeResource.method;
var Accounts = StripeResource.extend({
  retrieve: stripeMethod2({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts/{account}"
  }),
  list: stripeMethod2({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts",
    methodType: "list"
  }),
  disconnect: stripeMethod2({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/disconnect"
  }),
  listOwners: stripeMethod2({
    method: "GET",
    fullPath: "/v1/financial_connections/accounts/{account}/owners",
    methodType: "list"
  }),
  refresh: stripeMethod2({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/refresh"
  }),
  subscribe: stripeMethod2({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/subscribe"
  }),
  unsubscribe: stripeMethod2({
    method: "POST",
    fullPath: "/v1/financial_connections/accounts/{account}/unsubscribe"
  })
});

// ../../node_modules/stripe/esm/resources/Entitlements/ActiveEntitlements.js
var stripeMethod3 = StripeResource.method;
var ActiveEntitlements = StripeResource.extend({
  retrieve: stripeMethod3({
    method: "GET",
    fullPath: "/v1/entitlements/active_entitlements/{id}"
  }),
  list: stripeMethod3({
    method: "GET",
    fullPath: "/v1/entitlements/active_entitlements",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Billing/Alerts.js
var stripeMethod4 = StripeResource.method;
var Alerts = StripeResource.extend({
  create: stripeMethod4({ method: "POST", fullPath: "/v1/billing/alerts" }),
  retrieve: stripeMethod4({ method: "GET", fullPath: "/v1/billing/alerts/{id}" }),
  list: stripeMethod4({
    method: "GET",
    fullPath: "/v1/billing/alerts",
    methodType: "list"
  }),
  activate: stripeMethod4({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/activate"
  }),
  archive: stripeMethod4({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/archive"
  }),
  deactivate: stripeMethod4({
    method: "POST",
    fullPath: "/v1/billing/alerts/{id}/deactivate"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Issuing/Authorizations.js
var stripeMethod5 = StripeResource.method;
var Authorizations = StripeResource.extend({
  create: stripeMethod5({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations"
  }),
  capture: stripeMethod5({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/capture"
  }),
  expire: stripeMethod5({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/expire"
  }),
  finalizeAmount: stripeMethod5({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/finalize_amount"
  }),
  increment: stripeMethod5({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/increment"
  }),
  respond: stripeMethod5({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/fraud_challenges/respond"
  }),
  reverse: stripeMethod5({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/authorizations/{authorization}/reverse"
  })
});

// ../../node_modules/stripe/esm/resources/Issuing/Authorizations.js
var stripeMethod6 = StripeResource.method;
var Authorizations2 = StripeResource.extend({
  retrieve: stripeMethod6({
    method: "GET",
    fullPath: "/v1/issuing/authorizations/{authorization}"
  }),
  update: stripeMethod6({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}"
  }),
  list: stripeMethod6({
    method: "GET",
    fullPath: "/v1/issuing/authorizations",
    methodType: "list"
  }),
  approve: stripeMethod6({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}/approve"
  }),
  decline: stripeMethod6({
    method: "POST",
    fullPath: "/v1/issuing/authorizations/{authorization}/decline"
  })
});

// ../../node_modules/stripe/esm/resources/Tax/Calculations.js
var stripeMethod7 = StripeResource.method;
var Calculations = StripeResource.extend({
  create: stripeMethod7({ method: "POST", fullPath: "/v1/tax/calculations" }),
  retrieve: stripeMethod7({
    method: "GET",
    fullPath: "/v1/tax/calculations/{calculation}"
  }),
  listLineItems: stripeMethod7({
    method: "GET",
    fullPath: "/v1/tax/calculations/{calculation}/line_items",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Issuing/Cardholders.js
var stripeMethod8 = StripeResource.method;
var Cardholders = StripeResource.extend({
  create: stripeMethod8({ method: "POST", fullPath: "/v1/issuing/cardholders" }),
  retrieve: stripeMethod8({
    method: "GET",
    fullPath: "/v1/issuing/cardholders/{cardholder}"
  }),
  update: stripeMethod8({
    method: "POST",
    fullPath: "/v1/issuing/cardholders/{cardholder}"
  }),
  list: stripeMethod8({
    method: "GET",
    fullPath: "/v1/issuing/cardholders",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Issuing/Cards.js
var stripeMethod9 = StripeResource.method;
var Cards = StripeResource.extend({
  deliverCard: stripeMethod9({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/deliver"
  }),
  failCard: stripeMethod9({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/fail"
  }),
  returnCard: stripeMethod9({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/return"
  }),
  shipCard: stripeMethod9({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/ship"
  }),
  submitCard: stripeMethod9({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/cards/{card}/shipping/submit"
  })
});

// ../../node_modules/stripe/esm/resources/Issuing/Cards.js
var stripeMethod10 = StripeResource.method;
var Cards2 = StripeResource.extend({
  create: stripeMethod10({ method: "POST", fullPath: "/v1/issuing/cards" }),
  retrieve: stripeMethod10({ method: "GET", fullPath: "/v1/issuing/cards/{card}" }),
  update: stripeMethod10({ method: "POST", fullPath: "/v1/issuing/cards/{card}" }),
  list: stripeMethod10({
    method: "GET",
    fullPath: "/v1/issuing/cards",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/BillingPortal/Configurations.js
var stripeMethod11 = StripeResource.method;
var Configurations = StripeResource.extend({
  create: stripeMethod11({
    method: "POST",
    fullPath: "/v1/billing_portal/configurations"
  }),
  retrieve: stripeMethod11({
    method: "GET",
    fullPath: "/v1/billing_portal/configurations/{configuration}"
  }),
  update: stripeMethod11({
    method: "POST",
    fullPath: "/v1/billing_portal/configurations/{configuration}"
  }),
  list: stripeMethod11({
    method: "GET",
    fullPath: "/v1/billing_portal/configurations",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Terminal/Configurations.js
var stripeMethod12 = StripeResource.method;
var Configurations2 = StripeResource.extend({
  create: stripeMethod12({
    method: "POST",
    fullPath: "/v1/terminal/configurations"
  }),
  retrieve: stripeMethod12({
    method: "GET",
    fullPath: "/v1/terminal/configurations/{configuration}"
  }),
  update: stripeMethod12({
    method: "POST",
    fullPath: "/v1/terminal/configurations/{configuration}"
  }),
  list: stripeMethod12({
    method: "GET",
    fullPath: "/v1/terminal/configurations",
    methodType: "list"
  }),
  del: stripeMethod12({
    method: "DELETE",
    fullPath: "/v1/terminal/configurations/{configuration}"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/ConfirmationTokens.js
var stripeMethod13 = StripeResource.method;
var ConfirmationTokens = StripeResource.extend({
  create: stripeMethod13({
    method: "POST",
    fullPath: "/v1/test_helpers/confirmation_tokens"
  })
});

// ../../node_modules/stripe/esm/resources/Terminal/ConnectionTokens.js
var stripeMethod14 = StripeResource.method;
var ConnectionTokens = StripeResource.extend({
  create: stripeMethod14({
    method: "POST",
    fullPath: "/v1/terminal/connection_tokens"
  })
});

// ../../node_modules/stripe/esm/resources/Billing/CreditBalanceSummary.js
var stripeMethod15 = StripeResource.method;
var CreditBalanceSummary = StripeResource.extend({
  retrieve: stripeMethod15({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_summary"
  })
});

// ../../node_modules/stripe/esm/resources/Billing/CreditBalanceTransactions.js
var stripeMethod16 = StripeResource.method;
var CreditBalanceTransactions = StripeResource.extend({
  retrieve: stripeMethod16({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_transactions/{id}"
  }),
  list: stripeMethod16({
    method: "GET",
    fullPath: "/v1/billing/credit_balance_transactions",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Billing/CreditGrants.js
var stripeMethod17 = StripeResource.method;
var CreditGrants = StripeResource.extend({
  create: stripeMethod17({ method: "POST", fullPath: "/v1/billing/credit_grants" }),
  retrieve: stripeMethod17({
    method: "GET",
    fullPath: "/v1/billing/credit_grants/{id}"
  }),
  update: stripeMethod17({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}"
  }),
  list: stripeMethod17({
    method: "GET",
    fullPath: "/v1/billing/credit_grants",
    methodType: "list"
  }),
  expire: stripeMethod17({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}/expire"
  }),
  voidGrant: stripeMethod17({
    method: "POST",
    fullPath: "/v1/billing/credit_grants/{id}/void"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/CreditReversals.js
var stripeMethod18 = StripeResource.method;
var CreditReversals = StripeResource.extend({
  create: stripeMethod18({
    method: "POST",
    fullPath: "/v1/treasury/credit_reversals"
  }),
  retrieve: stripeMethod18({
    method: "GET",
    fullPath: "/v1/treasury/credit_reversals/{credit_reversal}"
  }),
  list: stripeMethod18({
    method: "GET",
    fullPath: "/v1/treasury/credit_reversals",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Customers.js
var stripeMethod19 = StripeResource.method;
var Customers = StripeResource.extend({
  fundCashBalance: stripeMethod19({
    method: "POST",
    fullPath: "/v1/test_helpers/customers/{customer}/fund_cash_balance"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/DebitReversals.js
var stripeMethod20 = StripeResource.method;
var DebitReversals = StripeResource.extend({
  create: stripeMethod20({
    method: "POST",
    fullPath: "/v1/treasury/debit_reversals"
  }),
  retrieve: stripeMethod20({
    method: "GET",
    fullPath: "/v1/treasury/debit_reversals/{debit_reversal}"
  }),
  list: stripeMethod20({
    method: "GET",
    fullPath: "/v1/treasury/debit_reversals",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Issuing/Disputes.js
var stripeMethod21 = StripeResource.method;
var Disputes = StripeResource.extend({
  create: stripeMethod21({ method: "POST", fullPath: "/v1/issuing/disputes" }),
  retrieve: stripeMethod21({
    method: "GET",
    fullPath: "/v1/issuing/disputes/{dispute}"
  }),
  update: stripeMethod21({
    method: "POST",
    fullPath: "/v1/issuing/disputes/{dispute}"
  }),
  list: stripeMethod21({
    method: "GET",
    fullPath: "/v1/issuing/disputes",
    methodType: "list"
  }),
  submit: stripeMethod21({
    method: "POST",
    fullPath: "/v1/issuing/disputes/{dispute}/submit"
  })
});

// ../../node_modules/stripe/esm/resources/Radar/EarlyFraudWarnings.js
var stripeMethod22 = StripeResource.method;
var EarlyFraudWarnings = StripeResource.extend({
  retrieve: stripeMethod22({
    method: "GET",
    fullPath: "/v1/radar/early_fraud_warnings/{early_fraud_warning}"
  }),
  list: stripeMethod22({
    method: "GET",
    fullPath: "/v1/radar/early_fraud_warnings",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/V2/Core/EventDestinations.js
var stripeMethod23 = StripeResource.method;
var EventDestinations = StripeResource.extend({
  create: stripeMethod23({
    method: "POST",
    fullPath: "/v2/core/event_destinations"
  }),
  retrieve: stripeMethod23({
    method: "GET",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  update: stripeMethod23({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  list: stripeMethod23({
    method: "GET",
    fullPath: "/v2/core/event_destinations",
    methodType: "list"
  }),
  del: stripeMethod23({
    method: "DELETE",
    fullPath: "/v2/core/event_destinations/{id}"
  }),
  disable: stripeMethod23({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/disable"
  }),
  enable: stripeMethod23({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/enable"
  }),
  ping: stripeMethod23({
    method: "POST",
    fullPath: "/v2/core/event_destinations/{id}/ping"
  })
});

// ../../node_modules/stripe/esm/resources/V2/Core/Events.js
var stripeMethod24 = StripeResource.method;
var Events = StripeResource.extend({
  retrieve(...args) {
    const transformResponseData = (response) => {
      return this.addFetchRelatedObjectIfNeeded(response);
    };
    return stripeMethod24({
      method: "GET",
      fullPath: "/v2/core/events/{id}",
      transformResponseData
    }).apply(this, args);
  },
  list(...args) {
    const transformResponseData = (response) => {
      return Object.assign(Object.assign({}, response), { data: response.data.map(this.addFetchRelatedObjectIfNeeded.bind(this)) });
    };
    return stripeMethod24({
      method: "GET",
      fullPath: "/v2/core/events",
      methodType: "list",
      transformResponseData
    }).apply(this, args);
  },
  /**
   * @private
   *
   * For internal use in stripe-node.
   *
   * @param pulledEvent The retrieved event object
   * @returns The retrieved event object with a fetchRelatedObject method,
   * if pulledEvent.related_object is valid (non-null and has a url)
   */
  addFetchRelatedObjectIfNeeded(pulledEvent) {
    if (!pulledEvent.related_object || !pulledEvent.related_object.url) {
      return pulledEvent;
    }
    return Object.assign(Object.assign({}, pulledEvent), { fetchRelatedObject: () => (
      // call stripeMethod with 'this' resource to fetch
      // the related object. 'this' is needed to construct
      // and send the request, but the method spec controls
      // the url endpoint and method, so it doesn't matter
      // that 'this' is an Events resource object here
      stripeMethod24({
        method: "GET",
        fullPath: pulledEvent.related_object.url
      }).apply(this, [
        {
          stripeAccount: pulledEvent.context
        }
      ])
    ) });
  }
});

// ../../node_modules/stripe/esm/resources/Entitlements/Features.js
var stripeMethod25 = StripeResource.method;
var Features = StripeResource.extend({
  create: stripeMethod25({ method: "POST", fullPath: "/v1/entitlements/features" }),
  retrieve: stripeMethod25({
    method: "GET",
    fullPath: "/v1/entitlements/features/{id}"
  }),
  update: stripeMethod25({
    method: "POST",
    fullPath: "/v1/entitlements/features/{id}"
  }),
  list: stripeMethod25({
    method: "GET",
    fullPath: "/v1/entitlements/features",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/FinancialAccounts.js
var stripeMethod26 = StripeResource.method;
var FinancialAccounts = StripeResource.extend({
  create: stripeMethod26({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts"
  }),
  retrieve: stripeMethod26({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}"
  }),
  update: stripeMethod26({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}"
  }),
  list: stripeMethod26({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts",
    methodType: "list"
  }),
  close: stripeMethod26({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/close"
  }),
  retrieveFeatures: stripeMethod26({
    method: "GET",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
  }),
  updateFeatures: stripeMethod26({
    method: "POST",
    fullPath: "/v1/treasury/financial_accounts/{financial_account}/features"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Treasury/InboundTransfers.js
var stripeMethod27 = StripeResource.method;
var InboundTransfers = StripeResource.extend({
  fail: stripeMethod27({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/fail"
  }),
  returnInboundTransfer: stripeMethod27({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/return"
  }),
  succeed: stripeMethod27({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/inbound_transfers/{id}/succeed"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/InboundTransfers.js
var stripeMethod28 = StripeResource.method;
var InboundTransfers2 = StripeResource.extend({
  create: stripeMethod28({
    method: "POST",
    fullPath: "/v1/treasury/inbound_transfers"
  }),
  retrieve: stripeMethod28({
    method: "GET",
    fullPath: "/v1/treasury/inbound_transfers/{id}"
  }),
  list: stripeMethod28({
    method: "GET",
    fullPath: "/v1/treasury/inbound_transfers",
    methodType: "list"
  }),
  cancel: stripeMethod28({
    method: "POST",
    fullPath: "/v1/treasury/inbound_transfers/{inbound_transfer}/cancel"
  })
});

// ../../node_modules/stripe/esm/resources/Terminal/Locations.js
var stripeMethod29 = StripeResource.method;
var Locations = StripeResource.extend({
  create: stripeMethod29({ method: "POST", fullPath: "/v1/terminal/locations" }),
  retrieve: stripeMethod29({
    method: "GET",
    fullPath: "/v1/terminal/locations/{location}"
  }),
  update: stripeMethod29({
    method: "POST",
    fullPath: "/v1/terminal/locations/{location}"
  }),
  list: stripeMethod29({
    method: "GET",
    fullPath: "/v1/terminal/locations",
    methodType: "list"
  }),
  del: stripeMethod29({
    method: "DELETE",
    fullPath: "/v1/terminal/locations/{location}"
  })
});

// ../../node_modules/stripe/esm/resources/Billing/MeterEventAdjustments.js
var stripeMethod30 = StripeResource.method;
var MeterEventAdjustments = StripeResource.extend({
  create: stripeMethod30({
    method: "POST",
    fullPath: "/v1/billing/meter_event_adjustments"
  })
});

// ../../node_modules/stripe/esm/resources/V2/Billing/MeterEventAdjustments.js
var stripeMethod31 = StripeResource.method;
var MeterEventAdjustments2 = StripeResource.extend({
  create: stripeMethod31({
    method: "POST",
    fullPath: "/v2/billing/meter_event_adjustments"
  })
});

// ../../node_modules/stripe/esm/resources/V2/Billing/MeterEventSession.js
var stripeMethod32 = StripeResource.method;
var MeterEventSession = StripeResource.extend({
  create: stripeMethod32({
    method: "POST",
    fullPath: "/v2/billing/meter_event_session"
  })
});

// ../../node_modules/stripe/esm/resources/V2/Billing/MeterEventStream.js
var stripeMethod33 = StripeResource.method;
var MeterEventStream = StripeResource.extend({
  create: stripeMethod33({
    method: "POST",
    fullPath: "/v2/billing/meter_event_stream",
    host: "meter-events.stripe.com"
  })
});

// ../../node_modules/stripe/esm/resources/Billing/MeterEvents.js
var stripeMethod34 = StripeResource.method;
var MeterEvents = StripeResource.extend({
  create: stripeMethod34({ method: "POST", fullPath: "/v1/billing/meter_events" })
});

// ../../node_modules/stripe/esm/resources/V2/Billing/MeterEvents.js
var stripeMethod35 = StripeResource.method;
var MeterEvents2 = StripeResource.extend({
  create: stripeMethod35({ method: "POST", fullPath: "/v2/billing/meter_events" })
});

// ../../node_modules/stripe/esm/resources/Billing/Meters.js
var stripeMethod36 = StripeResource.method;
var Meters = StripeResource.extend({
  create: stripeMethod36({ method: "POST", fullPath: "/v1/billing/meters" }),
  retrieve: stripeMethod36({ method: "GET", fullPath: "/v1/billing/meters/{id}" }),
  update: stripeMethod36({ method: "POST", fullPath: "/v1/billing/meters/{id}" }),
  list: stripeMethod36({
    method: "GET",
    fullPath: "/v1/billing/meters",
    methodType: "list"
  }),
  deactivate: stripeMethod36({
    method: "POST",
    fullPath: "/v1/billing/meters/{id}/deactivate"
  }),
  listEventSummaries: stripeMethod36({
    method: "GET",
    fullPath: "/v1/billing/meters/{id}/event_summaries",
    methodType: "list"
  }),
  reactivate: stripeMethod36({
    method: "POST",
    fullPath: "/v1/billing/meters/{id}/reactivate"
  })
});

// ../../node_modules/stripe/esm/resources/Climate/Orders.js
var stripeMethod37 = StripeResource.method;
var Orders = StripeResource.extend({
  create: stripeMethod37({ method: "POST", fullPath: "/v1/climate/orders" }),
  retrieve: stripeMethod37({
    method: "GET",
    fullPath: "/v1/climate/orders/{order}"
  }),
  update: stripeMethod37({
    method: "POST",
    fullPath: "/v1/climate/orders/{order}"
  }),
  list: stripeMethod37({
    method: "GET",
    fullPath: "/v1/climate/orders",
    methodType: "list"
  }),
  cancel: stripeMethod37({
    method: "POST",
    fullPath: "/v1/climate/orders/{order}/cancel"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundPayments.js
var stripeMethod38 = StripeResource.method;
var OutboundPayments = StripeResource.extend({
  update: stripeMethod38({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}"
  }),
  fail: stripeMethod38({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/fail"
  }),
  post: stripeMethod38({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/post"
  }),
  returnOutboundPayment: stripeMethod38({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_payments/{id}/return"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/OutboundPayments.js
var stripeMethod39 = StripeResource.method;
var OutboundPayments2 = StripeResource.extend({
  create: stripeMethod39({
    method: "POST",
    fullPath: "/v1/treasury/outbound_payments"
  }),
  retrieve: stripeMethod39({
    method: "GET",
    fullPath: "/v1/treasury/outbound_payments/{id}"
  }),
  list: stripeMethod39({
    method: "GET",
    fullPath: "/v1/treasury/outbound_payments",
    methodType: "list"
  }),
  cancel: stripeMethod39({
    method: "POST",
    fullPath: "/v1/treasury/outbound_payments/{id}/cancel"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Treasury/OutboundTransfers.js
var stripeMethod40 = StripeResource.method;
var OutboundTransfers = StripeResource.extend({
  update: stripeMethod40({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}"
  }),
  fail: stripeMethod40({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/fail"
  }),
  post: stripeMethod40({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/post"
  }),
  returnOutboundTransfer: stripeMethod40({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/return"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/OutboundTransfers.js
var stripeMethod41 = StripeResource.method;
var OutboundTransfers2 = StripeResource.extend({
  create: stripeMethod41({
    method: "POST",
    fullPath: "/v1/treasury/outbound_transfers"
  }),
  retrieve: stripeMethod41({
    method: "GET",
    fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}"
  }),
  list: stripeMethod41({
    method: "GET",
    fullPath: "/v1/treasury/outbound_transfers",
    methodType: "list"
  }),
  cancel: stripeMethod41({
    method: "POST",
    fullPath: "/v1/treasury/outbound_transfers/{outbound_transfer}/cancel"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Issuing/PersonalizationDesigns.js
var stripeMethod42 = StripeResource.method;
var PersonalizationDesigns = StripeResource.extend({
  activate: stripeMethod42({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/activate"
  }),
  deactivate: stripeMethod42({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/deactivate"
  }),
  reject: stripeMethod42({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/personalization_designs/{personalization_design}/reject"
  })
});

// ../../node_modules/stripe/esm/resources/Issuing/PersonalizationDesigns.js
var stripeMethod43 = StripeResource.method;
var PersonalizationDesigns2 = StripeResource.extend({
  create: stripeMethod43({
    method: "POST",
    fullPath: "/v1/issuing/personalization_designs"
  }),
  retrieve: stripeMethod43({
    method: "GET",
    fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
  }),
  update: stripeMethod43({
    method: "POST",
    fullPath: "/v1/issuing/personalization_designs/{personalization_design}"
  }),
  list: stripeMethod43({
    method: "GET",
    fullPath: "/v1/issuing/personalization_designs",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Issuing/PhysicalBundles.js
var stripeMethod44 = StripeResource.method;
var PhysicalBundles = StripeResource.extend({
  retrieve: stripeMethod44({
    method: "GET",
    fullPath: "/v1/issuing/physical_bundles/{physical_bundle}"
  }),
  list: stripeMethod44({
    method: "GET",
    fullPath: "/v1/issuing/physical_bundles",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Climate/Products.js
var stripeMethod45 = StripeResource.method;
var Products = StripeResource.extend({
  retrieve: stripeMethod45({
    method: "GET",
    fullPath: "/v1/climate/products/{product}"
  }),
  list: stripeMethod45({
    method: "GET",
    fullPath: "/v1/climate/products",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Terminal/Readers.js
var stripeMethod46 = StripeResource.method;
var Readers = StripeResource.extend({
  presentPaymentMethod: stripeMethod46({
    method: "POST",
    fullPath: "/v1/test_helpers/terminal/readers/{reader}/present_payment_method"
  })
});

// ../../node_modules/stripe/esm/resources/Terminal/Readers.js
var stripeMethod47 = StripeResource.method;
var Readers2 = StripeResource.extend({
  create: stripeMethod47({ method: "POST", fullPath: "/v1/terminal/readers" }),
  retrieve: stripeMethod47({
    method: "GET",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  update: stripeMethod47({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  list: stripeMethod47({
    method: "GET",
    fullPath: "/v1/terminal/readers",
    methodType: "list"
  }),
  del: stripeMethod47({
    method: "DELETE",
    fullPath: "/v1/terminal/readers/{reader}"
  }),
  cancelAction: stripeMethod47({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/cancel_action"
  }),
  processPaymentIntent: stripeMethod47({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/process_payment_intent"
  }),
  processSetupIntent: stripeMethod47({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/process_setup_intent"
  }),
  refundPayment: stripeMethod47({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/refund_payment"
  }),
  setReaderDisplay: stripeMethod47({
    method: "POST",
    fullPath: "/v1/terminal/readers/{reader}/set_reader_display"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedCredits.js
var stripeMethod48 = StripeResource.method;
var ReceivedCredits = StripeResource.extend({
  create: stripeMethod48({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/received_credits"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/ReceivedCredits.js
var stripeMethod49 = StripeResource.method;
var ReceivedCredits2 = StripeResource.extend({
  retrieve: stripeMethod49({
    method: "GET",
    fullPath: "/v1/treasury/received_credits/{id}"
  }),
  list: stripeMethod49({
    method: "GET",
    fullPath: "/v1/treasury/received_credits",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Treasury/ReceivedDebits.js
var stripeMethod50 = StripeResource.method;
var ReceivedDebits = StripeResource.extend({
  create: stripeMethod50({
    method: "POST",
    fullPath: "/v1/test_helpers/treasury/received_debits"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/ReceivedDebits.js
var stripeMethod51 = StripeResource.method;
var ReceivedDebits2 = StripeResource.extend({
  retrieve: stripeMethod51({
    method: "GET",
    fullPath: "/v1/treasury/received_debits/{id}"
  }),
  list: stripeMethod51({
    method: "GET",
    fullPath: "/v1/treasury/received_debits",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Refunds.js
var stripeMethod52 = StripeResource.method;
var Refunds = StripeResource.extend({
  expire: stripeMethod52({
    method: "POST",
    fullPath: "/v1/test_helpers/refunds/{refund}/expire"
  })
});

// ../../node_modules/stripe/esm/resources/Tax/Registrations.js
var stripeMethod53 = StripeResource.method;
var Registrations = StripeResource.extend({
  create: stripeMethod53({ method: "POST", fullPath: "/v1/tax/registrations" }),
  retrieve: stripeMethod53({
    method: "GET",
    fullPath: "/v1/tax/registrations/{id}"
  }),
  update: stripeMethod53({
    method: "POST",
    fullPath: "/v1/tax/registrations/{id}"
  }),
  list: stripeMethod53({
    method: "GET",
    fullPath: "/v1/tax/registrations",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Reporting/ReportRuns.js
var stripeMethod54 = StripeResource.method;
var ReportRuns = StripeResource.extend({
  create: stripeMethod54({ method: "POST", fullPath: "/v1/reporting/report_runs" }),
  retrieve: stripeMethod54({
    method: "GET",
    fullPath: "/v1/reporting/report_runs/{report_run}"
  }),
  list: stripeMethod54({
    method: "GET",
    fullPath: "/v1/reporting/report_runs",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Reporting/ReportTypes.js
var stripeMethod55 = StripeResource.method;
var ReportTypes = StripeResource.extend({
  retrieve: stripeMethod55({
    method: "GET",
    fullPath: "/v1/reporting/report_types/{report_type}"
  }),
  list: stripeMethod55({
    method: "GET",
    fullPath: "/v1/reporting/report_types",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Forwarding/Requests.js
var stripeMethod56 = StripeResource.method;
var Requests = StripeResource.extend({
  create: stripeMethod56({ method: "POST", fullPath: "/v1/forwarding/requests" }),
  retrieve: stripeMethod56({
    method: "GET",
    fullPath: "/v1/forwarding/requests/{id}"
  }),
  list: stripeMethod56({
    method: "GET",
    fullPath: "/v1/forwarding/requests",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Sigma/ScheduledQueryRuns.js
var stripeMethod57 = StripeResource.method;
var ScheduledQueryRuns = StripeResource.extend({
  retrieve: stripeMethod57({
    method: "GET",
    fullPath: "/v1/sigma/scheduled_query_runs/{scheduled_query_run}"
  }),
  list: stripeMethod57({
    method: "GET",
    fullPath: "/v1/sigma/scheduled_query_runs",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Apps/Secrets.js
var stripeMethod58 = StripeResource.method;
var Secrets = StripeResource.extend({
  create: stripeMethod58({ method: "POST", fullPath: "/v1/apps/secrets" }),
  list: stripeMethod58({
    method: "GET",
    fullPath: "/v1/apps/secrets",
    methodType: "list"
  }),
  deleteWhere: stripeMethod58({
    method: "POST",
    fullPath: "/v1/apps/secrets/delete"
  }),
  find: stripeMethod58({ method: "GET", fullPath: "/v1/apps/secrets/find" })
});

// ../../node_modules/stripe/esm/resources/BillingPortal/Sessions.js
var stripeMethod59 = StripeResource.method;
var Sessions = StripeResource.extend({
  create: stripeMethod59({
    method: "POST",
    fullPath: "/v1/billing_portal/sessions"
  })
});

// ../../node_modules/stripe/esm/resources/Checkout/Sessions.js
var stripeMethod60 = StripeResource.method;
var Sessions2 = StripeResource.extend({
  create: stripeMethod60({ method: "POST", fullPath: "/v1/checkout/sessions" }),
  retrieve: stripeMethod60({
    method: "GET",
    fullPath: "/v1/checkout/sessions/{session}"
  }),
  update: stripeMethod60({
    method: "POST",
    fullPath: "/v1/checkout/sessions/{session}"
  }),
  list: stripeMethod60({
    method: "GET",
    fullPath: "/v1/checkout/sessions",
    methodType: "list"
  }),
  expire: stripeMethod60({
    method: "POST",
    fullPath: "/v1/checkout/sessions/{session}/expire"
  }),
  listLineItems: stripeMethod60({
    method: "GET",
    fullPath: "/v1/checkout/sessions/{session}/line_items",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/FinancialConnections/Sessions.js
var stripeMethod61 = StripeResource.method;
var Sessions3 = StripeResource.extend({
  create: stripeMethod61({
    method: "POST",
    fullPath: "/v1/financial_connections/sessions"
  }),
  retrieve: stripeMethod61({
    method: "GET",
    fullPath: "/v1/financial_connections/sessions/{session}"
  })
});

// ../../node_modules/stripe/esm/resources/Tax/Settings.js
var stripeMethod62 = StripeResource.method;
var Settings = StripeResource.extend({
  retrieve: stripeMethod62({ method: "GET", fullPath: "/v1/tax/settings" }),
  update: stripeMethod62({ method: "POST", fullPath: "/v1/tax/settings" })
});

// ../../node_modules/stripe/esm/resources/Climate/Suppliers.js
var stripeMethod63 = StripeResource.method;
var Suppliers = StripeResource.extend({
  retrieve: stripeMethod63({
    method: "GET",
    fullPath: "/v1/climate/suppliers/{supplier}"
  }),
  list: stripeMethod63({
    method: "GET",
    fullPath: "/v1/climate/suppliers",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/TestClocks.js
var stripeMethod64 = StripeResource.method;
var TestClocks = StripeResource.extend({
  create: stripeMethod64({
    method: "POST",
    fullPath: "/v1/test_helpers/test_clocks"
  }),
  retrieve: stripeMethod64({
    method: "GET",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
  }),
  list: stripeMethod64({
    method: "GET",
    fullPath: "/v1/test_helpers/test_clocks",
    methodType: "list"
  }),
  del: stripeMethod64({
    method: "DELETE",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}"
  }),
  advance: stripeMethod64({
    method: "POST",
    fullPath: "/v1/test_helpers/test_clocks/{test_clock}/advance"
  })
});

// ../../node_modules/stripe/esm/resources/Issuing/Tokens.js
var stripeMethod65 = StripeResource.method;
var Tokens = StripeResource.extend({
  retrieve: stripeMethod65({
    method: "GET",
    fullPath: "/v1/issuing/tokens/{token}"
  }),
  update: stripeMethod65({
    method: "POST",
    fullPath: "/v1/issuing/tokens/{token}"
  }),
  list: stripeMethod65({
    method: "GET",
    fullPath: "/v1/issuing/tokens",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/TransactionEntries.js
var stripeMethod66 = StripeResource.method;
var TransactionEntries = StripeResource.extend({
  retrieve: stripeMethod66({
    method: "GET",
    fullPath: "/v1/treasury/transaction_entries/{id}"
  }),
  list: stripeMethod66({
    method: "GET",
    fullPath: "/v1/treasury/transaction_entries",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/TestHelpers/Issuing/Transactions.js
var stripeMethod67 = StripeResource.method;
var Transactions = StripeResource.extend({
  createForceCapture: stripeMethod67({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/create_force_capture"
  }),
  createUnlinkedRefund: stripeMethod67({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/create_unlinked_refund"
  }),
  refund: stripeMethod67({
    method: "POST",
    fullPath: "/v1/test_helpers/issuing/transactions/{transaction}/refund"
  })
});

// ../../node_modules/stripe/esm/resources/FinancialConnections/Transactions.js
var stripeMethod68 = StripeResource.method;
var Transactions2 = StripeResource.extend({
  retrieve: stripeMethod68({
    method: "GET",
    fullPath: "/v1/financial_connections/transactions/{transaction}"
  }),
  list: stripeMethod68({
    method: "GET",
    fullPath: "/v1/financial_connections/transactions",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Issuing/Transactions.js
var stripeMethod69 = StripeResource.method;
var Transactions3 = StripeResource.extend({
  retrieve: stripeMethod69({
    method: "GET",
    fullPath: "/v1/issuing/transactions/{transaction}"
  }),
  update: stripeMethod69({
    method: "POST",
    fullPath: "/v1/issuing/transactions/{transaction}"
  }),
  list: stripeMethod69({
    method: "GET",
    fullPath: "/v1/issuing/transactions",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Tax/Transactions.js
var stripeMethod70 = StripeResource.method;
var Transactions4 = StripeResource.extend({
  retrieve: stripeMethod70({
    method: "GET",
    fullPath: "/v1/tax/transactions/{transaction}"
  }),
  createFromCalculation: stripeMethod70({
    method: "POST",
    fullPath: "/v1/tax/transactions/create_from_calculation"
  }),
  createReversal: stripeMethod70({
    method: "POST",
    fullPath: "/v1/tax/transactions/create_reversal"
  }),
  listLineItems: stripeMethod70({
    method: "GET",
    fullPath: "/v1/tax/transactions/{transaction}/line_items",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Treasury/Transactions.js
var stripeMethod71 = StripeResource.method;
var Transactions5 = StripeResource.extend({
  retrieve: stripeMethod71({
    method: "GET",
    fullPath: "/v1/treasury/transactions/{id}"
  }),
  list: stripeMethod71({
    method: "GET",
    fullPath: "/v1/treasury/transactions",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Radar/ValueListItems.js
var stripeMethod72 = StripeResource.method;
var ValueListItems = StripeResource.extend({
  create: stripeMethod72({
    method: "POST",
    fullPath: "/v1/radar/value_list_items"
  }),
  retrieve: stripeMethod72({
    method: "GET",
    fullPath: "/v1/radar/value_list_items/{item}"
  }),
  list: stripeMethod72({
    method: "GET",
    fullPath: "/v1/radar/value_list_items",
    methodType: "list"
  }),
  del: stripeMethod72({
    method: "DELETE",
    fullPath: "/v1/radar/value_list_items/{item}"
  })
});

// ../../node_modules/stripe/esm/resources/Radar/ValueLists.js
var stripeMethod73 = StripeResource.method;
var ValueLists = StripeResource.extend({
  create: stripeMethod73({ method: "POST", fullPath: "/v1/radar/value_lists" }),
  retrieve: stripeMethod73({
    method: "GET",
    fullPath: "/v1/radar/value_lists/{value_list}"
  }),
  update: stripeMethod73({
    method: "POST",
    fullPath: "/v1/radar/value_lists/{value_list}"
  }),
  list: stripeMethod73({
    method: "GET",
    fullPath: "/v1/radar/value_lists",
    methodType: "list"
  }),
  del: stripeMethod73({
    method: "DELETE",
    fullPath: "/v1/radar/value_lists/{value_list}"
  })
});

// ../../node_modules/stripe/esm/resources/Identity/VerificationReports.js
var stripeMethod74 = StripeResource.method;
var VerificationReports = StripeResource.extend({
  retrieve: stripeMethod74({
    method: "GET",
    fullPath: "/v1/identity/verification_reports/{report}"
  }),
  list: stripeMethod74({
    method: "GET",
    fullPath: "/v1/identity/verification_reports",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Identity/VerificationSessions.js
var stripeMethod75 = StripeResource.method;
var VerificationSessions = StripeResource.extend({
  create: stripeMethod75({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions"
  }),
  retrieve: stripeMethod75({
    method: "GET",
    fullPath: "/v1/identity/verification_sessions/{session}"
  }),
  update: stripeMethod75({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}"
  }),
  list: stripeMethod75({
    method: "GET",
    fullPath: "/v1/identity/verification_sessions",
    methodType: "list"
  }),
  cancel: stripeMethod75({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}/cancel"
  }),
  redact: stripeMethod75({
    method: "POST",
    fullPath: "/v1/identity/verification_sessions/{session}/redact"
  })
});

// ../../node_modules/stripe/esm/resources/Accounts.js
var stripeMethod76 = StripeResource.method;
var Accounts2 = StripeResource.extend({
  create: stripeMethod76({ method: "POST", fullPath: "/v1/accounts" }),
  retrieve(id, ...args) {
    if (typeof id === "string") {
      return stripeMethod76({
        method: "GET",
        fullPath: "/v1/accounts/{id}"
      }).apply(this, [id, ...args]);
    } else {
      if (id === null || id === void 0) {
        [].shift.apply([id, ...args]);
      }
      return stripeMethod76({
        method: "GET",
        fullPath: "/v1/account"
      }).apply(this, [id, ...args]);
    }
  },
  update: stripeMethod76({ method: "POST", fullPath: "/v1/accounts/{account}" }),
  list: stripeMethod76({
    method: "GET",
    fullPath: "/v1/accounts",
    methodType: "list"
  }),
  del: stripeMethod76({ method: "DELETE", fullPath: "/v1/accounts/{account}" }),
  createExternalAccount: stripeMethod76({
    method: "POST",
    fullPath: "/v1/accounts/{account}/external_accounts"
  }),
  createLoginLink: stripeMethod76({
    method: "POST",
    fullPath: "/v1/accounts/{account}/login_links"
  }),
  createPerson: stripeMethod76({
    method: "POST",
    fullPath: "/v1/accounts/{account}/persons"
  }),
  deleteExternalAccount: stripeMethod76({
    method: "DELETE",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  deletePerson: stripeMethod76({
    method: "DELETE",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  }),
  listCapabilities: stripeMethod76({
    method: "GET",
    fullPath: "/v1/accounts/{account}/capabilities",
    methodType: "list"
  }),
  listExternalAccounts: stripeMethod76({
    method: "GET",
    fullPath: "/v1/accounts/{account}/external_accounts",
    methodType: "list"
  }),
  listPersons: stripeMethod76({
    method: "GET",
    fullPath: "/v1/accounts/{account}/persons",
    methodType: "list"
  }),
  reject: stripeMethod76({
    method: "POST",
    fullPath: "/v1/accounts/{account}/reject"
  }),
  retrieveCurrent: stripeMethod76({ method: "GET", fullPath: "/v1/account" }),
  retrieveCapability: stripeMethod76({
    method: "GET",
    fullPath: "/v1/accounts/{account}/capabilities/{capability}"
  }),
  retrieveExternalAccount: stripeMethod76({
    method: "GET",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  retrievePerson: stripeMethod76({
    method: "GET",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  }),
  updateCapability: stripeMethod76({
    method: "POST",
    fullPath: "/v1/accounts/{account}/capabilities/{capability}"
  }),
  updateExternalAccount: stripeMethod76({
    method: "POST",
    fullPath: "/v1/accounts/{account}/external_accounts/{id}"
  }),
  updatePerson: stripeMethod76({
    method: "POST",
    fullPath: "/v1/accounts/{account}/persons/{person}"
  })
});

// ../../node_modules/stripe/esm/resources/AccountLinks.js
var stripeMethod77 = StripeResource.method;
var AccountLinks = StripeResource.extend({
  create: stripeMethod77({ method: "POST", fullPath: "/v1/account_links" })
});

// ../../node_modules/stripe/esm/resources/AccountSessions.js
var stripeMethod78 = StripeResource.method;
var AccountSessions = StripeResource.extend({
  create: stripeMethod78({ method: "POST", fullPath: "/v1/account_sessions" })
});

// ../../node_modules/stripe/esm/resources/ApplePayDomains.js
var stripeMethod79 = StripeResource.method;
var ApplePayDomains = StripeResource.extend({
  create: stripeMethod79({ method: "POST", fullPath: "/v1/apple_pay/domains" }),
  retrieve: stripeMethod79({
    method: "GET",
    fullPath: "/v1/apple_pay/domains/{domain}"
  }),
  list: stripeMethod79({
    method: "GET",
    fullPath: "/v1/apple_pay/domains",
    methodType: "list"
  }),
  del: stripeMethod79({
    method: "DELETE",
    fullPath: "/v1/apple_pay/domains/{domain}"
  })
});

// ../../node_modules/stripe/esm/resources/ApplicationFees.js
var stripeMethod80 = StripeResource.method;
var ApplicationFees = StripeResource.extend({
  retrieve: stripeMethod80({
    method: "GET",
    fullPath: "/v1/application_fees/{id}"
  }),
  list: stripeMethod80({
    method: "GET",
    fullPath: "/v1/application_fees",
    methodType: "list"
  }),
  createRefund: stripeMethod80({
    method: "POST",
    fullPath: "/v1/application_fees/{id}/refunds"
  }),
  listRefunds: stripeMethod80({
    method: "GET",
    fullPath: "/v1/application_fees/{id}/refunds",
    methodType: "list"
  }),
  retrieveRefund: stripeMethod80({
    method: "GET",
    fullPath: "/v1/application_fees/{fee}/refunds/{id}"
  }),
  updateRefund: stripeMethod80({
    method: "POST",
    fullPath: "/v1/application_fees/{fee}/refunds/{id}"
  })
});

// ../../node_modules/stripe/esm/resources/Balance.js
var stripeMethod81 = StripeResource.method;
var Balance = StripeResource.extend({
  retrieve: stripeMethod81({ method: "GET", fullPath: "/v1/balance" })
});

// ../../node_modules/stripe/esm/resources/BalanceTransactions.js
var stripeMethod82 = StripeResource.method;
var BalanceTransactions = StripeResource.extend({
  retrieve: stripeMethod82({
    method: "GET",
    fullPath: "/v1/balance_transactions/{id}"
  }),
  list: stripeMethod82({
    method: "GET",
    fullPath: "/v1/balance_transactions",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Charges.js
var stripeMethod83 = StripeResource.method;
var Charges = StripeResource.extend({
  create: stripeMethod83({ method: "POST", fullPath: "/v1/charges" }),
  retrieve: stripeMethod83({ method: "GET", fullPath: "/v1/charges/{charge}" }),
  update: stripeMethod83({ method: "POST", fullPath: "/v1/charges/{charge}" }),
  list: stripeMethod83({
    method: "GET",
    fullPath: "/v1/charges",
    methodType: "list"
  }),
  capture: stripeMethod83({
    method: "POST",
    fullPath: "/v1/charges/{charge}/capture"
  }),
  search: stripeMethod83({
    method: "GET",
    fullPath: "/v1/charges/search",
    methodType: "search"
  })
});

// ../../node_modules/stripe/esm/resources/ConfirmationTokens.js
var stripeMethod84 = StripeResource.method;
var ConfirmationTokens2 = StripeResource.extend({
  retrieve: stripeMethod84({
    method: "GET",
    fullPath: "/v1/confirmation_tokens/{confirmation_token}"
  })
});

// ../../node_modules/stripe/esm/resources/CountrySpecs.js
var stripeMethod85 = StripeResource.method;
var CountrySpecs = StripeResource.extend({
  retrieve: stripeMethod85({
    method: "GET",
    fullPath: "/v1/country_specs/{country}"
  }),
  list: stripeMethod85({
    method: "GET",
    fullPath: "/v1/country_specs",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Coupons.js
var stripeMethod86 = StripeResource.method;
var Coupons = StripeResource.extend({
  create: stripeMethod86({ method: "POST", fullPath: "/v1/coupons" }),
  retrieve: stripeMethod86({ method: "GET", fullPath: "/v1/coupons/{coupon}" }),
  update: stripeMethod86({ method: "POST", fullPath: "/v1/coupons/{coupon}" }),
  list: stripeMethod86({
    method: "GET",
    fullPath: "/v1/coupons",
    methodType: "list"
  }),
  del: stripeMethod86({ method: "DELETE", fullPath: "/v1/coupons/{coupon}" })
});

// ../../node_modules/stripe/esm/resources/CreditNotes.js
var stripeMethod87 = StripeResource.method;
var CreditNotes = StripeResource.extend({
  create: stripeMethod87({ method: "POST", fullPath: "/v1/credit_notes" }),
  retrieve: stripeMethod87({ method: "GET", fullPath: "/v1/credit_notes/{id}" }),
  update: stripeMethod87({ method: "POST", fullPath: "/v1/credit_notes/{id}" }),
  list: stripeMethod87({
    method: "GET",
    fullPath: "/v1/credit_notes",
    methodType: "list"
  }),
  listLineItems: stripeMethod87({
    method: "GET",
    fullPath: "/v1/credit_notes/{credit_note}/lines",
    methodType: "list"
  }),
  listPreviewLineItems: stripeMethod87({
    method: "GET",
    fullPath: "/v1/credit_notes/preview/lines",
    methodType: "list"
  }),
  preview: stripeMethod87({ method: "GET", fullPath: "/v1/credit_notes/preview" }),
  voidCreditNote: stripeMethod87({
    method: "POST",
    fullPath: "/v1/credit_notes/{id}/void"
  })
});

// ../../node_modules/stripe/esm/resources/CustomerSessions.js
var stripeMethod88 = StripeResource.method;
var CustomerSessions = StripeResource.extend({
  create: stripeMethod88({ method: "POST", fullPath: "/v1/customer_sessions" })
});

// ../../node_modules/stripe/esm/resources/Customers.js
var stripeMethod89 = StripeResource.method;
var Customers2 = StripeResource.extend({
  create: stripeMethod89({ method: "POST", fullPath: "/v1/customers" }),
  retrieve: stripeMethod89({ method: "GET", fullPath: "/v1/customers/{customer}" }),
  update: stripeMethod89({ method: "POST", fullPath: "/v1/customers/{customer}" }),
  list: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers",
    methodType: "list"
  }),
  del: stripeMethod89({ method: "DELETE", fullPath: "/v1/customers/{customer}" }),
  createBalanceTransaction: stripeMethod89({
    method: "POST",
    fullPath: "/v1/customers/{customer}/balance_transactions"
  }),
  createFundingInstructions: stripeMethod89({
    method: "POST",
    fullPath: "/v1/customers/{customer}/funding_instructions"
  }),
  createSource: stripeMethod89({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources"
  }),
  createTaxId: stripeMethod89({
    method: "POST",
    fullPath: "/v1/customers/{customer}/tax_ids"
  }),
  deleteDiscount: stripeMethod89({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/discount"
  }),
  deleteSource: stripeMethod89({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  deleteTaxId: stripeMethod89({
    method: "DELETE",
    fullPath: "/v1/customers/{customer}/tax_ids/{id}"
  }),
  listBalanceTransactions: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/balance_transactions",
    methodType: "list"
  }),
  listCashBalanceTransactions: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance_transactions",
    methodType: "list"
  }),
  listPaymentMethods: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/payment_methods",
    methodType: "list"
  }),
  listSources: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/sources",
    methodType: "list"
  }),
  listTaxIds: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/tax_ids",
    methodType: "list"
  }),
  retrieveBalanceTransaction: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
  }),
  retrieveCashBalance: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance"
  }),
  retrieveCashBalanceTransaction: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/cash_balance_transactions/{transaction}"
  }),
  retrievePaymentMethod: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/payment_methods/{payment_method}"
  }),
  retrieveSource: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  retrieveTaxId: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/{customer}/tax_ids/{id}"
  }),
  search: stripeMethod89({
    method: "GET",
    fullPath: "/v1/customers/search",
    methodType: "search"
  }),
  updateBalanceTransaction: stripeMethod89({
    method: "POST",
    fullPath: "/v1/customers/{customer}/balance_transactions/{transaction}"
  }),
  updateCashBalance: stripeMethod89({
    method: "POST",
    fullPath: "/v1/customers/{customer}/cash_balance"
  }),
  updateSource: stripeMethod89({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources/{id}"
  }),
  verifySource: stripeMethod89({
    method: "POST",
    fullPath: "/v1/customers/{customer}/sources/{id}/verify"
  })
});

// ../../node_modules/stripe/esm/resources/Disputes.js
var stripeMethod90 = StripeResource.method;
var Disputes2 = StripeResource.extend({
  retrieve: stripeMethod90({ method: "GET", fullPath: "/v1/disputes/{dispute}" }),
  update: stripeMethod90({ method: "POST", fullPath: "/v1/disputes/{dispute}" }),
  list: stripeMethod90({
    method: "GET",
    fullPath: "/v1/disputes",
    methodType: "list"
  }),
  close: stripeMethod90({
    method: "POST",
    fullPath: "/v1/disputes/{dispute}/close"
  })
});

// ../../node_modules/stripe/esm/resources/EphemeralKeys.js
var stripeMethod91 = StripeResource.method;
var EphemeralKeys = StripeResource.extend({
  create: stripeMethod91({
    method: "POST",
    fullPath: "/v1/ephemeral_keys",
    validator: (data, options) => {
      if (!options.headers || !options.headers["Stripe-Version"]) {
        throw new Error("Passing apiVersion in a separate options hash is required to create an ephemeral key. See https://stripe.com/docs/api/versioning?lang=node");
      }
    }
  }),
  del: stripeMethod91({ method: "DELETE", fullPath: "/v1/ephemeral_keys/{key}" })
});

// ../../node_modules/stripe/esm/resources/Events.js
var stripeMethod92 = StripeResource.method;
var Events2 = StripeResource.extend({
  retrieve: stripeMethod92({ method: "GET", fullPath: "/v1/events/{id}" }),
  list: stripeMethod92({
    method: "GET",
    fullPath: "/v1/events",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/ExchangeRates.js
var stripeMethod93 = StripeResource.method;
var ExchangeRates = StripeResource.extend({
  retrieve: stripeMethod93({
    method: "GET",
    fullPath: "/v1/exchange_rates/{rate_id}"
  }),
  list: stripeMethod93({
    method: "GET",
    fullPath: "/v1/exchange_rates",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/FileLinks.js
var stripeMethod94 = StripeResource.method;
var FileLinks = StripeResource.extend({
  create: stripeMethod94({ method: "POST", fullPath: "/v1/file_links" }),
  retrieve: stripeMethod94({ method: "GET", fullPath: "/v1/file_links/{link}" }),
  update: stripeMethod94({ method: "POST", fullPath: "/v1/file_links/{link}" }),
  list: stripeMethod94({
    method: "GET",
    fullPath: "/v1/file_links",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/multipart.js
var multipartDataGenerator = (method, data, headers) => {
  const segno = (Math.round(Math.random() * 1e16) + Math.round(Math.random() * 1e16)).toString();
  headers["Content-Type"] = `multipart/form-data; boundary=${segno}`;
  const textEncoder = new TextEncoder();
  let buffer = new Uint8Array(0);
  const endBuffer = textEncoder.encode("\r\n");
  function push(l) {
    const prevBuffer = buffer;
    const newBuffer = l instanceof Uint8Array ? l : new Uint8Array(textEncoder.encode(l));
    buffer = new Uint8Array(prevBuffer.length + newBuffer.length + 2);
    buffer.set(prevBuffer);
    buffer.set(newBuffer, prevBuffer.length);
    buffer.set(endBuffer, buffer.length - 2);
  }
  function q(s) {
    return `"${s.replace(/"|"/g, "%22").replace(/\r\n|\r|\n/g, " ")}"`;
  }
  const flattenedData = flattenAndStringify(data);
  for (const k in flattenedData) {
    if (!Object.prototype.hasOwnProperty.call(flattenedData, k)) {
      continue;
    }
    const v2 = flattenedData[k];
    push(`--${segno}`);
    if (Object.prototype.hasOwnProperty.call(v2, "data")) {
      const typedEntry = v2;
      push(`Content-Disposition: form-data; name=${q(k)}; filename=${q(typedEntry.name || "blob")}`);
      push(`Content-Type: ${typedEntry.type || "application/octet-stream"}`);
      push("");
      push(typedEntry.data);
    } else {
      push(`Content-Disposition: form-data; name=${q(k)}`);
      push("");
      push(v2);
    }
  }
  push(`--${segno}--`);
  return buffer;
};
function multipartRequestDataProcessor(method, data, headers, callback) {
  data = data || {};
  if (method !== "POST") {
    return callback(null, queryStringifyRequestData(data));
  }
  this._stripe._platformFunctions.tryBufferData(data).then((bufferedData) => {
    const buffer = multipartDataGenerator(method, bufferedData, headers);
    return callback(null, buffer);
  }).catch((err2) => callback(err2, null));
}

// ../../node_modules/stripe/esm/resources/Files.js
var stripeMethod95 = StripeResource.method;
var Files = StripeResource.extend({
  create: stripeMethod95({
    method: "POST",
    fullPath: "/v1/files",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    host: "files.stripe.com"
  }),
  retrieve: stripeMethod95({ method: "GET", fullPath: "/v1/files/{file}" }),
  list: stripeMethod95({
    method: "GET",
    fullPath: "/v1/files",
    methodType: "list"
  }),
  requestDataProcessor: multipartRequestDataProcessor
});

// ../../node_modules/stripe/esm/resources/InvoiceItems.js
var stripeMethod96 = StripeResource.method;
var InvoiceItems = StripeResource.extend({
  create: stripeMethod96({ method: "POST", fullPath: "/v1/invoiceitems" }),
  retrieve: stripeMethod96({
    method: "GET",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  }),
  update: stripeMethod96({
    method: "POST",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  }),
  list: stripeMethod96({
    method: "GET",
    fullPath: "/v1/invoiceitems",
    methodType: "list"
  }),
  del: stripeMethod96({
    method: "DELETE",
    fullPath: "/v1/invoiceitems/{invoiceitem}"
  })
});

// ../../node_modules/stripe/esm/resources/InvoiceRenderingTemplates.js
var stripeMethod97 = StripeResource.method;
var InvoiceRenderingTemplates = StripeResource.extend({
  retrieve: stripeMethod97({
    method: "GET",
    fullPath: "/v1/invoice_rendering_templates/{template}"
  }),
  list: stripeMethod97({
    method: "GET",
    fullPath: "/v1/invoice_rendering_templates",
    methodType: "list"
  }),
  archive: stripeMethod97({
    method: "POST",
    fullPath: "/v1/invoice_rendering_templates/{template}/archive"
  }),
  unarchive: stripeMethod97({
    method: "POST",
    fullPath: "/v1/invoice_rendering_templates/{template}/unarchive"
  })
});

// ../../node_modules/stripe/esm/resources/Invoices.js
var stripeMethod98 = StripeResource.method;
var Invoices = StripeResource.extend({
  create: stripeMethod98({ method: "POST", fullPath: "/v1/invoices" }),
  retrieve: stripeMethod98({ method: "GET", fullPath: "/v1/invoices/{invoice}" }),
  update: stripeMethod98({ method: "POST", fullPath: "/v1/invoices/{invoice}" }),
  list: stripeMethod98({
    method: "GET",
    fullPath: "/v1/invoices",
    methodType: "list"
  }),
  del: stripeMethod98({ method: "DELETE", fullPath: "/v1/invoices/{invoice}" }),
  addLines: stripeMethod98({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/add_lines"
  }),
  createPreview: stripeMethod98({
    method: "POST",
    fullPath: "/v1/invoices/create_preview"
  }),
  finalizeInvoice: stripeMethod98({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/finalize"
  }),
  listLineItems: stripeMethod98({
    method: "GET",
    fullPath: "/v1/invoices/{invoice}/lines",
    methodType: "list"
  }),
  listUpcomingLines: stripeMethod98({
    method: "GET",
    fullPath: "/v1/invoices/upcoming/lines",
    methodType: "list"
  }),
  markUncollectible: stripeMethod98({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/mark_uncollectible"
  }),
  pay: stripeMethod98({ method: "POST", fullPath: "/v1/invoices/{invoice}/pay" }),
  removeLines: stripeMethod98({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/remove_lines"
  }),
  retrieveUpcoming: stripeMethod98({
    method: "GET",
    fullPath: "/v1/invoices/upcoming"
  }),
  search: stripeMethod98({
    method: "GET",
    fullPath: "/v1/invoices/search",
    methodType: "search"
  }),
  sendInvoice: stripeMethod98({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/send"
  }),
  updateLines: stripeMethod98({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/update_lines"
  }),
  updateLineItem: stripeMethod98({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/lines/{line_item_id}"
  }),
  voidInvoice: stripeMethod98({
    method: "POST",
    fullPath: "/v1/invoices/{invoice}/void"
  })
});

// ../../node_modules/stripe/esm/resources/Mandates.js
var stripeMethod99 = StripeResource.method;
var Mandates = StripeResource.extend({
  retrieve: stripeMethod99({ method: "GET", fullPath: "/v1/mandates/{mandate}" })
});

// ../../node_modules/stripe/esm/resources/OAuth.js
var stripeMethod100 = StripeResource.method;
var oAuthHost = "connect.stripe.com";
var OAuth = StripeResource.extend({
  basePath: "/",
  authorizeUrl(params, options) {
    params = params || {};
    options = options || {};
    let path = "oauth/authorize";
    if (options.express) {
      path = `express/${path}`;
    }
    if (!params.response_type) {
      params.response_type = "code";
    }
    if (!params.client_id) {
      params.client_id = this._stripe.getClientId();
    }
    if (!params.scope) {
      params.scope = "read_write";
    }
    return `https://${oAuthHost}/${path}?${queryStringifyRequestData(params)}`;
  },
  token: stripeMethod100({
    method: "POST",
    path: "oauth/token",
    host: oAuthHost
  }),
  deauthorize(spec, ...args) {
    if (!spec.client_id) {
      spec.client_id = this._stripe.getClientId();
    }
    return stripeMethod100({
      method: "POST",
      path: "oauth/deauthorize",
      host: oAuthHost
    }).apply(this, [spec, ...args]);
  }
});

// ../../node_modules/stripe/esm/resources/PaymentIntents.js
var stripeMethod101 = StripeResource.method;
var PaymentIntents = StripeResource.extend({
  create: stripeMethod101({ method: "POST", fullPath: "/v1/payment_intents" }),
  retrieve: stripeMethod101({
    method: "GET",
    fullPath: "/v1/payment_intents/{intent}"
  }),
  update: stripeMethod101({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}"
  }),
  list: stripeMethod101({
    method: "GET",
    fullPath: "/v1/payment_intents",
    methodType: "list"
  }),
  applyCustomerBalance: stripeMethod101({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/apply_customer_balance"
  }),
  cancel: stripeMethod101({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/cancel"
  }),
  capture: stripeMethod101({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/capture"
  }),
  confirm: stripeMethod101({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/confirm"
  }),
  incrementAuthorization: stripeMethod101({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/increment_authorization"
  }),
  search: stripeMethod101({
    method: "GET",
    fullPath: "/v1/payment_intents/search",
    methodType: "search"
  }),
  verifyMicrodeposits: stripeMethod101({
    method: "POST",
    fullPath: "/v1/payment_intents/{intent}/verify_microdeposits"
  })
});

// ../../node_modules/stripe/esm/resources/PaymentLinks.js
var stripeMethod102 = StripeResource.method;
var PaymentLinks = StripeResource.extend({
  create: stripeMethod102({ method: "POST", fullPath: "/v1/payment_links" }),
  retrieve: stripeMethod102({
    method: "GET",
    fullPath: "/v1/payment_links/{payment_link}"
  }),
  update: stripeMethod102({
    method: "POST",
    fullPath: "/v1/payment_links/{payment_link}"
  }),
  list: stripeMethod102({
    method: "GET",
    fullPath: "/v1/payment_links",
    methodType: "list"
  }),
  listLineItems: stripeMethod102({
    method: "GET",
    fullPath: "/v1/payment_links/{payment_link}/line_items",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/PaymentMethodConfigurations.js
var stripeMethod103 = StripeResource.method;
var PaymentMethodConfigurations = StripeResource.extend({
  create: stripeMethod103({
    method: "POST",
    fullPath: "/v1/payment_method_configurations"
  }),
  retrieve: stripeMethod103({
    method: "GET",
    fullPath: "/v1/payment_method_configurations/{configuration}"
  }),
  update: stripeMethod103({
    method: "POST",
    fullPath: "/v1/payment_method_configurations/{configuration}"
  }),
  list: stripeMethod103({
    method: "GET",
    fullPath: "/v1/payment_method_configurations",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/PaymentMethodDomains.js
var stripeMethod104 = StripeResource.method;
var PaymentMethodDomains = StripeResource.extend({
  create: stripeMethod104({
    method: "POST",
    fullPath: "/v1/payment_method_domains"
  }),
  retrieve: stripeMethod104({
    method: "GET",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}"
  }),
  update: stripeMethod104({
    method: "POST",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}"
  }),
  list: stripeMethod104({
    method: "GET",
    fullPath: "/v1/payment_method_domains",
    methodType: "list"
  }),
  validate: stripeMethod104({
    method: "POST",
    fullPath: "/v1/payment_method_domains/{payment_method_domain}/validate"
  })
});

// ../../node_modules/stripe/esm/resources/PaymentMethods.js
var stripeMethod105 = StripeResource.method;
var PaymentMethods = StripeResource.extend({
  create: stripeMethod105({ method: "POST", fullPath: "/v1/payment_methods" }),
  retrieve: stripeMethod105({
    method: "GET",
    fullPath: "/v1/payment_methods/{payment_method}"
  }),
  update: stripeMethod105({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}"
  }),
  list: stripeMethod105({
    method: "GET",
    fullPath: "/v1/payment_methods",
    methodType: "list"
  }),
  attach: stripeMethod105({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}/attach"
  }),
  detach: stripeMethod105({
    method: "POST",
    fullPath: "/v1/payment_methods/{payment_method}/detach"
  })
});

// ../../node_modules/stripe/esm/resources/Payouts.js
var stripeMethod106 = StripeResource.method;
var Payouts = StripeResource.extend({
  create: stripeMethod106({ method: "POST", fullPath: "/v1/payouts" }),
  retrieve: stripeMethod106({ method: "GET", fullPath: "/v1/payouts/{payout}" }),
  update: stripeMethod106({ method: "POST", fullPath: "/v1/payouts/{payout}" }),
  list: stripeMethod106({
    method: "GET",
    fullPath: "/v1/payouts",
    methodType: "list"
  }),
  cancel: stripeMethod106({
    method: "POST",
    fullPath: "/v1/payouts/{payout}/cancel"
  }),
  reverse: stripeMethod106({
    method: "POST",
    fullPath: "/v1/payouts/{payout}/reverse"
  })
});

// ../../node_modules/stripe/esm/resources/Plans.js
var stripeMethod107 = StripeResource.method;
var Plans = StripeResource.extend({
  create: stripeMethod107({ method: "POST", fullPath: "/v1/plans" }),
  retrieve: stripeMethod107({ method: "GET", fullPath: "/v1/plans/{plan}" }),
  update: stripeMethod107({ method: "POST", fullPath: "/v1/plans/{plan}" }),
  list: stripeMethod107({
    method: "GET",
    fullPath: "/v1/plans",
    methodType: "list"
  }),
  del: stripeMethod107({ method: "DELETE", fullPath: "/v1/plans/{plan}" })
});

// ../../node_modules/stripe/esm/resources/Prices.js
var stripeMethod108 = StripeResource.method;
var Prices = StripeResource.extend({
  create: stripeMethod108({ method: "POST", fullPath: "/v1/prices" }),
  retrieve: stripeMethod108({ method: "GET", fullPath: "/v1/prices/{price}" }),
  update: stripeMethod108({ method: "POST", fullPath: "/v1/prices/{price}" }),
  list: stripeMethod108({
    method: "GET",
    fullPath: "/v1/prices",
    methodType: "list"
  }),
  search: stripeMethod108({
    method: "GET",
    fullPath: "/v1/prices/search",
    methodType: "search"
  })
});

// ../../node_modules/stripe/esm/resources/Products.js
var stripeMethod109 = StripeResource.method;
var Products2 = StripeResource.extend({
  create: stripeMethod109({ method: "POST", fullPath: "/v1/products" }),
  retrieve: stripeMethod109({ method: "GET", fullPath: "/v1/products/{id}" }),
  update: stripeMethod109({ method: "POST", fullPath: "/v1/products/{id}" }),
  list: stripeMethod109({
    method: "GET",
    fullPath: "/v1/products",
    methodType: "list"
  }),
  del: stripeMethod109({ method: "DELETE", fullPath: "/v1/products/{id}" }),
  createFeature: stripeMethod109({
    method: "POST",
    fullPath: "/v1/products/{product}/features"
  }),
  deleteFeature: stripeMethod109({
    method: "DELETE",
    fullPath: "/v1/products/{product}/features/{id}"
  }),
  listFeatures: stripeMethod109({
    method: "GET",
    fullPath: "/v1/products/{product}/features",
    methodType: "list"
  }),
  retrieveFeature: stripeMethod109({
    method: "GET",
    fullPath: "/v1/products/{product}/features/{id}"
  }),
  search: stripeMethod109({
    method: "GET",
    fullPath: "/v1/products/search",
    methodType: "search"
  })
});

// ../../node_modules/stripe/esm/resources/PromotionCodes.js
var stripeMethod110 = StripeResource.method;
var PromotionCodes = StripeResource.extend({
  create: stripeMethod110({ method: "POST", fullPath: "/v1/promotion_codes" }),
  retrieve: stripeMethod110({
    method: "GET",
    fullPath: "/v1/promotion_codes/{promotion_code}"
  }),
  update: stripeMethod110({
    method: "POST",
    fullPath: "/v1/promotion_codes/{promotion_code}"
  }),
  list: stripeMethod110({
    method: "GET",
    fullPath: "/v1/promotion_codes",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Quotes.js
var stripeMethod111 = StripeResource.method;
var Quotes = StripeResource.extend({
  create: stripeMethod111({ method: "POST", fullPath: "/v1/quotes" }),
  retrieve: stripeMethod111({ method: "GET", fullPath: "/v1/quotes/{quote}" }),
  update: stripeMethod111({ method: "POST", fullPath: "/v1/quotes/{quote}" }),
  list: stripeMethod111({
    method: "GET",
    fullPath: "/v1/quotes",
    methodType: "list"
  }),
  accept: stripeMethod111({ method: "POST", fullPath: "/v1/quotes/{quote}/accept" }),
  cancel: stripeMethod111({ method: "POST", fullPath: "/v1/quotes/{quote}/cancel" }),
  finalizeQuote: stripeMethod111({
    method: "POST",
    fullPath: "/v1/quotes/{quote}/finalize"
  }),
  listComputedUpfrontLineItems: stripeMethod111({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/computed_upfront_line_items",
    methodType: "list"
  }),
  listLineItems: stripeMethod111({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/line_items",
    methodType: "list"
  }),
  pdf: stripeMethod111({
    method: "GET",
    fullPath: "/v1/quotes/{quote}/pdf",
    host: "files.stripe.com",
    streaming: true
  })
});

// ../../node_modules/stripe/esm/resources/Refunds.js
var stripeMethod112 = StripeResource.method;
var Refunds2 = StripeResource.extend({
  create: stripeMethod112({ method: "POST", fullPath: "/v1/refunds" }),
  retrieve: stripeMethod112({ method: "GET", fullPath: "/v1/refunds/{refund}" }),
  update: stripeMethod112({ method: "POST", fullPath: "/v1/refunds/{refund}" }),
  list: stripeMethod112({
    method: "GET",
    fullPath: "/v1/refunds",
    methodType: "list"
  }),
  cancel: stripeMethod112({
    method: "POST",
    fullPath: "/v1/refunds/{refund}/cancel"
  })
});

// ../../node_modules/stripe/esm/resources/Reviews.js
var stripeMethod113 = StripeResource.method;
var Reviews = StripeResource.extend({
  retrieve: stripeMethod113({ method: "GET", fullPath: "/v1/reviews/{review}" }),
  list: stripeMethod113({
    method: "GET",
    fullPath: "/v1/reviews",
    methodType: "list"
  }),
  approve: stripeMethod113({
    method: "POST",
    fullPath: "/v1/reviews/{review}/approve"
  })
});

// ../../node_modules/stripe/esm/resources/SetupAttempts.js
var stripeMethod114 = StripeResource.method;
var SetupAttempts = StripeResource.extend({
  list: stripeMethod114({
    method: "GET",
    fullPath: "/v1/setup_attempts",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/SetupIntents.js
var stripeMethod115 = StripeResource.method;
var SetupIntents = StripeResource.extend({
  create: stripeMethod115({ method: "POST", fullPath: "/v1/setup_intents" }),
  retrieve: stripeMethod115({
    method: "GET",
    fullPath: "/v1/setup_intents/{intent}"
  }),
  update: stripeMethod115({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}"
  }),
  list: stripeMethod115({
    method: "GET",
    fullPath: "/v1/setup_intents",
    methodType: "list"
  }),
  cancel: stripeMethod115({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/cancel"
  }),
  confirm: stripeMethod115({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/confirm"
  }),
  verifyMicrodeposits: stripeMethod115({
    method: "POST",
    fullPath: "/v1/setup_intents/{intent}/verify_microdeposits"
  })
});

// ../../node_modules/stripe/esm/resources/ShippingRates.js
var stripeMethod116 = StripeResource.method;
var ShippingRates = StripeResource.extend({
  create: stripeMethod116({ method: "POST", fullPath: "/v1/shipping_rates" }),
  retrieve: stripeMethod116({
    method: "GET",
    fullPath: "/v1/shipping_rates/{shipping_rate_token}"
  }),
  update: stripeMethod116({
    method: "POST",
    fullPath: "/v1/shipping_rates/{shipping_rate_token}"
  }),
  list: stripeMethod116({
    method: "GET",
    fullPath: "/v1/shipping_rates",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Sources.js
var stripeMethod117 = StripeResource.method;
var Sources = StripeResource.extend({
  create: stripeMethod117({ method: "POST", fullPath: "/v1/sources" }),
  retrieve: stripeMethod117({ method: "GET", fullPath: "/v1/sources/{source}" }),
  update: stripeMethod117({ method: "POST", fullPath: "/v1/sources/{source}" }),
  listSourceTransactions: stripeMethod117({
    method: "GET",
    fullPath: "/v1/sources/{source}/source_transactions",
    methodType: "list"
  }),
  verify: stripeMethod117({
    method: "POST",
    fullPath: "/v1/sources/{source}/verify"
  })
});

// ../../node_modules/stripe/esm/resources/SubscriptionItems.js
var stripeMethod118 = StripeResource.method;
var SubscriptionItems = StripeResource.extend({
  create: stripeMethod118({ method: "POST", fullPath: "/v1/subscription_items" }),
  retrieve: stripeMethod118({
    method: "GET",
    fullPath: "/v1/subscription_items/{item}"
  }),
  update: stripeMethod118({
    method: "POST",
    fullPath: "/v1/subscription_items/{item}"
  }),
  list: stripeMethod118({
    method: "GET",
    fullPath: "/v1/subscription_items",
    methodType: "list"
  }),
  del: stripeMethod118({
    method: "DELETE",
    fullPath: "/v1/subscription_items/{item}"
  }),
  createUsageRecord: stripeMethod118({
    method: "POST",
    fullPath: "/v1/subscription_items/{subscription_item}/usage_records"
  }),
  listUsageRecordSummaries: stripeMethod118({
    method: "GET",
    fullPath: "/v1/subscription_items/{subscription_item}/usage_record_summaries",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/SubscriptionSchedules.js
var stripeMethod119 = StripeResource.method;
var SubscriptionSchedules = StripeResource.extend({
  create: stripeMethod119({
    method: "POST",
    fullPath: "/v1/subscription_schedules"
  }),
  retrieve: stripeMethod119({
    method: "GET",
    fullPath: "/v1/subscription_schedules/{schedule}"
  }),
  update: stripeMethod119({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}"
  }),
  list: stripeMethod119({
    method: "GET",
    fullPath: "/v1/subscription_schedules",
    methodType: "list"
  }),
  cancel: stripeMethod119({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}/cancel"
  }),
  release: stripeMethod119({
    method: "POST",
    fullPath: "/v1/subscription_schedules/{schedule}/release"
  })
});

// ../../node_modules/stripe/esm/resources/Subscriptions.js
var stripeMethod120 = StripeResource.method;
var Subscriptions = StripeResource.extend({
  create: stripeMethod120({ method: "POST", fullPath: "/v1/subscriptions" }),
  retrieve: stripeMethod120({
    method: "GET",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  update: stripeMethod120({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  list: stripeMethod120({
    method: "GET",
    fullPath: "/v1/subscriptions",
    methodType: "list"
  }),
  cancel: stripeMethod120({
    method: "DELETE",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}"
  }),
  deleteDiscount: stripeMethod120({
    method: "DELETE",
    fullPath: "/v1/subscriptions/{subscription_exposed_id}/discount"
  }),
  resume: stripeMethod120({
    method: "POST",
    fullPath: "/v1/subscriptions/{subscription}/resume"
  }),
  search: stripeMethod120({
    method: "GET",
    fullPath: "/v1/subscriptions/search",
    methodType: "search"
  })
});

// ../../node_modules/stripe/esm/resources/TaxCodes.js
var stripeMethod121 = StripeResource.method;
var TaxCodes = StripeResource.extend({
  retrieve: stripeMethod121({ method: "GET", fullPath: "/v1/tax_codes/{id}" }),
  list: stripeMethod121({
    method: "GET",
    fullPath: "/v1/tax_codes",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/TaxIds.js
var stripeMethod122 = StripeResource.method;
var TaxIds = StripeResource.extend({
  create: stripeMethod122({ method: "POST", fullPath: "/v1/tax_ids" }),
  retrieve: stripeMethod122({ method: "GET", fullPath: "/v1/tax_ids/{id}" }),
  list: stripeMethod122({
    method: "GET",
    fullPath: "/v1/tax_ids",
    methodType: "list"
  }),
  del: stripeMethod122({ method: "DELETE", fullPath: "/v1/tax_ids/{id}" })
});

// ../../node_modules/stripe/esm/resources/TaxRates.js
var stripeMethod123 = StripeResource.method;
var TaxRates = StripeResource.extend({
  create: stripeMethod123({ method: "POST", fullPath: "/v1/tax_rates" }),
  retrieve: stripeMethod123({ method: "GET", fullPath: "/v1/tax_rates/{tax_rate}" }),
  update: stripeMethod123({ method: "POST", fullPath: "/v1/tax_rates/{tax_rate}" }),
  list: stripeMethod123({
    method: "GET",
    fullPath: "/v1/tax_rates",
    methodType: "list"
  })
});

// ../../node_modules/stripe/esm/resources/Tokens.js
var stripeMethod124 = StripeResource.method;
var Tokens2 = StripeResource.extend({
  create: stripeMethod124({ method: "POST", fullPath: "/v1/tokens" }),
  retrieve: stripeMethod124({ method: "GET", fullPath: "/v1/tokens/{token}" })
});

// ../../node_modules/stripe/esm/resources/Topups.js
var stripeMethod125 = StripeResource.method;
var Topups = StripeResource.extend({
  create: stripeMethod125({ method: "POST", fullPath: "/v1/topups" }),
  retrieve: stripeMethod125({ method: "GET", fullPath: "/v1/topups/{topup}" }),
  update: stripeMethod125({ method: "POST", fullPath: "/v1/topups/{topup}" }),
  list: stripeMethod125({
    method: "GET",
    fullPath: "/v1/topups",
    methodType: "list"
  }),
  cancel: stripeMethod125({ method: "POST", fullPath: "/v1/topups/{topup}/cancel" })
});

// ../../node_modules/stripe/esm/resources/Transfers.js
var stripeMethod126 = StripeResource.method;
var Transfers = StripeResource.extend({
  create: stripeMethod126({ method: "POST", fullPath: "/v1/transfers" }),
  retrieve: stripeMethod126({ method: "GET", fullPath: "/v1/transfers/{transfer}" }),
  update: stripeMethod126({ method: "POST", fullPath: "/v1/transfers/{transfer}" }),
  list: stripeMethod126({
    method: "GET",
    fullPath: "/v1/transfers",
    methodType: "list"
  }),
  createReversal: stripeMethod126({
    method: "POST",
    fullPath: "/v1/transfers/{id}/reversals"
  }),
  listReversals: stripeMethod126({
    method: "GET",
    fullPath: "/v1/transfers/{id}/reversals",
    methodType: "list"
  }),
  retrieveReversal: stripeMethod126({
    method: "GET",
    fullPath: "/v1/transfers/{transfer}/reversals/{id}"
  }),
  updateReversal: stripeMethod126({
    method: "POST",
    fullPath: "/v1/transfers/{transfer}/reversals/{id}"
  })
});

// ../../node_modules/stripe/esm/resources/WebhookEndpoints.js
var stripeMethod127 = StripeResource.method;
var WebhookEndpoints = StripeResource.extend({
  create: stripeMethod127({ method: "POST", fullPath: "/v1/webhook_endpoints" }),
  retrieve: stripeMethod127({
    method: "GET",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  }),
  update: stripeMethod127({
    method: "POST",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  }),
  list: stripeMethod127({
    method: "GET",
    fullPath: "/v1/webhook_endpoints",
    methodType: "list"
  }),
  del: stripeMethod127({
    method: "DELETE",
    fullPath: "/v1/webhook_endpoints/{webhook_endpoint}"
  })
});

// ../../node_modules/stripe/esm/resources.js
var Apps = resourceNamespace("apps", { Secrets });
var Billing = resourceNamespace("billing", {
  Alerts,
  CreditBalanceSummary,
  CreditBalanceTransactions,
  CreditGrants,
  MeterEventAdjustments,
  MeterEvents,
  Meters
});
var BillingPortal = resourceNamespace("billingPortal", {
  Configurations,
  Sessions
});
var Checkout = resourceNamespace("checkout", {
  Sessions: Sessions2
});
var Climate = resourceNamespace("climate", {
  Orders,
  Products,
  Suppliers
});
var Entitlements = resourceNamespace("entitlements", {
  ActiveEntitlements,
  Features
});
var FinancialConnections = resourceNamespace("financialConnections", {
  Accounts,
  Sessions: Sessions3,
  Transactions: Transactions2
});
var Forwarding = resourceNamespace("forwarding", {
  Requests
});
var Identity = resourceNamespace("identity", {
  VerificationReports,
  VerificationSessions
});
var Issuing = resourceNamespace("issuing", {
  Authorizations: Authorizations2,
  Cardholders,
  Cards: Cards2,
  Disputes,
  PersonalizationDesigns: PersonalizationDesigns2,
  PhysicalBundles,
  Tokens,
  Transactions: Transactions3
});
var Radar = resourceNamespace("radar", {
  EarlyFraudWarnings,
  ValueListItems,
  ValueLists
});
var Reporting = resourceNamespace("reporting", {
  ReportRuns,
  ReportTypes
});
var Sigma = resourceNamespace("sigma", {
  ScheduledQueryRuns
});
var Tax = resourceNamespace("tax", {
  Calculations,
  Registrations,
  Settings,
  Transactions: Transactions4
});
var Terminal = resourceNamespace("terminal", {
  Configurations: Configurations2,
  ConnectionTokens,
  Locations,
  Readers: Readers2
});
var TestHelpers = resourceNamespace("testHelpers", {
  ConfirmationTokens,
  Customers,
  Refunds,
  TestClocks,
  Issuing: resourceNamespace("issuing", {
    Authorizations,
    Cards,
    PersonalizationDesigns,
    Transactions
  }),
  Terminal: resourceNamespace("terminal", {
    Readers
  }),
  Treasury: resourceNamespace("treasury", {
    InboundTransfers,
    OutboundPayments,
    OutboundTransfers,
    ReceivedCredits,
    ReceivedDebits
  })
});
var Treasury = resourceNamespace("treasury", {
  CreditReversals,
  DebitReversals,
  FinancialAccounts,
  InboundTransfers: InboundTransfers2,
  OutboundPayments: OutboundPayments2,
  OutboundTransfers: OutboundTransfers2,
  ReceivedCredits: ReceivedCredits2,
  ReceivedDebits: ReceivedDebits2,
  TransactionEntries,
  Transactions: Transactions5
});
var V2 = resourceNamespace("v2", {
  Billing: resourceNamespace("billing", {
    MeterEventAdjustments: MeterEventAdjustments2,
    MeterEventSession,
    MeterEventStream,
    MeterEvents: MeterEvents2
  }),
  Core: resourceNamespace("core", {
    EventDestinations,
    Events
  })
});

// ../../node_modules/stripe/esm/stripe.core.js
var DEFAULT_HOST = "api.stripe.com";
var DEFAULT_PORT = "443";
var DEFAULT_BASE_PATH = "/v1/";
var DEFAULT_API_VERSION = ApiVersion;
var DEFAULT_TIMEOUT = 8e4;
var MAX_NETWORK_RETRY_DELAY_SEC = 5;
var INITIAL_NETWORK_RETRY_DELAY_SEC = 0.5;
var APP_INFO_PROPERTIES = ["name", "version", "url", "partner_id"];
var ALLOWED_CONFIG_PROPERTIES = [
  "authenticator",
  "apiVersion",
  "typescript",
  "maxNetworkRetries",
  "httpAgent",
  "httpClient",
  "timeout",
  "host",
  "port",
  "protocol",
  "telemetry",
  "appInfo",
  "stripeAccount",
  "stripeContext"
];
var defaultRequestSenderFactory = (stripe2) => new RequestSender(stripe2, StripeResource.MAX_BUFFERED_REQUEST_METRICS);
function createStripe(platformFunctions, requestSender = defaultRequestSenderFactory) {
  Stripe2.PACKAGE_VERSION = "17.7.0";
  Stripe2.USER_AGENT = Object.assign({ bindings_version: Stripe2.PACKAGE_VERSION, lang: "node", publisher: "stripe", uname: null, typescript: false }, determineProcessUserAgentProperties());
  Stripe2.StripeResource = StripeResource;
  Stripe2.resources = resources_exports;
  Stripe2.HttpClient = HttpClient;
  Stripe2.HttpClientResponse = HttpClientResponse;
  Stripe2.CryptoProvider = CryptoProvider;
  function createWebhooksDefault(fns = platformFunctions) {
    return createWebhooks(fns);
  }
  Stripe2.webhooks = Object.assign(createWebhooksDefault, createWebhooks(platformFunctions));
  function Stripe2(key3, config2 = {}) {
    if (!(this instanceof Stripe2)) {
      return new Stripe2(key3, config2);
    }
    const props = this._getPropsFromConfig(config2);
    this._platformFunctions = platformFunctions;
    Object.defineProperty(this, "_emitter", {
      value: this._platformFunctions.createEmitter(),
      enumerable: false,
      configurable: false,
      writable: false
    });
    this.VERSION = Stripe2.PACKAGE_VERSION;
    this.on = this._emitter.on.bind(this._emitter);
    this.once = this._emitter.once.bind(this._emitter);
    this.off = this._emitter.removeListener.bind(this._emitter);
    const agent = props.httpAgent || null;
    this._api = {
      host: props.host || DEFAULT_HOST,
      port: props.port || DEFAULT_PORT,
      protocol: props.protocol || "https",
      basePath: DEFAULT_BASE_PATH,
      version: props.apiVersion || DEFAULT_API_VERSION,
      timeout: validateInteger("timeout", props.timeout, DEFAULT_TIMEOUT),
      maxNetworkRetries: validateInteger("maxNetworkRetries", props.maxNetworkRetries, 2),
      agent,
      httpClient: props.httpClient || (agent ? this._platformFunctions.createNodeHttpClient(agent) : this._platformFunctions.createDefaultHttpClient()),
      dev: false,
      stripeAccount: props.stripeAccount || null,
      stripeContext: props.stripeContext || null
    };
    const typescript = props.typescript || false;
    if (typescript !== Stripe2.USER_AGENT.typescript) {
      Stripe2.USER_AGENT.typescript = typescript;
    }
    if (props.appInfo) {
      this._setAppInfo(props.appInfo);
    }
    this._prepResources();
    this._setAuthenticator(key3, props.authenticator);
    this.errors = Error_exports;
    this.webhooks = createWebhooksDefault();
    this._prevRequestMetrics = [];
    this._enableTelemetry = props.telemetry !== false;
    this._requestSender = requestSender(this);
    this.StripeResource = Stripe2.StripeResource;
  }
  Stripe2.errors = Error_exports;
  Stripe2.createNodeHttpClient = platformFunctions.createNodeHttpClient;
  Stripe2.createFetchHttpClient = platformFunctions.createFetchHttpClient;
  Stripe2.createNodeCryptoProvider = platformFunctions.createNodeCryptoProvider;
  Stripe2.createSubtleCryptoProvider = platformFunctions.createSubtleCryptoProvider;
  Stripe2.prototype = {
    // Properties are set in the constructor above
    _appInfo: void 0,
    on: null,
    off: null,
    once: null,
    VERSION: null,
    StripeResource: null,
    webhooks: null,
    errors: null,
    _api: null,
    _prevRequestMetrics: null,
    _emitter: null,
    _enableTelemetry: null,
    _requestSender: null,
    _platformFunctions: null,
    rawRequest(method, path, params, options) {
      return this._requestSender._rawRequest(method, path, params, options);
    },
    /**
     * @private
     */
    _setAuthenticator(key3, authenticator) {
      if (key3 && authenticator) {
        throw new Error("Can't specify both apiKey and authenticator");
      }
      if (!key3 && !authenticator) {
        throw new Error("Neither apiKey nor config.authenticator provided");
      }
      this._authenticator = key3 ? createApiKeyAuthenticator(key3) : authenticator;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setAppInfo(info) {
      if (info && typeof info !== "object") {
        throw new Error("AppInfo must be an object.");
      }
      if (info && !info.name) {
        throw new Error("AppInfo.name is required");
      }
      info = info || {};
      this._appInfo = APP_INFO_PROPERTIES.reduce(
        (accum, prop) => {
          if (typeof info[prop] == "string") {
            accum = accum || {};
            accum[prop] = info[prop];
          }
          return accum;
        },
        // @ts-ignore
        void 0
      );
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiField(key3, value) {
      this._api[key3] = value;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getApiField(key3) {
      return this._api[key3];
    },
    setClientId(clientId) {
      this._clientId = clientId;
    },
    getClientId() {
      return this._clientId;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getConstant: (c) => {
      switch (c) {
        case "DEFAULT_HOST":
          return DEFAULT_HOST;
        case "DEFAULT_PORT":
          return DEFAULT_PORT;
        case "DEFAULT_BASE_PATH":
          return DEFAULT_BASE_PATH;
        case "DEFAULT_API_VERSION":
          return DEFAULT_API_VERSION;
        case "DEFAULT_TIMEOUT":
          return DEFAULT_TIMEOUT;
        case "MAX_NETWORK_RETRY_DELAY_SEC":
          return MAX_NETWORK_RETRY_DELAY_SEC;
        case "INITIAL_NETWORK_RETRY_DELAY_SEC":
          return INITIAL_NETWORK_RETRY_DELAY_SEC;
      }
      return Stripe2[c];
    },
    getMaxNetworkRetries() {
      return this.getApiField("maxNetworkRetries");
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _setApiNumberField(prop, n, defaultVal) {
      const val = validateInteger(prop, n, defaultVal);
      this._setApiField(prop, val);
    },
    getMaxNetworkRetryDelay() {
      return MAX_NETWORK_RETRY_DELAY_SEC;
    },
    getInitialNetworkRetryDelay() {
      return INITIAL_NETWORK_RETRY_DELAY_SEC;
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent and uses a cached version for a slight
     * speed advantage.
     */
    getClientUserAgent(cb) {
      return this.getClientUserAgentSeeded(Stripe2.USER_AGENT, cb);
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     *
     * Gets a JSON version of a User-Agent by encoding a seeded object and
     * fetching a uname from the system.
     */
    getClientUserAgentSeeded(seed, cb) {
      this._platformFunctions.getUname().then((uname) => {
        var _a;
        const userAgent = {};
        for (const field in seed) {
          if (!Object.prototype.hasOwnProperty.call(seed, field)) {
            continue;
          }
          userAgent[field] = encodeURIComponent((_a = seed[field]) !== null && _a !== void 0 ? _a : "null");
        }
        userAgent.uname = encodeURIComponent(uname || "UNKNOWN");
        const client = this.getApiField("httpClient");
        if (client) {
          userAgent.httplib = encodeURIComponent(client.getClientName());
        }
        if (this._appInfo) {
          userAgent.application = this._appInfo;
        }
        cb(JSON.stringify(userAgent));
      });
    },
    /**
     * @private
     * Please open or upvote an issue at github.com/stripe/stripe-node
     * if you use this, detailing your use-case.
     *
     * It may be deprecated and removed in the future.
     */
    getAppInfoAsString() {
      if (!this._appInfo) {
        return "";
      }
      let formatted = this._appInfo.name;
      if (this._appInfo.version) {
        formatted += `/${this._appInfo.version}`;
      }
      if (this._appInfo.url) {
        formatted += ` (${this._appInfo.url})`;
      }
      return formatted;
    },
    getTelemetryEnabled() {
      return this._enableTelemetry;
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _prepResources() {
      for (const name2 in resources_exports) {
        if (!Object.prototype.hasOwnProperty.call(resources_exports, name2)) {
          continue;
        }
        this[pascalToCamelCase(name2)] = new resources_exports[name2](this);
      }
    },
    /**
     * @private
     * This may be removed in the future.
     */
    _getPropsFromConfig(config2) {
      if (!config2) {
        return {};
      }
      const isString = typeof config2 === "string";
      const isObject2 = config2 === Object(config2) && !Array.isArray(config2);
      if (!isObject2 && !isString) {
        throw new Error("Config must either be an object or a string");
      }
      if (isString) {
        return {
          apiVersion: config2
        };
      }
      const values = Object.keys(config2).filter((value) => !ALLOWED_CONFIG_PROPERTIES.includes(value));
      if (values.length > 0) {
        throw new Error(`Config object may only contain the following: ${ALLOWED_CONFIG_PROPERTIES.join(", ")}`);
      }
      return config2;
    },
    parseThinEvent(payload, header, secret2, tolerance, cryptoProvider, receivedAt) {
      return this.webhooks.constructEvent(payload, header, secret2, tolerance, cryptoProvider, receivedAt);
    }
  };
  return Stripe2;
}

// ../../node_modules/stripe/esm/stripe.esm.node.js
var Stripe = createStripe(new NodePlatformFunctions());
var stripe_esm_node_default = Stripe;

// src/lib/stripe.ts
var key = process.env.STRIPE_SECRET_KEY;
var stripe = key ? new stripe_esm_node_default(key, { apiVersion: "2024-12-18.acacia" }) : null;
if (!stripe) {
  console.warn("[stripe] STRIPE_SECRET_KEY is not set. Payment endpoints will return 503.");
}

// src/services/weather.service.ts
function mapWeatherIdToCondition(id) {
  if (id >= 200 && id < 300) return "storm";
  if (id >= 300 && id < 500) return "rain";
  if (id >= 500 && id < 600) {
    if (id === 502 || id === 503 || id === 504) return "heavy_rain";
    return "rain";
  }
  if (id >= 600 && id < 700) return "snow";
  if (id >= 700 && id < 800) return "rain";
  if (id === 800) return "clear";
  return "clear";
}
async function getWeatherSurcharge(lat, lng, configValues) {
  const key3 = process.env.OPENWEATHER_API_KEY;
  if (!key3) return 0;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key3}`;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 3e3);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) return 0;
    const json = await res.json();
    const id = json.weather?.[0]?.id;
    if (typeof id !== "number") return 0;
    const condition = mapWeatherIdToCondition(id);
    return configValues["weather"]?.[condition] ?? 0;
  } catch {
    return 0;
  }
}
async function getWeatherForecast(lat, lng) {
  const key3 = process.env.OPENWEATHER_API_KEY;
  if (!key3) return null;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key3}&units=metric`;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 3e3);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const json = await res.json();
    const w2 = json.weather?.[0];
    if (!w2 || typeof w2.id !== "number") return null;
    const condition = mapWeatherIdToCondition(w2.id);
    return {
      condition,
      description: w2.description ?? condition,
      iconUrl: w2.icon ? `https://openweathermap.org/img/wn/${w2.icon}@2x.png` : null
    };
  } catch {
    return null;
  }
}

// src/services/pricing.service.ts
var CACHE_TTL_MS = 5 * 60 * 1e3;
var cache = null;
async function loadConfig() {
  if (cache && Date.now() - cache.loadedAt < CACHE_TTL_MS) return cache.values;
  const rows = await db.pricingConfig.findMany().catch(() => []);
  const values = {};
  for (const row of rows) {
    if (!values[row.category]) values[row.category] = {};
    values[row.category][row.key] = row.value;
  }
  cache = { values, loadedAt: Date.now() };
  return values;
}
function clearPricingCache() {
  cache = null;
}
function readConfig(values, category, key3) {
  const dbValue = values[category]?.[key3];
  if (typeof dbValue === "number") return dbValue;
  const defaults = DEFAULT_PRICING_CONFIG[category];
  return defaults[key3] ?? 0;
}
function isWeekend(date) {
  const d = date.getUTCDay();
  return d === 0 || d === 6;
}
function isPeakMonth(date) {
  const m2 = date.getUTCMonth();
  return m2 >= 5 && m2 <= 7;
}
function isEndOfMonth(date) {
  const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  const lastDay = new Date(next.getTime() - 864e5).getUTCDate();
  return date.getUTCDate() >= lastDay - 2;
}
function daysFromToday(date, today) {
  const a2 = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const b = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((a2 - b) / 864e5);
}
function urgencyMultiplier(values, days) {
  if (days <= 0) return readConfig(values, "urgency", "todayMultiplier");
  if (days === 1) return readConfig(values, "urgency", "tomorrowMultiplier");
  if (days === 2) return readConfig(values, "urgency", "twoDaysMultiplier");
  return 1;
}
function slotMultiplier(values, slot) {
  if (slot === "morning") return readConfig(values, "slot", "morningMultiplier");
  if (slot === "evening") return readConfig(values, "slot", "eveningMultiplier");
  return readConfig(values, "slot", "afternoonMultiplier");
}
var SERVICE_BASE_PRICE_KEY = {
  "house-removals": "houseRemovalsBasePrice",
  "house-removal": "houseRemovalsBasePrice",
  "long-distance-removals": "houseRemovalsBasePrice",
  furniture: "furnitureBasePrice",
  "furniture-delivery": "furnitureBasePrice",
  storage: "storageBasePrice",
  office: "officeBasePrice",
  "office-removal": "officeBasePrice",
  other: "otherBasePrice",
  "man-and-van": "otherBasePrice",
  "flat-removals": "otherBasePrice",
  "small-moves": "otherBasePrice",
  "student-move": "studentMoveBasePrice",
  "ikea-delivery": "ikeaDeliveryBasePrice",
  "rubbish-removal": "rubbishRemovalBasePrice",
  "piano-moving": "pianoMovingBasePrice",
  "same-day-delivery": "sameDayDeliveryBasePrice",
  "packing-service": "packingServiceBasePrice"
};
function serviceBasePrice(values, serviceType) {
  const key3 = SERVICE_BASE_PRICE_KEY[serviceType] ?? "serviceBasePrice";
  return readConfig(values, "base", key3);
}
function variantMultiplier(values, variant) {
  if (!variant) return 1;
  const v2 = variant.toLowerCase();
  const map = {
    "1-bedroom": "bedroom1Multiplier",
    "2-bedroom": "bedroom2Multiplier",
    "3-bedroom": "bedroom3Multiplier",
    "4-bedroom": "bedroom4Multiplier",
    "5-bedroom": "bedroom5PlusMultiplier",
    "5+-bedroom": "bedroom5PlusMultiplier",
    "small-business": "businessSmallMultiplier",
    "medium-business": "businessMediumMultiplier",
    "large-business": "businessLargeMultiplier"
  };
  const key3 = map[v2];
  return key3 ? readConfig(values, "variant", key3) : 1;
}
function computeDistanceCost(values, miles) {
  const free = readConfig(values, "distance", "freeMiles");
  const rate = readConfig(values, "distance", "perMileRate");
  const discountStart = readConfig(values, "distance", "longDistanceDiscountStart");
  const discountFactor = readConfig(values, "distance", "longDistanceDiscountFactor");
  const billable = Math.max(0, miles - free);
  if (billable <= discountStart) return billable * rate;
  return discountStart * rate + (billable - discountStart) * rate * discountFactor;
}
function computeFloorCost(values, floor, hasLift) {
  if (floor <= 0) return 0;
  const per = readConfig(values, "floor", "perFloorSurcharge");
  const noLift = readConfig(values, "floor", "noLiftPenaltyMultiplier");
  const base = floor * per;
  return hasLift ? base : base * (noLift || 1);
}
function computeAddons(values, helpersCount, needsPacking, needsAssembly) {
  const lineItems = [];
  let total = 0;
  if (helpersCount > 0) {
    const perHelper = readConfig(values, "addon", "helperPerHourPerHelper");
    const cost = helpersCount * perHelper;
    lineItems.push({ label: `${helpersCount} extra helper(s)`, amount: cost, type: "addon" });
    total += cost;
  }
  if (needsPacking) {
    const cost = readConfig(values, "addon", "packingFlat");
    lineItems.push({ label: "Packing service", amount: cost, type: "addon" });
    total += cost;
  }
  if (needsAssembly) {
    const cost = readConfig(values, "addon", "assemblyFlat");
    lineItems.push({ label: "Assembly service", amount: cost, type: "addon" });
    total += cost;
  }
  return { lineItems, total };
}
function tierFor(price, sorted) {
  if (sorted.length === 0) return "yellow";
  const third = Math.floor(sorted.length / 3);
  const lowCutoff = sorted[third] ?? sorted[0];
  const highCutoff = sorted[Math.max(0, sorted.length - third - 1)] ?? sorted[sorted.length - 1];
  if (price <= lowCutoff) return "green";
  if (price >= highCutoff) return "red";
  return "yellow";
}
async function calculatePrice(input) {
  const values = await loadConfig();
  const base = serviceBasePrice(values, input.serviceType);
  const variantMul = variantMultiplier(values, input.serviceVariant);
  const baseAdjusted = Math.round(base * variantMul * 100) / 100;
  const distanceCost = Math.round(computeDistanceCost(values, input.distanceMiles) * 100) / 100;
  const pickupFloorCost = Math.round(
    computeFloorCost(values, input.pickupFloor, input.pickupHasLift) * 100
  ) / 100;
  const dropoffFloorCost = Math.round(
    computeFloorCost(values, input.dropoffFloor, input.dropoffHasLift) * 100
  ) / 100;
  const addons = computeAddons(
    values,
    input.helpersCount,
    input.needsPacking,
    input.needsAssembly
  );
  const weatherSurcharge = input.pickupLat !== void 0 && input.pickupLng !== void 0 ? await getWeatherSurcharge(input.pickupLat, input.pickupLng, values) : 0;
  const staticLineItems = [
    { label: "Base service", amount: baseAdjusted, type: "base" },
    { label: `Distance (${input.distanceMiles.toFixed(1)} mi)`, amount: distanceCost, type: "surcharge" },
    ...pickupFloorCost > 0 ? [
      {
        label: `Pickup floor ${input.pickupFloor}${input.pickupHasLift ? " (lift)" : " (no lift)"}`,
        amount: pickupFloorCost,
        type: "surcharge"
      }
    ] : [],
    ...dropoffFloorCost > 0 ? [
      {
        label: `Dropoff floor ${input.dropoffFloor}${input.dropoffHasLift ? " (lift)" : " (no lift)"}`,
        amount: dropoffFloorCost,
        type: "surcharge"
      }
    ] : [],
    ...addons.lineItems,
    ...weatherSurcharge > 0 ? [{ label: "Weather surcharge", amount: weatherSurcharge, type: "surcharge" }] : []
  ];
  const staticSubtotal = Math.round(
    (baseAdjusted + distanceCost + pickupFloorCost + dropoffFloorCost + addons.total + weatherSurcharge) * 100
  ) / 100;
  const today = /* @__PURE__ */ new Date();
  const days = [];
  const allPrices = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + i));
    const urgency = urgencyMultiplier(values, daysFromToday(d, today));
    const weekend = isWeekend(d) ? readConfig(values, "weekend", "multiplier") : 1;
    const peak = isPeakMonth(d) ? readConfig(values, "season", "peakMonthMultiplier") : 1;
    const eom = isEndOfMonth(d) ? readConfig(values, "season", "endOfMonthMultiplier") : 1;
    const slots = TIME_SLOTS.map((slot) => {
      const slotMul = slotMultiplier(values, slot);
      const total = Math.round(staticSubtotal * urgency * weekend * peak * eom * slotMul * 100) / 100;
      allPrices.push(total);
      return { slot, price: total, tier: "yellow" };
    });
    days.push({ date: d.toISOString().slice(0, 10), slots });
  }
  const sorted = [...allPrices].sort((a2, b) => a2 - b);
  for (const day of days) {
    for (const slot of day.slots) {
      slot.tier = tierFor(slot.price, sorted);
    }
  }
  return {
    days,
    staticLineItems,
    staticSubtotal,
    currency: CURRENCY.code,
    symbol: CURRENCY.symbol
  };
}
async function calculatePriceForSlot(input, date, slot) {
  const result = await calculatePrice(input);
  const iso = date.toISOString().slice(0, 10);
  const day = result.days.find((d) => d.date === iso);
  const slotPrice = day?.slots.find((s) => s.slot === slot)?.price;
  return slotPrice ?? result.staticSubtotal;
}

// src/lib/pusher.ts
var pusher = null;
var initStarted = false;
var appId = process.env.PUSHER_APP_ID;
var key2 = process.env.PUSHER_KEY;
var secret = process.env.PUSHER_SECRET;
var cluster = process.env.PUSHER_CLUSTER;
function init() {
  if (initStarted) return;
  initStarted = true;
  if (!(appId && key2 && secret && cluster)) {
    console.warn("[pusher] env vars missing; real-time push disabled (no-op).");
    return;
  }
  import("pusher").then((mod) => {
    pusher = new mod.default({ appId, key: key2, secret, cluster, useTLS: true });
  }).catch(() => {
    console.warn("[pusher] 'pusher' package not installed; real-time push disabled.");
  });
}
init();
function triggerEvent(channel, event, data) {
  if (!pusher) return;
  pusher.trigger(channel, event, data).catch((err2) => {
    console.error("[pusher] trigger failed:", err2);
  });
}

// src/services/tracking.service.ts
async function createTrackingEvent(params) {
  const event = await db.trackingEvent.create({
    data: {
      bookingId: params.bookingId,
      type: params.type,
      status: params.status,
      message: params.message,
      lat: params.lat,
      lng: params.lng,
      isInternal: params.isInternal ?? false,
      actorId: params.actorId,
      actorRole: params.actorRole
    }
  });
  if (!event.isInternal) {
    triggerEvent(`booking-${params.bookingId}`, "tracking-event", {
      type: event.type,
      status: event.status,
      message: event.message,
      lat: event.lat,
      lng: event.lng,
      createdAt: event.createdAt
    });
  }
  return event;
}
async function recordStatusChange(bookingId, fromStatus, toStatus, changedById, changedByRole, note) {
  await db.statusHistory.create({
    data: { bookingId, fromStatus, toStatus, changedById, changedByRole, note }
  });
  await createTrackingEvent({
    bookingId,
    type: "status",
    status: toStatus,
    message: note,
    actorId: changedById,
    actorRole: changedByRole
  });
}
async function trackDriverLocation(bookingId, lat, lng) {
  await createTrackingEvent({ bookingId, type: "location", lat, lng });
}

// src/services/notification.service.ts
async function notifyAllAdmins(type, title, body, link, metadata) {
  const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });
  if (admins.length === 0) return;
  await db.notification.createMany({
    data: admins.map((a2) => ({
      userId: a2.id,
      type,
      title,
      body,
      link,
      metadata
    }))
  });
}
async function notifyNewBooking(booking) {
  await notifyAllAdmins(
    "NEW_BOOKING",
    `New booking: ${booking.reference}`,
    `${booking.customerName} booked for \xA3${booking.totalPrice.toFixed(2)}`,
    `/admin/bookings/${booking.id}`,
    { bookingId: booking.id }
  );
}
async function notifyDriverAssigned(booking, driverName) {
  await notifyAllAdmins(
    "DRIVER_ASSIGNED",
    `Driver assigned: ${booking.reference}`,
    `${driverName} accepted the job`,
    `/admin/bookings/${booking.id}`
  );
}
async function notifyJobCompleted(booking) {
  await notifyAllAdmins(
    "JOB_COMPLETED",
    `Job completed: ${booking.reference}`,
    `Booking ${booking.reference} has been completed`,
    `/admin/bookings/${booking.id}`
  );
}
async function notifyChatMessage(recipientId, bookingRef, senderName) {
  await db.notification.create({
    data: {
      userId: recipientId,
      type: "CHAT_MESSAGE",
      title: `New message from ${senderName}`,
      body: `Booking ${bookingRef}`,
      link: `/chat?ref=${bookingRef}`
    }
  });
}
async function notifyNewEuropeanEnquiry(enquiry) {
  await notifyAllAdmins(
    "EUROPEAN_ENQUIRY",
    `\u{1F1EA}\u{1F1FA} New European enquiry: Scotland \u2192 ${enquiry.toCountry}`,
    `${enquiry.customerName} requested a European removals quote`,
    `/admin/enquiries`,
    { enquiryId: enquiry.id }
  );
}

// src/services/job.service.ts
async function publishToJobBoard(bookingId) {
  const existing = await db.driverJob.findUnique({ where: { bookingId } });
  if (existing) return existing;
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  const [pctRow, minRow] = await Promise.all([
    db.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_percentage" } } }),
    db.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_minimum" } } })
  ]);
  const pct = pctRow?.value ?? 60;
  const min = minRow?.value ?? 25;
  const driverPay = booking ? Math.max(booking.totalPrice * (pct / 100), min) : min;
  return db.driverJob.create({
    data: { bookingId, status: "AVAILABLE", isPublic: true, driverPay }
  });
}
var JobAlreadyTakenError = class extends Error {
  constructor() {
    super("Job is no longer available");
    this.name = "JobAlreadyTakenError";
  }
};
async function acceptJob(jobId, driverId) {
  return db.$transaction(async (tx) => {
    const job = await tx.driverJob.findUnique({ where: { id: jobId } });
    if (!job) throw new Error("NOT_FOUND");
    if (job.status !== "AVAILABLE" || !job.isPublic || job.driverId) {
      throw new JobAlreadyTakenError();
    }
    const updated = await tx.driverJob.update({
      where: { id: jobId },
      data: {
        driverId,
        status: "ACCEPTED",
        isPublic: false,
        acceptedAt: /* @__PURE__ */ new Date()
      }
    });
    const booking = await tx.booking.update({
      where: { id: job.bookingId },
      data: { driverId, status: "ASSIGNED" }
    });
    const conv = await tx.conversation.findUnique({ where: { bookingId: booking.id } });
    if (conv) {
      const driver = await tx.driver.findUnique({
        where: { id: driverId },
        include: { user: true }
      });
      if (driver) {
        await tx.conversationParticipant.upsert({
          where: {
            conversationId_userId: { conversationId: conv.id, userId: driver.userId }
          },
          update: {},
          create: {
            conversationId: conv.id,
            userId: driver.userId,
            role: "DRIVER"
          }
        });
      }
    }
    return updated;
  }).then(async (job) => {
    const booking = await db.booking.findUnique({
      where: { id: job.bookingId },
      include: { driver: { include: { user: true } } }
    });
    if (booking && booking.driver) {
      await sendDriverAssigned(
        { customerEmail: booking.customerEmail, reference: booking.reference },
        booking.driver.user.name
      ).catch(() => {
      });
      await notifyDriverAssigned(
        { id: booking.id, reference: booking.reference },
        booking.driver.user.name
      ).catch(() => {
      });
    }
    return job;
  }).catch((err2) => {
    if (err2 instanceof src_exports.Prisma.PrismaClientKnownRequestError) {
      throw new JobAlreadyTakenError();
    }
    throw err2;
  });
}
async function rejectJob(jobId, reason) {
  await db.driverJob.update({
    where: { id: jobId },
    data: {
      status: "AVAILABLE",
      isPublic: true,
      driverId: null,
      acceptedAt: null,
      rejectionReason: reason
    }
  });
  const job = await db.driverJob.findUnique({ where: { id: jobId } });
  if (job) {
    await db.booking.update({
      where: { id: job.bookingId },
      data: { driverId: null, status: "CONFIRMED" }
    });
  }
}
async function updateJobStatus(jobId, newStatus, actorId, note) {
  const job = await db.driverJob.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("NOT_FOUND");
  const updates = { status: newStatus };
  if (newStatus === "DRIVER_EN_ROUTE" && !job.startedAt) updates.startedAt = /* @__PURE__ */ new Date();
  if (newStatus === "COMPLETED") updates.completedAt = /* @__PURE__ */ new Date();
  const updated = await db.driverJob.update({ where: { id: jobId }, data: updates });
  const bookingStatus = newStatus === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS";
  await db.booking.update({
    where: { id: job.bookingId },
    data: { status: bookingStatus }
  });
  await recordStatusChange(
    job.bookingId,
    job.status,
    newStatus,
    actorId,
    "DRIVER",
    note
  );
  if (newStatus === "COMPLETED") {
    const booking = await db.booking.findUnique({ where: { id: job.bookingId } });
    if (booking) {
      await sendJobCompleted({
        customerEmail: booking.customerEmail,
        reference: booking.reference
      }).catch(() => {
      });
      await notifyJobCompleted({
        id: booking.id,
        reference: booking.reference
      }).catch(() => {
      });
    }
  } else {
    await createTrackingEvent({
      bookingId: job.bookingId,
      type: "status",
      status: newStatus,
      message: note,
      actorId,
      actorRole: "DRIVER"
    });
  }
  return updated;
}

// src/services/booking.service.ts
var PRICE_TOLERANCE_GBP = 1;
async function findOrCreateCustomer(email, name2, phone) {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return existing;
  const randomPw = await import_bcryptjs2.default.hash(`guest-${Date.now()}-${Math.random()}`, 10);
  return db.user.create({
    data: { email, name: name2, phone, password: randomPw, role: "CUSTOMER" }
  });
}
async function createBooking(input) {
  const scheduledDate = new Date(input.selectedDate);
  const serverPrice = await calculatePriceForSlot(
    {
      serviceType: input.entryServiceSlug || input.serviceSlug,
      serviceVariant: input.serviceVariant,
      distanceMiles: input.distanceMiles,
      pickupFloor: input.pickupFloor,
      pickupHasLift: input.pickupHasLift,
      dropoffFloor: input.dropoffFloor,
      dropoffHasLift: input.dropoffHasLift,
      helpersCount: input.helpersCount,
      needsPacking: input.needsPacking,
      needsAssembly: input.needsAssembly,
      pickupLat: input.pickupLat,
      pickupLng: input.pickupLng
    },
    scheduledDate,
    input.selectedTimeSlot
  );
  if (Math.abs(serverPrice - input.clientTotal) > PRICE_TOLERANCE_GBP) {
    const err2 = new Error(
      `Price changed: server=${serverPrice.toFixed(2)} client=${input.clientTotal.toFixed(2)}`
    );
    err2.name = "PriceChangedError";
    throw err2;
  }
  const customer = await findOrCreateCustomer(
    input.customerEmail,
    input.customerName,
    input.customerPhone
  );
  const service = await db.service.findUnique({ where: { slug: input.serviceSlug } });
  if (!service) throw new Error("NOT_FOUND");
  const area = await db.area.findFirst({ where: { isActive: true } });
  if (!area) throw new Error("NOT_FOUND");
  const reference = generateBookingReference();
  const booking = await db.booking.create({
    data: {
      reference,
      userId: customer.id,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      serviceId: service.id,
      serviceSlug: input.serviceSlug,
      serviceName: input.serviceName,
      serviceVariant: input.serviceVariant,
      areaId: area.id,
      pickupAddress: input.pickupAddress,
      pickupPostcode: input.pickupPostcode,
      pickupLat: input.pickupLat,
      pickupLng: input.pickupLng,
      pickupFloor: input.pickupFloor,
      pickupHasLift: input.pickupHasLift,
      dropoffAddress: input.dropoffAddress,
      dropoffPostcode: input.dropoffPostcode,
      dropoffLat: input.dropoffLat,
      dropoffLng: input.dropoffLng,
      dropoffFloor: input.dropoffFloor,
      dropoffHasLift: input.dropoffHasLift,
      distanceMiles: input.distanceMiles,
      scheduledAt: scheduledDate,
      selectedDate: scheduledDate,
      selectedTimeSlot: input.selectedTimeSlot,
      helpersCount: input.helpersCount,
      needsPacking: input.needsPacking,
      needsAssembly: input.needsAssembly,
      price: serverPrice,
      totalPrice: serverPrice,
      status: "PENDING",
      items: {
        create: input.selectedItems.map((it) => ({
          name: it.name,
          quantity: it.quantity
        }))
      }
    }
  });
  let clientSecret = null;
  if (stripe) {
    const intent = await stripe.paymentIntents.create({
      amount: poundsToPence(serverPrice),
      currency: "gbp",
      metadata: { bookingId: booking.id, reference: booking.reference },
      automatic_payment_methods: { enabled: true }
    });
    clientSecret = intent.client_secret;
    await db.booking.update({
      where: { id: booking.id },
      data: { stripePaymentId: intent.id }
    });
  }
  return { booking, clientSecret };
}
async function confirmBooking(bookingId, paymentIntentId) {
  if (stripe) {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      const err2 = new Error(`PaymentIntent not succeeded: ${intent.status}`);
      err2.name = "PaymentNotSucceeded";
      throw err2;
    }
  }
  const booking = await db.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED", isPaid: true, paidAt: /* @__PURE__ */ new Date(), stripePaymentId: paymentIntentId }
  });
  await createTrackingEvent({
    bookingId: booking.id,
    type: "system",
    status: "CONFIRMED",
    message: "Payment received"
  });
  try {
    const existingConversation = await db.conversation.findUnique({
      where: { bookingId: booking.id },
      select: { id: true, participants: { select: { userId: true } } }
    });
    const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });
    const participantMap = /* @__PURE__ */ new Map();
    for (const a2 of admins) {
      if (a2.id) participantMap.set(a2.id, "ADMIN");
    }
    if (booking.userId) participantMap.set(booking.userId, "CUSTOMER");
    if (!existingConversation) {
      await db.conversation.create({
        data: {
          bookingId: booking.id,
          participants: {
            create: Array.from(participantMap.entries()).map(([userId, role]) => ({
              userId,
              role
            }))
          }
        }
      });
    } else {
      const existingUserIds = new Set(existingConversation.participants.map((p2) => p2.userId));
      const toCreate = Array.from(participantMap.entries()).filter(([userId]) => !existingUserIds.has(userId)).map(([userId, role]) => ({
        conversationId: existingConversation.id,
        userId,
        role
      }));
      if (toCreate.length > 0) {
        await db.conversationParticipant.createMany({ data: toCreate, skipDuplicates: true });
      }
    }
  } catch (err2) {
    console.error("[booking] conversation setup failed:", err2);
  }
  await publishToJobBoard(booking.id).catch(
    (err2) => console.error("[booking] publishToJobBoard failed:", err2)
  );
  await sendBookingConfirmation({
    customerEmail: booking.customerEmail,
    customerName: booking.customerName,
    reference: booking.reference,
    serviceName: booking.serviceName,
    scheduledAt: booking.scheduledAt,
    totalPrice: booking.totalPrice
  }).catch(() => {
  });
  await notifyNewBooking({
    id: booking.id,
    reference: booking.reference,
    customerName: booking.customerName,
    totalPrice: booking.totalPrice
  }).catch(() => {
  });
  return booking;
}
async function cancelBooking(bookingId, options) {
  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new Error("NOT_FOUND");
  if (booking.status === "CANCELLED") {
    return { booking, refundAmount: booking.refundAmount };
  }
  const refundAmount = booking.isPaid ? calculateRefund(booking.scheduledAt, booking.totalPrice) : 0;
  if (refundAmount > 0 && booking.stripePaymentId && stripe) {
    try {
      await stripe.refunds.create({
        payment_intent: booking.stripePaymentId,
        amount: poundsToPence(refundAmount)
      });
    } catch (err2) {
      console.error("[booking] Stripe refund failed:", err2);
    }
  }
  const previousStatus = booking.status;
  const updated = await db.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED", refundAmount }
  });
  await db.driverJob.updateMany({
    where: { bookingId },
    data: { status: "CANCELLED", isPublic: false }
  });
  await recordStatusChange(
    bookingId,
    previousStatus,
    "CANCELLED",
    options.actorId,
    options.actorRole,
    options.reason
  );
  await sendBookingCancelled(
    { customerEmail: updated.customerEmail, reference: updated.reference },
    refundAmount
  ).catch(() => {
  });
  return { booking: updated, refundAmount };
}
async function getBookingForTracking(reference, email) {
  const booking = await db.booking.findUnique({
    where: { reference },
    include: {
      driver: { include: { user: true } },
      trackingEvents: {
        where: { isInternal: false },
        orderBy: { createdAt: "asc" }
      },
      conversation: { select: { id: true } }
    }
  });
  if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
    throw new Error("NOT_FOUND");
  }
  const lastLocation = [...booking.trackingEvents].reverse().find((e) => e.type === "location" && e.lat !== null && e.lng !== null);
  return {
    reference: booking.reference,
    bookingId: booking.id,
    status: booking.status,
    serviceName: booking.serviceName,
    scheduledAt: booking.scheduledAt.toISOString(),
    pickupPostcode: booking.pickupPostcode,
    dropoffPostcode: booking.dropoffPostcode,
    pickupAddress: booking.pickupAddress,
    dropoffAddress: booking.dropoffAddress,
    driverName: booking.driver?.user.name,
    driverPhone: booking.driver?.user.phone ?? void 0,
    driverVanSize: booking.driver?.vanSize ?? void 0,
    conversationId: booking.conversation?.id ?? void 0,
    canCancel: ["PENDING", "CONFIRMED"].includes(booking.status),
    events: booking.trackingEvents.map((e) => ({
      type: e.type,
      status: e.status ?? void 0,
      message: e.message ?? void 0,
      createdAt: e.createdAt.toISOString()
    })),
    liveLocation: lastLocation ? {
      lat: lastLocation.lat,
      lng: lastLocation.lng,
      updatedAt: lastLocation.createdAt.toISOString()
    } : void 0
  };
}

// src/routes/booking.ts
var app3 = new Hono2();
app3.post("/create", zValidator("json", CreateBookingSchema), async (c) => {
  const input = c.req.valid("json");
  try {
    const { booking, clientSecret } = await createBooking(input);
    return c.json(
      ok({
        bookingId: booking.id,
        bookingRef: booking.reference,
        clientSecret,
        totalPrice: booking.totalPrice
      }),
      201
    );
  } catch (err2) {
    if (err2 instanceof Error && err2.name === "PriceChangedError") {
      return c.json(fail(err2.message, "PRICE_CHANGED"), 422);
    }
    throw err2;
  }
});
app3.post("/confirm", zValidator("json", ConfirmBookingSchema), async (c) => {
  const { bookingId, stripePaymentIntentId } = c.req.valid("json");
  try {
    const booking = await confirmBooking(bookingId, stripePaymentIntentId);
    return c.json(ok({ success: true, bookingRef: booking.reference }));
  } catch (err2) {
    if (err2 instanceof Error && err2.name === "PaymentNotSucceeded") {
      return c.json(fail(err2.message, "PAYMENT_NOT_SUCCEEDED"), 400);
    }
    throw err2;
  }
});
app3.get("/check", zValidator("query", external_exports.object({ email: external_exports.string().email() })), async (c) => {
  const { email } = c.req.valid("query");
  const booking = await db.booking.findFirst({
    where: {
      customerEmail: email,
      status: { in: ["PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS"] }
    },
    orderBy: { createdAt: "desc" }
  });
  return c.json(
    ok({
      hasActiveBooking: Boolean(booking),
      booking: booking ? {
        id: booking.id,
        reference: booking.reference,
        status: booking.status,
        scheduledAt: booking.scheduledAt
      } : null
    })
  );
});
app3.get(
  "/track/:reference",
  zValidator("query", external_exports.object({ email: external_exports.string().email() })),
  async (c) => {
    const reference = c.req.param("reference");
    const { email } = c.req.valid("query");
    try {
      const data = await getBookingForTracking(reference, email);
      return c.json(ok(data));
    } catch {
      return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    }
  }
);
app3.post(
  "/track/:reference/cancel",
  zValidator("json", CancelBookingSchema),
  async (c) => {
    const reference = c.req.param("reference");
    const { email, reason } = c.req.valid("json");
    const booking = await db.booking.findUnique({ where: { reference } });
    if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    }
    const result = await cancelBooking(booking.id, {
      reason,
      actorRole: "CUSTOMER",
      actorId: booking.userId
    });
    return c.json(ok({ success: true, refundAmount: result.refundAmount }));
  }
);
app3.get("/:id", requireAuth, async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      items: true,
      trackingEvents: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      driver: { include: { user: true } }
    }
  });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  if (role !== "ADMIN" && booking.userId !== userId) {
    return c.json(fail("Forbidden", "FORBIDDEN"), 403);
  }
  return c.json(ok(booking));
});
app3.get("/:id/invoice", requireAuth, async (c) => {
  const id = c.req.param("id");
  const userId = c.get("userId");
  const role = c.get("userRole");
  const booking = await db.booking.findUnique({
    where: { id },
    include: { items: true }
  });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  if (role !== "ADMIN" && booking.userId !== userId) {
    return c.json(fail("Forbidden", "FORBIDDEN"), 403);
  }
  const buffer = await new Promise((resolve, reject) => {
    const doc = new import_pdfkit.default({ margin: 50, size: "A4" });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.fontSize(26).font("Helvetica-Bold").fillColor("#0F172A").text("SPEEDY VAN", 50, 50);
    doc.fontSize(9).font("Helvetica").fillColor("#64748b");
    doc.text("1 Barrack Street, Office 2.18, Hamilton ML3 0HS", 50, 82);
    doc.text("support@speedyvan.uk  \xB7  +44 7909 032889", 50, 93);
    doc.fontSize(22).font("Helvetica-Bold").fillColor("#0F172A").text("INVOICE", 400, 50, { align: "right", width: 145 });
    doc.fontSize(9).font("Helvetica").fillColor("#64748b");
    doc.text(`INV-${booking.reference}`, 400, 80, { align: "right", width: 145 });
    doc.text(`Date: ${new Date(booking.createdAt).toLocaleDateString("en-GB")}`, 400, 91, { align: "right", width: 145 });
    doc.text(`Status: ${booking.status}`, 400, 102, { align: "right", width: 145 });
    doc.moveTo(50, 120).lineTo(545, 120).strokeColor("#e2e8f0").lineWidth(1).stroke();
    doc.moveDown(1.5);
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#64748b").text("BILL TO", 50, 135);
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#0F172A").text(booking.customerName, 50, 148);
    doc.fontSize(9).font("Helvetica").fillColor("#64748b");
    doc.text(booking.customerEmail, 50, 161);
    if (booking.customerPhone) doc.text(booking.customerPhone, 50, 172);
    const detailY = 210;
    doc.moveTo(50, 200).lineTo(545, 200).strokeColor("#e2e8f0").lineWidth(1).stroke();
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#64748b").text("SERVICE DETAILS", 50, detailY);
    doc.fontSize(10).font("Helvetica").fillColor("#0F172A");
    doc.text(
      `${booking.serviceName}${booking.serviceVariant ? ` (${booking.serviceVariant})` : ""}`,
      50,
      detailY + 14
    );
    doc.fontSize(9).fillColor("#64748b");
    doc.text(`From: ${booking.pickupAddress}`, 50, detailY + 28);
    doc.text(`To:     ${booking.dropoffAddress}`, 50, detailY + 40);
    doc.text(
      `Date: ${new Date(booking.scheduledAt).toLocaleDateString("en-GB")} \u2014 ${booking.selectedTimeSlot ?? ""}`,
      50,
      detailY + 52
    );
    doc.text(`Distance: ${booking.distanceMiles.toFixed(1)} miles`, 50, detailY + 64);
    if (booking.items.length > 0) {
      const itemsY = detailY + 88;
      doc.moveTo(50, itemsY - 8).lineTo(545, itemsY - 8).strokeColor("#e2e8f0").lineWidth(1).stroke();
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#64748b").text("ITEMS", 50, itemsY);
      let cursor = itemsY + 14;
      for (const item of booking.items.slice(0, 20)) {
        doc.fontSize(9).font("Helvetica").fillColor("#0F172A").text(`${item.name} \xD7 ${item.quantity}`, 50, cursor);
        cursor += 13;
      }
    }
    const priceY = 430;
    doc.moveTo(50, priceY).lineTo(545, priceY).strokeColor("#e2e8f0").lineWidth(1).stroke();
    doc.fontSize(9).font("Helvetica-Bold").fillColor("#64748b").text("PAYMENT", 50, priceY + 8);
    doc.fontSize(10).font("Helvetica").fillColor("#0F172A");
    doc.text("Subtotal", 350, priceY + 8, { width: 100, align: "right" });
    doc.text(`\xA3${booking.price.toFixed(2)}`, 460, priceY + 8, { width: 85, align: "right" });
    doc.text("Total paid", 350, priceY + 22, { width: 100, align: "right" });
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#0F172A");
    doc.text(`\xA3${booking.totalPrice.toFixed(2)}`, 460, priceY + 20, { width: 85, align: "right" });
    doc.moveTo(50, 700).lineTo(545, 700).strokeColor("#e2e8f0").lineWidth(1).stroke();
    doc.fontSize(8).font("Helvetica").fillColor("#94a3b8");
    doc.text("Covered by Goods in Transit Insurance.", 50, 710);
    doc.text(
      "Cancellation: Free 48h+ before move  \xB7  50% refund 24-48h  \xB7  No refund within 24h",
      50,
      722
    );
    doc.text("Thank you for choosing Speedy Van!", 50, 740, { align: "center", width: 495 });
    doc.end();
  });
  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="INV-${booking.reference}.pdf"`,
      "Cache-Control": "private, no-store"
    }
  });
});
app3.post(
  "/review",
  zValidator(
    "json",
    external_exports.object({
      reference: external_exports.string().min(1),
      email: external_exports.string().email(),
      rating: external_exports.number().int().min(1).max(5),
      comment: external_exports.string().min(1).max(2e3)
    })
  ),
  async (c) => {
    const { reference, email, rating, comment } = c.req.valid("json");
    const booking = await db.booking.findUnique({
      where: { reference },
      include: { review: true }
    });
    if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    }
    if (booking.status !== "COMPLETED") {
      return c.json(fail("Booking must be completed before reviewing", "NOT_COMPLETED"), 400);
    }
    if (booking.review) {
      return c.json(fail("Review already submitted", "ALREADY_REVIEWED"), 409);
    }
    const review = await db.review.create({
      data: { bookingId: booking.id, userId: booking.userId, rating, comment }
    });
    return c.json(ok({ review: { id: review.id, rating: review.rating, comment: review.comment } }), 201);
  }
);
var booking_default = app3;

// src/routes/pricing.ts
var app4 = new Hono2();
app4.post("/calculate", zValidator("json", PricingCalculateSchema), async (c) => {
  const input = c.req.valid("json");
  const result = await calculatePrice(input);
  return c.json(ok(result));
});
var pricing_default = app4;

// src/routes/items.ts
var app5 = new Hono2();
app5.get(
  "/",
  zValidator(
    "query",
    external_exports.object({
      type: external_exports.enum(["residential", "business", "both"]).optional()
    })
  ),
  async (c) => {
    const { type } = c.req.valid("query");
    const where = type ? { isActive: true, OR: [{ type }, { type: "both" }] } : { isActive: true };
    const categories = await db.itemCategory.findMany({
      where,
      orderBy: { sortOrder: "asc" },
      include: {
        items: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" }
        }
      }
    });
    c.header("Cache-Control", "public, s-maxage=3600");
    return c.json(ok({ categories }));
  }
);
var items_default = app5;

// src/routes/geocode.ts
var app6 = new Hono2();
var MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
if (!MAPBOX_TOKEN) {
  console.warn("[geocode] MAPBOX_TOKEN not set; geocoding endpoints will return 503.");
}
app6.get("/search", zValidator("query", GeocodeSearchSchema), async (c) => {
  if (!MAPBOX_TOKEN) {
    return c.json(fail("Geocoding not configured", "MAPBOX_NOT_CONFIGURED"), 503);
  }
  const { q } = c.req.valid("query");
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?country=gb&types=address,postcode,place&limit=5&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return c.json(fail("Geocoding failed", "MAPBOX_ERROR"), 502);
    const json = await res.json();
    const results = json.features?.map((f) => {
      const postcodeCtx = f.context?.find((c2) => c2.id.startsWith("postcode"));
      return {
        address: f.place_name ?? "",
        postcode: postcodeCtx?.text ?? "",
        lat: f.center?.[1] ?? 0,
        lng: f.center?.[0] ?? 0
      };
    }) ?? [];
    return c.json(ok({ results }));
  } catch (err2) {
    console.error("[geocode/search]", err2);
    return c.json(fail("Geocoding error", "MAPBOX_ERROR"), 502);
  }
});
app6.post("/directions", zValidator("json", DirectionsSchema), async (c) => {
  if (!MAPBOX_TOKEN) {
    return c.json(fail("Directions not configured", "MAPBOX_NOT_CONFIGURED"), 503);
  }
  const { pickupLat, pickupLng, dropoffLat, dropoffLng } = c.req.valid("json");
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?geometries=geojson&overview=simplified&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return c.json(fail("Directions failed", "MAPBOX_ERROR"), 502);
    const json = await res.json();
    const route = json.routes?.[0];
    if (!route) return c.json(fail("No route found", "NO_ROUTE"), 404);
    const result = {
      distanceMiles: route.distance / 1609.344,
      durationMinutes: route.duration / 60,
      routeGeometry: route.geometry
    };
    return c.json(ok(result));
  } catch (err2) {
    console.error("[geocode/directions]", err2);
    return c.json(fail("Directions error", "MAPBOX_ERROR"), 502);
  }
});
app6.get("/reverse", async (c) => {
  if (!MAPBOX_TOKEN) {
    return c.json(fail("Geocoding not configured", "MAPBOX_NOT_CONFIGURED"), 503);
  }
  const lat = Number(c.req.query("lat"));
  const lng = Number(c.req.query("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return c.json(fail("Invalid coordinates", "INVALID_COORDS"), 400);
  }
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?country=gb&types=address,postcode,place&limit=1&access_token=${MAPBOX_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return c.json(fail("Reverse geocoding failed", "MAPBOX_ERROR"), 502);
    const json = await res.json();
    const f = json.features?.[0];
    if (!f) return c.json(fail("No address found", "NO_ADDRESS"), 404);
    const postcodeCtx = f.context?.find((x2) => x2.id.startsWith("postcode"));
    const result = {
      address: f.place_name ?? "",
      postcode: postcodeCtx?.text ?? "",
      lat: f.center?.[1] ?? lat,
      lng: f.center?.[0] ?? lng
    };
    return c.json(ok(result));
  } catch (err2) {
    console.error("[geocode/reverse]", err2);
    return c.json(fail("Reverse geocoding error", "MAPBOX_ERROR"), 502);
  }
});
var geocode_default = app6;

// src/routes/stripe.ts
var app7 = new Hono2();
var webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
app7.post("/webhook", async (c) => {
  if (!stripe || !webhookSecret) {
    return c.json(fail("Stripe not configured", "STRIPE_NOT_CONFIGURED"), 503);
  }
  const sig = c.req.header("stripe-signature");
  if (!sig) return c.json(fail("Missing stripe-signature header", "MISSING_SIG"), 400);
  const rawBody = await c.req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err2) {
    console.error("[stripe] signature verification failed:", err2);
    return c.json(fail("Invalid signature", "INVALID_SIGNATURE"), 400);
  }
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi2 = event.data.object;
        const bookingId = pi2.metadata?.bookingId;
        if (bookingId) await confirmBooking(bookingId, pi2.id).catch(() => {
        });
        break;
      }
      case "payment_intent.payment_failed": {
        const pi2 = event.data.object;
        const bookingId = pi2.metadata?.bookingId;
        if (bookingId) {
          const booking = await db.booking.findUnique({ where: { id: bookingId } });
          if (booking) {
            await db.booking.update({
              where: { id: bookingId },
              data: { status: "CANCELLED" }
            });
            await recordStatusChange(
              bookingId,
              booking.status,
              "CANCELLED",
              void 0,
              "SYSTEM",
              "Payment failed"
            );
          }
        }
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object;
        const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
        if (piId) {
          const booking = await db.booking.findFirst({ where: { stripePaymentId: piId } });
          if (booking) {
            await db.booking.update({
              where: { id: booking.id },
              data: { refundAmount: (charge.amount_refunded ?? 0) / 100 }
            });
          }
        }
        break;
      }
      default:
        break;
    }
  } catch (err2) {
    console.error(`[stripe] handler error for ${event.type}:`, err2);
  }
  return c.json(ok({ received: true }));
});
var stripe_default = app7;

// src/routes/driver.ts
var app8 = new Hono2();
app8.use("*", requireDriver);
async function getDriver(userId) {
  return db.driver.findUnique({ where: { userId } });
}
app8.get("/dashboard", async (c) => {
  const userId = c.get("userId");
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
  const startOfDay = /* @__PURE__ */ new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setUTCDate(startOfDay.getUTCDate() - startOfDay.getUTCDay());
  const [todayJobs, completedToday, totalCompleted, weekJobs, nextJob, todaySchedule] = await Promise.all([
    db.driverJob.count({
      where: { driverId: driver.id, booking: { scheduledAt: { gte: startOfDay } } }
    }),
    db.booking.findMany({
      where: { driverId: driver.id, status: "COMPLETED", scheduledAt: { gte: startOfDay } }
    }),
    db.booking.count({ where: { driverId: driver.id, status: "COMPLETED" } }),
    db.booking.findMany({
      where: { driverId: driver.id, status: "COMPLETED", scheduledAt: { gte: startOfWeek } }
    }),
    db.driverJob.findFirst({
      where: { driverId: driver.id, status: { not: "COMPLETED" } },
      include: { booking: true },
      orderBy: { booking: { scheduledAt: "asc" } }
    }),
    db.booking.findMany({
      where: { driverId: driver.id, scheduledAt: { gte: startOfDay } },
      orderBy: { scheduledAt: "asc" }
    })
  ]);
  const sum = (arr) => arr.reduce((acc, b) => acc + b.totalPrice, 0);
  return c.json(
    ok({
      todayJobs,
      todayEarnings: sum(completedToday),
      totalCompletedJobs: totalCompleted,
      nextJob,
      todaySchedule,
      weekStats: { completed: weekJobs.length, earnings: sum(weekJobs) }
    })
  );
});
app8.get(
  "/jobs",
  zValidator(
    "query",
    external_exports.object({
      service: external_exports.string().optional(),
      area: external_exports.string().optional(),
      date: external_exports.string().optional(),
      sort: external_exports.enum(["newest", "highest", "shortest"]).optional()
    })
  ),
  async (c) => {
    const { service, area, date, sort } = c.req.valid("query");
    const orderBy = sort === "highest" ? { booking: { totalPrice: "desc" } } : sort === "shortest" ? { booking: { distanceMiles: "asc" } } : { createdAt: "desc" };
    const jobs = await db.driverJob.findMany({
      where: {
        status: "AVAILABLE",
        isPublic: true,
        driverId: null,
        ...service ? { booking: { serviceSlug: service } } : {},
        ...area ? { booking: { pickupPostcode: { startsWith: area, mode: "insensitive" } } } : {},
        ...date ? {
          booking: {
            scheduledAt: {
              gte: new Date(date),
              lt: new Date(new Date(date).getTime() + 864e5)
            }
          }
        } : {}
      },
      include: { booking: true },
      orderBy
    });
    const sanitized = jobs.map((j) => ({
      id: j.id,
      status: j.status,
      createdAt: j.createdAt,
      booking: {
        id: j.booking.id,
        reference: j.booking.reference,
        serviceName: j.booking.serviceName,
        serviceSlug: j.booking.serviceSlug,
        scheduledAt: j.booking.scheduledAt,
        selectedTimeSlot: j.booking.selectedTimeSlot,
        pickupPostcode: maskPostcode(j.booking.pickupPostcode),
        dropoffPostcode: maskPostcode(j.booking.dropoffPostcode),
        distanceMiles: j.booking.distanceMiles,
        totalPrice: j.booking.totalPrice,
        helpersCount: j.booking.helpersCount,
        needsPacking: j.booking.needsPacking,
        needsAssembly: j.booking.needsAssembly
      }
    }));
    return c.json(ok({ jobs: sanitized }));
  }
);
app8.post("/jobs/:id/accept", async (c) => {
  const userId = c.get("userId");
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
  try {
    const job = await acceptJob(c.req.param("id"), driver.id);
    return c.json(ok({ success: true, job }));
  } catch (err2) {
    if (err2 instanceof JobAlreadyTakenError) {
      return c.json(fail(err2.message, "JOB_TAKEN"), 409);
    }
    throw err2;
  }
});
app8.get(
  "/my-jobs",
  zValidator(
    "query",
    external_exports.object({
      status: external_exports.enum(["upcoming", "in_progress", "completed", "all"]).optional()
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
    const { status } = c.req.valid("query");
    const statusFilter = status === "upcoming" ? { in: ["ACCEPTED"] } : status === "in_progress" ? { in: ["DRIVER_EN_ROUTE", "ARRIVED_PICKUP", "LOADING", "IN_TRANSIT", "ARRIVED_DROPOFF", "UNLOADING"] } : status === "completed" ? { equals: "COMPLETED" } : void 0;
    const jobs = await db.driverJob.findMany({
      where: {
        driverId: driver.id,
        ...statusFilter ? { status: statusFilter } : {}
      },
      include: { booking: { include: { items: true, conversation: { select: { id: true } } } } },
      orderBy: { booking: { scheduledAt: "asc" } }
    });
    return c.json(ok({ jobs }));
  }
);
app8.patch(
  "/my-jobs/:id/status",
  zValidator("json", DriverStatusUpdateSchema),
  async (c) => {
    const userId = c.get("userId");
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") } });
    if (!job || job.driverId !== driver.id) {
      return c.json(fail("Job not found", "NOT_FOUND"), 404);
    }
    const { status, note } = c.req.valid("json");
    const updated = await updateJobStatus(job.id, status, userId, note);
    return c.json(ok({ success: true, job: updated }));
  }
);
app8.post(
  "/my-jobs/:id/reject",
  zValidator("json", external_exports.object({ reason: external_exports.string().min(1) })),
  async (c) => {
    const userId = c.get("userId");
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") } });
    if (!job || job.driverId !== driver.id) {
      return c.json(fail("Job not found", "NOT_FOUND"), 404);
    }
    const { reason } = c.req.valid("json");
    await rejectJob(job.id, reason);
    return c.json(ok({ success: true }));
  }
);
app8.post(
  "/tracking/location",
  zValidator("json", DriverLocationSchema),
  async (c) => {
    const userId = c.get("userId");
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
    const { bookingId, lat, lng } = c.req.valid("json");
    const booking = await db.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.driverId !== driver.id) {
      return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    }
    await trackDriverLocation(bookingId, lat, lng);
    return c.json(ok({ success: true }));
  }
);
app8.get("/profile", async (c) => {
  const userId = c.get("userId");
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, role: true, driver: true }
  });
  return c.json(ok({ user }));
});
app8.patch(
  "/profile",
  zValidator("json", external_exports.object({ name: external_exports.string().optional(), phone: external_exports.string().optional() })),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");
    const user = await db.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, phone: true, role: true }
    });
    return c.json(ok({ user }));
  }
);
app8.post(
  "/my-jobs/:id/photo",
  zValidator(
    "json",
    external_exports.object({
      image: external_exports.string().optional(),
      // base64 string from iOS
      imageUrl: external_exports.string().optional(),
      // legacy URL
      type: external_exports.enum(["proof_of_delivery", "before", "after", "damage"]).optional()
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") }, include: { booking: true } });
    if (!job || job.driverId !== driver.id) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const { image, imageUrl, type } = c.req.valid("json");
    const finalUrl = image ? `data:image/jpeg;base64,${image}` : imageUrl ?? null;
    if (!finalUrl) return c.json(fail("No image provided", "VALIDATION_ERROR"), 400);
    const updated = await db.driverJob.update({
      where: { id: job.id },
      data: { proofImageUrl: finalUrl }
    });
    await db.trackingEvent.create({
      data: {
        bookingId: job.bookingId,
        type: "photo_added",
        message: `${type ?? "proof_of_delivery"} photo uploaded`,
        actorId: userId,
        actorRole: "DRIVER"
      }
    });
    return c.json(ok({ imageUrl: updated.proofImageUrl }));
  }
);
app8.post(
  "/my-jobs/:id/signature",
  zValidator(
    "json",
    external_exports.object({
      signatureData: external_exports.string().min(1),
      signerName: external_exports.string().min(1)
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") }, include: { booking: true } });
    if (!job || job.driverId !== driver.id) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const { signatureData, signerName } = c.req.valid("json");
    const signatureUrl = `data:image/png;base64,${signatureData}`;
    await db.trackingEvent.create({
      data: {
        bookingId: job.bookingId,
        type: "signature_collected",
        message: `Signature collected from ${signerName}`,
        actorId: userId,
        actorRole: "DRIVER"
      }
    });
    return c.json(ok({ signatureUrl }));
  }
);
app8.post(
  "/my-jobs/:id/notes",
  zValidator("json", external_exports.object({ notes: external_exports.string().min(1).max(2e3) })),
  async (c) => {
    const userId = c.get("userId");
    const driver = await getDriver(userId);
    if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
    const job = await db.driverJob.findUnique({ where: { id: c.req.param("id") }, include: { booking: true } });
    if (!job || job.driverId !== driver.id) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const { notes } = c.req.valid("json");
    await db.driverJob.update({ where: { id: job.id }, data: { notes } });
    await db.trackingEvent.create({
      data: {
        bookingId: job.bookingId,
        type: "note_added",
        message: notes,
        actorId: userId,
        actorRole: "DRIVER",
        isInternal: true
      }
    });
    return c.json(ok({ success: true }));
  }
);
app8.get("/earnings", async (c) => {
  const userId = c.get("userId");
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
  const now = /* @__PURE__ */ new Date();
  const startOfToday = new Date(now);
  startOfToday.setUTCHours(0, 0, 0, 0);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setUTCDate(startOfToday.getUTCDate() - (startOfToday.getUTCDay() + 6) % 7);
  const startOfMonth = new Date(now.getUTCFullYear(), now.getUTCMonth(), 1);
  const allJobs = await db.driverJob.findMany({
    where: { driverId: driver.id, driverPay: { gt: 0 } },
    select: { driverPay: true, driverPayStatus: true, completedAt: true, createdAt: true },
    orderBy: { completedAt: "desc" }
  });
  const sumPaid = (jobs) => jobs.reduce((s, j) => s + (j.driverPay ?? 0), 0);
  const paidJobs = allJobs.filter((j) => j.driverPayStatus === "paid");
  const unpaidJobs = allJobs.filter((j) => j.driverPayStatus === "unpaid");
  const todayPaid = paidJobs.filter((j) => j.completedAt && j.completedAt >= startOfToday);
  const weekPaid = paidJobs.filter((j) => j.completedAt && j.completedAt >= startOfWeek);
  const monthPaid = paidJobs.filter((j) => j.completedAt && j.completedAt >= startOfMonth);
  const cutoff = new Date(startOfToday);
  cutoff.setUTCDate(cutoff.getUTCDate() - 13);
  const recentMap = /* @__PURE__ */ new Map();
  for (const j of paidJobs.filter((x2) => x2.completedAt && x2.completedAt >= cutoff)) {
    const day = j.completedAt.toISOString().slice(0, 10);
    const existing = recentMap.get(day) ?? { jobs: 0, amount: 0 };
    recentMap.set(day, { jobs: existing.jobs + 1, amount: existing.amount + (j.driverPay ?? 0) });
  }
  const recentPayments = Array.from(recentMap.entries()).sort((a2, b) => b[0].localeCompare(a2[0])).slice(0, 10).map(([date, { jobs, amount }]) => ({ date, amount, jobCount: jobs }));
  const dailyCap = 500;
  return c.json(
    ok({
      today: { jobs: todayPaid.length, amount: sumPaid(todayPaid) },
      thisWeek: { jobs: weekPaid.length, amount: sumPaid(weekPaid) },
      thisMonth: { jobs: monthPaid.length, amount: sumPaid(monthPaid) },
      allTime: { jobs: paidJobs.length, amount: sumPaid(paidJobs) },
      unpaid: { jobs: unpaidJobs.length, amount: sumPaid(unpaidJobs) },
      recentPayments,
      dailyCap,
      todayRemaining: Math.max(0, dailyCap - sumPaid(todayPaid))
    })
  );
});
app8.get("/stats", async (c) => {
  const userId = c.get("userId");
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
  const [acceptedCount, completedCount, totalOffered, reviewData, allDrivers] = await Promise.all([
    db.driverJob.count({ where: { driverId: driver.id, status: { not: "AVAILABLE" } } }),
    db.driverJob.count({ where: { driverId: driver.id, status: "COMPLETED" } }),
    db.driverJob.count({ where: { driverId: driver.id } }),
    db.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
      where: { booking: { driverId: driver.id } }
    }),
    db.driverJob.groupBy({
      by: ["driverId"],
      where: { status: "COMPLETED", driverId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } }
    })
  ]);
  const acceptanceRate = totalOffered > 0 ? Math.round(acceptedCount / totalOffered * 100) : 100;
  const completionRate = acceptedCount > 0 ? Math.round(completedCount / acceptedCount * 100) : 100;
  const avgRating = reviewData._avg.rating ?? 5;
  const totalReviews = reviewData._count.rating;
  const rankIdx = allDrivers.findIndex((d) => d.driverId === driver.id);
  const rank = rankIdx === -1 ? allDrivers.length + 1 : rankIdx + 1;
  const achievements = [
    {
      id: "first_job",
      title: "First Delivery",
      description: "Complete your first job",
      earned: completedCount >= 1
    },
    {
      id: "ten_jobs",
      title: "Ten Deliveries",
      description: "Complete 10 jobs",
      earned: completedCount >= 10
    },
    {
      id: "fifty_jobs",
      title: "Road Warrior",
      description: "Complete 50 jobs",
      earned: completedCount >= 50
    },
    {
      id: "top_rated",
      title: "Top Rated",
      description: "Maintain 4.8+ average rating",
      earned: totalReviews >= 5 && avgRating >= 4.8
    }
  ];
  return c.json(
    ok({
      acceptanceRate,
      completionRate,
      onTimeRate: 95,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews,
      rank,
      totalDrivers: allDrivers.length || 1,
      achievements
    })
  );
});
app8.get("/leaderboard", async (c) => {
  const userId = c.get("userId");
  const driver = await getDriver(userId);
  if (!driver) return c.json(fail("Driver profile missing", "NOT_FOUND"), 404);
  const startOfMonth = /* @__PURE__ */ new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);
  const top = await db.driverJob.groupBy({
    by: ["driverId"],
    where: {
      status: "COMPLETED",
      driverId: { not: null },
      completedAt: { gte: startOfMonth }
    },
    _count: { id: true },
    _sum: { driverPay: true },
    orderBy: { _count: { id: "desc" } },
    take: 20
  });
  const driverIds = top.map((d) => d.driverId);
  const users = await db.driver.findMany({
    where: { id: { in: driverIds } },
    include: { user: { select: { name: true } } }
  });
  const nameMap = new Map(users.map((d) => [d.id, d.user.name]));
  const drivers = top.map((d, idx) => {
    const fullName = nameMap.get(d.driverId) ?? "Driver";
    const parts = fullName.trim().split(" ");
    const displayName = d.driverId === driver.id ? "You" : `${parts[0]} ${parts[1]?.[0] ?? ""}.`.trimEnd();
    return {
      rank: idx + 1,
      name: displayName,
      completedJobs: d._count.id,
      earnings: d._sum.driverPay ?? 0,
      isCurrentUser: d.driverId === driver.id
    };
  });
  const inList = drivers.some((d) => d.isCurrentUser);
  if (!inList) {
    const myCount = await db.driverJob.count({
      where: { driverId: driver.id, status: "COMPLETED", completedAt: { gte: startOfMonth } }
    });
    const myEarnings = await db.driverJob.aggregate({
      where: { driverId: driver.id, status: "COMPLETED", completedAt: { gte: startOfMonth } },
      _sum: { driverPay: true }
    });
    const myRank = top.filter((d) => (d._count.id ?? 0) > myCount).length + 1;
    drivers.push({
      rank: myRank,
      name: "You",
      completedJobs: myCount,
      earnings: myEarnings._sum.driverPay ?? 0,
      isCurrentUser: true
    });
  }
  return c.json(ok({ period: "this_month", drivers }));
});
app8.get("/notifications", async (c) => {
  const userId = c.get("userId");
  const notifications = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      title: true,
      body: true,
      isRead: true,
      link: true,
      createdAt: true
    }
  });
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  return c.json(ok({ notifications, unreadCount }));
});
app8.post(
  "/notifications/read",
  zValidator(
    "json",
    external_exports.union([
      external_exports.object({ ids: external_exports.array(external_exports.string()) }),
      external_exports.object({ all: external_exports.literal(true) })
    ])
  ),
  async (c) => {
    const userId = c.get("userId");
    const body = c.req.valid("json");
    if ("all" in body) {
      await db.notification.updateMany({ where: { userId }, data: { isRead: true } });
    } else {
      await db.notification.updateMany({
        where: { userId, id: { in: body.ids } },
        data: { isRead: true }
      });
    }
    return c.json(ok({ success: true }));
  }
);
app8.post(
  "/push-token",
  zValidator(
    "json",
    external_exports.object({
      token: external_exports.string().min(1),
      platform: external_exports.enum(["ios", "android"])
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const { token, platform } = c.req.valid("json");
    await db.user.update({
      where: { id: userId },
      data: { pushToken: token, pushPlatform: platform }
    });
    return c.json(ok({ success: true }));
  }
);
var driver_default = app8;

// src/routes/tracking.ts
var app9 = new Hono2();
function newSessionId() {
  return `vis_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
app9.post("/session", zValidator("json", VisitorSessionSchema), async (c) => {
  const data = c.req.valid("json");
  const sessionId = newSessionId();
  await db.visitor.create({
    data: {
      sessionId,
      userAgent: data.userAgent,
      referrer: data.referrer,
      landingPage: data.landingPage,
      screenWidth: data.screenWidth
    }
  });
  return c.json(ok({ sessionId }));
});
app9.post("/event", zValidator("json", VisitorEventSchema), async (c) => {
  const { sessionId, type, page, element, metadata } = c.req.valid("json");
  const visitor = await db.visitor.findUnique({ where: { sessionId } });
  if (!visitor) return c.json(fail("Session not found", "NOT_FOUND"), 404);
  await db.visitorEvent.create({
    data: {
      visitorId: visitor.id,
      type,
      page,
      element,
      metadata
    }
  });
  await db.visitor.update({
    where: { id: visitor.id },
    data: {
      lastActiveAt: /* @__PURE__ */ new Date(),
      ...type === "page_view" ? { pageViews: { increment: 1 } } : {}
    }
  });
  return c.json(ok({ success: true }));
});
app9.post(
  "/heartbeat",
  zValidator("json", external_exports.object({ sessionId: external_exports.string() })),
  async (c) => {
    const { sessionId } = c.req.valid("json");
    const visitor = await db.visitor.findUnique({ where: { sessionId } });
    if (!visitor) return c.json(fail("Session not found", "NOT_FOUND"), 404);
    const sinceLast = Math.floor((Date.now() - visitor.lastActiveAt.getTime()) / 1e3);
    await db.visitor.update({
      where: { id: visitor.id },
      data: {
        lastActiveAt: /* @__PURE__ */ new Date(),
        totalDuration: { increment: Math.min(sinceLast, 60) }
      }
    });
    return c.json(ok({ success: true }));
  }
);
app9.post(
  "/exit",
  zValidator("json", external_exports.object({ sessionId: external_exports.string() })),
  async (c) => {
    const { sessionId } = c.req.valid("json");
    await db.visitor.updateMany({
      where: { sessionId },
      data: { isActive: false, exitedAt: /* @__PURE__ */ new Date() }
    });
    return c.json(ok({ success: true }));
  }
);
var tracking_default = app9;

// src/routes/chat.ts
var app10 = new Hono2();
app10.use("*", requireAuth);
async function isParticipant(conversationId, userId) {
  const part = await db.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } }
  });
  return Boolean(part);
}
app10.get("/conversations", async (c) => {
  const userId = c.get("userId");
  const conversations = await db.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      booking: {
        select: { id: true, reference: true, serviceName: true, status: true }
      },
      messages: { orderBy: { createdAt: "desc" }, take: 1 }
    },
    orderBy: { updatedAt: "desc" }
  });
  return c.json(ok({ conversations }));
});
app10.post(
  "/conversations",
  zValidator("json", external_exports.object({ bookingId: external_exports.string() })),
  async (c) => {
    const userId = c.get("userId");
    const role = c.get("userRole");
    const { bookingId } = c.req.valid("json");
    const booking = await db.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return c.json(fail("Booking not found", "NOT_FOUND"), 404);
    if (role !== "ADMIN" && booking.userId !== userId) {
      return c.json(fail("Forbidden", "FORBIDDEN"), 403);
    }
    const existing = await db.conversation.findUnique({ where: { bookingId } });
    if (existing) return c.json(ok({ conversation: existing }));
    const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });
    const conversation = await db.conversation.create({
      data: {
        bookingId,
        participants: {
          create: [
            { userId: booking.userId, role: "CUSTOMER" },
            ...admins.map((a2) => ({ userId: a2.id, role: "ADMIN" }))
          ]
        }
      }
    });
    return c.json(ok({ conversation }), 201);
  }
);
app10.get(
  "/conversations/:id/messages",
  zValidator(
    "query",
    external_exports.object({
      page: external_exports.coerce.number().int().min(1).default(1),
      limit: external_exports.coerce.number().int().min(1).max(100).default(50)
    })
  ),
  async (c) => {
    const userId = c.get("userId");
    const conversationId = c.req.param("id");
    if (!await isParticipant(conversationId, userId)) {
      return c.json(fail("Forbidden", "FORBIDDEN"), 403);
    }
    const { page, limit } = c.req.valid("query");
    const [messages, total] = await Promise.all([
      db.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { sender: { select: { id: true, name: true, role: true } } }
      }),
      db.message.count({ where: { conversationId } })
    ]);
    return c.json(
      ok({
        messages: messages.reverse(),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.max(1, Math.ceil(total / limit))
        }
      })
    );
  }
);
app10.post(
  "/conversations/:id/messages",
  zValidator("json", SendMessageSchema),
  async (c) => {
    const userId = c.get("userId");
    const conversationId = c.req.param("id");
    if (!await isParticipant(conversationId, userId)) {
      return c.json(fail("Forbidden", "FORBIDDEN"), 403);
    }
    const { body } = c.req.valid("json");
    const sender = await db.user.findUnique({ where: { id: userId } });
    if (!sender) return c.json(fail("Sender not found", "NOT_FOUND"), 404);
    const message = await db.message.create({
      data: { conversationId, senderId: userId, body },
      include: { sender: { select: { id: true, name: true, role: true } } }
    });
    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: /* @__PURE__ */ new Date() }
    });
    triggerEvent(`conversation-${conversationId}`, "new-message", message);
    const others = await db.conversationParticipant.findMany({
      where: { conversationId, userId: { not: userId } },
      include: { user: true }
    });
    const conv = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { booking: { select: { reference: true } } }
    });
    if (conv) {
      for (const p2 of others) {
        await notifyChatMessage(p2.userId, conv.booking.reference, sender.name).catch(() => {
        });
        await sendNewMessage(p2.user.email, sender.name, body, conv.booking.reference).catch(() => {
        });
      }
    }
    return c.json(ok({ message }), 201);
  }
);
app10.post("/conversations/:id/read", async (c) => {
  const userId = c.get("userId");
  const conversationId = c.req.param("id");
  if (!await isParticipant(conversationId, userId)) {
    return c.json(fail("Forbidden", "FORBIDDEN"), 403);
  }
  await db.conversationParticipant.update({
    where: { conversationId_userId: { conversationId, userId } },
    data: { lastReadAt: /* @__PURE__ */ new Date() }
  });
  return c.json(ok({ success: true }));
});
var chat_default = app10;
var bookingMessagesApp = new Hono2();
var BookingMsgSchema = external_exports.object({
  bookingRef: external_exports.string().min(1),
  email: external_exports.string().email(),
  content: external_exports.string().min(1).max(4e3)
});
async function getOrCreateConversationForBooking(bookingId, customerId) {
  const existing = await db.conversation.findUnique({ where: { bookingId } });
  if (existing) return existing.id;
  const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });
  const created = await db.conversation.create({
    data: {
      bookingId,
      participants: {
        create: [
          { userId: customerId, role: "CUSTOMER" },
          ...admins.map((a2) => ({ userId: a2.id, role: "ADMIN" }))
        ]
      }
    }
  });
  return created.id;
}
bookingMessagesApp.get(
  "/booking-messages/:ref",
  zValidator("query", external_exports.object({ email: external_exports.string().email() })),
  async (c) => {
    const reference = c.req.param("ref");
    const { email } = c.req.valid("query");
    const booking = await db.booking.findUnique({ where: { reference } });
    if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return c.json(fail("Not found", "NOT_FOUND"), 404);
    }
    const conversation = await db.conversation.findUnique({
      where: { bookingId: booking.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: { sender: { select: { id: true, name: true, role: true } } }
        }
      }
    });
    if (!conversation) {
      return c.json(ok({ messages: [], conversationId: null }));
    }
    return c.json(
      ok({
        conversationId: conversation.id,
        messages: conversation.messages.map((m2) => ({
          id: m2.id,
          body: m2.body,
          createdAt: m2.createdAt.toISOString(),
          sender: m2.sender
        }))
      })
    );
  }
);
bookingMessagesApp.post(
  "/booking-messages",
  zValidator("json", BookingMsgSchema),
  async (c) => {
    const { bookingRef, email, content } = c.req.valid("json");
    const booking = await db.booking.findUnique({ where: { reference: bookingRef } });
    if (!booking || booking.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return c.json(fail("Not found", "NOT_FOUND"), 404);
    }
    const conversationId = await getOrCreateConversationForBooking(booking.id, booking.userId);
    const message = await db.message.create({
      data: {
        conversationId,
        senderId: booking.userId,
        body: content.trim()
      },
      include: { sender: { select: { id: true, name: true, role: true } } }
    });
    const admins = await db.user.findMany({ where: { role: "ADMIN", isActive: true } });
    triggerEvent(`conversation-${conversationId}`, "new-message", {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender
    });
    await Promise.all(
      admins.map(
        (admin) => sendNewMessage(admin.email, booking.customerName, content, bookingRef)
      )
    );
    return c.json(
      ok({
        message: {
          id: message.id,
          body: message.body,
          createdAt: message.createdAt.toISOString(),
          sender: message.sender
        },
        conversationId
      }),
      201
    );
  }
);

// src/routes/weather.ts
var app11 = new Hono2();
app11.get("/forecast", async (c) => {
  const lat = Number(c.req.query("lat"));
  const lng = Number(c.req.query("lng"));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return c.json(fail("Invalid coordinates", "INVALID_COORDS"), 400);
  }
  const result = await getWeatherForecast(lat, lng);
  if (!result) {
    return c.json(ok({ available: false, condition: null, description: null, iconUrl: null }));
  }
  return c.json(ok({ available: true, ...result }));
});
var weather_default = app11;

// src/routes/service-flags.ts
var app12 = new Hono2();
var KNOWN_SLUGS = ["rubbish-removal", "same-day-delivery"];
app12.get("/", async (c) => {
  const flags = await db.serviceFlag.findMany({
    where: { slug: { in: [...KNOWN_SLUGS] } }
  });
  const bySlug = new Map(flags.map((f) => [f.slug, f]));
  const items = KNOWN_SLUGS.map((slug) => {
    const existing = bySlug.get(slug);
    return existing ? { slug: existing.slug, enabled: existing.enabled, mode: existing.mode } : { slug, enabled: true, mode: null };
  });
  c.header("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
  return c.json(ok({ items }));
});
var service_flags_default = app12;

// src/routes/waitlist.ts
var app13 = new Hono2();
var POSTCODE_RE = /^([A-Z]{1,2}\d[A-Z\d]?)\s*(\d[A-Z]{2})?$/i;
app13.post(
  "/",
  zValidator(
    "json",
    external_exports.object({
      email: external_exports.string().email().max(255),
      postcode: external_exports.string().min(2).max(10).regex(POSTCODE_RE, "Invalid UK postcode"),
      source: external_exports.string().max(64).optional()
    })
  ),
  async (c) => {
    const { email, postcode, source } = c.req.valid("json");
    const cleanPostcode = postcode.trim().toUpperCase();
    const area = cleanPostcode.match(/^([A-Z]{1,2})/)?.[1] ?? null;
    try {
      await db.waitlistEntry.upsert({
        where: { email_postcode: { email: email.toLowerCase(), postcode: cleanPostcode } },
        create: { email: email.toLowerCase(), postcode: cleanPostcode, area, source: source ?? null },
        update: {}
      });
    } catch (err2) {
      console.error("[waitlist] insert failed", err2);
      return c.json(fail("Could not save your details, please try again later.", "DB_ERROR"), 500);
    }
    return c.json(ok({ saved: true }));
  }
);
var waitlist_default = app13;

// src/routes/enquiry.ts
var app14 = new Hono2();
var EUROPEAN_COUNTRIES = [
  "France",
  "Germany",
  "Spain",
  "Netherlands",
  "Ireland",
  "Belgium",
  "Italy",
  "Portugal",
  "Austria",
  "Switzerland",
  "Poland",
  "Czech Republic",
  "Denmark",
  "Sweden",
  "Norway",
  "Finland",
  "Greece",
  "Hungary",
  "Romania",
  "Croatia"
];
var PHONE_RE = /^[+()\-\s\d]{7,20}$/;
var EuropeanEnquirySchema = external_exports.object({
  customerName: external_exports.string().min(2).max(120),
  customerEmail: external_exports.string().email().max(255),
  customerPhone: external_exports.string().regex(PHONE_RE, "Invalid phone number"),
  fromAddress: external_exports.string().min(2).max(255),
  propertyType: external_exports.enum(["Studio", "Flat", "House", "Office", "Storage Unit"]),
  bedrooms: external_exports.coerce.number().int().min(0).max(20).default(1),
  toCountry: external_exports.enum(EUROPEAN_COUNTRIES),
  toCity: external_exports.string().min(2).max(120),
  preferredDate: external_exports.string().datetime({ offset: true }).or(external_exports.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional().nullable(),
  flexibleDate: external_exports.boolean().default(false),
  flexibleMonth: external_exports.string().max(32).optional().nullable(),
  needsPacking: external_exports.boolean().default(false),
  needsStorage: external_exports.boolean().default(false),
  notes: external_exports.string().max(2e3).optional().nullable()
}).refine((d) => d.flexibleDate || !!d.preferredDate, {
  message: "Either preferredDate or flexibleDate must be provided",
  path: ["preferredDate"]
});
app14.post("/european", zValidator("json", EuropeanEnquirySchema), async (c) => {
  const input = c.req.valid("json");
  let enquiry;
  try {
    enquiry = await db.europeanEnquiry.create({
      data: {
        customerName: input.customerName.trim(),
        customerEmail: input.customerEmail.toLowerCase().trim(),
        customerPhone: input.customerPhone.trim(),
        fromAddress: input.fromAddress.trim(),
        propertyType: input.propertyType,
        bedrooms: ["Office", "Storage Unit"].includes(input.propertyType) ? 0 : input.bedrooms,
        toCountry: input.toCountry,
        toCity: input.toCity.trim(),
        preferredDate: input.preferredDate ? new Date(input.preferredDate) : null,
        flexibleDate: input.flexibleDate,
        flexibleMonth: input.flexibleDate ? input.flexibleMonth ?? null : null,
        needsPacking: input.needsPacking,
        needsStorage: input.needsStorage,
        notes: input.notes?.trim() || null
      }
    });
  } catch (err2) {
    console.error("[enquiry] european create failed:", err2);
    return c.json(fail("Could not save your enquiry, please try again.", "DB_ERROR"), 500);
  }
  Promise.allSettled([
    sendEuropeanEnquiryConfirmation(enquiry),
    sendEuropeanEnquiryAdminAlert(enquiry),
    notifyNewEuropeanEnquiry({
      id: enquiry.id,
      customerName: enquiry.customerName,
      toCountry: enquiry.toCountry
    })
  ]).catch(() => {
  });
  return c.json(
    ok({
      success: true,
      enquiryId: enquiry.id,
      message: "Quote request received. We'll respond within 24 hours."
    }),
    201
  );
});
var enquiry_default = app14;

// src/routes/admin/bookings.ts
var app15 = new Hono2();
app15.use("*", requireAdmin);
app15.get(
  "/",
  zValidator(
    "query",
    external_exports.object({
      q: external_exports.string().optional(),
      status: external_exports.string().optional(),
      page: external_exports.coerce.number().int().min(1).default(1),
      limit: external_exports.coerce.number().int().min(1).max(100).default(20)
    })
  ),
  async (c) => {
    const { q, status, page, limit } = c.req.valid("query");
    const where = {
      ...status ? { status } : {},
      ...q ? {
        OR: [
          { reference: { contains: q, mode: "insensitive" } },
          { customerEmail: { contains: q, mode: "insensitive" } },
          { customerName: { contains: q, mode: "insensitive" } }
        ]
      } : {}
    };
    const [items, total] = await Promise.all([
      db.booking.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { driver: { include: { user: { select: { name: true } } } } }
      }),
      db.booking.count({ where })
    ]);
    return c.json(paginated(items, page, limit, total));
  }
);
app15.get("/:id", async (c) => {
  const booking = await db.booking.findUnique({
    where: { id: c.req.param("id") },
    include: {
      items: true,
      driver: { include: { user: true } },
      trackingEvents: { orderBy: { createdAt: "asc" } },
      statusHistory: { orderBy: { createdAt: "asc" } },
      job: true,
      conversation: { select: { id: true } }
    }
  });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  return c.json(ok(booking));
});
app15.patch(
  "/:id/status",
  zValidator(
    "json",
    external_exports.object({
      status: external_exports.enum([
        "PENDING",
        "CONFIRMED",
        "ASSIGNED",
        "IN_PROGRESS",
        "COMPLETED",
        "CANCELLED"
      ]),
      note: external_exports.string().optional()
    })
  ),
  async (c) => {
    const id = c.req.param("id");
    const userId = c.get("userId");
    const { status, note } = c.req.valid("json");
    const booking = await db.booking.findUnique({ where: { id } });
    if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.booking.update({ where: { id }, data: { status } });
    await recordStatusChange(id, booking.status, status, userId, "ADMIN", note);
    return c.json(ok(updated));
  }
);
app15.patch(
  "/:id/edit",
  zValidator(
    "json",
    external_exports.object({
      customerName: external_exports.string().optional(),
      customerEmail: external_exports.string().email().optional(),
      customerPhone: external_exports.string().optional(),
      scheduledAt: external_exports.string().datetime().optional(),
      selectedTimeSlot: external_exports.enum(["morning", "afternoon", "evening"]).optional(),
      notes: external_exports.string().optional()
    }).strict()
  ),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const updated = await db.booking.update({
      where: { id },
      data: {
        ...data,
        ...data.scheduledAt ? { scheduledAt: new Date(data.scheduledAt) } : {}
      }
    });
    return c.json(ok(updated));
  }
);
app15.post(
  "/:id/assign",
  zValidator("json", external_exports.object({ driverId: external_exports.string() })),
  async (c) => {
    const id = c.req.param("id");
    const { driverId } = c.req.valid("json");
    const driver = await db.driver.findUnique({ where: { id: driverId } });
    if (!driver) return c.json(fail("Driver not found", "NOT_FOUND"), 404);
    await db.$transaction([
      db.booking.update({ where: { id }, data: { driverId, status: "ASSIGNED" } }),
      db.driverJob.upsert({
        where: { bookingId: id },
        update: { driverId, status: "ACCEPTED", isPublic: false, acceptedAt: /* @__PURE__ */ new Date() },
        create: { bookingId: id, driverId, status: "ACCEPTED", isPublic: false, acceptedAt: /* @__PURE__ */ new Date() }
      })
    ]);
    return c.json(ok({ success: true }));
  }
);
app15.post(
  "/:id/cancel",
  zValidator("json", external_exports.object({ reason: external_exports.string().optional() })),
  async (c) => {
    const id = c.req.param("id");
    const userId = c.get("userId");
    const { reason } = c.req.valid("json");
    const result = await cancelBooking(id, { reason, actorId: userId, actorRole: "ADMIN" });
    return c.json(ok({ refundAmount: result.refundAmount }));
  }
);
app15.post("/:id/recalculate", async (c) => {
  const id = c.req.param("id");
  const booking = await db.booking.findUnique({ where: { id } });
  if (!booking) return c.json(fail("Not found", "NOT_FOUND"), 404);
  const newPrice = await calculatePriceForSlot(
    {
      serviceType: booking.serviceSlug,
      serviceVariant: booking.serviceVariant ?? void 0,
      distanceMiles: booking.distanceMiles,
      pickupFloor: booking.pickupFloor,
      pickupHasLift: booking.pickupHasLift,
      dropoffFloor: booking.dropoffFloor,
      dropoffHasLift: booking.dropoffHasLift,
      helpersCount: booking.helpersCount,
      needsPacking: booking.needsPacking,
      needsAssembly: booking.needsAssembly,
      pickupLat: booking.pickupLat,
      pickupLng: booking.pickupLng
    },
    booking.scheduledAt,
    booking.selectedTimeSlot ?? "afternoon"
  );
  return c.json(ok({ oldPrice: booking.price, newPrice }));
});
app15.get("/:id/tracking", async (c) => {
  const id = c.req.param("id");
  const events = await db.trackingEvent.findMany({
    where: { bookingId: id },
    orderBy: { createdAt: "asc" }
  });
  return c.json(ok({ events }));
});
app15.post(
  "/:id/tracking",
  zValidator(
    "json",
    external_exports.object({
      type: external_exports.enum(["status", "location", "note", "system"]).default("note"),
      message: external_exports.string().optional(),
      isInternal: external_exports.boolean().default(true),
      lat: external_exports.number().optional(),
      lng: external_exports.number().optional()
    })
  ),
  async (c) => {
    const id = c.req.param("id");
    const userId = c.get("userId");
    const data = c.req.valid("json");
    const event = await createTrackingEvent({
      bookingId: id,
      type: data.type,
      message: data.message,
      isInternal: data.isInternal,
      lat: data.lat,
      lng: data.lng,
      actorId: userId,
      actorRole: "ADMIN"
    });
    return c.json(ok(event), 201);
  }
);
var bookings_default = app15;

// src/routes/admin/drivers.ts
var import_bcryptjs3 = __toESM(require_bcryptjs());
var app16 = new Hono2();
app16.use("*", requireAdmin);
app16.get("/", async (c) => {
  const drivers = await db.driver.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, isActive: true, createdAt: true } },
      _count: { select: { bookings: true } }
    }
  });
  return c.json(ok({ drivers }));
});
var CreateDriverSchema = external_exports.object({
  name: external_exports.string().min(1),
  email: external_exports.string().email(),
  phone: external_exports.string().optional(),
  vanSize: external_exports.enum(["SMALL", "MEDIUM", "LARGE", "LUTON"]).default("MEDIUM")
});
function randomPassword(len = 12) {
  const a2 = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  return Array.from({ length: len }, () => a2[Math.floor(Math.random() * a2.length)]).join("");
}
app16.post("/", zValidator("json", CreateDriverSchema), async (c) => {
  const { name: name2, email, phone, vanSize } = c.req.valid("json");
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return c.json(fail("Email already in use", "EMAIL_TAKEN"), 409);
  const tempPassword = randomPassword();
  const hashed = await import_bcryptjs3.default.hash(tempPassword, 10);
  const user = await db.user.create({
    data: {
      name: name2,
      email,
      phone,
      password: hashed,
      role: "DRIVER",
      driver: { create: { vanSize } }
    },
    include: { driver: true }
  });
  await sendDriverWelcome({ email: user.email, name: user.name }, tempPassword).catch(() => {
  });
  return c.json(ok({ user, tempPassword }), 201);
});
app16.patch(
  "/:id",
  zValidator(
    "json",
    external_exports.object({
      name: external_exports.string().optional(),
      phone: external_exports.string().optional(),
      vanSize: external_exports.enum(["SMALL", "MEDIUM", "LARGE", "LUTON"]).optional()
    })
  ),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const driver = await db.driver.findUnique({ where: { id } });
    if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const userUpdate = {
      ...data.name !== void 0 ? { name: data.name } : {},
      ...data.phone !== void 0 ? { phone: data.phone } : {}
    };
    const driverUpdate = data.vanSize ? { vanSize: data.vanSize } : {};
    const [user, updatedDriver] = await db.$transaction([
      db.user.update({ where: { id: driver.userId }, data: userUpdate }),
      db.driver.update({ where: { id }, data: driverUpdate })
    ]);
    return c.json(ok({ user, driver: updatedDriver }));
  }
);
app16.post("/:id/reset-password", async (c) => {
  const id = c.req.param("id");
  const driver = await db.driver.findUnique({ where: { id }, include: { user: true } });
  if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);
  const tempPassword = randomPassword();
  const hashed = await import_bcryptjs3.default.hash(tempPassword, 10);
  await db.user.update({ where: { id: driver.userId }, data: { password: hashed } });
  await sendDriverWelcome({ email: driver.user.email, name: driver.user.name }, tempPassword).catch(
    () => {
    }
  );
  return c.json(ok({ success: true, tempPassword }));
});
app16.patch(
  "/:id/status",
  zValidator("json", external_exports.object({ isActive: external_exports.boolean() })),
  async (c) => {
    const id = c.req.param("id");
    const { isActive } = c.req.valid("json");
    const driver = await db.driver.findUnique({ where: { id } });
    if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const [u, d] = await db.$transaction([
      db.user.update({ where: { id: driver.userId }, data: { isActive } }),
      db.driver.update({ where: { id }, data: { isActive } })
    ]);
    return c.json(ok({ user: u, driver: d }));
  }
);
app16.get("/pay-config", async (c) => {
  const [pct, min] = await Promise.all([
    db.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_percentage" } } }),
    db.pricingConfig.findUnique({ where: { category_key: { category: "driver", key: "driver_pay_minimum" } } })
  ]);
  return c.json(ok({
    percentage: pct?.value ?? 60,
    minimum: min?.value ?? 25
  }));
});
app16.patch(
  "/pay-config",
  zValidator("json", external_exports.object({ percentage: external_exports.number().min(1).max(100).optional(), minimum: external_exports.number().min(0).optional() })),
  async (c) => {
    const { percentage, minimum } = c.req.valid("json");
    const ops = [];
    if (percentage !== void 0) {
      ops.push(db.pricingConfig.upsert({
        where: { category_key: { category: "driver", key: "driver_pay_percentage" } },
        update: { value: percentage },
        create: { category: "driver", key: "driver_pay_percentage", value: percentage, description: "Driver pay as % of customer price" }
      }));
    }
    if (minimum !== void 0) {
      ops.push(db.pricingConfig.upsert({
        where: { category_key: { category: "driver", key: "driver_pay_minimum" } },
        update: { value: minimum },
        create: { category: "driver", key: "driver_pay_minimum", value: minimum, description: "Minimum driver pay per job (\xA3)" }
      }));
    }
    await Promise.all(ops);
    return c.json(ok({ success: true }));
  }
);
app16.get("/:id/earnings", async (c) => {
  const id = c.req.param("id");
  const driver = await db.driver.findUnique({ where: { id } });
  if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);
  const startOfMonth = /* @__PURE__ */ new Date();
  startOfMonth.setUTCDate(1);
  startOfMonth.setUTCHours(0, 0, 0, 0);
  const [all, thisMonth, unpaid, paid] = await Promise.all([
    db.driverJob.aggregate({ where: { driverId: id }, _sum: { driverPay: true } }),
    db.driverJob.aggregate({ where: { driverId: id, createdAt: { gte: startOfMonth } }, _sum: { driverPay: true } }),
    db.driverJob.aggregate({ where: { driverId: id, driverPayStatus: "unpaid", status: "COMPLETED" }, _sum: { driverPay: true } }),
    db.driverJob.aggregate({ where: { driverId: id, driverPayStatus: "paid" }, _sum: { driverPay: true } })
  ]);
  return c.json(ok({
    total: all._sum.driverPay ?? 0,
    thisMonth: thisMonth._sum.driverPay ?? 0,
    unpaid: unpaid._sum.driverPay ?? 0,
    paid: paid._sum.driverPay ?? 0
  }));
});
app16.post("/:id/mark-paid", async (c) => {
  const id = c.req.param("id");
  const driver = await db.driver.findUnique({ where: { id } });
  if (!driver) return c.json(fail("Not found", "NOT_FOUND"), 404);
  const result = await db.driverJob.updateMany({
    where: { driverId: id, driverPayStatus: "unpaid", status: "COMPLETED" },
    data: { driverPayStatus: "paid" }
  });
  return c.json(ok({ success: true, markedPaid: result.count }));
});
var drivers_default = app16;

// src/routes/admin/pricing.ts
var app17 = new Hono2();
app17.use("*", requireAdmin);
app17.get("/", async (c) => {
  const rows = await db.pricingConfig.findMany({ orderBy: [{ category: "asc" }, { key: "asc" }] });
  const grouped = rows.reduce((acc, row) => {
    (acc[row.category] ??= []).push(row);
    return acc;
  }, {});
  return c.json(ok({ grouped, items: rows }));
});
app17.patch(
  "/:id",
  zValidator(
    "json",
    external_exports.object({
      value: external_exports.number(),
      label: external_exports.string().optional(),
      description: external_exports.string().optional()
    })
  ),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const exists = await db.pricingConfig.findUnique({ where: { id } });
    if (!exists) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.pricingConfig.update({ where: { id }, data });
    clearPricingCache();
    return c.json(ok(updated));
  }
);
app17.post(
  "/bulk-update",
  zValidator(
    "json",
    external_exports.object({
      category: external_exports.string().optional(),
      percentage: external_exports.number()
    })
  ),
  async (c) => {
    const { category, percentage } = c.req.valid("json");
    const factor = 1 + percentage / 100;
    const where = category ? { category } : {};
    const rows = await db.pricingConfig.findMany({ where });
    await db.$transaction(
      rows.map(
        (r) => db.pricingConfig.update({
          where: { id: r.id },
          data: { value: Math.round(r.value * factor * 100) / 100 }
        })
      )
    );
    clearPricingCache();
    return c.json(ok({ updated: rows.length }));
  }
);
app17.post("/reset", async (c) => {
  await db.$transaction([
    db.pricingConfig.deleteMany({}),
    db.pricingConfig.createMany({ data: DEFAULT_PRICING_CONFIG_ROWS })
  ]);
  clearPricingCache();
  return c.json(ok({ success: true, count: DEFAULT_PRICING_CONFIG_ROWS.length }));
});
var pricing_default2 = app17;

// src/routes/admin/jobs.ts
var app18 = new Hono2();
app18.use("*", requireAdmin);
app18.get(
  "/",
  zValidator(
    "query",
    external_exports.object({
      status: external_exports.string().optional(),
      isPublic: external_exports.enum(["true", "false"]).optional(),
      bookingId: external_exports.string().optional()
    })
  ),
  async (c) => {
    const { status, isPublic, bookingId } = c.req.valid("query");
    const jobs = await db.driverJob.findMany({
      where: {
        ...status ? { status } : {},
        ...isPublic !== void 0 ? { isPublic: isPublic === "true" } : {},
        ...bookingId ? { bookingId } : {}
      },
      include: {
        booking: { select: { id: true, reference: true, serviceName: true, scheduledAt: true, totalPrice: true, pickupAddress: true, dropoffAddress: true, customerName: true } },
        driver: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: "desc" }
    });
    return c.json(ok({ jobs }));
  }
);
app18.patch(
  "/:id",
  zValidator(
    "json",
    external_exports.object({
      isPublic: external_exports.boolean().optional(),
      status: external_exports.string().optional(),
      driverId: external_exports.string().nullable().optional()
    })
  ),
  async (c) => {
    const id = c.req.param("id");
    const data = c.req.valid("json");
    const job = await db.driverJob.findUnique({ where: { id } });
    if (!job) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.driverJob.update({
      where: { id },
      data
    });
    return c.json(ok(updated));
  }
);
app18.post("/publish/:bookingId", async (c) => {
  const bookingId = c.req.param("bookingId");
  const job = await publishToJobBoard(bookingId);
  return c.json(ok(job));
});
app18.post("/pause-all", async (c) => {
  const r = await db.driverJob.updateMany({
    where: { status: "AVAILABLE" },
    data: { isPublic: false }
  });
  return c.json(ok({ paused: r.count }));
});
app18.post("/resume-all", async (c) => {
  const r = await db.driverJob.updateMany({
    where: { status: "AVAILABLE" },
    data: { isPublic: true }
  });
  return c.json(ok({ resumed: r.count }));
});
app18.patch(
  "/:id/driver-pay",
  zValidator("json", external_exports.object({ driverPay: external_exports.number().min(0), driverPayNotes: external_exports.string().optional() })),
  async (c) => {
    const id = c.req.param("id");
    const { driverPay, driverPayNotes } = c.req.valid("json");
    const job = await db.driverJob.findUnique({ where: { id } });
    if (!job) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.driverJob.update({
      where: { id },
      data: { driverPay, ...driverPayNotes !== void 0 ? { driverPayNotes } : {} }
    });
    return c.json(ok(updated));
  }
);
var jobs_default = app18;

// src/routes/admin/content.ts
var app19 = new Hono2();
app19.use("*", requireAdmin);
app19.get(
  "/",
  zValidator("query", external_exports.object({ section: external_exports.string().optional() })),
  async (c) => {
    const { section } = c.req.valid("query");
    const items = await db.content.findMany({
      where: section ? { section } : {},
      orderBy: [{ section: "asc" }, { key: "asc" }]
    });
    return c.json(ok({ items }));
  }
);
app19.put(
  "/",
  zValidator(
    "json",
    external_exports.object({
      section: external_exports.string().min(1),
      key: external_exports.string().min(1),
      value: external_exports.string(),
      type: external_exports.enum(["text", "html", "markdown", "json"]).default("text")
    })
  ),
  async (c) => {
    const data = c.req.valid("json");
    const item = await db.content.upsert({
      where: { section_key: { section: data.section, key: data.key } },
      create: data,
      update: { value: data.value, type: data.type }
    });
    return c.json(ok(item));
  }
);
app19.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const exists = await db.content.findUnique({ where: { id } });
  if (!exists) return c.json(fail("Not found", "NOT_FOUND"), 404);
  await db.content.delete({ where: { id } });
  return c.json(ok({ success: true }));
});
var content_default = app19;

// src/routes/admin/analytics.ts
var app20 = new Hono2();
app20.use("*", requireAdmin);
function startOfDayUTC(d) {
  const x2 = new Date(d);
  x2.setUTCHours(0, 0, 0, 0);
  return x2;
}
app20.get("/overview", async (c) => {
  const now = /* @__PURE__ */ new Date();
  const today = startOfDayUTC(now);
  const startMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const [
    totalBookings,
    bookingsToday,
    bookingsMonth,
    paidAgg,
    paidTodayAgg,
    paidMonthAgg,
    activeDrivers,
    pendingJobs,
    completedJobs,
    activeVisitors
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { createdAt: { gte: today } } }),
    db.booking.count({ where: { createdAt: { gte: startMonth } } }),
    db.booking.aggregate({ _sum: { totalPrice: true }, where: { isPaid: true } }),
    db.booking.aggregate({
      _sum: { totalPrice: true },
      where: { isPaid: true, paidAt: { gte: today } }
    }),
    db.booking.aggregate({
      _sum: { totalPrice: true },
      where: { isPaid: true, paidAt: { gte: startMonth } }
    }),
    db.driver.count({ where: { isActive: true } }),
    db.driverJob.count({ where: { status: "AVAILABLE", isPublic: true } }),
    db.driverJob.count({ where: { status: "COMPLETED" } }),
    db.visitor.count({ where: { isActive: true } })
  ]);
  return c.json(
    ok({
      bookings: { total: totalBookings, today: bookingsToday, month: bookingsMonth },
      revenue: {
        total: paidAgg._sum.totalPrice ?? 0,
        today: paidTodayAgg._sum.totalPrice ?? 0,
        month: paidMonthAgg._sum.totalPrice ?? 0
      },
      drivers: { active: activeDrivers },
      jobs: { pending: pendingJobs, completed: completedJobs },
      visitors: { active: activeVisitors }
    })
  );
});
app20.get("/bookings-per-day", async (c) => {
  const since = new Date(Date.now() - 30 * 864e5);
  const rows = await db.$queryRawUnsafe(
    `SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::bigint AS count
     FROM "Booking" WHERE "createdAt" >= $1 GROUP BY day ORDER BY day ASC`,
    since
  );
  return c.json(ok(rows.map((r) => ({ day: r.day, count: Number(r.count) }))));
});
app20.get("/revenue-per-day", async (c) => {
  const since = new Date(Date.now() - 30 * 864e5);
  const rows = await db.$queryRawUnsafe(
    `SELECT date_trunc('day', "paidAt") AS day, COALESCE(SUM("totalPrice"), 0)::float AS revenue
     FROM "Booking" WHERE "isPaid" = true AND "paidAt" >= $1 GROUP BY day ORDER BY day ASC`,
    since
  );
  return c.json(ok(rows));
});
app20.get("/services", async (c) => {
  const rows = await db.booking.groupBy({
    by: ["serviceSlug", "serviceName"],
    _count: { _all: true },
    _sum: { totalPrice: true },
    orderBy: { _count: { serviceSlug: "desc" } }
  });
  return c.json(
    ok(
      rows.map((r) => ({
        slug: r.serviceSlug,
        name: r.serviceName,
        count: r._count._all,
        revenue: r._sum.totalPrice ?? 0
      }))
    )
  );
});
app20.get("/areas", async (c) => {
  const rows = await db.$queryRawUnsafe(
    `SELECT split_part("pickupPostcode", ' ', 1) AS area, COUNT(*)::bigint AS count
     FROM "Booking" GROUP BY area ORDER BY count DESC LIMIT 20`
  );
  return c.json(ok(rows.map((r) => ({ area: r.area, count: Number(r.count) }))));
});
app20.get("/drivers", async (c) => {
  const drivers = await db.driver.findMany({
    include: {
      user: { select: { name: true } },
      _count: { select: { bookings: { where: { status: "COMPLETED" } } } }
    }
  });
  return c.json(
    ok(
      drivers.map((d) => ({
        id: d.id,
        name: d.user.name,
        completedJobs: d._count.bookings
      }))
    )
  );
});
var analytics_default = app20;

// src/routes/admin/visitors.ts
var app21 = new Hono2();
app21.use("*", requireAdmin);
var STALE_MS = 2 * 60 * 1e3;
async function markStale() {
  const cutoff = new Date(Date.now() - STALE_MS);
  await db.visitor.updateMany({
    where: { isActive: true, lastActiveAt: { lt: cutoff } },
    data: { isActive: false }
  });
}
app21.get("/realtime", async (c) => {
  await markStale();
  const visitors = await db.visitor.findMany({
    where: { isActive: true },
    orderBy: { lastActiveAt: "desc" },
    take: 100,
    include: { events: { orderBy: { createdAt: "desc" }, take: 5 } }
  });
  return c.json(ok({ count: visitors.length, visitors }));
});
app21.get("/today", async (c) => {
  const start = /* @__PURE__ */ new Date();
  start.setUTCHours(0, 0, 0, 0);
  const [count, pageViews] = await Promise.all([
    db.visitor.count({ where: { createdAt: { gte: start } } }),
    db.visitor.aggregate({ _sum: { pageViews: true }, where: { createdAt: { gte: start } } })
  ]);
  return c.json(ok({ visitors: count, pageViews: pageViews._sum.pageViews ?? 0 }));
});
app21.get("/week", async (c) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = /* @__PURE__ */ new Date();
    dayStart.setUTCHours(0, 0, 0, 0);
    dayStart.setUTCDate(dayStart.getUTCDate() - i);
    const dayEnd = new Date(dayStart.getTime() + 864e5);
    const count = await db.visitor.count({
      where: { createdAt: { gte: dayStart, lt: dayEnd } }
    });
    days.push({ date: dayStart.toISOString().split("T")[0], count });
  }
  return c.json(ok({ visitors: days }));
});
app21.get("/month", async (c) => {
  const start = new Date(Date.now() - 30 * 864e5);
  const count = await db.visitor.count({ where: { createdAt: { gte: start } } });
  return c.json(ok({ visitors: count }));
});
var visitors_default = app21;

// src/routes/admin/notifications.ts
var app22 = new Hono2();
app22.use("*", requireAdmin);
app22.get("/", async (c) => {
  const userId = c.get("userId");
  const items = await db.notification.findMany({
    where: { userId },
    orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
    take: 50
  });
  return c.json(ok({ items }));
});
app22.post(
  "/read",
  zValidator(
    "json",
    external_exports.object({ ids: external_exports.array(external_exports.string()).optional(), all: external_exports.boolean().optional() })
  ),
  async (c) => {
    const userId = c.get("userId");
    const { ids, all } = c.req.valid("json");
    if (all) {
      const r2 = await db.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true }
      });
      return c.json(ok({ updated: r2.count }));
    }
    if (!ids || ids.length === 0) {
      return c.json(fail("ids or all required", "BAD_REQUEST"), 400);
    }
    const r = await db.notification.updateMany({
      where: { userId, id: { in: ids } },
      data: { isRead: true }
    });
    return c.json(ok({ updated: r.count }));
  }
);
app22.patch(
  "/:id",
  zValidator("json", external_exports.object({ isRead: external_exports.boolean() })),
  async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const note = await db.notification.findUnique({ where: { id } });
    if (!note || note.userId !== userId) {
      return c.json(fail("Not found", "NOT_FOUND"), 404);
    }
    const updated = await db.notification.update({
      where: { id },
      data: { isRead: c.req.valid("json").isRead }
    });
    return c.json(ok(updated));
  }
);
app22.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const note = await db.notification.findUnique({ where: { id } });
  if (!note || note.userId !== userId) {
    return c.json(fail("Not found", "NOT_FOUND"), 404);
  }
  await db.notification.delete({ where: { id } });
  return c.json(ok({ success: true }));
});
var notifications_default = app22;

// src/routes/admin/service-flags.ts
var app23 = new Hono2();
app23.use("*", requireAdmin);
var KNOWN_SLUGS2 = ["rubbish-removal", "same-day-delivery"];
var slugSchema = external_exports.enum(KNOWN_SLUGS2);
var modeSchema = external_exports.enum(["popup"]).nullable();
app23.get("/", async (c) => {
  const flags = await db.serviceFlag.findMany({
    where: { slug: { in: [...KNOWN_SLUGS2] } },
    orderBy: { slug: "asc" }
  });
  const bySlug = new Map(flags.map((f) => [f.slug, f]));
  const items = KNOWN_SLUGS2.map((slug) => {
    const existing = bySlug.get(slug);
    return existing ? {
      slug: existing.slug,
      enabled: existing.enabled,
      mode: existing.mode,
      updatedAt: existing.updatedAt
    } : { slug, enabled: true, mode: null, updatedAt: null };
  });
  return c.json(ok({ items }));
});
app23.put(
  "/:slug",
  zValidator(
    "json",
    external_exports.object({
      enabled: external_exports.boolean(),
      mode: modeSchema.optional()
    })
  ),
  async (c) => {
    const slugParam = c.req.param("slug");
    const parsed = slugSchema.safeParse(slugParam);
    if (!parsed.success) {
      return c.json(fail("Unknown service flag", "NOT_FOUND"), 404);
    }
    const slug = parsed.data;
    const { enabled, mode = null } = c.req.valid("json");
    const flag = await db.serviceFlag.upsert({
      where: { slug },
      create: { slug, enabled, mode },
      update: { enabled, mode }
    });
    return c.json(
      ok({ slug: flag.slug, enabled: flag.enabled, mode: flag.mode, updatedAt: flag.updatedAt })
    );
  }
);
var service_flags_default2 = app23;

// src/routes/admin/enquiries.ts
var app24 = new Hono2();
app24.use("*", requireAdmin);
var ALLOWED_STATUSES = ["new", "quoted", "accepted", "declined"];
app24.get(
  "/",
  zValidator(
    "query",
    external_exports.object({
      q: external_exports.string().optional(),
      status: external_exports.enum(ALLOWED_STATUSES).optional(),
      page: external_exports.coerce.number().int().min(1).default(1),
      limit: external_exports.coerce.number().int().min(1).max(100).default(20)
    })
  ),
  async (c) => {
    const { q, status, page, limit } = c.req.valid("query");
    const where = {
      ...status ? { status } : {},
      ...q ? {
        OR: [
          { customerName: { contains: q, mode: "insensitive" } },
          { customerEmail: { contains: q, mode: "insensitive" } },
          { customerPhone: { contains: q, mode: "insensitive" } },
          { toCountry: { contains: q, mode: "insensitive" } },
          { toCity: { contains: q, mode: "insensitive" } }
        ]
      } : {}
    };
    const [items, total] = await Promise.all([
      db.europeanEnquiry.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      db.europeanEnquiry.count({ where })
    ]);
    return c.json(paginated(items, page, limit, total));
  }
);
app24.get("/:id", async (c) => {
  const enquiry = await db.europeanEnquiry.findUnique({ where: { id: c.req.param("id") } });
  if (!enquiry) return c.json(fail("Not found", "NOT_FOUND"), 404);
  return c.json(ok(enquiry));
});
app24.patch(
  "/:id",
  zValidator(
    "json",
    external_exports.object({
      status: external_exports.enum(ALLOWED_STATUSES).optional(),
      quotedPrice: external_exports.number().min(0).max(1e6).optional().nullable(),
      adminNotes: external_exports.string().max(2e3).optional().nullable()
    })
  ),
  async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");
    const existing = await db.europeanEnquiry.findUnique({ where: { id } });
    if (!existing) return c.json(fail("Not found", "NOT_FOUND"), 404);
    const updated = await db.europeanEnquiry.update({
      where: { id },
      data: {
        ...body.status !== void 0 ? { status: body.status } : {},
        ...body.quotedPrice !== void 0 ? { quotedPrice: body.quotedPrice } : {},
        ...body.adminNotes !== void 0 ? { adminNotes: body.adminNotes } : {}
      }
    });
    return c.json(ok(updated));
  }
);
app24.post("/:id/send-quote", async (c) => {
  const id = c.req.param("id");
  const enquiry = await db.europeanEnquiry.findUnique({ where: { id } });
  if (!enquiry) return c.json(fail("Not found", "NOT_FOUND"), 404);
  if (enquiry.quotedPrice == null || enquiry.quotedPrice <= 0) {
    return c.json(fail("Set a quoted price before sending", "NO_QUOTE"), 400);
  }
  try {
    await sendEuropeanEnquiryQuote({
      customerEmail: enquiry.customerEmail,
      customerName: enquiry.customerName,
      toCountry: enquiry.toCountry,
      toCity: enquiry.toCity,
      quotedPrice: enquiry.quotedPrice,
      adminNotes: enquiry.adminNotes
    });
  } catch (err2) {
    console.error("[admin/enquiries] send-quote email failed:", err2);
    return c.json(fail("Could not send the quote email", "EMAIL_ERROR"), 500);
  }
  const updated = await db.europeanEnquiry.update({
    where: { id },
    data: { status: "quoted", quoteSentAt: /* @__PURE__ */ new Date() }
  });
  return c.json(ok(updated));
});
var enquiries_default = app24;

// src/app.ts
var app25 = new Hono2();
app25.use("*", logger());
app25.use(
  "*",
  cors({
    origin: [...ALLOWED_ORIGINS],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "stripe-signature"]
  })
);
app25.onError(errorHandler2);
app25.route("/", health_default);
app25.route("/auth", auth_default);
app25.route("/booking", booking_default);
app25.route("/pricing", pricing_default);
app25.route("/items", items_default);
app25.route("/geocode", geocode_default);
app25.route("/stripe", stripe_default);
app25.route("/driver", driver_default);
app25.route("/tracking", tracking_default);
app25.route("/chat", chat_default);
app25.route("/chat", bookingMessagesApp);
app25.route("/weather", weather_default);
app25.route("/service-flags", service_flags_default);
app25.route("/waitlist", waitlist_default);
app25.route("/enquiry", enquiry_default);
app25.route("/admin/bookings", bookings_default);
app25.route("/admin/drivers", drivers_default);
app25.route("/admin/pricing", pricing_default2);
app25.route("/admin/jobs", jobs_default);
app25.route("/admin/content", content_default);
app25.route("/admin/analytics", analytics_default);
app25.route("/admin/visitors", visitors_default);
app25.route("/admin/notifications", notifications_default);
app25.route("/admin/service-flags", service_flags_default2);
app25.route("/admin/enquiries", enquiries_default);
var app_default = app25;

// src/handler.ts
var config = {
  api: {
    bodyParser: false
  }
};
async function handler(req, res) {
  const host = req.headers["host"] ?? "localhost";
  const url = `https://${host}${req.url ?? "/"}`;
  let body = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });
  }
  const request = new Request(url, {
    method: req.method ?? "GET",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: req.headers,
    body: body && body.length > 0 ? body : null
  });
  const response = await app_default.fetch(request);
  res.statusCode = response.status;
  response.headers.forEach((value, key3) => res.setHeader(key3, value));
  res.end(Buffer.from(await response.arrayBuffer()));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
/*! Bundled license information:

bcryptjs/dist/bcrypt.js:
  (**
   * @license bcrypt.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
   * Released under the Apache License, Version 2.0
   * see: https://github.com/dcodeIO/bcrypt.js for details
   *)

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

@neondatabase/serverless/index.mjs:
  (*! Bundled license information:
  
  ieee754/index.js:
    (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)
  
  buffer/index.js:
    (*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <https://feross.org>
     * @license  MIT
     *)
  *)
*/
