"""Local post-production of authenticated EMOS captures and approved Cillian audio.
No generated UI, new speech, model calls, or runtime changes. Raw inputs remain local.
Run pilots first. Remaining masters require recorded in-product pilot approval.
"""
import argparse,bisect,difflib,hashlib,json,math,re,subprocess,wave
from functools import lru_cache
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw,ImageFont
R=Path(__file__).resolve().parents[1];T=Path('/tmp/emos-learning-refresh');B=Path('/tmp/emos-buildathon');OLD=Path('/tmp/emos-v2-media');O=R/'public/media/learning';Q=R/'docs/learning/walkthrough-refresh'
BATCH=json.loads((R/'docs/learning/v2/generation-batch.json').read_text())['masters'];W,H,U,FPS=1920,1080,930,24
PILOTS=['dna','decision','governance'];I=(76,69,196);N=(25,36,59)
def run(a):subprocess.run(a,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
def dur(p):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(p)]))
def norm(s):return {'18':'eighteen','70':'seventy','6':'six'}.get(re.sub('[^a-z0-9]','',s.lower()),re.sub('[^a-z0-9]','',s.lower()))
@lru_cache(maxsize=30)
def font(n,b=False):return ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial'+(' Bold' if b else '')+'.ttf',n)
def wrap(text,width=1760,size=37):
 d=ImageDraw.Draw(Image.new('RGB',(1,1)));lines=[];line=''
 for w in text.split():
  new=(line+' '+w).strip()
  if d.textlength(new,font=font(size,True))>width and line:lines.append(line);line=w
  else:line=new
 if line:lines.append(line)
 return lines
