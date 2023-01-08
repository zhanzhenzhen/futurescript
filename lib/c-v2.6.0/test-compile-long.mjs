import {test, assert, code} from "./test-base.mjs";
import * as $api from "../test-locked-api.mjs";
import * as $libApi from "../locked-api.mjs";

// This takes around 75ms for a 2.7GHz computer.
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
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
a: 1
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
let duration = new Date().getTime() - startTime;
$api.printLine("Long 1: " + duration);
assert(duration < 375);
}); // ============================================================

// This takes around 80ms for a 2.7GHz computer.
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
                else
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
            else
                if a
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
                else
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
        else
            if a
                if a
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
                else
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
            else
                if a
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
                else
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
    else
        if a
            if a
                if a
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
                else
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
            else
                if a
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
                else
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
        else
            if a
                if a
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
                else
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
            else
                if a
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
                else
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
let duration = new Date().getTime() - startTime;
$api.printLine("Long 2: " + duration);
assert(duration < 400);
}); // ============================================================

// This takes around 100ms for a 2.7GHz computer.
test(async () => {
let startTime = new Date().getTime();
await $libApi.generateOutput({code: code`
1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
+ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
+ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
+ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
+ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
+ 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1
`});
let duration = new Date().getTime() - startTime;
$api.printLine("Long 3: " + duration);
assert(duration < 500);
}); // ============================================================
