"use client";

import { PortableText } from "@portabletext/react";
import PortableImage from "@/components/PortableImage";
import PortableChart from "@/components/PortableChart";
import PortableTable from "@/components/PortableTable";
import PortableEmbed from "@/components/PortableEmbed";
import PortableCode from "@/components/PortableCode";
import PortablePdf from "@/components/PortablePdf";

const styles = {
  h2: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginTop: "1.5rem",
    marginBottom: "0.5rem",
  },
  h3: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginTop: "1rem",
    marginBottom: "0.3rem",
  },
  ul: {
    listStyleType: "disc",
    marginLeft: "1.5rem",
    marginBottom: "1rem",
  },
  li: {
    marginBottom: "0.3rem",
  },
};

const components = {
  block: {
    h2: (props: any) => <h2 style={styles.h2}>{props.children}</h2>,
    h3: (props: any) => <h3 style={styles.h3}>{props.children}</h3>,
  },
  list: {
    bullet: (props: any) => <ul style={styles.ul}>{props.children}</ul>,
    number: (props: any) => <ol style={styles.ul}>{props.children}</ol>,
  },
  listItem: {
    bullet: (props: any) => <li style={styles.li}>{props.children}</li>,
    number: (props: any) => <li style={styles.li}>{props.children}</li>,
  },
  types: {
    image: PortableImage,
    chartBlock: PortableChart,
    tableBlock: PortableTable,
    embedBlock: PortableEmbed,
    codeBlock: PortableCode,
    pdfBlock: PortablePdf,
  },
};

export default function CasePortableContent({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}