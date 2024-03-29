"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvisoActualizacion = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
let AvisoActualizacion = class AvisoActualizacion {
};
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], AvisoActualizacion.prototype, "id_documento", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], AvisoActualizacion.prototype, "id_fab_vehic", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], AvisoActualizacion.prototype, "systems_to_update", void 0);
__decorate([
    fabric_contract_api_1.Property(),
    __metadata("design:type", String)
], AvisoActualizacion.prototype, "date", void 0);
AvisoActualizacion = __decorate([
    fabric_contract_api_1.Object()
], AvisoActualizacion);
exports.AvisoActualizacion = AvisoActualizacion;
/*export interface System {
    id_emb_sys:     string;
    description:    string;
    type_of_update: string;
}*/ 
//# sourceMappingURL=aviso_actualizacion.js.map