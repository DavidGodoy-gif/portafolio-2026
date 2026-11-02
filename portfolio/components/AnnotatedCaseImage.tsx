import Image from 'next/image';
import {urlFor} from '@/lib/sanity';
import styles from './AnnotatedCaseImage.module.css';

type Annotation = {_key: string; text: string; position: number};
type Value = {alt?: string; caption?: string; asset: {metadata?: {dimensions?: {width: number; height: number}}}; annotations: Annotation[]};

export default function AnnotatedCaseImage({value}: {value: Value}) {
  const notes = value.annotations.filter(note => note.text && Number.isFinite(note.position)).slice(0, 3);
  const dimensions = value.asset.metadata?.dimensions;
  return <figure className={styles.figure}>
    <div className={styles.layout}>
      <div className={styles.shot}>
        <Image src={urlFor(value).width(1350).fit('max').auto('format').url()} alt={value.alt || ''}
          width={dimensions?.width || 1350} height={dimensions?.height || 1330}
          sizes="(min-width: 1101px) 420px, (max-width: 480px) 85vw, 420px" />
        <div className={styles.markers} aria-hidden="true">
          {notes.map((note, index) => <span key={note._key} className={styles.marker}
            style={{top: `${Math.max(0, Math.min(100, note.position))}%`}}>{index + 1}</span>)}
        </div>
      </div>
      <ol className={styles.notes} aria-label="Anotaciones de la captura">
        {notes.map((note, index) => <li key={note._key} className={styles.note}
          style={{top: `${Math.max(0, Math.min(100, note.position))}%`}}>
          <span className={styles.number} aria-hidden="true">{index + 1}.</span> {note.text}
        </li>)}
      </ol>
    </div>
    {value.caption && <figcaption className={styles.caption}>{value.caption}</figcaption>}
  </figure>;
}
