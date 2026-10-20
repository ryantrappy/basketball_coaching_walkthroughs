import type { Concept, ConceptGroup, ConceptId } from './types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface ConceptMenuProps {
 lessons: Concept[];
 activeId: ConceptId;
 openGroup: ConceptGroup | null;
 onToggle: (group: ConceptGroup) => void;
 onSelect: (id: ConceptId) => void;
}

export default function ConceptMenu({ lessons, activeId, openGroup, onToggle, onSelect }: ConceptMenuProps) {
 const groups = [...new Set(lessons.map(lesson=>lesson.group))];
 return <nav className="concept-groups" aria-label="Basketball concepts">
  {groups.map(group=>{
   const items=lessons.filter(lesson=>lesson.group===group);
   const expanded=openGroup===group;
   const containsCurrent=items.some(lesson=>lesson.id===activeId);
   const panelId=`concepts-${group.toLowerCase().replace(/[^a-z0-9]+/g,'-')}`;
   return <div key={group} className={`concept-group ${containsCurrent?'contains-current':''}`}>
    <button className="group-toggle" aria-label={group} aria-expanded={expanded} aria-controls={panelId} onClick={()=>onToggle(group)}>
     <span className="group-title">{group}</span>
     <span className="group-count" aria-hidden="true">{items.length}</span>
     <ChevronDown className="group-chevron" size={15} aria-hidden="true"/>
    </button>
    <div id={panelId} className="group-plays" role="group" aria-label={group} hidden={!expanded}>
     {items.map(lesson=><button key={lesson.id} className={`concept-option ${lesson.id===activeId?'active':''}`} onClick={()=>onSelect(lesson.id)} aria-current={lesson.id===activeId?'page':undefined}>
      <span className="play-dot" aria-hidden="true"/>
      <strong>{lesson.name}</strong>
      {lesson.id===activeId&&<ChevronRight size={15} aria-hidden="true"/>}
     </button>)}
    </div>
   </div>;
  })}
 </nav>;
}
