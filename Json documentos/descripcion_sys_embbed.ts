// Generated by https://quicktype.io

export interface DescripcionSysEmbbed {
    id:        string;
    nombre:    string;
    fecha:     string;
    id_fabric: string;
    version:   string;
    hw_elem:   Elem[];
    sw_elem:   Elem[];
}

export interface Elem {
    num_modelo:             string;
    nombre_coloquial:       string;
    version:                string;
    fecha:                  string;
    decission_document_id?: string;
}