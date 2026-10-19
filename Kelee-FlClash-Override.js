/*
 * Kelee-FlClash-Override
 *
 * Based on iKeLee / ProxyResource:
 * https://github.com/luestr/ProxyResource
 *
 * Original Mihomo configuration:
 * Tool/Clash/Config/Clash_Sample_Config_By_iKeLee.yaml
 *
 * Thanks to iKeLee (Kelee) for maintaining and sharing
 * the original configuration and rule resources.
 *
 * This is an unofficial FlClash Override adaptation.
 * It is not affiliated with or maintained by iKeLee.
 */

function main(config) {
  // ============================================================
  // 1. 获取 FlClash 当前订阅中的节点
  // ============================================================

  const proxies = Array.isArray(config.proxies) ? config.proxies : [];

  if (proxies.length === 0) {
    throw new Error(
      "Kelee-FlClash-Override：当前配置中没有找到任何代理节点，请先确认机场订阅已经正常加载。"
    );
  }

  const proxyNames = proxies
    .map((proxy) => proxy && proxy.name)
    .filter((name) => typeof name === "string" && name.trim().length > 0);


  // ============================================================
  // 2. 节点过滤
  // ============================================================

  // 排除游戏、回国、校园等特殊节点
  const EXCLUDE_REGION =
    /(回国|校园|游戏|🎮|\bGAME\b)/i;

  // 排除机场公告、流量提示、到期提醒等非正常代理节点
  const EXCLUDE_ALL =
    /(官网|网站|网址|剩余|流量|套餐|到期|过期|时间|重置|更新|公告|通知|提示|客服|群组|频道|订阅|续费|倍率|Traffic|Expire|Website|Official|剩余流量|距离下次重置)/i;

  const allNodes = proxyNames.filter(
    (name) =>
      !EXCLUDE_ALL.test(name) &&
      !EXCLUDE_REGION.test(name)
  );


  if (allNodes.length === 0) {
    throw new Error(
      "Kelee-FlClash-Override：过滤后没有可用代理节点，请检查机场节点名称。"
    );
  }


  // ============================================================
  // 3. 国家 / 地区节点识别
  // ============================================================

  const REGION_REGEX = {
    hk: /(香港|港|HK|Hong\s*Kong|HongKong|🇭🇰)/i,

    tw: /(台湾|臺灣|台灣|台北|TW|Taiwan|Taipei|🇹🇼)/i,

    jp: /(日本|东京|東京|大阪|JP|Japan|Tokyo|Osaka|🇯🇵)/i,

    kr: /(韩国|韓國|首尔|首爾|KR|Korea|Seoul|🇰🇷)/i,

    sg: /(新加坡|狮城|獅城|新国|SG|Singapore|🇸🇬)/i,

    us: /(美国|美國|洛杉矶|洛杉磯|西雅图|西雅圖|圣何塞|聖何塞|纽约|紐約|达拉斯|達拉斯|US|USA|United\s*States|America|Los\s*Angeles|Seattle|San\s*Jose|New\s*York|Dallas|🇺🇸)/i,

    uk: /(英国|英國|伦敦|倫敦|UK|United\s*Kingdom|Britain|London|🇬🇧)/i,

    fr: /(法国|法國|巴黎|FR|France|Paris|🇫🇷)/i,

    de: /(德国|德國|法兰克福|法蘭克福|DE|Germany|Frankfurt|🇩🇪)/i,
  };


  function region(regex) {
    return allNodes.filter((name) => regex.test(name));
  }


  const hkNodes = region(REGION_REGEX.hk);
  const twNodes = region(REGION_REGEX.tw);
  const jpNodes = region(REGION_REGEX.jp);
  const krNodes = region(REGION_REGEX.kr);
  const sgNodes = region(REGION_REGEX.sg);
  const usNodes = region(REGION_REGEX.us);
  const ukNodes = region(REGION_REGEX.uk);
  const frNodes = region(REGION_REGEX.fr);
  const deNodes = region(REGION_REGEX.de);


  // 自动策略不能出现空节点组。
  // 如果机场没有该地区节点，则回退到全部可用节点。
  function usable(nodes) {
    return nodes.length > 0 ? nodes : allNodes;
  }


  // ============================================================
  // 4. Mihomo 基础设置
  // ============================================================

  config["unified-delay"] = true;

  config["geodata-mode"] = false;

  config["geodata-loader"] = "standard";

  config["geo-auto-update"] = true;

  config["geo-update-interval"] = 24;

  config["tcp-concurrent"] = true;

  config["find-process-mode"] = "strict";

  config["global-client-fingerprint"] = "chrome";

  config["allow-lan"] = true;

  config.mode = "rule";

  config["log-level"] = "info";

  config.ipv6 = true;

  config.udp = true;


  // ============================================================
  // 5. GeoData
  // ============================================================

  config["geox-url"] = {
    mmdb:
      "https://geodata.kelee.one/Country-Masaiki.mmdb",

    asn:
      "https://geodata.kelee.one/GeoLite2-ASN-P3TERX.mmdb",
  };


  // ============================================================
  // 6. Profile
  // ============================================================

  config.profile = {
    "store-selected": true,
    "store-fake-ip": true,
  };


  // ============================================================
  // 7. Sniffer
  // ============================================================

  config.sniffer = {
    enable: true,

    "force-dns-mapping": true,

    "parse-pure-ip": true,

    "override-destination": true,

    sniff: {
      HTTP: {
        ports: [
          80,
          "8080-8880",
        ],

        "override-destination": true,
      },

      TLS: {
        ports: [
          443,
          8443,
        ],
      },

      QUIC: {
        ports: [
          443,
          8443,
        ],
      },
    },
  };


  // ============================================================
  // 8. TUN
  // ============================================================

  config.tun = {
    enable: true,

    stack: "system",

    "dns-hijack": [
      "any:53",
    ],

    "auto-route": true,

    "auto-detect-interface": true,
  };


  // ============================================================
  // 9. DNS
  // ============================================================

  config.dns = {
    enable: true,

    "prefer-h3": true,

    listen: "0.0.0.0:1053",

    ipv6: false,

    "enhanced-mode": "fake-ip",

    "fake-ip-range": "28.0.0.1/8",

    "fake-ip-filter": [
      "*",
      "+.lan",
    ],

    "default-nameserver": [
      "223.5.5.5",
      "223.6.6.6",
    ],

    nameserver: [
      "https://223.5.5.5/dns-query",
      "https://223.6.6.6/dns-query",
    ],
  };


  // ============================================================
  // 10. Proxy Group 创建工具
  // ============================================================

  const TEST_URL =
    "https://www.google.com/generate_204";


  // 自动测速策略
  function autoGroup(name, nodes) {
    return {
      name: name,

      type: "url-test",

      proxies: usable(nodes),

      url: TEST_URL,

      interval: 6,

      tolerance: 20,

      lazy: true,

      timeout: 2000,

      "max-failed-times": 3,

      hidden: true,
    };
  }


  // 手动节点选择策略
  function manualGroup(name, nodes) {
    return {
      name: name,

      type: "select",

      // 如果机场确实没有这个地区节点，
      // 使用全部节点作为兼容回退，避免空策略组。
      proxies: usable(nodes),
    };
  }


  // ============================================================
  // 11. 国家 / 地区自动策略
  // ============================================================

  const autoGroups = [

    autoGroup(
      "香港自动策略",
      hkNodes
    ),

    autoGroup(
      "台湾自动策略",
      twNodes
    ),

    autoGroup(
      "日本自动策略",
      jpNodes
    ),

    autoGroup(
      "韩国自动策略",
      krNodes
    ),

    autoGroup(
      "新国自动策略",
      sgNodes
    ),

    autoGroup(
      "美国自动策略",
      usNodes
    ),

    autoGroup(
      "英国自动策略",
      ukNodes
    ),

    autoGroup(
      "法国自动策略",
      frNodes
    ),

    autoGroup(
      "德国自动策略",
      deNodes
    ),
  ];


  // ============================================================
  // 12. 国家 / 地区手动策略
  //
  // 这里就是本版本新增的部分。
  //
  // 例如：
  //
  // 香港手动策略
  //   ├── 香港01
  //   ├── 香港02
  //   └── 香港03
  //
  // ============================================================

  const manualGroups = [

    manualGroup(
      "香港手动策略",
      hkNodes
    ),

    manualGroup(
      "台湾手动策略",
      twNodes
    ),

    manualGroup(
      "日本手动策略",
      jpNodes
    ),

    manualGroup(
      "韩国手动策略",
      krNodes
    ),

    manualGroup(
      "新国手动策略",
      sgNodes
    ),

    manualGroup(
      "美国手动策略",
      usNodes
    ),

    manualGroup(
      "英国手动策略",
      ukNodes
    ),

    manualGroup(
      "法国手动策略",
      frNodes
    ),

    manualGroup(
      "德国手动策略",
      deNodes
    ),
  ];


  // ============================================================
  // 13. 兜底策略
  //
  // 顺序严格按照：
  //
  // 香港自动
  // 台湾自动
  // 日本自动
  // ...
  // 香港手动
  // 台湾手动
  // 日本手动
  // ...
  //
  // ============================================================

  const fallbackSelector = {
    name: "兜底后备策略",

    type: "select",

    proxies: [

      // ====================
      // 自动策略
      // ====================

      "香港自动策略",

      "台湾自动策略",

      "日本自动策略",

      "韩国自动策略",

      "新国自动策略",

      "美国自动策略",

      "英国自动策略",

      "法国自动策略",

      "德国自动策略",


      // ====================
      // 手动策略
      // ====================

      "香港手动策略",

      "台湾手动策略",

      "日本手动策略",

      "韩国手动策略",

      "新国手动策略",

      "美国手动策略",

      "英国手动策略",

      "法国手动策略",

      "德国手动策略",
    ],
  };


  // ============================================================
  // 14. 特殊业务策略
  // ============================================================

  const specialGroups = [

    {
      name: "游戏选择",

      type: "select",

      proxies: [
        "PASS",
        "DIRECT",
        ...allNodes,
      ],
    },


    {
      name: "AI",

      type: "select",

      proxies: [
        ...allNodes,
      ],
    },


    {
      name: "TikTok",

      type: "select",

      proxies: [
        ...allNodes,
      ],
    },


    {
      name: "Speedtest国际",

      type: "select",

      proxies: [
        "PASS",
        "DIRECT",
        ...allNodes,
      ],
    },


    {
      name: "Netflix",

      type: "select",

      proxies: [
        ...allNodes,
      ],
    },
  ];


  // ============================================================
  // 15. 写入 Proxy Groups
  //
  // 注意顺序：
  //
  // 特殊业务策略
  // ↓
  // 兜底策略
  // ↓
  // 国家自动策略
  // ↓
  // 国家手动策略
  //
  // ============================================================

  config["proxy-groups"] = [

    ...specialGroups,

    fallbackSelector,

    ...autoGroups,

    ...manualGroups,
  ];


  // ============================================================
  // 16. Rule Provider 创建工具
  // ============================================================

  function ruleProvider(path, url) {
    return {
      type: "http",

      behavior: "classical",

      path: path,

      url: url,

      interval: 3600,

      format: "yaml",

      proxy: "DIRECT",
    };
  }


  // ============================================================
  // 17. Rule Providers
  // ============================================================

  config["rule-providers"] = {

    LAN: ruleProvider(
      "./ruleset/LAN.yaml",
      "https://kelee.one/Tool/Clash/Rule/LAN_SPLITTER.yaml"
    ),


    Direct: ruleProvider(
      "./ruleset/Direct.yaml",
      "https://kelee.one/Tool/Clash/Rule/Direct.yaml"
    ),


    Proxy: ruleProvider(
      "./ruleset/Proxy.yaml",
      "https://kelee.one/Tool/Clash/Rule/Proxy.yaml"
    ),


    AI: ruleProvider(
      "./ruleset/AI.yaml",
      "https://kelee.one/Tool/Clash/Rule/AI.yaml"
    ),


    TikTok: ruleProvider(
      "./ruleset/TikTok.yaml",
      "https://kelee.one/Tool/Clash/Rule/TikTok.yaml"
    ),


    SpeedtestIntl: ruleProvider(
      "./ruleset/SpeedtestInternational.yaml",
      "https://kelee.one/Tool/Clash/Rule/SpeedtestInternational.yaml"
    ),


    Game: ruleProvider(
      "./ruleset/Game.yaml",
      "https://kelee.one/Tool/Clash/Rule/Game.yaml"
    ),


    Netflix: ruleProvider(
      "./ruleset/Netflix.yaml",
      "https://rule.kelee.one/Clash/Netflix.yaml"
    ),


    ESET_China: ruleProvider(
      "./ruleset/ESET_China.yaml",
      "https://kelee.one/Tool/Clash/Rule/ESET_China.yaml"
    ),
  };


  // ============================================================
  // 18. Rules
  // ============================================================

  config.rules = [

    // 局域网
    "RULE-SET,LAN,DIRECT",


    // 国内 / 直连
    "RULE-SET,Direct,DIRECT",


    // 普通代理流量
    "RULE-SET,Proxy,兜底后备策略",


    // AI
    "RULE-SET,AI,AI",


    // TikTok
    "RULE-SET,TikTok,TikTok",


    // 国际测速
    "RULE-SET,SpeedtestIntl,Speedtest国际",


    // 游戏
    "RULE-SET,Game,游戏选择",


    // Netflix
    "RULE-SET,Netflix,Netflix",


    // ESET 中国
    "RULE-SET,ESET_China,DIRECT",


    // 中国 IP
    "GEOIP,CN,DIRECT",


    // 所有未匹配流量
    "MATCH,兜底后备策略",
  ];


  // ============================================================
  // 19. 返回最终配置
  // ============================================================

  return config;
}
