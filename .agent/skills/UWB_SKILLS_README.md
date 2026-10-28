# UWB 项目本地 Skills

安装日期：2026-10-28。来源：C:\Users\29909\.codex\skills 中已经安装的本地技能包。

本目录按各技能 SKILL.md 的 name 平铺，保留技能正文、references、scripts、assets 和包依赖声明。排除了 Git 数据、node_modules、Python 缓存、系统杂项与环境配置文件；没有运行 npm 安装或启动 EDA。文件 SHA-256 清单见同目录的安装清单 JSON。

## 使用顺序与职责

| Skill | 何时使用 |
|---|---|
| manage-pcba-program | 需要协调硬件项目阶段、记录证据与变更影响时 |
| plan-electronic-product | 整理需求、系统架构、电源预算、接口与待定条件 |
| qualify-pcba-sourcing | 核对精确料号、封装、引脚、库和采购依据 |
| design-and-review-circuit | 检查电源、复位、逻辑域、接口、时序与电气正确性 |
| easyeda-api | 操作嘉立创 EDA 专业版前查 API，并按需连接客户端 |
| easyeda-schematic-net-fanout | 初步放置、真实引脚读取、接口映射与扇出辅助 |
| ideal-schematic-style | 采用用户已记录的个人原理图风格 |
| modular-schematic-layout | 确定功能分组、局部拓扑、分页、标注及统一风格 |
| schematic-humanizer | 改善可读性，并用真实网表与渲染检查连接保真 |
| pcb-design-guidelines | 根据已确认原理图制定板级布局布线步骤 |
| pcb-layout-review | 审查 PCB 回流、RF、热、布局布线、DRC 与制造性 |
| release-pcba-fabrication | 整理和核对同一版制造、装配与测试资料 |

根据当前任务选用对应技能，不需要每次加载所有文件。个人风格规则与模块化布局、可读性检查协作；扇出技能适合准备阶段，最终原理图中的局部功能关系仍应用可追踪导线表达，不能把满页标签当作完成图。

## UWB 项目当前讨论基线

用户已在本次对话指定：嘉立创 EDA 专业版；Anchor 使用 ESP32-S3-WROOM-1-N16R8 与 DW3220；USB 供电，当前稳压方案为 AMS1117；保留原生 USB 与 UART。完整电气与采购资料仍需按实际器件和工程核验。技能包的复制不代表已经绘制原理图或通过任何硬件检查。

## 路径、参考资料与可用范围

- 原来源于多技能仓库的 modular-schematic-layout 和 pcb-design-guidelines 已拆为本目录下同名技能，使 ideal-schematic-style 中的兄弟技能链接可解析。
- ideal-schematic-style 的规则、索引及包内缓存随技能保留；原始 PDF 参考库及部分历史产物位于技能目录之外，本次不复制这些项目资料。需要重新审阅原图或验证源文件时，按索引定位原资料，不能据规则文件存在声称原图已验证。
- easyeda-api 带有 API 文档、桥接脚本和依赖声明；实际自动操作还需要兼容的客户端、扩展/接入方式和运行时依赖。
- manage-pcba-program 提到的 operate-jlcpcb-order 不在本次源目录中，也不属于当前原理图/PCB资料准备范围；本包没有安装在线下单能力。
- 按用户要求放在 .agent/skills。此目录是否被具体 AI 客户端自动发现取决于该客户端的技能发现规则；也可直接指定并读取本目录的 SKILL.md。未修改其他技能目录或客户端全局设置。
