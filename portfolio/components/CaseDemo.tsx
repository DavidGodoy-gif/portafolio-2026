"use client";
import {useId, useRef, useState} from 'react';
import styles from './CaseDemo.module.css';

type Value = {kind?: string; label?: string; caption?: string};
export default function CaseDemo({value}: {value: Value}) {
  const id = useId();
  const field = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState('Presencial');
  const [status, setStatus] = useState('Ejemplo preparado.');
  const [sample, setSample] = useState('');
  const [touched, setTouched] = useState(false);
  const valid = sample.length >= 4;
  let content;
  switch (value.kind) {
    case 'passwordCreation': content = <div className={styles.field}>
      <label htmlFor={id}>Clave ficticia del ejemplo</label>
      <small id={id+'-help'}>Condición inventada para este ejemplo: al menos 4 caracteres. Usa texto ficticio.</small>
      <div className={styles.inline}><input id={id} type={visible ? 'text' : 'password'} value={sample} autoComplete="off" spellCheck={false} aria-describedby={id+'-help '+id+'-state'} aria-invalid={touched && !valid} onChange={e=>{setSample(e.target.value);setTouched(true);}} onBlur={()=>{if(sample)setTouched(true);}} />
        <button type="button" aria-controls={id} aria-pressed={visible} aria-label={visible ? 'Ocultar clave ficticia' : 'Mostrar clave ficticia'} onClick={()=>setVisible(!visible)}>{visible ? 'Ocultar' : 'Mostrar'}</button></div>
      <small id={id+'-state'} role="status" className={touched && !valid ? styles.error : undefined}>{!touched ? '— Estado inicial: escribe un texto ficticio para probar.' : valid ? '✓ Correcto para el ejemplo: cumple la condición ficticia.' : '! Por revisar: escribe al menos 4 caracteres para este ejemplo.'}</small>
    </div>; break;
    case 'iterationAdjustments': content = <div className={styles.grid}>
      {[['Estado inicial','Incorporé un estado neutro antes de señalar un error.'],['Espera','Destaqué el temporizador para hacer visible el tiempo restante.'],['Acciones y mensajes','Simplifiqué textos y ajusté controles ambiguos.']].map(([title,text])=><div className={styles.card} key={title}><strong>{title}</strong><p>{text}</p></div>)}
    </div>; break;
    case 'passwordVisibility': content = <div className={styles.field}>
      <label htmlFor={id}>Clave ficticia</label>
      <div className={styles.inline}><input id={id} type={visible ? 'text' : 'password'} value="Ejemplo-2026" readOnly autoComplete="off" spellCheck={false} />
        <button type="button" aria-controls={id} aria-pressed={visible} aria-label={visible ? 'Ocultar clave ficticia' : 'Mostrar clave ficticia'} onClick={()=>setVisible(!visible)}>{visible ? 'Ocultar' : 'Mostrar'}</button></div>
      <small role="status">{visible ? 'Clave visible.' : 'Clave oculta.'}</small>
    </div>; break;
    case 'componentVariants': content = <div className={styles.groups}>
      <section><h4>Mismo comportamiento, distinto contenido.</h4><div className={styles.grid}>
        {['Una actividad para compartir.', 'Una actividad para compartir ideas y conocer distintas formas de resolver una tarea.'].map(text=><div className={styles.card} key={text}><p>{text}</p><button type="button" onClick={()=>setStatus('Acción de ejemplo seleccionada; no abre otro servicio.')}>Ver actividad</button></div>)}
      </div></section>
      <section><h4>Comportamiento diferente, definición específica.</h4><div className={styles.grid}>
        <div className={styles.card}><strong>Información de la actividad</strong><p>Material disponible para lectura.</p></div>
        <details className={styles.card}><summary>Consultar detalles de la actividad</summary><p>Este contenido se despliega desde la misma tarjeta.</p></details>
      </div></section><small role="status">{status}</small>
    </div>; break;
    case 'buttonStates': content = <><div className={styles.grid}>
      <div className={styles.card}><span>Normal · Acción reconocible</span><button type="button" onClick={()=>setStatus('Activación de ejemplo; no se ejecutó una operación.')}>Ver ejemplo</button></div>
      <div className={styles.card}><span>Foco por teclado · Respuesta visible</span><button type="button" className={styles.focusExample} onClick={()=>setStatus('Recorre los botones con Tab para comprobar el foco.')}>Probar con Tab</button><small>El contorno ilustra el foco; Tab activa el foco real.</small></div>
      <div className={styles.card}><span>Cargando · Respuesta visible</span><button type="button" disabled aria-busy="true">Cargando ejemplo…</button><small>Estado ilustrado, sin operación en curso.</small></div>
      <div className={styles.card}><span>Deshabilitado · Disponibilidad explícita</span><button type="button" disabled>No disponible</button></div>
    </div><small role="status">{status}</small></>; break;
    case 'fieldFeedback': content = <div className={styles.field}>
      <label htmlFor={id}>Nombre de la actividad</label><small id={id+'-help'}>Escribe un nombre breve para identificarla.</small>
      <input ref={field} id={id} placeholder="Ej.: Taller de lectura" autoComplete="off" aria-describedby={id+'-help'+(error?' '+id+'-error':'')} aria-invalid={error} onChange={()=>setError(false)} />
      {error && <p className={styles.error} id={id+'-error'} role="alert">Revisa el campo: escribe el nombre de la actividad.</p>}
      <button type="button" onClick={()=>{const invalid=!field.current?.value.trim();setError(invalid);setStatus(invalid?'':'El campo está completo; no se enviaron datos.');field.current?.focus();}}>Revisar campo</button>
      <small role="status">{status}</small>
    </div>; break;
    case 'conditionalFields': content = <div className={styles.field}>
      <label htmlFor={id}>Modalidad de la actividad</label><select id={id} value={mode} onChange={e=>setMode(e.target.value)} aria-controls={id+'-conditional'}><option>Presencial</option><option>En línea</option></select>
      <small role="status">{mode==='Presencial'?'Campo disponible: Sede.':'Campo disponible: Enlace.'}</small>
      <div id={id+'-conditional'} className={styles.field}><label htmlFor={id+'-detail'}>{mode==='Presencial'?'Sede':'Enlace'}</label><input key={mode} id={id+'-detail'} type={mode==='Presencial'?'text':'url'} autoComplete="off" placeholder={mode==='Presencial'?'Ej.: Biblioteca del barrio':'https://example.org/actividad'} /></div>
    </div>; break;
    case 'informationLayers': content = <div className={styles.grid}>
      <div className={styles.card}><span className={styles.accent}>1 · Concepto principal</span><strong>Escenario de ahorro</strong><p>Una representación para explorar alternativas.</p></div>
      <div className={styles.card}><span className={styles.accent}>2 · Explicación</span><p>La ayuda acompaña al concepto que necesita aclarar.</p><small>3 · Contexto: ejemplo de organización, sin cálculos ni proyecciones.</small></div>
    </div>; break;
    default: return null;
  }
  return <figure className={styles.demo}><div className={styles.label}>{value.label || 'Demostración independiente.'}</div>{content}{value.caption && <figcaption>{value.caption}</figcaption>}</figure>;
}
