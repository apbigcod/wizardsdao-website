"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRoyalties__factory = void 0;
const ethers_1 = require("ethers");
class AbstractRoyalties__factory {
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.AbstractRoyalties__factory = AbstractRoyalties__factory;
const _abi = [
    {
        inputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        name: "royalties",
        outputs: [
            {
                internalType: "address payable",
                name: "account",
                type: "address",
            },
            {
                internalType: "uint96",
                name: "value",
                type: "uint96",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];
