import tls from "node:tls";

type TlsWithSystemCA = typeof tls & {
  getCACertificates?: (source?: "default" | "system") => string[];
  setDefaultCACertificates?: (certs: string[]) => void;
};

/** Node solo trae CAs de Mozilla; en Windows con antivirus/proxy hace falta el almacén del SO. */
function trustSystemRootCAs() {
  const nodeTls = tls as TlsWithSystemCA;
  const getCerts = nodeTls.getCACertificates;
  const setCerts = nodeTls.setDefaultCACertificates;
  if (!getCerts || !setCerts) return;

  const system = getCerts("system");
  if (!system.length) return;

  setCerts([...getCerts(), ...system]);
}

trustSystemRootCAs();
