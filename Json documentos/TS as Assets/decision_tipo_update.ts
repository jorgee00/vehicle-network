import{ Object, Property} from 'fabric-contract-api';

@Object()
export class DecisionTipoUpdate {
    @Property()
    id_doc:                       string;
    @Property()
    fecha:                        string;
    @Property()
    id_oem_manuf:                 string;
    @Property()
    update_type_decission:        string;
    @Property()
    quality_controls:             QualityControl[];
    @Property()
    changes_evaluation:           ChangesEvaluation[];
    @Property()
    regulation_impact_evaluation: RegulationImpactEvaluation[];
    @Property()
    modifications_on_system:      ModificationsOnSystem[];
    @Property()
    changes_in_functionality:     ChangesInFunctionality[];
}

export class ChangesEvaluation {
    name_of_change: string;
    description:    string;
    observaciones:  string;
}

export class ChangesInFunctionality {
    name_of_functionality: string;
    description:           string;
    change_applied:        string;
}

export class ModificationsOnSystem {
    modification_name: string;
    description:       string;
}

export class QualityControl {
    id_control:  string;
    description: string;
}

export class RegulationImpactEvaluation {
    id_rule:     string;
    impact:      string;
    conclusions: string;
}