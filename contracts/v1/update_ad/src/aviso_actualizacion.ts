import{ Object, Property} from 'fabric-contract-api';

@Object()
export class AvisoActualizacion {
    @Property()
    id_documento:      string;
    @Property()
    id_fab_vehic:      string;
    @Property()
    systems_to_update: string;
    @Property()
    date:              string;
}

/*export interface System {
    id_emb_sys:     string;
    description:    string;
    type_of_update: string;
}*/