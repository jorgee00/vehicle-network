import{ Object, Property} from 'fabric-contract-api';

@Object()
export class Justification {
    @Property()
    id_documento:       string;
    @Property()
    id_fab:             string;
    @Property()
    id_doc_descripcion: string;
    @Property()
    decission:          string;
    @Property()
    justification:      string;
    @Property()
    date:               string;
}