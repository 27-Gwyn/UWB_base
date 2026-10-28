# Anchor DRAFT：依据与范围

2026-10-28。原生目标为现有 UWB / Anchor / Schematic2，工程 UUID `2ceff1de2cdb41d6a9101840f44c2b87`，板子 UUID `972ce89fb0e827ad`，原理图 UUID `fff8ecc88c1d6f03`，唯一图页 UUID `a2ae37ea91715ac4`。图页显示名为 Anchor。未新建或复制工程、板子或独立原理图。

## 厂家资料

- Qorvo/Decawave DW3000 Datasheet v1.3，本地 `references/vendor/DW3000_v1_3.pdf`，表 1/2、表 10、图 32、表 22、QFN 封装图 38。DW3220TR13 为 QFN40 双 RF 版本；该封装图没有额外编号的中心焊盘，不能自行增加 41 脚。RF1=18，RF2=13，双路各串联 2 pF。RSTn 不得由外部推挽拉高。VTX_D、VIO_D 是内部去耦节点。
- [Qorvo DW3220 产品页](https://www.qorvo.com/products/p/DW3220)：2026-10-28 查询确认 Last Time Buy 至 2027-02-28。本次没有采购或锁定库存。
- Espressif ESP32-S3-WROOM-1/WROOM-1U Datasheet v1.8，本地 `references/vendor/ESP32S3_WROOM1_v1_8.pdf`，表 3-1、启动配置、图 9-1。N16R8 的 GPIO35/36/37 为 PSRAM 占用；41 为 EPAD，接 GND；EN 常用 10 kΩ / 1 µF。
- [Espressif Schematic Checklist](https://docs.espressif.com/projects/esp-hardware-design-guidelines/en/latest/esp32s3/schematic-checklist.html)：原生 USB 串联电阻起点 22/33 Ω；本图使用已核库的 27 Ω 支持件，需实板信号质量复核。
- Advanced Monolithic Systems AMS1117，2012-09-14，本地 `references/vendor/AMS1117_AMS.pdf`。SOT-223：1 GND、2 VOUT、3 VIN，散热片 VOUT。该库将散热片编号为 4，2/4 同接 +3V3。输出使用 22 µF 固态钽。手册首页压差概述与电气表数值不同，预算应按具体负载表项及实测；不能只引用首页的 1.3 V。
- ST USBLC6-2，DS4260 Rev7 / 2021-12，本地 `references/vendor/USBLC6-2_Rev7.pdf`。选择 ST USBLC6-2SC6 / C7519，1/6 为一条数据线、3/4 为另一条、2 GND、5 VBUS。
- 支持件采用实时读回的嘉立创系统库资料：完整器件、符号、封装 UUID 和来源在 `bom_draft.csv`、`library_pin_map.csv`、`native-audit.json` 与 `eda/libraries`。它们证明库与实例映射，不等于已完成每个支持件的采购、机械或制造签核。

## 未关闭事项

1. 用户确认无已验证双天线设计：仅实现双路 DC 隔直与命名馈电端。天线实体、匹配网络最终取值、相位中心、互耦和标定未完成。16.9 mm 不作为已验证尺寸。
2. TXC 8Y38472012 为厂家参考表推荐候选，但当前供应资料 ESR 80 Ω 与 DW3000 表 10 的 60 Ω 条件存在差异。用户仅表示问题不严重时可用，尚无证明差异不影响起振裕量的证据。因此 Y1 保留原生候选实例、标 DNP，排除装配 BOM；需厂家确认或起振/温度/电压试验后定版。两侧 3.3 pF 是参考电路起点，不是实测负载标定值。
3. USB 源能力、VBUS 压降、直接电容负载的插入浪涌、AMS1117 稳定性/压差/瞬态/热均待验证。5 V→3.3 V 的 300 mA/500 mA 电阻性损耗为约 0.51/0.85 W，另计偏置损耗。不能由 1 A 标称推断可持续供整板电流。
4. R1 为用户原有通用 10K 器件，精确采购料号未指定；测试点为已有通用库实体，采购与机械验收未锁定。
5. PCB、层叠、RF/USB 阻抗几何、天线布局、固件、定位精度及实物测试均不在本次已验证范围。

## 调试与布局意图

- [SPEC] 所有 MCU/UWB 数字接口为 3.3 V 域。USB OTG 与 Serial/JTAG 共用内部 PHY；UART0、EN、BOOT 保留恢复路径。UART 不得给未供电板反向供电。
- [DESIGN] SPI mode 0；CS 上拉、WAKE 下拉、IRQ 100 kΩ 下拉。初始 SPI 2 MHz、先以 16 MHz 调试是目标，不是信号完整性签核。
- [SPEC] RST_N 固件必须开漏拉低或释放，禁用外部上拉和推挽高电平。未进行部分掉电反灌实测。
- [SPEC] U3 电源旁路靠近各域引脚，小电容在引脚逃逸路径，地端短接参考面。VDD2A 经厂家参考磁珠 BLM03PG330SN1D 隔离，内部节点不接外部 3.3 V。
- [SPEC] RF1/RF2 50 Ω，USB 差分 90 Ω；几何由实际层叠计算，本次没有给通用线宽。保留 DW3220 推荐芯片下方铜处理要求，不能自动套用普通 QFN 中心地焊盘规则。
- [TBD-MEASURE] 连续回流、晶体回路、2.4 GHz 模组天线禁布、ESD 位置、热铜面积、温升、负载瞬态、双天线不对称相位需在后续 PCB 与实物阶段核验。
