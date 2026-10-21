"""Add the operator's own 18+ community rule; preserve all existing rules/design."""
from pathlib import Path
import re,json,hashlib
R=Path(__file__).resolve().parents[1]
row=('        <article><span class="number">01</span><div><h3>Sei volljährig.</h3>'
 '<p>Unsere Community ist ab 18. Mit deinem Beitritt zu unserem Discord bestätigst du, '
 'dass du mindestens 18 Jahre alt und an deinem Wohnort volljährig bist. '
 'Das ist Voraussetzung für die Teilnahme auf Discord und auf unserem Gameserver. '
 'Für Minderjährige ist die Teilnahme ausgeschlossen.</p></div><span class="rule-tag">18+</span></article>')
report={}
for name in ['index.html','regelwerk.html']:
 p=R/'website/regelwerk'/name;raw=p.read_bytes();text=raw.decode('utf-8')
 start=text.index('    <section class="rules section" id="community">');end=text.index('    </section>',start)
 block=text[start:end];numbers=re.findall(r'<span class="number">(\d+)</span>',block);assert numbers==['01','02','03','04']
 block=re.sub(r'(<span class="number">)(\d+)(</span>)',lambda m:m[1]+f'{int(m[2])+1:02d}'+m[3],block)
 ending='\r\n'if '\r\n'in block else '\n';anchor='      <div class="rule-list">'+ending;assert block.count(anchor)==1
 block=block.replace(anchor,anchor+row+ending,1)
 updated=text[:start]+block+text[end:]
 assert updated.count('Regelwerk · Stand: 17. Oktober 2026')==1
 updated=updated.replace('Regelwerk · Stand: 17. Oktober 2026','Regelwerk · Stand: 21. Oktober 2026',1)
 p.write_bytes(updated.encode('utf-8'))
 # Existing article contents and structure remain byte-identical after removing new row/renumbering/date.
 restored=block.replace(row+ending,'',1)
 restored=re.sub(r'(<span class="number">)(\d+)(</span>)',lambda m:m[1]+f'{int(m[2])-1:02d}'+m[3],restored)
 assert restored==text[start:end]
 report[name]={'oldSha256':hashlib.sha256(raw).hexdigest(),'newSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'communityNumbers':[f'{i:02d}'for i in range(1,6)],'oldRulesPreserved':True,'designPreserved':True}
print(json.dumps(report))
