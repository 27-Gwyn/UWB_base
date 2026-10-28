---
name: ideal-schematic-style
description: Use when drawing, rearranging, reviewing, or calibrating schematics in 嘉立创 EDA 专业版 for this user's reference-library style, especially functional grouping, visible local topology, consistent annotations, and readable page organization. Also use when updating this user's schematic-style preferences. Not for PCB placement or circuit redesign alone.
---

# 理想原理图风格

以功能关系组织图面，以可追踪的局部拓扑解释电路，以统一标注和适量分区建立秩序。此 Skill 保存个人风格知识，不修改模型权重。

## 先读什么

1. 每次读取 [偏好记录](references/preferences.md)，区分用户已确认偏好、待确认推断和工程建议。
2. 按任务查 [中文指导册](references/handbook.md)：页面与模块读 R01–R04；走线及辅助电路读 R05–R10；标注及交付读 R11–R16。只选有关规则。
3. 需要原图、比较或判断冲突时，查 [证据与完整索引](references/evidence.md)；源文件或缓存变化时运行 `python scripts/audit_skill.py --verify-sources`。
4. 实际操作 EDA 前读 [实施流程](references/easyeda-workflow.md)，再按其中链接读取已安装 API 的准确签名。查看 [验证记录](references/validation.md) 了解已验证范围。

## 与已有 Skills 协作

- 整页、分页及拓扑通用方法：读 [modular-schematic-layout](../modular-schematic-layout/SKILL.md)，按需读其关联文档。
- 重排、连接保真及局部审图：读 [schematic-humanizer](../schematic-humanizer/SKILL.md)，采用其适配器和视觉检查；导出适配器未经证明时不宣称等价。
- 器件、引脚、图元和真实操作：读 [easyeda-api](../easyeda-api/SKILL.md)，需要操作时才连接。依赖缺失时查安装位置；仍缺失则说明受影响能力，不臆造 API。

## 执行顺序

1. **理解输入**：区分新建、重排、审查、仅更新风格。记录需求、输入可信度、目标阅读方式和允许修改范围。PDF 仅提供图面证据。
2. **选择规则**：列出本次采用的 R 编号及例外。111、222 均为用户自制，333 为开源；共同学习，无组别优先级。111 整体完成度评价不代表其每个细节正确。
3. **规划页面**：按功能和真实连接安排模块、主路径、支路、配对与反馈，再决定框和分页。新图按需分框，标题左上；按正常阅读比例与查线成本选页幅/分页。
4. **锁定电气基线**：新建使用可信的器件/参数/真实针号到网络输入；缺少连接输入则先交付明确标识的布局方案。重排保存器件身份、值/型号、引脚映射、极性、多单元归属和网络身份。
5. **读取与绘制**：批量读对象；读取真实库和已放置器件的引脚；先完成一组功能单元与标注，再按核验过的输入复用。分批修改，记对象 ID，回读后再继续；超时先查状态，避免重建重复器件/标签/导线。
6. **渲染与修正**：查看所有页整体、目标阅读比例和关键局部；追踪路径，检查文字归属、避让、页边界和重复通道差异。说明文字加入后再检查。必要时调整模块空间或分页。
7. **报告与沉淀**：分别报告文件保存、原生重开、图面检查、引脚/网络比较和设计检查的实际结果及未执行项。电气疑点单列。将新反馈写入 preferences，并同步相关 R 规则及证据；不能将自己的建议记成用户确认。

## 决策边界

- 功能和连接优先于外观；不为对齐换脚、改极性、并地、添器件或改值。图中邻近不证明 PCB 距离、回路面积或安规满足。
- 局部关键路径和反馈优先实线；跨模块、跨页、共享控制和高引脚接口映射可用标签/端口。连接线上命名不等于标签跳转。
- 不复制参考芯片、器件数、页数、颜色和绝对坐标；不从 PDF 像素推导 EDA 网格或单位。未确认的字号、线宽与间距由真实工程和渲染校准。
- 对参考图冲突给出证据和候选决策；只集中询问明显改变结果的偏好，其余保持待确认并完成可独立推进的部分。
- 交付至少包含可审阅的实际图面或布局结果、采用规则/例外、检查范围与局限；生成文件和 API 无报错本身不能证明绘图完成。
