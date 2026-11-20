"""Finish Higgsfield outputs with real EMOS captures and burned-in phrase captions.

Inputs stay in /tmp/emos-v2-media. Only final MP4s, posters, and verification
metadata are published. Requires Pillow and faster-whisper for prior alignment.
"""
import argparse, difflib, hashlib, json, re, subprocess, textwrap
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

REPO=Path(__file__).resolve().parents[1]
ROOT=Path('/tmp/emos-v2-media')
BATCH=json.loads((REPO/'docs/learning/v2/generation-batch.json').read_text())
OUT=REPO/'public/media/learning'
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
SCREENS={
 'orientation':['workspace','dna','governance'], 'workspace':['workspace','portfolio','workspace'],
 'discovery':['portfolio','dna','ask'], 'dna':['dna','dna','governance'],
 'decision':['decision','governance','dna'], 'ask':['ask','ask','governance'],
 'governance':['governance','execution','governance'], 'privacy-history':['history','history','workspace'],
 'import':['import','portfolio','dna'], 'security':['governance','execution','ask'],
 'execution':['plan','execution','execution'], 'outcomes':['measure','learn','learn'],
 **{d:[d,d,d] for d in ['retain','retire','rehost','replatform','refactor','repurchase']}}

def run(args):
 subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)

def duration(path):
 return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(path)]))

def norm(word):
 value=re.sub(r'[^a-z0-9]','',word.lower())
 return {'18':'eighteen','70':'seventy','6':'six'}.get(value,value)

def align_text(text,alignment,offset,rate):
 original=text.split(); heard=[w for w in alignment['words'] if w['end']-w['start'] >= 0.035]; a=[norm(w) for w in original]; b=[norm(w['word']) for w in heard]
 matcher=difflib.SequenceMatcher(None,a,b,autojunk=False); known={}
 for match in matcher.get_matching_blocks():
  for k in range(match.size):known[match.a+k]=(heard[match.b+k]['start'],heard[match.b+k]['end'])
 ratio=matcher.ratio()
 if ratio<0.76:raise ValueError(f'Audio requires review ({ratio:.2f}): {text}\nHeard: '+ ' '.join(w['word'] for w in heard))
 # Anchor exact words to measured timestamps; interpolate only spelling/tokenization differences.
 starts=[]
 for i in range(len(original)):
  if i in known:starts.append(known[i][0]);continue
  before=max([k for k in known if k<i],default=-1);after=min([k for k in known if k>i],default=len(original))
  lo=known[before][1] if before>=0 else 0;hi=known[after][0] if after<len(original) else alignment['duration']
  starts.append(lo+(hi-lo)*(i-before)/(after-before))
 groups=[];begin=0
 for i in range(len(original)):
  phrase=' '.join(original[begin:i+1]);next_len=len(phrase)+1+(len(original[i+1]) if i+1<len(original) else 0)
  if i==len(original)-1 or next_len>88 or (len(phrase)>35 and re.search(r'[.!?;:]$',original[i])):
   start=starts[begin];end=starts[i+1] if i+1<len(original) else alignment['duration']
   groups.append({'text':phrase,'start':offset+start/rate,'end':offset+end/rate});begin=i+1
 return groups,ratio

def text_center(draw,text,y,font,fill,max_width=1740):
 words=text.split();lines=[];line=''
 for word in words:
  candidate=(line+' '+word).strip()
  if draw.textlength(candidate,font=font)>max_width and line:lines.append(line);line=word
  else:line=candidate
 if line:lines.append(line)
 for line in lines:
  draw.text((960,y),line,anchor='mt',font=font,fill=fill);y+=font.size+10
 return len(lines)

def overlay(master,chapter,caption,path):
 im=Image.new('RGBA',(1920,1080),(7,12,27,150));d=ImageDraw.Draw(im)
 d.rectangle((0,0,1920,132),fill=(9,15,32,245));d.rectangle((65,48,71,88),fill='#b7a3ef')
 d.text((90,38),'EMOS',font=ImageFont.truetype(BOLD,32),fill='white')
 d.text((90,79),'LEARNING CENTER  /  V2',font=ImageFont.truetype(FONT,17),fill='#c1badb')
 titlefont=ImageFont.truetype(BOLD,38 if len(master['title'])>42 else 44)
 d.text((440,50),master['title'],font=titlefont,fill='#f4f2fc')
 if chapter>0:
  shot=Image.open(ROOT/'screens'/(SCREENS[master['id']][chapter-1]+'.jpg')).convert('RGB')
  shot.thumbnail((1360,752),Image.Resampling.LANCZOS)
  x=(1920-shot.width)//2;y=150
  d.rounded_rectangle((x-5,y-5,x+shot.width+5,y+shot.height+5),radius=10,fill='#55516f')
  im.paste(shot,(x,y))
  d.text((960,914),'CURRENT EMOS V2  •  SYNTHETIC DEMONSTRATION DATA',anchor='mm',font=ImageFont.truetype(FONT,17),fill='#d3cce3')
 else:
  d.rounded_rectangle((250,292,1670,710),radius=24,fill=(9,15,32,210),outline='#68617e',width=2)
  d.text((960,330),'UNDERSTAND  →  DECIDE  →  GOVERN  →  TRANSFORM  →  OUTCOMES',anchor='mt',font=ImageFont.truetype(FONT,24),fill='#bfb3e1')
  text_center(d,master['title'],430,ImageFont.truetype(BOLD,64),'white',1300)
  d.text((960,640),'Evidence informs. Humans authorize.',anchor='mt',font=ImageFont.truetype(FONT,30),fill='#c4bbda')
 d.rectangle((0,938,1920,1080),fill=(7,12,27,255))
 n=text_center(d,caption,956,ImageFont.truetype(BOLD,38),'white',1660)
 if n>2:raise ValueError('Caption exceeds two lines: '+caption)
 im.save(path)

