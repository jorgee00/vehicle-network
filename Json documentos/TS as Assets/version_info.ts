import{ Object, Property} from 'fabric-contract-api';

@Object()
export class VersionInfo {
    @Property()
    id_documento:         string;
    @Property()
    version:              string;
    @Property()
    integrity_validation: string;
    @Property()
    RXSWIN:               string;
    @Property()
    updated_systems:      UpdatedSystem[];
}

export class UpdatedSystem {
    id_sistema:            string;
    description_of_update: string;
}