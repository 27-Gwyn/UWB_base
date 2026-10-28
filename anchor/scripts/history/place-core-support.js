// COMMON
const out={};
out.U2=await place('U2','701a1177d7184d1bbf7f86d69d9385c2',850,800,0,'ESP32-S3-WROOM-1-N16R8');
out.R1=await place('R1','f61af53b8d604d888b6dd9daa1a301b0',540,875,90,'10K');
for(const [ref,id,x,y,r,name] of [
 ['C10','f4744ff7405a46a48e360c2c6fadeca3',540,790,0,'1uF / EN'],
 ['C11','8c1f4a9e9d204b148b36ce719c891bd1',620,950,0,'10uF / 25V'],
 ['C12','96b39256cc3f4d80bd3b503deb4f3328',690,950,0,'100nF'],
 ['SW1','9b1d934c3e3a4920af227bab22a915b2',440,790,0,'RESET'],
 ['R10','b948db94476e4027ac8953235755ec96',1050,825,90,'10k'],
 ['SW2','9b1d934c3e3a4920af227bab22a915b2',1050,715,0,'BOOT'],
 ['SW3','9b1d934c3e3a4920af227bab22a915b2',600,665,0,'USER'],
 ['R11','b948db94476e4027ac8953235755ec96',600,715,90,'10k'],
 ['R12','18db11499a04403ba8c98e2f7a687fbc',600,580,0,'1k'],
 ['D1','044668f4d8a64015bfbf32f95a0f5c4c',700,580,0,'STATUS'],
 ['R13','9a8d7280acde4efba4ed8a6a94e594ca',600,500,0,'27R USB_D-'],
 ['R14','9a8d7280acde4efba4ed8a6a94e594ca',600,450,0,'27R USB_D+']
])out[ref]=await place(ref,id,x,y,r,name);
return {out,...await finish()};
