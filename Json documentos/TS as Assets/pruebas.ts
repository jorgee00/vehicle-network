import{ Object, Property} from 'fabric-contract-api';

@Object()
export class Pruebas {
    @Property()
    id_prueba:         string;
    @Property()
    id_documento:      string;
    @Property()
    id_oem_manuf:      string;
    @Property()
    id_embbed_sys:     string;
    @Property()
    sistemas_probados: System[];
    @Property()
    tipo_de_prueba:    string;
    @Property()
    description:       string;
    @Property()
    expected_results:  string;
    @Property()
    obtained_results:  string;
    @Property()
    proof_validation:  string;
    @Property()
    date:              string;
}

export interface System {
    type: string;
}