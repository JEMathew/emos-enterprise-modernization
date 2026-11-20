"""Compose the flagship from recorded production UI, Higgsfield footage and Cillian audio."""
import bisect,difflib,hashlib,json,math,re,subprocess
from functools import lru_cache
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path('/tmp/emos-flagship');REPO=Path(__file__).resolve().parents[1];OUT=REPO/'public/media/flagship';OUT.mkdir(parents=True,exist_ok=True)
PLAN=json.loads((REPO/'docs/learning/flagship/production-plan.json').read_text());FPS=24;W,H=1920,1080;TARGET=87.5
FONT='/System/Library/Fonts/Supplemental/Arial.ttf';BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
def norm(t):
 t=re.sub('[^a-z0-9]','',t.lower());return {'modernisation':'modernization','rational':'rationale','6':'six','emoss':'emos'}.get(t,t)
def run(args):subprocess.run(args,check=True,stdout=subprocess.DEVNULL)
segments=[];total=0
for i,script in enumerate(PLAN['narration']):
 original=script.split();candidates=[]
 for source in ['alignment-small','alignment']:
  alignment=ROOT/source/f'{i}.json'
  if not alignment.exists():continue
  words=[w for w in json.loads(alignment.read_text())['words'] if w['end']-w['start']>=.025]
  matcher=difflib.SequenceMatcher(None,[norm(w) for w in original],[norm(w['word']) for w in words],autojunk=False)
  candidates.append((matcher.ratio(),source,words,matcher))
 ratio,source,words,matcher=max(candidates,key=lambda c:c[0]);known={}
 for m in matcher.get_matching_blocks():
  for k in range(m.size):known[m.a+k]=(words[m.b+k]['start'],words[m.b+k]['end'])
 assert matcher.ratio()>.70,(i,matcher.ratio())
 assert max(known)==len(original)-1,(i,'Narration ending requires review')
 start=max(0,known[min(known)][0]-.05);end=known[max(known)][1]+.07
 times=[]
 for k in range(len(original)):
  if k in known:times.append(known[k][0]-start);continue
  before=max([j for j in known if j<k],default=-1);after=min([j for j in known if j>k],default=len(original));lo=known[before][1] if before>=0 else start;hi=known[after][0] if after<len(original) else end
  times.append(lo+(hi-lo)*(k-before)/(after-before)-start)
 segments.append({'script':script,'original':original,'times':times,'start':start,'end':end,'duration':end-start,'alignmentRatio':matcher.ratio()});total+=end-start
rate=total/(TARGET-.4);offset=.2
captions=[]
for i,s in enumerate(segments):
 s['offset']=offset;s['scaledDuration']=s['duration']/rate
 run(['ffmpeg','-v','error','-y','-i',str(ROOT/'raw'/f'{i}.wav'),'-af',f"atrim=start={s['start']}:end={s['end']},asetpts=PTS-STARTPTS,atempo={rate}",'-ar','48000','-ac','1',str(ROOT/f'voice-{i}.wav')])
 begin=0
 for j,word in enumerate(s['original']):
  phrase=' '.join(s['original'][begin:j+1]);next_length=len(phrase)+1+(len(s['original'][j+1]) if j+1<len(s['original']) else 0)
  if j==len(s['original'])-1 or next_length>79 or (len(phrase)>28 and re.search(r'[.!?;:]$',word)):
   start=offset+max(0,s['times'][begin])/rate;end=offset+(s['times'][j+1] if j+1<len(s['original']) else s['duration'])/rate
   captions.append({'text':phrase,'start':start,'end':end});begin=j+1
 offset+=s['scaledDuration']
(ROOT/'voice-concat.txt').write_text(''.join(f"file '{ROOT}/voice-{i}.wav'\n" for i in range(6)))
run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i',str(ROOT/'voice-concat.txt'),'-af','adelay=200:all=1,apad=pad_dur=0.3,loudnorm=I=-16:TP=-1.5:LRA=9','-t',str(TARGET),str(ROOT/'narration.wav')])
def at(i,phrase):
 s=segments[i];a=[norm(w) for w in s['original']];b=[norm(w) for w in phrase.split()]
 for k in range(len(a)-len(b)+1):
  if a[k:k+len(b)]==b:return s['offset']+max(0,s['times'][k])/rate
 raise ValueError(phrase)