def render(index,master):
 work=ROOT/'render'/master['id'];work.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True)
 inputs=[];alignments=[]
 for segment in range(4):
  source=ROOT/'raw'/f'{100+index*4+segment}.wav'
  alignment=json.loads((ROOT/'alignment'/f'{100+index*4+segment}.json').read_text())
  heard=[w for w in alignment['words'] if w['end']-w['start']>=0.035]
  original=master['narration'][segment].split()
  matches=difflib.SequenceMatcher(None,[norm(w) for w in original],[norm(w['word']) for w in heard],autojunk=False).get_matching_blocks()
  pairs=[(m.a+k,m.b+k) for m in matches for k in range(m.size)]
  if not pairs:raise ValueError('No narration alignment')
  start=max(0,heard[pairs[0][1]]['start']-0.06)
  end=min(duration(source),heard[pairs[-1][1]]['end']+0.16)
  if pairs[0][0]>1 or pairs[-1][0]<len(original)-3:raise ValueError(f'Missing narration boundary: {master["id"]}/{segment}')
  trimmed=work/f'audio-{segment}.wav'
  run(['ffmpeg','-y','-v','error','-ss',str(start),'-i',str(source),'-t',str(end-start),'-c:a','pcm_s16le',str(trimmed)])
  alignment['words']=[{**w,'start':max(0,w['start']-start),'end':min(end-start,w['end']-start)} for w in heard if w['end']>start and w['start']<end]
  alignment['duration']=end-start
  alignment['trimStart']=start;alignment['trimEnd']=end
  alignments.append(alignment);inputs.append(trimmed)
 raw_durations=[duration(p) for p in inputs];total=sum(raw_durations)
 rate=max(1,total/(master['maxSeconds']-0.4))
 if rate>1.50:raise ValueError(f'{master["id"]} narration too long: {total:.2f}s, requires {rate:.2f}x')
 cues=[];ratios=[];offset=0
 for segment in range(4):
  alignment=alignments[segment]
  # ffprobe duration controls boundaries; word timestamps are measured from the generated narration.
  alignment['duration']=raw_durations[segment]
  part,ratio=align_text(master['narration'][segment],alignment,offset,rate)
  if part:part[0]['start']=offset
  for c in part:c['chapter']=segment
  cues+=part;ratios.append(ratio);offset+=raw_durations[segment]/rate
 (work/'audio.txt').write_text(''.join(f"file '{p}'\n" for p in inputs))
 audio=work/'narration.wav'
 run(['ffmpeg','-y','-v','error','-f','concat','-safe','0','-i',str(work/'audio.txt'),'-af',f'atempo={rate},loudnorm=I=-16:TP=-1.5:LRA=11','-ar','48000',str(audio)])
 final_duration=duration(audio)
 cues[-1]['end']=final_duration
 for i,c in enumerate(cues):
  if i+1<len(cues):c['end']=cues[i+1]['start']
  overlay(master,c['chapter'],c['text'],work/f'{i:03}.png')
 (work/'frames.txt').write_text(''.join(f"file '{work}/{i:03}.png'\nduration {c['end']-c['start']:.6f}\n" for i,c in enumerate(cues))+f"file '{work}/{len(cues)-1:03}.png'\n")
 dest=OUT/f'emos-v2-{master["id"]}.mp4'
 run(['ffmpeg','-y','-v','error','-stream_loop','-1','-i',str(ROOT/'raw'/f'{index}.mp4'),'-f','concat','-safe','0','-i',str(work/'frames.txt'),'-i',str(audio),'-filter_complex','[0:v]scale=1920:1080,setsar=1,fps=24[bg];[bg][1:v]overlay=0:0:format=auto,format=yuv420p[v]','-map','[v]','-map','2:a','-t',str(final_duration),'-c:v','libx264','-preset','fast','-crf','25','-threads','4','-c:a','aac','-b:a','160k','-movflags','+faststart',str(dest)])
 poster=OUT/f'emos-v2-{master["id"]}.jpg'
 run(['ffmpeg','-y','-v','error','-ss','1','-i',str(dest),'-frames:v','1','-q:v','2',str(poster)])
 # Publish an accessible text transcript as an additional resource; captions are already pixels in the MP4.
 (OUT/f'emos-v2-{master["id"]}.txt').write_text(master['title']+'\n\n'+'\n\n'.join(master['narration'])+'\n')
 report={'id':master['id'],'durationSeconds':duration(dest),'voice':'Cillian','burnedInCaptions':True,'captionCount':len(cues),'maxCaptionLines':2,'narrationTempo':rate,'alignmentRatios':ratios,'audioTrims':[{'start':a['trimStart'],'end':a['trimEnd']} for a in alignments],'captions':cues,'file':dest.name,'bytes':dest.stat().st_size,'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'realScreens':SCREENS[master['id']],'qa':'pending_visual_and_playback_review'}
 (REPO/'docs/learning/v2'/f'qa-{master["id"]}.json').write_text(json.dumps(report,indent=2)+'\n')
 print(master['id'],round(report['durationSeconds'],2),'seconds',round(report['bytes']/1e6,2),'MB',flush=True)

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('ids',nargs='*');args=parser.parse_args()
 for i,m in enumerate(BATCH['masters']):
  if not args.ids or m['id'] in args.ids:render(i,m)