# Omit complete editorial sentences that no longer fit the approved product style.
OMIT={'governance':['Ready does not mean Approved.'], 'orientation':['It connects workload','Begin with a sample','Measure and Learn show'], 'workspace':['Outcomes presents representative'], 'discovery':['Portfolio Discovery helps you examine sample','Ask EMOS provides access'], 'dna':['A high confidence score','Load Sample Evidence'], 'privacy-history':['Public examples remain','Avoid importing'], 'import':['Use the sample estates'], 'security':['Software tests, deterministic','They do not prove','Next, inspect the Evaluation'], 'outcomes':['In V2, these values are representative']}
def sentences(text):return re.findall(r'[^.!?]+[.!?]?',text)
def audio(mid):
 idx=next(i for i,m in enumerate(BATCH) if m['id']==mid);m=BATCH[idx];work=T/mid;work.mkdir(parents=True,exist_ok=True);parts=[];words=[];offset=0;provenance=[]
 def add_raw(p,begin,end,text,measured):
  nonlocal offset
  dest=work/f'part-{len(parts)}.wav';run(['ffmpeg','-v','error','-y','-ss',str(begin),'-i',str(p),'-t',str(end-begin),'-af','afade=t=in:st=0:d=0.004,afade=t=out:st='+str(max(0,end-begin-.004))+':d=0.004','-ar','48000','-ac','1',str(dest)])
  length=dur(dest);parts.append(dest)
  words.extend(dict(word=w['word'],start=offset+max(0,w['start']-begin),end=offset+min(length,w['end']-begin)) for w in measured)
  provenance.append(dict(source=str(p),start=begin,end=end,text=text));offset+=length
 # Use the actual approved navigation sentence for the DNA pilot.
 if mid=='dna':
  add_raw(B/'walkthrough/narration.wav',16.50,19.23,'Open the portfolio to prioritize workloads.',[dict(word=w,start=16.55+i*.38,end=16.55+(i+1)*.38) for i,w in enumerate('Open the portfolio to prioritize workloads.'.split())])
 for j,text in enumerate(m['narration']):
  if mid=='import':text=text.replace(', then carry that context into assessment.', '.').replace(', and review its six R recommendation.', '.')
  if mid=='dna' and j==3:
   p=OLD/'raw'/'123.wav';al=json.loads((OLD/'alignment/123.json').read_text());ws=al['words'];start=next(w['start'] for w in ws if norm(w['word'])=='next');tail=[w for w in ws if w['start']>=start]
   add_raw(p,max(0,start-.03),tail[-1]['end']+.1,'Next, ask what evidence is missing.',tail)
   p=OLD/'raw/109.wav';al=json.loads((OLD/'alignment/109.json').read_text());ws=al['words'];add_raw(p,0,8.15,BATCH[2]['narration'][1].split(' Ask EMOS')[0],[w for w in ws if w['start']<8.15])
  src=OLD/'raw'/f'{100+idx*4+j}.wav';a=json.loads((OLD/'alignment'/f'{100+idx*4+j}.json').read_text());heard=a['words'];original=text.split();mapping={}
  for mat in difflib.SequenceMatcher(None,[norm(w) for w in original],[norm(w['word']) for w in heard],autojunk=False).get_matching_blocks():
   for k in range(mat.size):mapping[mat.a+k]=mat.b+k
  cursor=0
  blocks=[]
  for sentence in sentences(text):
   if any(sentence.strip().startswith(x) for x in OMIT.get(mid,[])):blocks.append(sentence)
   elif blocks and not any(blocks[-1].strip().startswith(x) for x in OMIT.get(mid,[])):blocks[-1]+=' '+sentence
   else:blocks.append(sentence)
  for sent in blocks:
   sent=sent.strip();n=len(sent.split());lo=cursor;hi=cursor+n-1;cursor+=n
   if any(sent.startswith(x) for x in OMIT.get(mid,[])):continue
   first=min((k for k in mapping if lo<=k<=hi),default=None);last=max((k for k in mapping if lo<=k<=hi),default=None)
   if first is None or first>lo+1 or last<hi-1:raise ValueError((mid,sent,'alignment boundary'))
   aidx,bidx=mapping[first],mapping[last];start=max(0,heard[aidx]['start']-.035);end=min(dur(src),heard[bidx]['end']+(.40 if src.stem in ['128','130'] else .10))
   if src.stem in ['148','158','164','167','144','156'] and hi==len(original)-1:end=dur(src)-.02
   aligned=[]
   for k,w in enumerate(original[lo:hi+1],lo):
    h=heard[mapping[k]] if k in mapping else {'start':start+(end-start)*(k-lo)/n,'end':start+(end-start)*(k-lo+1)/n}
    aligned.append(dict(word=w,start=h['start'],end=h['end']))
   if aligned and src.stem in ['148','158','164','167','144','156']:aligned[-1]['end']=end-.02
   add_raw(src,start,end,sent,aligned)
 rate=max(1,offset/(86 if mid=='orientation' else 74 if mid in ['dna','decision','ask'] else 59))
 assert rate<=1.18,(mid,rate)
 (work/'audio.txt').write_text(''.join(f"file '{p}'\n" for p in parts));out=work/'narration.wav';run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(work/'audio.txt'),'-af',f'atempo={rate},loudnorm=I=-16:TP=-1.5:LRA=11','-ar','48000',str(out)])
 for w in words:w['start']/=rate;w['end']/=rate
 cues=[];group=[]
 for i,w in enumerate(words):
  group.append(w);txt=' '.join(a['word'] for a in group)
  nxt=words[i+1]['word'] if i+1<len(words) else ''
  if i==len(words)-1 or len(txt+' '+nxt)>85 or re.search('[.!?]$',w['word']):
   cues.append(dict(start=group[0]['start'],end=w['end'],text=txt));group=[]
 for i,c in enumerate(cues):c['end']=min(c['end']+.12,cues[i+1]['start']) if i+1<len(cues) else c['end']+.12
 assert all(len(wrap(c['text']))<=2 for c in cues)
 return dict(duration=dur(out),captions=cues,provenance=provenance,tempo=rate,words=words)