# Each product shot is a recorded real UI interaction followed by a restrained focus move.
scenes=[(0,'context',''),(6,'command','UNDERSTAND'),(at(1,'Start'),'portfolio','UNDERSTAND'),(at(1,'Enterprise DNA'),'dna','UNDERSTAND'),(at(1,'missing evidence'),'dna-structured','UNDERSTAND'),(at(1,'Compare'),'decision','DECIDE'),(at(1,'Replatform'),'alternatives','DECIDE'),(at(1,'rationale'),'evidence','DECIDE'),(at(2,'Through'),'ask','ASK EMOS'),(at(2,'Portfolio Discovery'),'ask-evidence','ASK EMOS'),(at(3,'AI cannot'),'governance','GOVERN'),(at(3,'The chosen'),'plan','TRANSFORM')]
play_start=at(3,'its own');play_end=at(4,'Measure');playbooks=['retain-detail','retire-detail','rehost-detail','replatform-detail','execute-detail','repurchase-detail']
for i,name in enumerate(playbooks):scenes.append((play_start+(play_end-play_start)*i/6,name,'TRANSFORM'))
scenes += [(at(4,'Measure'),'measure-detail','OUTCOMES'),(at(4,'Learn'),'learn','LEARN'),(at(4,'session-only'),'learn-recorded','LEARN'),(at(4,'V2 proves'),'command','V2 TODAY'),(at(4,'Workload characteristics'),'dna-structured','WORKLOAD-FIRST'),(at(5,'Google Cloud'),'command','CURRENT REFERENCE IMPLEMENTATION')]
close_start=min(at(5,'Enterprise-controlled'),6+.84*TARGET);scenes.append((close_start,'vision','TARGET VISION'));scenes=sorted(scenes)
for i,(start,name,label) in enumerate(scenes):
 end=scenes[i+1][0] if i+1<len(scenes) else TARGET
 assert end>start,(name,start,end)
manifest=[{'start':s,'end':scenes[i+1][0] if i+1<len(scenes) else TARGET,'name':n,'stage':l,'realLightUi':n not in ['context','vision']} for i,(s,n,l) in enumerate(scenes)]
(ROOT/'timeline.json').write_text(json.dumps({'duration':TARGET,'narrationRate':rate,'segments':segments,'captions':captions,'scenes':manifest,'realUiSeconds':close_start-6,'realUiPercent':100*(close_start-6)/TARGET},indent=2))
print('Timeline prepared',TARGET,'seconds; UI',round(100*(close_start-6)/TARGET,2),'%; rate',rate,flush=True)
# Decode only the generated contextual clip; never generate or recolor product UI.
context=ROOT/'context-frames';context.mkdir(exist_ok=True)
run(['ffmpeg','-v','error','-y','-i',str(ROOT/'raw/10.mp4'),'-vf','fps=24,scale=1920:1080','-q:v','3',str(context/'%04d.jpg')])
context_files=sorted(context.glob('*.jpg'));recordings={}
for _,name,_ in scenes:
 p=ROOT/'recordings'/name/'frames.json'
 if p.exists():recordings[name]=json.loads(p.read_text())
@lru_cache(maxsize=180)
def read_image(path):return Image.open(path).convert('RGB')
font=ImageFont.truetype(BOLD,38);small=ImageFont.truetype(FONT,20);label_font=ImageFont.truetype(BOLD,22);vision_font=ImageFont.truetype(BOLD,64)
def wrap(draw,text,font,width):
 lines=[];line=''
 for word in text.split():
  new=(line+' '+word).strip()
  if draw.textlength(new,font=font)>width and line:lines.append(line);line=word
  else:line=new
 if line:lines.append(line)
 return lines
