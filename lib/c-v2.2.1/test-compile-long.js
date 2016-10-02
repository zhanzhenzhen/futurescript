import {test, assert, code} from "./test-base.js";
import * as $api from "../test-locked-api.js";
import * as $libApi from "../locked-api.js";

let r;

// This takes around 65ms for a 2.7GHz computer.
test(() => {
let startTime = new Date().getTime();
$libApi.generateOutput({code: code`
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
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

// This takes around 30ms for a 2.7GHz computer.
test(() => {
let startTime = new Date().getTime();
$libApi.generateOutput({code: code`
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

// This takes around 100ms for a 2.7GHz computer.
test(() => {
let startTime = new Date().getTime();
$libApi.generateOutput({code: code`
Promise.resolve()
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
.then(<> Promise.resolve())
`});
$api.printLine("Long 3: " + (new Date().getTime() - startTime));
}); // ============================================================
