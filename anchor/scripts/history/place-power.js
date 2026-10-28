// COMMON
const out={};for(const [ref,id,x,y,r,name] of [
 ['U1','9f9c6cb41c7449fd8acf96aceed2661a',240,950,0,'AMS1117-3.3 (AMS)'],
 ['C1','8c1f4a9e9d204b148b36ce719c891bd1',110,920,90,'10uF / 25V'],
 ['C2','60b599cc41fc4332b802ee995fcea20f',350,920,90,'22uF / 10V Ta'],
 ['C3','96b39256cc3f4d80bd3b503deb4f3328',420,920,90,'100nF'],
 ['J1','74d31c19993b4b9581f3175a7da4b280',170,590,180,'USB-C / 5 V sink'],
 ['U4','41567551402d47e3a0236ab3d895b322',370,550,0,'USBLC6-2SC6 (ST)'],
 ['R2','b5d09b57bc354a60b86d6a6308651647',180,390,90,'5.1k CC1'],
 ['R3','b5d09b57bc354a60b86d6a6308651647',280,390,90,'5.1k CC2'],
 ['J2','8c5282bb0a03497ca34b12735e6b8dae',1350,960,0,'UART0 / 3.3 V'],
 ['J3','8c5282bb0a03497ca34b12735e6b8dae',1350,800,0,'RESET / BOOT'],
 ['TP1','a8a2233f125d4d05aaadb9a5bc7619e5',1230,650,0,'+3V3'],
 ['TP2','a8a2233f125d4d05aaadb9a5bc7619e5',1340,650,0,'GND'],
 ['TP3','a8a2233f125d4d05aaadb9a5bc7619e5',1450,650,0,'VBUS']
])out[ref]=await place(ref,id,x,y,r,name);
return {out,...await finish()};
