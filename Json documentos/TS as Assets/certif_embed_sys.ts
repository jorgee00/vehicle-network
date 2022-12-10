import{ Object, Property} from 'fabric-contract-api';

@Object()
export class CertifEmbedSys {
    @Property()
    ref_doc_descripcion: string;
    @Property()
    id_homologador:      string;
    @Property()
    id_documento:        string;
    @Property()
    fecha:               string;
    @Property()
    firma:               string;
}