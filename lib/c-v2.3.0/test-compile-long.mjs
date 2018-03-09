import {test, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $libApi from "../locked-api.mjs";

// This takes around 55ms for a 2.7GHz computer.
test(async () => {
let startTime = new Date().getTime();
await $libApi.generateOutput({code: code`
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
`});
$api.printLine("Long 1: " + (new Date().getTime() - startTime));
}); // ============================================================

// This takes around 8ms for a 2.7GHz computer.
test(async () => {
let startTime = new Date().getTime();
await $libApi.generateOutput({code: code`
a: 1
b:
    if a
        if a
            if a
                if a
                    if a
                        1
                    else
                        0
                else
                    if a
                        1
                    else
                        0
            else
                if a
                    if a
                        1
                    else
                        0
                else
                    if a
                        1
                    else
                        0
        else
            if a
                if a
                    if a
                        1
                    else
                        0
                else
                    if a
                        1
                    else
                        0
            else
                if a
                    if a
                        1
                    else
                        0
                else
                    if a
                        1
                    else
                        0
    else
        if a
            if a
                if a
                    if a
                        1
                    else
                        0
                else
                    if a
                        1
                    else
                        0
            else
                if a
                    if a
                        1
                    else
                        0
                else
                    if a
                        1
                    else
                        0
        else
            if a
                if a
                    if a
                        1
                    else
                        0
                else
                    if a
                        1
                    else
                        0
            else
                if a
                    if a
                        1
                    else
                        0
                else
                    if a
                        1
                    else
                        0
`});
$api.printLine("Long 2: " + (new Date().getTime() - startTime));
}); // ============================================================

// This takes around 170ms for a 2.7GHz computer.
test(async () => {
let startTime = new Date().getTime();
await $libApi.generateOutput({code: code`
1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
+ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
+ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
+ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
+ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
`});
$api.printLine("Long 3: " + (new Date().getTime() - startTime));
}); // ============================================================