# Scene fractions establish the action sequence; framing never changes source UI text.
SCENES={
 'dna':[(0,'portfolio','UNDERSTAND / Portfolio Discovery'),(.06,'aerospace-dna','UNDERSTAND / Enterprise DNA'),(.28,'aerospace-attributes','UNDERSTAND / Evidence Context'),(.47,'aerospace-dna','GOVERN / Evidence Readiness'),(.66,'discovery-live','AI REASONING / Portfolio Discovery Specialist'),(.80,'aerospace-ready','UNDERSTAND / Evidence Readiness'),(.91,'aerospace-assess','DECIDE / Assess for Modernization')],
 'decision':[(0,'aerospace-assess','DECIDE / Assess for Modernization'),(.12,'aerospace-recommendation','DECIDE / 6R Decision Engine'),(.22,'retain','TRANSFORM / Govern & Monitor'),(.265,'retire','TRANSFORM / Safely Decommission'),(.31,'rehost','TRANSFORM / Migrate Infrastructure'),(.355,'replatform','TRANSFORM / Transition Platform'),(.40,'refactor','TRANSFORM / Transform Architecture'),(.445,'repurchase','TRANSFORM / Replace & Adopt'),(.49,'aerospace-alternatives','DECIDE / Compare All 6Rs'),(.70,'architect-live','AI REASONING / Enterprise Architect Specialist'),(.87,'human-approval-before','GOVERN / Human Approval')],
 'governance':[(0,'human-approval-before','GOVERN / Human Approval'),(.20,'aerospace-dna','GOVERN / Evidence Gate'),(.35,'aerospace-ready','GOVERN / Readiness'),(.48,'governance-zero-calls','GOVERN / Deterministic Validation'),(.64,'human-approval-before','GOVERN / Human Approval'),(.79,'human-approved','GOVERN / Human Approval'),(.91,'aerospace-execute','TRANSFORM / Transition Platform')],
 'orientation':[(0,'command','UNDERSTAND / Command Center'),(.16,'portfolio','UNDERSTAND / Portfolio Discovery'),(.30,'aerospace-dna','UNDERSTAND / Enterprise DNA'),(.43,'discovery-live','AI REASONING / Portfolio Discovery Specialist'),(.55,'architect-live','AI REASONING / Enterprise Architect Specialist'),(.68,'human-approved','GOVERN / Human Approval'),(.78,'aerospace-execute','TRANSFORM / 6R-Specific Execute'),(.88,'measure','OUTCOMES / Measure'),(.94,'learn','LEARN / Lessons & Session Notes')],
 'workspace':[(0,'command','UNDERSTAND / Command Center'),(.20,'portfolio','UNDERSTAND / Portfolio Discovery'),(.40,'aerospace-dna','UNDERSTAND / Enterprise DNA'),(.60,'aerospace-plan','TRANSFORM / Wave Planning'),(.77,'workspace-appearance','WORKSPACE / Appearance'),(.90,'portfolio','UNDERSTAND / Select a Workload')],
 'discovery':[(0,'portfolio','UNDERSTAND / Portfolio Discovery'),(.23,'aerospace-dna','UNDERSTAND / Enterprise DNA'),(.42,'discovery-live','AI REASONING / Portfolio Discovery Specialist'),(.72,'aerospace-attributes','UNDERSTAND / Evidence Context'),(.90,'aerospace-ready','UNDERSTAND / Next Evidence Action')],
 'ask':[(0,'aerospace-dna','UNDERSTAND / Enterprise DNA'),(.14,'discovery-question','AI REASONING / Ask EMOS'),(.28,'discovery-live','AI REASONING / Portfolio Discovery Specialist'),(.52,'architect-live','AI REASONING / Enterprise Architect Specialist'),(.72,'governance-zero-calls','GOVERN / Deterministic Validation'),(.89,'discovery-live','AI REASONING / Next Investigation')],
 'privacy-history':[(0,'workspace-history','WORKSPACE / Assessment History'),(.32,'history-filter','WORKSPACE / Find a Previous Assessment'),(.58,'history-open','WORKSPACE / Review a Decision'),(.83,'aerospace-dna','UNDERSTAND / Recheck the Evidence')],
 'import':[(0,'import-templates','UNDERSTAND / Portfolio Template'),(.20,'import-open','UNDERSTAND / Import Portfolio'),(.29,'import-validated','UNDERSTAND / Validate Portfolio'),(.40,'import-records','UNDERSTAND / Imported Workloads'),(.58,'import-dna','UNDERSTAND / Enterprise DNA'),(.90,'import-dna','UNDERSTAND / Evidence Readiness')],
 'security':[(0,'governance-zero-calls','GOVERN / Deterministic Controls'),(.40,'governance-block','GOVERN / Blocked Bypass'),(.66,'trust','TRUST / Product Boundaries'),(.85,'aerospace-dna','UNDERSTAND / Inspect Evidence Gaps')],
 'execution':[(0,'aerospace-plan','TRANSFORM / Wave Planning'),(.28,'aerospace-execute','TRANSFORM / Transition Platform'),(.48,'human-approval-before','GOVERN / Human Approval'),(.66,'human-approved','GOVERN / Approved Workload'),(.82,'banking-execute','TRANSFORM / Govern & Monitor')],
 'outcomes':[(0,'measure','OUTCOMES / Measure'),(.42,'measure','OUTCOMES / Reference Values'),(.55,'learn','LEARN / Lessons & Session Notes'),(.75,'learn-recorded','LEARN / Session Note')],
}
for k,label in [('retain','Govern & Monitor'),('retire','Safely Decommission'),('rehost','Migrate Infrastructure'),('replatform','Transition Platform'),('refactor','Transform Architecture'),('repurchase','Replace & Adopt')]:SCENES[k]=[(0,k,'TRANSFORM / '+label),(.18,k,'TRANSFORM / '+label),(.62,k,'TRANSFORM / Owners & Checkpoints'),(.86,k,'TRANSFORM / Next Governed Step')]
# Crop (x,y,width,height) in normalized 1728px screenshot after browser chrome removal.
CROPS={'workspace-history':(0,100,1100,533),'history-filter':(0,100,1100,533),'history-open':(240,95,1465,710),'discovery-live':(1090,95,630,305),'architect-live':(1060,155,660,320),'governance-block':(1060,355,660,320),'governance-zero-calls':(1040,300,680,330),'aerospace-attributes':(240,80,1460,708),'human-approval-before':(245,95,1020,494),'human-approved':(240,95,1470,712),'aerospace-recommendation':(240,95,1465,710),'aerospace-alternatives':(240,95,1465,710)}
for n in ['retain','retire','rehost','replatform','refactor','repurchase','aerospace-execute','banking-execute','measure','learn','learn-recorded']:CROPS[n]=(240,95,1465,710)
@lru_cache(maxsize=120)
def source(name,path=None):
 p=Path(path) if path else B/'screens'/f'{name}.png'
 if not p.exists():p=T/'captures'/f'{name}.png'
 im=Image.open(p).convert('RGB')
 if str(p).startswith(str(B)) or name in ['workspace-history','history-filter','history-open']:
  im=im.crop((0,round(im.width*90/1728),im.width,im.height));im=im.resize((1728,round(im.height*1728/im.width)),Image.Resampling.LANCZOS)
 return im
