import {test, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

// This takes around 200ms for a 2.7GHz computer.
test(async () => {
let startTime = new Date().getTime();
let r = await $api.runCode(code`
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
`);
$api.printLine("Long 1: " + (new Date().getTime() - startTime));
}); // ============================================================

// This takes around 100ms for a 2.7GHz computer.
test(async () => {
let startTime = new Date().getTime();
let r = await $api.runCode(code`
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
`);
$api.printLine("Long 2: " + (new Date().getTime() - startTime));
}); // ============================================================
