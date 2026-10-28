import json,csv,pathlib,sys
root=pathlib.Path(__file__).parent
read=lambda name:json.loads((root/name).read_text(encoding='utf-8-sig'))['result']
E={}
def spec(ref,m): E[ref]={str(k):v for k,v in m.items()}
spec('U1',{1:'GND',2:'+3V3',3:'VBUS_5V',4:'+3V3'})
spec('U2',{**{k:'' for k in range(1,42)},1:'GND',2:'+3V3',3:'ESP_EN',7:'UWB_WAKE',8:'STATUS_LED_N',9:'USER_KEY',12:'UWB_RST_N',13:'USB_DM',14:'USB_DP',17:'UWB_IRQ',18:'UWB_CS_N',19:'UWB_MOSI',20:'UWB_SCK',21:'UWB_MISO',27:'BOOT_N',36:'UART0_RX',37:'UART0_TX',40:'GND',41:'GND'})
spec('U3',{**{k:'GND' for k in [10,11,12,14,15,16,17,19,20,24,25,30,39,40]},**{k:'' for k in [3,4,6,7,8,9,31]},1:'UWB_IRQ',2:'DW_SPIPHA',5:'DW_SPIPOL',13:'DW_RF2',18:'DW_RF1',21:'DW_XTI',22:'DW_XTO',23:'+3V3',26:'+3V3',27:'DW_VTX_D',28:'DW_VDD2A',29:'+3V3',32:'UWB_WAKE',33:'UWB_RST_N',34:'UWB_SCK',35:'UWB_MOSI',36:'UWB_MISO',37:'UWB_CS_N',38:'DW_VIO_D'})
for ref,a,b in [('R1','ESP_EN','+3V3'),('R10','BOOT_N','+3V3'),('R11','USER_KEY','+3V3'),('R12','STATUS_LED_N','LED_K'),('D1','+3V3','LED_K'),('R13','USB_CONN_DM','USB_DM'),('R14','USB_CONN_DP','USB_DP'),('R2','GND','USB_A5'),('R3','GND','USB_B5'),('R30','GND','DW_SPIPHA'),('R31','GND','DW_SPIPOL'),('R32','GND','UWB_IRQ'),('R33','UWB_CS_N','+3V3'),('R34','GND','UWB_WAKE'),('FB1','+3V3','DW_VDD2A'),('C40','ANT2_FEED_TBD','DW_RF2'),('C41','ANT1_FEED_TBD','DW_RF1')]:spec(ref,{1:a,2:b})
for ref,n in [('SW1','ESP_EN'),('SW2','BOOT_N'),('SW3','USER_KEY')]:spec(ref,{1:n,2:n,3:'GND',4:'GND'})
spec('J1',{'A1B12':'GND','A4B9':'VBUS_5V','B8':'','A5':'USB_A5','B7':'USB_CONN_DM','A6':'USB_CONN_DP','A7':'USB_CONN_DM','B6':'USB_CONN_DP','A8':'','B5':'USB_B5','B4A9':'VBUS_5V','B1A12':'GND',**{str(k):'GND' for k in [1,2,3,4]}})
spec('U4',{1:'USB_CONN_DM',6:'USB_CONN_DM',3:'USB_CONN_DP',4:'USB_CONN_DP',2:'GND',5:'VBUS_5V'})
spec('J2',{1:'GND',2:'UART0_TX',3:'UART0_RX'});spec('J3',{1:'GND',2:'ESP_EN',3:'BOOT_N'})
for ref,n in [('TP1','+3V3'),('TP2','GND'),('TP3','VBUS_5V')]:spec(ref,{1:n})
spec('Y1',{1:'DW_XTI',2:'GND',3:'DW_XTO',4:'GND'})
spec('C2',{1:'+3V3',2:'GND'})
positions={**read('core-support.json')['pins'],**read('dw-placed.json')['pins'],**read('power-wired.json')['pins']}
for ref,n in [('C1','VBUS_5V'),('C3','+3V3'),('C10','ESP_EN'),('C11','+3V3'),('C12','+3V3')]+[(f'C{k}','DW_VTX_D' if k==28 else 'DW_VIO_D' if k==29 else 'DW_VDD2A' if k==30 else '+3V3') for k in range(20,31)]+[('C31','DW_XTI'),('C32','DW_XTO')]:
    # C10/11/12 were rotated after core-support snapshot. All are nonpolar and pin 2 is above in the rotated instance.
    ps=positions[ref]
    top=max(ps,key=lambda p:p['y'])['pinNumber'] if ref not in ['C10','C11','C12'] else '2'
    spec(ref,{p['pinNumber']:n if p['pinNumber']==top else 'GND' for p in ps})
actual_file=sys.argv[1] if len(sys.argv)>1 else 'actual-netlist-final.json'
raw=json.loads(read(actual_file)['text'])
A={c['props']['Designator']:{str(p.get('number',k)):p.get('net','') for k,p in c['pinInfoMap'].items()} for c in raw['components'].values()}
errors=[];rows=[]
for ref,pins in E.items():
    for pn,net in pins.items():
        observed=A.get(ref,{}).get(pn,'<MISSING>')
        if observed!=net:errors.append({'ref':ref,'pin':pn,'expected':net,'actual':observed})
        rows.append({'reference':ref,'pin':pn,'pin_name':next((p.get('name','') for c in raw['components'].values() if c['props']['Designator']==ref for k,p in c['pinInfoMap'].items() if p.get('number',k)==pn),''),'net':net,'action':'CONNECT' if net else 'NC','basis':'DW3000 v1.3 table 2 / ESP32-S3 module v1.8 tables 3-1,4-1 / AMS 2012 / ST DS4260 Rev7 / recorded support decisions','actual_net':observed,'comparison':'PASS' if observed==net else 'FAIL'})
for ref,pins in A.items():
    if ref not in E:errors.append({'unexpected_reference':ref})
    for pn in pins.keys()-E.get(ref,{}).keys():errors.append({'unexpected_pin':ref+'.'+pn})
out={'schema':'anchor-pin-comparison-v1','actual_source':actual_file,'expected_pins':sum(map(len,E.values())),'expected_components':len(E),'actual_components':len(A),'differences':errors,'result':'PASS' if not errors else 'FAIL','limitations':['NC verified separately from saved instance pin states; blank export alone is insufficient.','No populated multipart devices; no hidden symbol pins among selected parts, verified from library records.','Only Basic assembly variant is used. Y1 is excluded from assembly BOM pending crystal qualification.','Repeated footprint pad numbers are reconciled separately against embedded native library records.']}
(root/'expected-connections.json').write_text(json.dumps(E,indent=2),encoding='utf8')
(root/'connection-comparison.json').write_text(json.dumps(out,indent=2,ensure_ascii=False),encoding='utf8')
with (root/'pin_connections.csv').open('w',encoding='utf-8-sig',newline='') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows)
print(json.dumps(out,ensure_ascii=False))