cap_starts=[x['start'] for x in captions];scene_starts=[x[0] for x in scenes]
command=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s','1920x1080','-r',str(FPS),'-i','-','-i',str(ROOT/'narration.wav'),'-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart','-t',str(TARGET),str(OUT/'emos-v2-vision.mp4')]
proc=subprocess.Popen(command,stdin=subprocess.PIPE);maxlines=0
for frame in range(round(TARGET*FPS)):
 t=frame/FPS;idx=max(0,bisect.bisect_right(scene_starts,t)-1);start,name,label=scenes[idx];end=manifest[idx]['end'];progress=(t-start)/(end-start)
 if name in ['context','vision']:
  # Separate portions of one continuous dolly, subtly slowed for the vision close.
  phase=(t/6*.45) if name=='context' else .45+(t-start)/(TARGET-start)*.55
  im=read_image(str(context_files[min(len(context_files)-1,int(phase*(len(context_files)-1)))])).copy()
  shade=Image.new('RGBA',(W,H),(8,17,31,95));im=Image.alpha_composite(im.convert('RGBA'),shade).convert('RGB');d=ImageDraw.Draw(im)
  if name=='context':
   d.text((80,65),'EMOS',font=ImageFont.truetype(BOLD,34),fill='white')
   d.text((80,110),'Enterprise Modernization Operating System',font=ImageFont.truetype(FONT,25),fill='#edf0f7')
  else:
   d.text((80,100),'TARGET VISION',font=label_font,fill='#d9d4ff')
   d.text((80,165),'Enterprise-controlled.',font=vision_font,fill='white');d.text((80,246),'Or managed SaaS.',font=vision_font,fill='white')
   d.text((84,365),'Retained / private  ·  Public cloud  ·  SaaS / packaged platforms',font=ImageFont.truetype(FONT,27),fill='#f2f1f8')
   d.text((84,435),'Workload fit determines the destination.',font=ImageFont.truetype(FONT,29),fill='white')
 else:
  rec=recordings.get(name);elapsed=t-start
  # Preserve captured action timing, then continue with a gentle documentary camera move.
  if rec and elapsed<min(1.35,(end-start)*.35):
   rt=elapsed/min(1.35,(end-start)*.35)*min(1.35,rec[-1]['t']);k=max(0,bisect.bisect_right([f['t'] for f in rec],rt)-1);src=read_image(rec[k]['file'])
  else:src=read_image(str(ROOT/'screens'/f'{name}.jpg'))
  sw,sh=src.size;zoom=1+.018*progress;cw=sw/zoom;ch=cw*930/1920
  # The capture is panned within its real pixels; important content stays above the caption band.
  yfocus=0 if name not in ['learn','learn-recorded','measure-detail','execute-detail','retain-detail','retire-detail','rehost-detail','replatform-detail','repurchase-detail'] else min(sh-ch,70)
  x=(sw-cw)/2;y=min(sh-ch,yfocus+12*progress)
  cropped=src.crop((round(x),round(y),round(x+cw),round(y+ch))).resize((W,930),Image.Resampling.LANCZOS)
  im=Image.new('RGB',(W,H),'#0a1322');im.paste(cropped,(0,0));d=ImageDraw.Draw(im)
 # Captions occupy their own band, never cover original UI pixels.
 d.rectangle((0,930,W,H),fill='#0a1322');d.line((0,930,W,930),fill='#b7add6',width=2)
 if name not in ['context','vision']:
  disclosure='REAL EMOS V2 · LIGHT MODE · SYNTHETIC DEMONSTRATION'
  if name.startswith('ask'):disclosure='ASK EMOS · DEMONSTRATION SHOWS DISCLOSED LOCAL FALLBACK'
  if name.startswith('measure'):disclosure='MEASURE · REPRESENTATIVE SYNTHETIC OUTCOMES'
  if name.startswith('learn'):disclosure='LEARN · SESSION-ONLY NOTES · NO AUTOMATED RETRAINING'
  if label=='CURRENT REFERENCE IMPLEMENTATION':disclosure='CURRENT V2 IMPLEMENTATION: GOOGLE CLOUD · MODERNIZATION TARGETS REMAIN EVIDENCE-LED'
  d.text((W/2,944),disclosure,font=small,fill='#c4c9d7',anchor='mt')
 ci=bisect.bisect_right(cap_starts,t)-1
 if ci>=0 and t<=captions[ci]['end']+.05:
  lines=wrap(d,captions[ci]['text'],font,1760);maxlines=max(maxlines,len(lines));assert len(lines)<=2
  y=982 if len(lines)==2 else 1000
  for line in lines:d.text((W/2,y),line,font=font,fill='white',anchor='mt');y+=45
 proc.stdin.write(im.tobytes())
 if frame%(FPS*10)==0:print('Rendered',round(t),'seconds',name,flush=True)
proc.stdin.close();assert proc.wait()==0
# Poster is an unchanged real product capture; layout treatment belongs to the page.
import shutil
shutil.copy(ROOT/'screens/decision.jpg',OUT/'emos-v2-vision.jpg')
(OUT/'emos-v2-vision.txt').write_text('\n\n'.join(PLAN['narration'])+'\n')
result={'durationSeconds':TARGET,'realLightUiPercent':round(100*(close_start-6)/TARGET,2),'conceptualPercent':round(100*(TARGET-close_start+6)/TARGET,2),'voice':'Cillian','voiceId':PLAN['audio'][0]['params']['voice_id'],'burnedInCaptions':True,'maxCaptionLines':maxlines,'captionUiCollision':False,'realProductShots':[s for s in manifest if s['realLightUi']],'sourceCaptureManifest':'capture-manifest.json','narrationTempo':rate,'sha256':hashlib.sha256((OUT/'emos-v2-vision.mp4').read_bytes()).hexdigest(),'reviewStatus':'pending_visual_quality_gate'}
(REPO/'docs/learning/flagship/render-qa.json').write_text(json.dumps(result,indent=2)+'\n')
print('FINISHED',json.dumps(result),flush=True)
