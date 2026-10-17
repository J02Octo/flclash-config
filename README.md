# Kelee-FlClash-Override

> 将 **iKeLee Mihomo 配置**适配为可用于 **FlClash** 的 JavaScript Override 脚本。

在保留 FlClash 原有机场订阅及节点更新方式的基础上，应用 iKeLee 配置中的策略组、DNS、Rule Providers 与分流规则。

无需将机场订阅地址写入脚本。

---

## ✨ 功能

- 🌐 直接使用 FlClash 当前机场订阅节点
- 🔄 不影响机场订阅正常更新
- 🚀 自动识别不同国家/地区节点
- 🤖 AI 独立分流
- 🎵 TikTok 独立分流
- 🎬 Netflix 独立分流
- 🎮 游戏独立分流
- 📶 Speedtest 国际测速分流
- 🧩 使用 iKeLee 远程 Rule Providers
- 🛡️ 支持 Mihomo DNS / Sniffer / TUN 配置
- 🔒 脚本中不保存机场订阅 URL 或 Token

---

## 🌍 策略组

当前 Override 会根据机场节点名称自动生成以下策略：

| 类型 | 策略 |
| --- | --- |
| 🇭🇰 | 香港自动策略 |
| 🇹🇼 | 台湾自动策略 |
| 🇯🇵 | 日本自动策略 |
| 🇰🇷 | 韩国自动策略 |
| 🇸🇬 | 新国自动策略 |
| 🇺🇸 | 美国自动策略 |
| 🇬🇧 | 英国自动策略 |
| 🇫🇷 | 法国自动策略 |
| 🇩🇪 | 德国自动策略 |
| 🤖 | AI |
| 🎵 | TikTok |
| 🎬 | Netflix |
| 🎮 | 游戏选择 |
| 📶 | Speedtest国际 |
| 🔀 | 兜底后备策略 |

如果机场不存在某个国家或地区的节点，Override 会使用可用节点池作为兼容回退，避免生成空策略组导致配置加载失败。

---

## 📥 使用方法

### 1. 添加机场订阅

首先在 FlClash 中正常添加自己的机场订阅。

无需修改机场订阅，也无需将订阅 URL 填写到本项目脚本中。

### 2. 导入 Override

在 FlClash 中进入：

**工具 → 进阶设置 → 脚本**

选择通过 URL 导入脚本。

脚本地址：

```text
https://raw.githubusercontent.com/J02Octo/flclash-config/main/Kelee-FlClash-Override.js
```

### 3. 应用 Override

进入：

**配置 → 选择机场订阅 → 覆写**

选择：

**Kelee-FlClash-Override**

然后刷新机场订阅并重新加载配置。

### 4. 检查是否生效

成功加载后，在 FlClash 的代理页面应该可以看到：

`香港自动策略`、`台湾自动策略`、`日本自动策略`、`新国自动策略`、`美国自动策略`、`AI`、`TikTok`、`Netflix`、`游戏选择`、`Speedtest国际` 等策略组。

> [!IMPORTANT]
> 不建议同时启用其他会重写 `proxy-groups`、`rules`、`rule-providers` 或 DNS 的 Override 脚本，否则可能发生配置覆盖或冲突。

---

## 🔄 更新机制

本项目包含三类不同的更新：

| 内容 | 更新方式 |
| --- | --- |
| 机场节点 | 由原机场订阅更新 |
| iKeLee Rule Providers | Mihomo 定时从远程规则源更新 |
| Kelee-FlClash-Override.js | 本仓库维护更新 |

因此，机场节点发生变化时，不需要修改本脚本。

iKeLee 的远程 Rule Providers 更新后，也不需要重新修改脚本。

如果 iKeLee 原始 Mihomo 配置的**策略组、DNS、节点筛选逻辑或配置结构**发生变化，则需要同步更新本项目的 Override 脚本。

> [!NOTE]
> FlClash 对已经通过 URL 导入的 Override 脚本是否自动获取最新版本，取决于 FlClash 当前版本的实现。若本仓库脚本已经更新但本地仍为旧版本，可重新通过上述 Raw URL 导入。

---

## 🧩 与原版 iKeLee 配置的区别

iKeLee 原始 Mihomo 配置通过 `proxy-providers` 填写机场订阅，例如：

```yaml
proxy-providers:
  机场名称:
    url: "机场订阅URL"
```

本项目将这一部分移除。

节点改为直接读取 FlClash 已加载的机场订阅：

```text
机场订阅
   ↓
FlClash
   ↓
Kelee-FlClash-Override
   ↓
策略组 + DNS + Rule Providers + Rules
```

因此：

**机场订阅与分流配置相互独立。**

更换机场时，也无需将机场 URL 或 Token 写入 Override 脚本。

---

## 🛠️ 主要适配内容

相对于原始 iKeLee Mihomo 配置，本项目主要进行了以下适配：

- 移除示例配置中的机场 `proxy-providers`
- 直接读取 FlClash 当前订阅提供的节点
- 将 YAML 配置逻辑转换为 FlClash JavaScript Override
- 使用 `main(config)` 对现有配置进行覆写
- 保留地区节点识别及自动策略
- 保留 AI、TikTok、Netflix、游戏、Speedtest 等分流
- 继续使用 iKeLee 提供的远程 Rule Providers
- 针对不存在特定地区节点的情况增加兼容处理

本项目的目标并不是重新设计 iKeLee 的分流体系，而是使其更方便地应用于 FlClash 的机场订阅。

---

## 🙏 来源与致谢

本项目基于 **iKeLee** 编写并发布于 **ProxyResource** 仓库中的 Mihomo 配置进行适配与转换。

### 原项目

**iKeLee / ProxyResource**

https://github.com/luestr/ProxyResource

### 原始 Mihomo 配置

`Tool/Clash/Config/Clash_Sample_Config_By_iKeLee.yaml`

https://github.com/luestr/ProxyResource/blob/main/Tool/Clash/Config/Clash_Sample_Config_By_iKeLee.yaml

原配置文件中标注：

> 配置作者：iKeLee  
> 适用于所有使用 Mihomo 核心的程序

感谢 **iKeLee（Kelee）** 对 Mihomo 配置、分流规则以及相关资源的长期维护与分享。

本仓库为针对 **FlClash Override** 使用方式制作的非官方适配版本，**与 iKeLee / ProxyResource 官方无隶属关系，也并非由原作者维护。**

---

## ⚠️ Disclaimer

本项目仅提供配置适配与技术研究用途，不提供任何代理节点、机场订阅或代理服务。

使用者需要自行提供合法可用的 Mihomo / FlClash 节点或订阅。

原始 iKeLee 配置、Rule Providers 及相关资源的版权与权利归原作者及相应项目所有。

如原项目的授权、使用要求或相关资源发生变化，应以原项目最新说明为准。

---

## ❤️ Credits

Special thanks to **iKeLee (Kelee)** for creating and maintaining the original Mihomo configuration and rule resources.

Without the original work from iKeLee / ProxyResource, this FlClash adaptation would not exist.
