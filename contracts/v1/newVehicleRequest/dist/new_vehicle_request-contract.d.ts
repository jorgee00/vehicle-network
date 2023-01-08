import { Context, Contract } from 'fabric-contract-api';
import { DescripcionVehic } from './descripcion_vehic';
import { VehicleRequestStatus } from "./new_vehicle_status";
import { Sistema } from "./system_request";
import { Software } from './sw_request';
export declare class NewVehicleRequestContract extends Contract {
    private static getAclSubject;
    private aclRules;
    constructor();
    beforeTransaction(ctx: Context): Promise<void>;
    /**
     * Perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    inicio(ctx: Context): Promise<void>;
    existe(ctx: Context, id_doc: string): Promise<boolean>;
    sendNewVehicleDescription(ctx: Context, id_doc: string, cod_modelo: string, systems: string): Promise<void>;
    sendNewSystemDescription(ctx: Context, nombre: string, sw_included: string): Promise<void>;
    sendNewSwDescription(ctx: Context, nombre: string): Promise<void>;
    acceptVehicle(ctx: Context, vehicleId: string, justification: string): Promise<void>;
    rejectVehicle(ctx: Context, vehicleId: string, justification: string): Promise<void>;
    acceptSystem(ctx: Context, systemId: string, justification: string): Promise<void>;
    rejectSystem(ctx: Context, systemID: string, justification: string): Promise<void>;
    acceptSoftware(ctx: Context, swId: string, justification: string): Promise<void>;
    rejectSoftware(ctx: Context, swID: string, justification: string): Promise<void>;
    getVehicleDescription(ctx: Context, vehicleId: string): Promise<DescripcionVehic>;
    getSystemDescription(ctx: Context, systemId: string): Promise<Sistema>;
    getSoftwareDescription(ctx: Context, swId: string): Promise<Software>;
    getVehicleSpecificationStatus(ctx: Context, tradeId: string): Promise<VehicleRequestStatus>;
    isSystemValid(ctx: Context, id_sys: string): Promise<boolean>;
    isSoftwareValid(ctx: Context, id_sw: string): Promise<boolean>;
    private processResultset;
    private mergeResults;
}
