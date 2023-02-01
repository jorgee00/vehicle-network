import { Context, Contract } from 'fabric-contract-api';
import { DescripcionVehic } from './descripcion_vehic';
import { VehicleRequestStatus } from "./new_vehicle_status";
import { System } from "./system_request";
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
    exists(ctx: Context, id_doc: string): Promise<boolean>;
    /**
     * Functions related to Vehicle
     */
    sendNewVehicleDescription(ctx: Context, id_doc: string, cod_modelo: string, systems: string): Promise<void>;
    acceptVehicle(ctx: Context, vehicleId: string, justification: string): Promise<void>;
    rejectVehicle(ctx: Context, vehicleId: string, justification: string): Promise<void>;
    getVehicleDescription(ctx: Context, vehicleId: string): Promise<DescripcionVehic>;
    getVehicleSpecificationStatus(ctx: Context, tradeId: string): Promise<VehicleRequestStatus>;
    /**
     * Functions related to systems
     */
    sendNewSysDescription(ctx: Context, id: string, descripcion: string, nombre: string, sw_included: string): Promise<void>;
    acceptSys(ctx: Context, systemId: string, justification: string): Promise<void>;
    rejectSys(ctx: Context, systemID: string, justification: string): Promise<void>;
    getSysDescription(ctx: Context, systemId: string): Promise<System>;
    isSysValid(ctx: Context, id_sys: string): Promise<boolean>;
    listSys(ctx: Context): Promise<System[]>;
    private processResultSetSys;
    /**
     * Functions related to software
     */
    sendNewSwDescription(ctx: Context, id: string, nombre: string, descripcion: string): Promise<void>;
    acceptSw(ctx: Context, swId: string, justification: string): Promise<void>;
    rejectSw(ctx: Context, swID: string, justification: string): Promise<void>;
    getSwDescription(ctx: Context, swId: string): Promise<Software>;
    isSwValid(ctx: Context, id: string): Promise<boolean>;
    getSwStatus(ctx: Context, id: string): Promise<string>;
    listSw(ctx: Context): Promise<Software[]>;
    private processResultSetSw;
    private processResultset;
    private mergeResults;
}
