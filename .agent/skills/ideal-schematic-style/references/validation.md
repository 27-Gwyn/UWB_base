# 验证记录与应用结果

2026-10-28。本次参考输入只有 PDF；未连接或修改 EDA。验证分为资料可靠性、结构链接和布局应用三个层次，不能相互替代。

## 1. 已完成的资料核对

36 份 PDF 的 SHA-256 与已有索引一致；41 页的页数/MediaBox 与 pypdf 读取一致；41 张 PNG 均可解码；全部页通过 11 张概览实际查看，15 个代表局部另放大。详见 [evidence.md](evidence.md) 和 [library-index.json](library-index.json)。没有全库重提取或重渲染。

## 2. 无新 Skill 的基线

独立代理在新 Skill 写入前，实际查看 S012 与 S011 的整页和原尺寸图，依据旧通用 Skills 生成 [基线说明](../../../../output/schematic-learning/validation/baseline/baseline.md)、[BUCK 布局](../../../../output/schematic-learning/validation/baseline/buck-layout.svg) 与 [MCU/无线布局](../../../../output/schematic-learning/validation/baseline/mcu-wireless-layout.svg)，并查看 PNG。后来确认的 P04/P05 仅追加说明，未重绘基线。

基线已经能作合理功能分区、保留局部实线并说明局限；没有人为制造故障，也没有证据证明新 Skill 比基线有可量化收益。它仍是概念模块图，并非逐器件连接输入的实施结果。基线与下述应用的输入粒度不同，不构成严格对照实验。应用检查的是新 Skill 能否选择规则、处理不同拓扑并给出可审阅图面，不以复述 Skill 为验证。

## 3. 两类实际布局应用

已保存 [两类抽象连接输入](../../../../output/schematic-learning/validation/inputs.json)：A 为含反馈、自举、使能的同步 BUCK；B 为含去耦、复位、晶振、调试接口的 MCU/无线板。它们是人工构造的布局夹具，**不是参考 PDF 转录、真实库映射或可制造电路**。两个无本次聊天历史的独立代理分别读取新 Skill、偏好及按需文档，生成元件级图面，实际查看渲染并记录选择与例外。

| 应用 | 实际图面与采用规则 | 抽象输入核对 | 实际查看范围 |
| --- | --- | --- | --- |
| A：同步 BUCK | [PNG](../../../../output/schematic-learning/validation/application-A/schematic.png) / [SVG](../../../../output/schematic-learning/validation/application-A/schematic.svg) / [应用说明](../../../../output/schematic-learning/validation/application-A/application.md)。以留白分区，连续主路、BST—CB—SW、自举浮动关系、EN 及反馈返回，使用 R01–R07、R11–R16 | 10 器件、7 网络、24 端点；身份/值字符串和网络成员与输入一致 | 代理看整页及输入/自举/反馈三个局部；主任务另看整页、自举与反馈局部 |
| B：MCU＋无线 | [PNG](../../../../output/schematic-learning/validation/application-B/mcu-radio-topology.png) / [SVG](../../../../output/schematic-learning/validation/application-B/mcu-radio-topology.svg) / [应用说明](../../../../output/schematic-learning/validation/application-B/application.md)。本地复位/晶振/去耦展开，五条成员关系逐线连接，调试针号映射保留，同名供电/地分配，使用 R01–R09、R11–R16 | 11 器件、12 网络、39 端点；身份/值字符串和网络成员与输入一致 | 代理看整页、复位/晶振/调试/SPI 局部，修正后复看；主任务另看最终整页、晶振与调试局部 |

![BUCK 抽象布局应用](../../../../output/schematic-learning/validation/application-A/schematic.png)

![MCU 与无线抽象布局应用](../../../../output/schematic-learning/validation/application-B/mcu-radio-topology.png)

主任务独立运行 [check_applications.py](../../../../output/schematic-learning/validation/check_applications.py)，重新读取输入、applied.json 和 SVG：两个契约均精确保持，每个抽象端点有对应坐标且落在其网络的实际 SVG 正交线段上，结果见 [application-checks.json](../../../../output/schematic-learning/validation/application-checks.json)。这只是抽象契约与显示路径覆盖，**不是完整接触分析、原生网表等价或电气验证**。A 自带的几何检查、B 自带的契约检查另存各目录，未替代主任务实际看图。

## 4. 实际发现、修正与规则修订

| 发现 | 实际修正 | 沉淀到规则 |
| --- | --- | --- |
| B 首版去耦地符号/地名贴近芯片顶边，容易混同为芯片顶部针名 | 调整整个局部显示支路，重新渲染 | R07：电容本体之外，地符号、名称及芯片轮廓也要共同留白 |
| B 调试口 VDD 字样贴近 SWCLK；修正过程中又发现 XOUT 名称贴近 U1 地符号 | 重新安排显示端/网络名字的位置，不改输入连接；复看调试与晶振局部 | R12：密集接口网络名与邻线、地符号共同检查；修正后也检查邻区 |
| B 首次局部裁图切到邻近字段 | 扩大裁图上下文；完整整页未裁掉对象 | 记录审阅范围；裁剪边界不等于源图缺陷，不新增电路规则 |
| 主任务复核发现 B 的 SPI 模块标题仍居中，未落实已确认 P04 | 仅将模块标题及辅助说明改为左对齐，重渲染并查看；信号名和连接保持 | R02：无框功能区也使用左上标题锚点，区别于可居中的网络名/器件字段 |
| A 未发现需修复的图面遮挡；连续地轨使连接器回线较长 | 保留为该小单元的有理由例外，已在说明中记录 | 不把一次成功画法变为所有电路的硬规则 |

B 的 [首版 PNG](../../../../output/schematic-learning/validation/application-B/first-render.png) 保留真实首次渲染；不是制造缺陷的“前后对比”。具体修正过程见其 application.md。以上 R02/R07/R12 修订是应用得到的工程说明，不是新的用户偏好确认。修正后主任务已重新看过最终图面，未发现这些已定位问题仍未处理。

## 5. 文件、脚本与触发结构检查

- 已运行 skill-creator 的 `quick_validate.py`，返回 `Skill is valid!`。为运行该原版校验器，将缺少的 PyYAML 6.0.3 仅安装在项目 tmp/schematic-learning/validator-deps；没有全局安装或更改原 Skills。
- 新 `agents/openai.yaml` 用 YAML 解析检查，短描述长度与默认提示符合要求；未关闭默认自动选择。
- 已执行新 [audit_skill.py](../scripts/audit_skill.py) 的 `--verify-sources`：36 源、41 页，129 个源/文本/单页渲染/概览文件哈希一致；文档、源文件与例图链接均可解析。完整数字以最新 [文件检查报告](../../../../output/schematic-learning/validation/file-checks.json) 为准。
- [test_audit.py](../../../../output/schematic-learning/validation/test_audit.py) 在独立临时夹具上验证：未变资源通过且未被改写、源变化被拒绝、断链被拒绝、新增未索引 PDF 被拒绝；四项通过。脚本只核文件与缓存，不核电路。
- 16 个 R 编号在指导册和证据表均有记录，36 行清单与机器索引的 ID 集合一致。一次辅助行计数最初误把比较表行计入，已改为匹配独立 ID 列后重核；不是参考资料缺失。

## 6. 结论的边界

即使图面和文件结构检查通过，仍不能据此声称 EDA 原生创建、真实库引脚、网表等价或 ERC/DRC 已通过。需要后续取得可信原生工程/网表、确认客户端连接后，在独立副本小范围试绘，并完成原生保存/重开、最终渲染、前后连接比较和真实设计检查。
