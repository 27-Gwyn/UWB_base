# 嘉立创 EDA 专业版实施与效率

此页只维护将风格落实到真实对象的操作约束；视觉规则在 [handbook.md](handbook.md)。依据是项目中已安装的 [easyeda-api SKILL.md](../../easyeda-api/SKILL.md)（metadata.version 1.1.61）及关联类文档，读取日期 2026-10-28。**本次没有连接客户端；以下是已读文档能力，不是本机实时调用成功记录。** 客户端版本、权限和实际行为必须在操作时核实。

## 1. 模式与输入契约

| 模式 | 输入与可做动作 | 输出证据 |
| --- | --- | --- |
| 新建原生电路 | 可靠的器件/参数/真实针号→网络、符号/器件库和功能要求；先查库和器件资料，未知不猜 | 原生工程、渲染、已用引脚映射及连接/设计检查 |
| 重排原生电路 | 保存基线，限定只改图面；记录锁定对象/区域、PCB 及其他受保护文件 | 同一适配器前后导出、参数/身份比较、最终渲染和检查差异 |
| PDF/截图审图或布局方案 | 文字辅助检索，整页+局部阅读；不把图像转录当可信网表 | 标注局限的方案图、证据位置与待确认项 |
| 仅维护 Skill | 只更新规则/偏好与必要验证文件 | 文件检查和真实应用演练；不自动启动 EDA |

不要为演练覆盖用户当前工程。若有可靠原生输入并需要试绘，使用可恢复的独立副本；先记录当前文档/未保存状态，避免切项目丢改动。

## 2. 连接与文档选择

按 easyeda-api 的握手规则发现已运行桥接服务，核 `service === "easyeda-bridge"`，首次操作确认窗口、工程与原理图文档。多个窗口按实际项目定位；无法区分才问用户。没有服务/扩展时如实说明，可继续只读方案；本任务不需要为维护规则而安装扩展、启动服务或改当前工程。

读取 [DMT_SelectControl](../../easyeda-api/references/classes/DMT_SelectControl.md) 的 `getCurrentDocumentInfo()`，及实际工程信息。所有 Promise await；执行代码用 return 回传，客户端运行环境没有 Node 文件系统；不使用猜测的 API 或枚举数字。

## 3. 集中读取，再有边界地修改

先按 [索引](../../easyeda-api/references/_index.md) 找所需类，再读具体签名/参数/备注及枚举，避免全量加载 API 手册。需要源格式操作时才读其 [format/index.md](../../easyeda-api/format/index.md)，不要混用标准版和专业版格式。

一次库存记录至少包括：文档 ID/页 ID、器件 primitiveId/uniqueId/位号、库器件及符号标识、子单元、值/型号/可见属性、X/Y、真实旋转/镜像、引脚号/名字/位置，以及导线/端口/电源地的网络和作用域。源导出适配器负责完整连接，器件的 `getState_Net()` 不是全部引脚网表。

| 工作 | 已读入口 | 操作要点 |
| --- | --- | --- |
| 对象批量读取 | [SCH_PrimitiveComponent](../../easyeda-api/references/classes/SCH_PrimitiveComponent.md) 的 getAll/get/getAllPinsByPrimitiveId；[SCH_PrimitiveWire](../../easyeda-api/references/classes/SCH_PrimitiveWire.md) 的 getAll/get | 明确当前页/全页范围；get 数组可能漏掉未找到的 ID，按 ID 核集合，不能只看数组长度或顺序 |
| 已放置引脚 | [ISCH_PrimitiveComponent](../../easyeda-api/references/classes/ISCH_PrimitiveComponent.md) 的 getAllPins；[ISCH_PrimitiveComponentPin](../../easyeda-api/references/classes/ISCH_PrimitiveComponentPin.md)、[ISCH_PrimitivePin](../../easyeda-api/references/classes/ISCH_PrimitivePin.md) | 获取 PinNumber/PinName/X/Y；旋转、镜像、移动后重读。器件引脚几何只读；不改 pinNumber 达到排版目的 |
| 库与器件 | [LIB_Device](../../easyeda-api/references/classes/LIB_Device.md)、[LIB_Symbol](../../easyeda-api/references/classes/LIB_Symbol.md) | 搜索结果不默认取第一项；核型号、封装、符号、多单元及针号映射。create 使用真实 libraryUuid/uuid 或已验证库对象 |
| 布局修改 | [SCH_PrimitiveComponent](../../easyeda-api/references/classes/SCH_PrimitiveComponent.md) 的 modify；或对象 toAsync/setState/done | 采用当前版本已核签名的一种路径；await done 后重新 get。只改目标几何/显示字段，不顺手改参数或网络 |
| 实线 | [SCH_PrimitiveWire](../../easyeda-api/references/classes/SCH_PrimitiveWire.md) 的 create/modify | 正交折线用原始引脚端点；读回线段和网络。文档说明 WIRE 分组及合并行为有语义，端点看似相触仍需网表验证 |
| 网络名/端口/电源地 | [SCH_PrimitiveAttribute](../../easyeda-api/references/classes/SCH_PrimitiveAttribute.md) 的 createNetLabel；Component 的 createNetPort/createNetFlag | 普通文字不是电气标签；保留 net 和作用域。文档含特定自动布线的锚点导线要求，需在相关流程验证，不机械给所有对象加零长线 |
| 标注与框 | Attribute 的 getAll(parentPrimitiveId)/modify；[SCH_PrimitiveText](../../easyeda-api/references/classes/SCH_PrimitiveText.md)、[SCH_PrimitiveRectangle](../../easyeda-api/references/classes/SCH_PrimitiveRectangle.md) | 编辑原生属性保持归属；图形框不传电气意义。文字/图元范围与实际渲染共同检查 |
| 总线 | [SCH_PrimitiveBus](../../easyeda-api/references/classes/SCH_PrimitiveBus.md) 与实际成员、入口类型 | 有明确成员才使用。不能用普通线或粗线冒充原生总线 |

