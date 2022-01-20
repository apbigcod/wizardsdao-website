"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ISeeder__factory = void 0;
const ethers_1 = require("ethers");
class ISeeder__factory {
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.ISeeder__factory = ISeeder__factory;
const _abi = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "wizardId",
                type: "uint256",
            },
            {
                internalType: "contract IDescriptor",
                name: "descriptor",
                type: "address",
            },
            {
                internalType: "bool",
                name: "isOneOfOne",
                type: "bool",
            },
            {
                internalType: "uint48",
                name: "isOneOfOneIndex",
                type: "uint48",
            },
        ],
        name: "generateSeed",
        outputs: [
            {
                components: [
                    {
                        internalType: "uint48",
                        name: "background",
                        type: "uint48",
                    },
                    {
                        internalType: "uint48",
                        name: "skin",
                        type: "uint48",
                    },
                    {
                        internalType: "uint48",
                        name: "clothes",
                        type: "uint48",
                    },
                    {
                        internalType: "uint48",
                        name: "eyes",
                        type: "uint48",
                    },
                    {
                        internalType: "uint48",
                        name: "mouth",
                        type: "uint48",
                    },
                    {
                        internalType: "uint48",
                        name: "accessory",
                        type: "uint48",
                    },
                    {
                        internalType: "uint48",
                        name: "bgItem",
                        type: "uint48",
                    },
                    {
                        internalType: "uint48",
                        name: "hat",
                        type: "uint48",
                    },
                    {
                        internalType: "bool",
                        name: "oneOfOne",
                        type: "bool",
                    },
                    {
                        internalType: "uint48",
                        name: "oneOfOneIndex",
                        type: "uint48",
                    },
                ],
                internalType: "struct ISeeder.Seed",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