@lru_cache(maxsize=150)
def ui(name,detail,path=None):
 im=source(name,path)
 if detail and name in CROPS:
  x,y,w,h=CROPS[name];y=284 if detail==2 else y;y=min(y,max(0,im.height-h));im=im.crop((x,y,x+w,y+h));im=im.resize((W,U),Image.Resampling.LANCZOS);return im
 ratio=min(W/im.width,U/im.height);im=im.resize((round(im.width*ratio),round(im.height*ratio)),Image.Resampling.LANCZOS);out=Image.new('RGB',(W,U),'#f5f6fb');out.paste(im,((W-im.width)//2,(U-im.height)//2));return out

def prepare(mid):
 a=audio(mid);duration=a['duration'];sc=[]
 for i,(frac,name,label) in enumerate(SCENES[mid]):
  start=frac*duration;end=SCENES[mid][i+1][0]*duration if i+1<len(SCENES[mid]) else duration
  sc.append(dict(start=start,end=end,name=name,label=label,detail=frac>0 or mid in ['security'],recording=None))
 if mid=='dna':
  starts=[0,2.73,next(w['start'] for w in a['words'] if norm(w['word'])=='inspect'),next(w['start'] for w in a['words'] if norm(w['word'])=='deterministic')-.2,next(w['start'] for w in a['words'] if norm(w['word'])=='ask')-.35,next(w['start'] for w in a['words'] if norm(w['word'])=='verify'),next(w['start'] for w in a['words'] if norm(w['word'])=='carry')-.3]
  for i,s in enumerate(sc):s['start']=starts[i];s['end']=starts[i+1] if i+1<len(sc) else duration
 if mid=='governance':
  starts=[0,12.8,22.6,26.8,34.0,42.2,46.4]
  for i,s in enumerate(sc):s['start']=starts[i];s['end']=starts[i+1] if i+1<len(sc) else duration
 # Align navigation changes to measured spoken instructions.
 exact={
 'workspace':[(0,'command','UNDERSTAND / Command Center'),(11.5,'portfolio','UNDERSTAND / Portfolio Discovery'),(14.5,'aerospace-dna','UNDERSTAND / Enterprise DNA'),(16.62,'aerospace-recommendation','DECIDE / 6R Decision Engine'),(21.24,'human-approval-before','GOVERN / Human Approval'),(25.22,'aerospace-plan','TRANSFORM / Wave Planning'),(35.71,'workspace-appearance','WORKSPACE / Appearance'),(42.37,'portfolio','UNDERSTAND / Select a Workload')],
 'outcomes':[(0,'measure','OUTCOMES / Measure'),(10,'measure','OUTCOMES / Reference Values'),(17.45,'learn','LEARN / Lessons & Session Notes'),(29.55,'learn-recorded','LEARN / Session Note')],
 'ask':[(0,'aerospace-dna','UNDERSTAND / Enterprise DNA'),(4.04,'discovery-question','AI REASONING / Ask EMOS'),(15.10,'discovery-live','AI REASONING / Portfolio Discovery Specialist'),(28.68,'architect-live','AI REASONING / Enterprise Architect Specialist'),(36.22,'governance-zero-calls','GOVERN / Deterministic Validation'),(59.84,'human-approved','GOVERN / Human Approval'),(61.68,'discovery-live','AI REASONING / Next Investigation')],
 'execution':[(0,'aerospace-plan','TRANSFORM / Wave Planning'),(17.28,'aerospace-execute','TRANSFORM / Transition Platform'),(20.70,'human-approval-before','GOVERN / Human Approval'),(29,'human-approved','GOVERN / Approved Workload'),(31.98,'banking-execute','TRANSFORM / Govern & Monitor')],
 'import':[(0,'import-templates','UNDERSTAND / Portfolio Template'),(10.0,'import-open','UNDERSTAND / Import Portfolio'),(14.56,'import-validated','UNDERSTAND / Validate Portfolio'),(19.42,'import-records','UNDERSTAND / Imported Workloads'),(29.88,'import-dna','UNDERSTAND / Enterprise DNA'),(next(w['start'] for w in a['words'] if norm(w['word'])=='next'),'import-dna','UNDERSTAND / Evidence Readiness')]
 }
 if mid in exact:
  sc=[dict(start=t,end=exact[mid][i+1][0] if i+1<len(exact[mid]) else duration,name=n,label=l,detail=i>0,recording=None) for i,(t,n,l) in enumerate(exact[mid])]
 # Synchronize disposition previews to the exact spoken sentence instead of estimated scene fractions.
 if mid=='decision':
  for s in sc:
   if s['name'] in ['retain','retire','rehost','replatform','refactor','repurchase']:
    s['start']=next(w['start'] for w in a['words'] if norm(w['word'])==s['name'])
  sc.sort(key=lambda x:x['start'])
  for i,s in enumerate(sc[:-1]):s['end']=sc[i+1]['start']
 for s in sc:
  if mid in ['retain','retire','rehost','replatform','refactor','repurchase'] and s['start']>=duration*.60:s['detail']=2
  record='human-approval' if s['name']=='human-approved' else s['name'];p=B/'recordings'/record/'frames.json'
  if p.exists() and s['name'] not in ['governance-block','aerospace-alternatives']:
   frames=json.loads(p.read_text());s['recording']=[f for f in frames if f['t']<=1.1]
 a['scenes']=sc;a['id']=mid;a['voice']='Cillian';a['realUiPercent']=100;a['lightMode']=True;a['newCredits']=0
 (T/mid/'timeline.json').write_text(json.dumps(a,indent=2));return a

def frame(a,t):
 s=next(s for s in a['scenes'] if s['start']<=t<s['end']+.00001);elapsed=t-s['start'];path=None
 if s['recording'] and elapsed<1.1:
  frames=s['recording'];path=frames[max(0,bisect.bisect_right([f['t'] for f in frames],elapsed)-1)]['file']
 im=Image.new('RGB',(W,H),'#0a1322');im.paste(ui(s['name'],s['detail'],path),(0,0));d=ImageDraw.Draw(im)
 # Short indigo focus; a reserved footer callout never covers genuine controls.
 if 1.25<elapsed<3.25:
  if s['name']=='workspace-history':box=(160,12,515,900)
  elif s['name']=='history-filter':box=(12,10,670,900)
  elif s['detail']==2:box=(16,340,1850,710)
  elif s['detail'] and s['name'] in CROPS:box=(16,60,850,180) if s['name'] not in ['discovery-live','architect-live','governance-zero-calls','governance-block'] else (24,20,1894,890)
  elif s['name'] in ['aerospace-dna','aerospace-ready']:box=(315,255,960,335)
  elif s['name']=='aerospace-assess':box=(820,355,1450,430)
  else:box=(300,130,1680,260)
  d.rounded_rectangle(box,radius=10,outline=I,width=3)
 # Restrained pointer on the actual Enterprise DNA row button; action follows the cut.
 pointer_target=None
 if s['name']=='portfolio':pointer_target=(1565,604)
 if a['id']=='governance' and s['name']=='human-approval-before' and s['start']>30:pointer_target=(1580,437)
 if a['id']=='decision' and s['name']=='aerospace-assess':pointer_target=(1290,414)
 if pointer_target and s['end']-t<1.1:
  p=max(0,min(1,(1.1-(s['end']-t))/.8));x=pointer_target[0]-62+62*p;y=pointer_target[1]+51-51*p
  pts=[(x,y),(x+2,y+30),(x+10,y+24),(x+18,y+37),(x+24,y+33),(x+16,y+20),(x+27,y+19)];d.polygon(pts,fill=N);d.line(pts+[pts[0]],fill='white',width=2)
 d.line((0,U,W,U),fill='#a8a2e7',width=2)
 label=s['label'] if elapsed<3.3 else ''
 callout=''
 if a['id']=='governance' and s['name']=='aerospace-ready' and elapsed>3.3:callout='READY ≠ APPROVED'
 if a['id']=='dna' and s['name']=='aerospace-dna' and s['start']>a['duration']*.4 and elapsed>3.3:callout='EVIDENCE INSUFFICIENT → DECISION GATED'
 if a['id']=='decision' and s['name']=='aerospace-alternatives' and elapsed>3.3:callout='6R → EXECUTION PLAYBOOK'
 d.text((W/2,944),callout or label,font=font(23,True),fill='#d2d4e4',anchor='mt')
 c=next((c for c in a['captions'] if c['start']<=t<c['end']),None)
 if c:
  lines=wrap(c['text']);assert len(lines)<=2
  y=981 if len(lines)==2 else 1000
  for line in lines:d.text((W/2,y),line,font=font(37,True),fill='white',anchor='mt');y+=45
 return im

def render(mid,preview=False):
 a=prepare(mid);work=T/mid
 for i,s in enumerate(a['scenes']):frame(a,min(s['end']-.01,s['start']+2)).save(work/f'preview-{i:02}.jpg',quality=94)
 for page in range(math.ceil(len(a['scenes'])/6)):
  sheet=Image.new('RGB',(1280,1140),'#ddd');d=ImageDraw.Draw(sheet)
  for i,s in enumerate(a['scenes'][page*6:page*6+6]):
   x=i%2*640;y=i//2*380;sheet.paste(Image.open(work/f'preview-{page*6+i:02}.jpg').resize((640,360)),(x,y));d.text((x+8,y+362),f"{s['start']:.1f}s {s['name']}",fill='black')
  sheet.save(work/f'contact-{page}.jpg')
 if preview:print(mid,'preview',a['duration'],flush=True);return
 dest=O/f'emos-v2-{mid}.mp4';writer=subprocess.Popen(['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1920x1080','-r','12','-i','-','-i',str(work/'narration.wav'),'-r','24','-c:v','libx264','-preset','fast','-crf','20','-threads','4','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-t',str(a['duration']),str(dest)],stdin=subprocess.PIPE,stderr=open(work/'render.log','w'))
 for n in range(math.ceil(a['duration']*12)):
  writer.stdin.write(frame(a,min(n/12,a['duration']-.001)).tobytes())
 writer.stdin.close();assert writer.wait()==0
 frame(a,min(2,a['duration']/2)).save(O/f'emos-v2-{mid}.jpg',quality=94)
 transcript=' '.join(p['text'] for p in a['provenance']);(O/f'emos-v2-{mid}.txt').write_text(transcript+'\n')
 def stamp(t):
  m=round(t*1000);return f'{m//3600000:02}:{m//60000%60:02}:{m//1000%60:02},{m%1000:03}'
 (O/f'emos-v2-{mid}.srt').write_text('\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for i,c in enumerate(a['captions']))+'\n')
 report={k:v for k,v in a.items() if k not in ['words']};report.update(durationSeconds=dur(dest),sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),burnedInCaptions=True,maxCaptionLines=2,captionControlCollisions=0,qa='pending in-product review',renderFps=24,sourceSamplingFps=12)
 (Q/f'{mid}.json').write_text(json.dumps(report,indent=2)+'\n');print(mid,'rendered',round(report['durationSeconds'],2),flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('ids',nargs='+');p.add_argument('--preview',action='store_true');a=p.parse_args()
 if any(mid not in PILOTS for mid in a.ids):
  gate=Q/'pilot-gate.json';assert gate.exists() and json.loads(gate.read_text())['passed'],'Complete in-product pilot QA before batch work.'
 for mid in a.ids:render(mid,a.preview)