### 坐标与网格

已安装 SKILL 的 Coordinate Unit 节写明 SCH 坐标单位为 0.01 inch（10 mil），PCB 为 1 mil；这两个域不同。**这不是推荐间距或网格。** 既有引脚可能有半格坐标，保留其原始坐标，不四舍五入；读取真实旋转/镜像及变换后引脚端点。实际编辑器的轴方向、当前网格、缩放和字段尺寸要读取工程设置/真实对象，在副本小范围回读及渲染校准。不要假定图像的向下 Y 与 EDA 完全相同；不要直接移植 Cadence 坐标、网格或固定字高。

## 4. 可复用而不会重复创建的操作节奏

1. **读一次**：库存对象和库/针脚；以文档 ID＋库 UUID＋子单元/配置为缓存键。工程或库变化才刷新相关部分；器件移动后刷新其引脚几何。
2. **算一次**：把选定 R 规则转为相对布局和项目样式，记录字体、字高、组内/组间/字段留白等真实工程参数；不把这些参数升级为跨项目风格要求。
3. **先做一组**：完成代表单元的符号、线、字段；按原始输入核身份和值并渲染，再复制几何关系到其余单元。
4. **批次有范围**：以一个功能模块或可恢复对象集为界，列预期修改/新建 ID 和连接。批量只读可并行；依赖创建、移动后读针脚、连线与保存依次执行。不假定跨多次调用是事务。
5. **记录并回读**：每个成功创建立即记录 primitiveId、位号/目标网、所属页；每批后核实际对象集合、关键位置、字段、线段端点及网络。回读不到对象或数量/身份不符先定位，不继续全图操作。
6. **超时查状态**：先按 ID/位号/几何和预期网络核已完成项，再只补缺项；匹配歧义先停该批次。不得无条件重跑 create 或按计数盲删对象。
7. **限定修复**：失败恢复只影响本批已记录对象；电气基线不符先停止后续布局，保留诊断，恢复可信状态。不要为消告警添加 no-connect/并网/驱动标志。

### 留下可再次使用的模块记录

原生模块通过实际检查后，在该绘图项目的工作记录中保存：源工程/页/模块路径与哈希、EDA 及库版本/UUID、子单元与配置、参数来源、接口针号/网络映射、适用供电域/装配条件、采用的 R 编号及工程样式参数、渲染/连接比较/设计检查的证据和局限。复用前比较这些条件；只更改位置时复用验证过的功能关系，库或电气参数改变则重新核受影响部分。

本初版**没有已验证的原生 EDA 复用模块**；validation 中的抽象方案图只能复用布局方法，不能冒充已验证器件模板。不得把“某次脚本跑通”作为模块已验证的唯一依据，也不要将新工程的局部参数重复写进全局风格规则。

## 5. 保存、导出与检查分别取证

- [SCH_Document](../../easyeda-api/references/classes/SCH_Document.md) 的 `save(): Promise<boolean>`：检查返回值，保存成功不代表已重开一致。新器件 uniqueId 在保存前可能不稳定，做网表映射时先核对。
- [SCH_ManufactureData](../../easyeda-api/references/classes/SCH_ManufactureData.md)：读 getPngFile/getSvgFile/getNetlistFile 的实际签名、枚举和返回 File；多页图像可能返回 ZIP，PNG/SVG 导出同名风险要用不同文件名并核页数。该类旧 getExportDocumentFile 被文档标为自 v4.1 弃用，不当作默认 PDF 方案；若无已核的新接口，使用实际编辑器导出菜单并记录方式，不臆造替代 API。
- [SCH_Drc](../../easyeda-api/references/classes/SCH_Drc.md)：`check(true, false, false)` 文档定义返回布尔门禁；详细模式返回分组树，顶层长度不是错误总数。应报告“实际原理图设计检查”及工具结果，不能将其扩写为完整电气设计认证。
- 按 [humanizer adapters](../../schematic-humanizer/references/adapters.md) 选择同一导出与规范化策略；未验证适配器不能证明引脚/网表等价。位置引起自动网名变化时按针脚成员集合建立映射，显式命名、作用域与域边界继续单独保留；不能忽略所有网名差异。
- 按 [视觉检查](../../schematic-humanizer/references/visual-audit-checklist.md) 查看全部页和密集局部；正文阅读比例可读，修正后重看邻居。自动范围检测只是定位辅助。

报告应明确：工程/页/版本和修改范围、实际原生文件及预览、规则/例外、保存与重开结果、连接比较结果和适配器局限、设计检查前后变化、看过的页面/局部、电气疑点及未完成项。
