import { Context, Contract } from 'fabric-contract-api';
import { DescripcionVehic } from './descripcion_vehic';
import { VehicleRequestStatus } from "./new_vehicle_status";
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
    acceptVehicle(ctx: Context, tradeId: string, justification: string): Promise<void>;
    rejectVehicle(ctx: Context, tradeId: string, justification: string): Promise<void>;
    getVehicleDescription(ctx: Context, tradeId: string): Promise<DescripcionVehic>;
    getVehicleSpecificationStatus(ctx: Context, tradeId: string): Promise<VehicleRequestStatus>;
    private processResultset;
    private mergeResults;
}
