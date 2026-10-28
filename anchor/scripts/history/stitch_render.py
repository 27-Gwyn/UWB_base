import json,pathlib,base64,io
from PIL import Image
root=pathlib.Path(__file__).parent
tiles=json.loads((root/'final-tiles.json').read_text(encoding='utf8'))['result']
scale=3.0; W,H=round(1655*scale),round(1170*scale)
canvas=Image.new('RGB',(W,H),'white');manifest=[]
for name,tile in tiles.items():
    b=tile['requested'];original=Image.open(io.BytesIO(base64.b64decode(tile['data'])))
    if original.getbbox() is None:raise ValueError('Transparent native tile: '+name)
    im=original.convert('RGB'); iw,ih=im.size
    if im.getextrema()==((0,0),(0,0),(0,0)):raise ValueError('Black native tile: '+name)
    unitsw,unitsh=b['right']-b['left'],b['top']-b['bottom'];s=min(iw/unitsw,ih/unitsh)
    crop=((iw-unitsw*s)/2,(ih-unitsh*s)/2,(iw+unitsw*s)/2,(ih+unitsh*s)/2)
    x0,x1=round(b['left']*scale),round(b['right']*scale);y0,y1=round((1170-b['top'])*scale),round((1170-b['bottom'])*scale)
    canvas.paste(im.crop(crop).resize((x1-x0,y1-y0),Image.Resampling.LANCZOS),(x0,y0));manifest.append({'tile':name,'source_size':[iw,ih],'requested':b,'center_crop':crop,'output_box':[x0,y0,x1,y1]})
canvas.save(root/'Anchor_DRAFT_A3.png',dpi=(300,300));canvas.resize((1414,1000)).save(root/'Anchor_preview.png')
(root/'render-stitch-manifest.json').write_text(json.dumps({'method':'native EDA canvas API captures; geometric center cropping and tiling; no schematic redrawing','source':'final-tiles.json','output_pixels':[W,H],'tiles':manifest,'limitation':'Raster review PDF, not native vector export; tile registration visually checked against independent full-canvas and dense-area captures.'},indent=2),encoding='utf8')
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.pagesizes import A3,landscape
c=Canvas(str(root/'Anchor_DRAFT_A3.pdf'),pagesize=landscape(A3));c.drawImage(str(root/'Anchor_DRAFT_A3.png'),0,0,width=landscape(A3)[0],height=landscape(A3)[1]);c.showPage();c.save()
print('PNG',canvas.size,'PDF pages 1; native canvas tiles',len(tiles))
