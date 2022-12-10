import{ Object, Property} from 'fabric-contract-api';

@Object()
export class Sistema {
    @Property()
    nombre:  string;

    @Property()
    sw_included:  string;

    @Property()
    status:  string;

    @Property()
    justification:     string;
}

/*export class CodifModelo {
    marca:       string;
    modelo:      string;
    id_vehículo: string;
}

export class Sistema {
    nombre:  string;
    manager: Manager;
}

export class Manager {
    identificador:        string;
    nombre:               string;
    sistemas_controlados: string[];
}*/