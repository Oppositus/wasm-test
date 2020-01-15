import { Component } from '@angular/core';

import {correlate} from '../finmath/stat';
import {AllocatedMemory, WasmService} from './services/wasm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  wasmResult = 0.0;
  wasmOpS = 0.0;

  jsResult = 0.0;
  jsOpS = 0.0;

  ready = false;

  constructor(private wasmService: WasmService) {
    wasmService.onReady().subscribe((value) => this.ready = value);
  }

  start() {
    const len = 10000;
    const count = 100000;

    this.wasmService.deallocateAll();

    const array1 = this.wasmService.allocateFloat32Array(len);
    const array2 = this.wasmService.allocateFloat32Array(len);

    for (let i = 0; i < len; ++i) {
      array1.object[i] = Math.random();
      array2.object[i] = Math.random();
    }

    const startJs = window.performance.now();
    this.testJs(count, array1, array2);
    const endJS = window.performance.now();

    this.jsResult = endJS - startJs;
    this.jsOpS = count / this.jsResult;

    const startWasm = window.performance.now();
    this.testWasm(count, array1, array2);
    const endWasm = window.performance.now();

    this.wasmResult = endWasm - startWasm;
    this.wasmOpS = count / this.wasmResult;
  }

  private testJs(count: number, array1: AllocatedMemory<Float32Array>, array2: AllocatedMemory<Float32Array>) {
    for (let i = 0; i < count; ++i) {
      const correl = correlate(array1.object, array2.object);
      // console.log('JS: ', correl);
    }
  }

  private testWasm(count: number, array1: AllocatedMemory<Float32Array>, array2: AllocatedMemory<Float32Array>) {
    const correlateFn = this.wasmService.getByName('correlate');

    const ptr1 = array1.pointer;
    const len1 = array1.object.length;
    const ptr2 = array2.pointer;
    const len2 = array2.object.length;

    for (let i = 0; i < count; ++i) {
      const correl = correlateFn(ptr1, len1, ptr2, len2);
      // console.log('WASM: ', correl);
    }
  }
}
