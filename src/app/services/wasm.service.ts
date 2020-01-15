import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface AllocatedMemory<T> {
  object: T;
  pointer: number;
}

@Injectable({
  providedIn: 'root'
})
export class WasmService {

  private wasmModule: WebAssembly.Module;
  private wasmInstance: WebAssembly.Instance;

  private ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private bufferPtr = 0;

  constructor() {
    // @ts-ignore
    WebAssembly.instantiateStreaming(fetch('assets/main.wasm')).then(result => {
      this.wasmModule = result.module;
      this.wasmInstance = result.instance;

      this.ready.next(true);
    });
  }

  public onReady(): Observable<boolean> {
    return this.ready.asObservable();
  }

  public deallocateAll(): void {
    this.bufferPtr = 0;
  }

  public allocateFloat32Array(size: number): AllocatedMemory<Float32Array> {
    if (!this.wasmInstance) {
      return null;
    }

    const ptr = this.bufferPtr;

    const array = new Float32Array(this.wasmInstance.exports.memory.buffer, ptr, size);

    this.bufferPtr += array.byteLength;

    return {
      object: array,
      pointer: ptr
    };
  }

  public getByName(name: string): any {
    return this.wasmInstance.exports[name];
  }
}
