import{ Object, Property} from 'fabric-contract-api';

@Object()
export class DescripcionSysEmbbed {
    @Property()
    id:        string;
    @Property()
    nombre:    string;
    @Property()
    fecha:     string;
    @Property()
    id_fabric: string;
    @Property()
    version:   string;
    @Property()
    hw_elem:   Elem[];
    @Property()
    sw_elem:   Elem[];
}

export class Elem {
    num_modelo:             string;
    nombre_coloquial:       string;
    version:                string;
    fecha:                  string;
    decission_document_id?: string;
}