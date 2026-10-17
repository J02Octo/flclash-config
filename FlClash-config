/*
 * Kelee -> FlClash Override
 * Source template: Clash_Sample_Config_By_iKeLee.yaml
 *
 * 用途：
 * 将 iKeLee Mihomo 配置的 DNS、策略组、Rule Providers、
 * Rules 等逻辑应用到 FlClash 已有机场订阅。
 *
 * 注意：
 * 1. 不包含任何机场订阅 URL。
 * 2. 节点直接读取 FlClash 当前机场订阅的 config.proxies。
 * 3. 不要与 Proxy-override 同时启用。
 */

function main(config) {
  config = config || {};

  const proxies = Array.isArray(config.proxies)
    ? config.proxies
    : [];

  const nodeNames = proxies
    .map(p => p && p.name)
    .filter(
      name =>
        typeof name === "string" &&
        name.length > 0
    );

  if (nodeNames.length === 0) {
    throw new Error(
      "Kelee Override: 当前订阅没有可用 proxies 节点，请确认机场订阅已经正常加载。"
    );
  }


  /* =========================
   * 基础 Mihomo 设置
   * ========================= */

  config["unified-delay"] = true;
  config["geodata-mode"] = false;
  config["geodata-loader"] = "standard";

  config["geo-auto-update"] = true;
  config["geo-update-interval"] = 24;

  config["tcp-concurrent"] = true;

  config["find-process-mode"] = "strict";

  config["global-client-fingerprint"] = "chrome";

  config["allow-lan"] = true;

  config["mode"] = "rule";

  config["log-level"] = "info";

  config["ipv6"] = true;

  config["udp"] = true;


  /* =========================
   * Geo 数据
   * ========================= */

  config["geox-url"] = {
    mmdb:
      "https://geodata.kelee.one/Country-Masaiki.mmdb",

    asn:
      "https://geodata.kelee.one/GeoLite2-ASN-P3TERX.mmdb"
  };


  /* =========================
   * Profile
   * ========================= */

  config.profile = {
    ...(config.profile || {}),

    "store-selected": true,

    "store-fake-ip": true
  };


  /* =========================
   * Sniffer
   * ========================= */

  config.sniffer = {
    enable: true,

    "force-dns-mapping": true,

    "parse-pure-ip": true,

    "override-destination": true,

    sniff: {
      HTTP: {
        ports: [
          "80",
          "8080-8880"
        ],

        "override-destination": true
      },

      TLS: {
        ports: [
          "443",
          "8443"
        ]
      },

      QUIC: {
        ports: [
          "443",
          "8443"
        ]
      }
    },

    "force-domain": [
      "+.v2ex.com"
    ],

    "skip-domain": [
      "Mijia Cloud"
    ]
  };


  /* =========================
   * TUN
   * ========================= */

  config.tun = {
    ...(config.tun || {}),

    enable: true,

    stack: "system",

    "dns-hijack": [
      "any:53"
    ],

    "auto-route": true,

    "auto-detect-interface": true
  };


  /* =========================
   * DNS
   * ========================= */

  config.dns = {
    enable: true,

    "prefer-h3": true,

    listen:
      "0.0.0.0:1053",

    ipv6: false,

    "enhanced-mode":
      "fake-ip",

    "fake-ip-range":
      "28.0.0.1/8",

    "fake-ip-filter": [
      "*",
      "+.lan"
    ],

    "default-nameserver": [
      "223.5.5.5",
      "223.6.6.6"
    ],

    nameserver: [
      "https://223.5.5.5/dns-query",
      "https://223.6.6.6/dns-query"
    ]
  };


  /* =========================
   * 节点过滤
   * ========================= */

  const EXCLUDE_REGION =
    /(回国|校园|游戏|🎮|\bGAME\b)/i;


  const EXCLUDE_ALL =
    /(群|邀请|返利|循环|官网|客服|网站|网址|获取|订阅|流量|到期|机场|下次|版本|官址|备用|过期|已用|联系|邮箱|工单|贩卖|通知|倒卖|防止|国内|地址|频道|无法|说明|使用|提示|特别|访问|支持|教程|关注|更新|作者|加入|超时|收藏|福利|好友|失联|\b(USE|USED|TOTAL|EXPIRE|EMAIL|Panel|Channel|Author|Traffic)\d*\b|\d{4}-\d{2}-\d{2}|\dG)/i;


  /* =========================
   * 国家/地区节点识别
   * ========================= */

  const regionPatterns = {

    hk:
      /(🇭🇰|香港|\b(HK|HKG|Hong)\d*\b)/i,

    tw:
      /(🇹🇼|台湾|\b(TW|TWN|Tai|Taiwan)\d*\b)/i,

    jp:
      /(🇯🇵|日本|川日|东京|大阪|泉日|埼玉|\b(JP|JPN|Japan)\d*\b)/i,

    kr:
      /(🇰🇷|韩国|韓|首尔|\b(KR|KOR|Korea)\d*\b)/i,

    sg:
      /(🇸🇬|新加坡|狮|\b(SG|SGP|Singapore)\d*\b)/i,

    us:
      /(🇺🇸|美国|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|拉斯维加斯|洛杉矶|圣何塞|圣克拉拉|西雅图|芝加哥|\b(US|USA|United States)\d*\b)/i,

    uk:
      /(🇬🇧|英国|伦敦|\b(UK|GBR|United Kingdom)\d*\b)/i,

    fr:
      /(🇫🇷|法国|\b(FR|FRA|France)\d*\b)/i,

    de:
      /(🇩🇪|德国|\b(DE|DEU|Germany)\d*\b)/i
  };


  /* =========================
   * 去除机场公告类节点
   * ========================= */

  const allNodes =
    nodeNames.filter(
      n => !EXCLUDE_ALL.test(n)
    );


  const region = key =>
    nodeNames.filter(
      n =>
        regionPatterns[key].test(n) &&
        !EXCLUDE_REGION.test(n)
    );


  const hk = region("hk");
  const tw = region("tw");
  const jp = region("jp");
  const kr = region("kr");
  const sg = region("sg");
  const us = region("us");
  const uk = region("uk");
  const fr = region("fr");
  const de = region("de");


  /*
   * 如果机场没有某个地区节点，
   * 防止生成空的 url-test 策略组。
   */

  const usable = arr =>
    arr.length
      ? arr
      : allNodes;


  /* =========================
   * URL-Test 模板
   * ========================= */

  const urlTest =
    (name, nodes) => ({

      name,

      type:
        "url-test",

      proxies:
        usable(nodes),

      interval:
        6,

      tolerance:
        20,

      lazy:
        true,

      url:
        "http://www.google.com/blank.html",

      "disable-udp":
        false,

      timeout:
        2000,

      "max-failed-times":
        3,

      hidden:
        true
    });


  const fallbackNames = [

    "香港自动策略",

    "台湾自动策略",

    "日本自动策略",

    "韩国自动策略",

    "新国自动策略",

    "美国自动策略",

    "英国自动策略",

    "法国自动策略",

    "德国自动策略"
  ];


  /* =========================
   * Kelee 策略组
   * ========================= */

  config["proxy-groups"] = [

    {
      name:
        "游戏选择",

      type:
        "select",

      proxies: [
        "PASS",
        "DIRECT",
        ...allNodes
      ]
    },


    {
      name:
        "AI",

      type:
        "select",

      proxies:
        allNodes
    },


    {
      name:
        "TikTok",

      type:
        "select",

      proxies:
        allNodes
    },


    {
      name:
        "Speedtest国际",

      type:
        "select",

      proxies: [
        "PASS",
        "DIRECT",
        ...allNodes
      ]
    },


    {
      name:
        "Netflix",

      type:
        "select",

      proxies:
        allNodes
    },


    {
      name:
        "兜底后备策略",

      type:
        "fallback",

      proxies:
        fallbackNames,

      interval:
        6,

      lazy:
        true,

      url:
        "http://www.google.com/blank.html",

      "disable-udp":
        false,

      timeout:
        2000,

      "max-failed-times":
        3
    },


    urlTest(
      "香港自动策略",
      hk
    ),

    urlTest(
      "台湾自动策略",
      tw
    ),

    urlTest(
      "日本自动策略",
      jp
    ),

    urlTest(
      "韩国自动策略",
      kr
    ),

    urlTest(
      "新国自动策略",
      sg
    ),

    urlTest(
      "美国自动策略",
      us
    ),

    urlTest(
      "英国自动策略",
      uk
    ),

    urlTest(
      "法国自动策略",
      fr
    ),

    urlTest(
      "德国自动策略",
      de
    )
  ];


  /* =========================
   * Rule Provider 模板
   * ========================= */

  const rp =
    (path, url) => ({

      type:
        "http",

      behavior:
        "classical",

      interval:
        3600,

      format:
        "yaml",

      proxy:
        "DIRECT",

      path,

      url
    });


  /* =========================
   * Kelee Rule Providers
   * ========================= */

  config["rule-providers"] = {

    LAN:
      rp(
        "./rules/Lan.yaml",
        "https://kelee.one/Tool/Clash/Rule/LAN_SPLITTER.yaml"
      ),


    Direct:
      rp(
        "./rules/Direct.yaml",
        "https://kelee.one/Tool/Clash/Rule/Direct.yaml"
      ),


    Proxy:
      rp(
        "./rules/Proxy.yaml",
        "https://kelee.one/Tool/Clash/Rule/Proxy.yaml"
      ),


    AI:
      rp(
        "./rules/AI.yaml",
        "https://kelee.one/Tool/Clash/Rule/AI.yaml"
      ),


    TikTok:
      rp(
        "./rules/TikTok.yaml",
        "https://kelee.one/Tool/Clash/Rule/TikTok.yaml"
      ),


    SpeedtestIntl:
      rp(
        "./rules/SpeedtestInternational.yaml",
        "https://kelee.one/Tool/Clash/Rule/SpeedtestInternational.yaml"
      ),


    Game:
      rp(
        "./rules/Game.yaml",
        "https://kelee.one/Tool/Clash/Rule/Game.yaml"
      ),


    Netflix:
      rp(
        "./rules/Netflix.yaml",
        "https://rule.kelee.one/Clash/Netflix.yaml"
      ),


    ESET_China:
      rp(
        "./rules/ESET_China.yaml",
        "https://kelee.one/Tool/Clash/Rule/ESET_China.yaml"
      )
  };


  /* =========================
   * Kelee Rules
   * ========================= */

  config.rules = [

    "RULE-SET,LAN,DIRECT",

    "RULE-SET,Direct,DIRECT",

    "RULE-SET,Proxy,兜底后备策略",

    "RULE-SET,AI,AI",

    "RULE-SET,TikTok,TikTok",

    "RULE-SET,SpeedtestIntl,Speedtest国际",

    "RULE-SET,Game,游戏选择",

    "RULE-SET,Netflix,Netflix",

    "RULE-SET,ESET_China,DIRECT",

    "GEOIP,CN,DIRECT",

    "MATCH,兜底后备策略"
  ];


  /*
   * 不复制 Kelee 示例配置中的 proxy-providers。
   *
   * 节点继续由：
   *
   * FlClash
   *      ↓
   * 你的机场订阅
   *
   * 提供。
   */

  return config;
}
