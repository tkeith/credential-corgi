import type {
  ZkappWorkerRequest,
  ZkappWorkerReponse,
  WorkerFunctions,
} from "./zkworker";

export type Credential = {
  [key: string]: string | boolean | number | bigint;
};

export default class ZkappWorkerClient {
  // ---------------------------------------------------------------------------------------

  async pingSnarky() {
    return this._call("pingSnarky", {});
  }

  async zkpHashCredential(credential: Credential) {
    console.log("debug 1");

    const result = await this._call("zkpHashCredential", {
      credential: credential,
    });
    console.log("debug 3");

    return result;
  }

  async proveCredentialMeetsRequirements(
    stringHashRequirement: bigint,
    booleanRequirement: boolean,
    intMin: number,
    intMax: number,
    stringHashVal: bigint,
    booleanVal: boolean,
    intVal: number
  ) {
    const result = await this._call("proveCredentialMeetsRequirements", {
      stringHashRequirement,
      booleanRequirement,
      intMin,
      intMax,
      stringHashVal,
      booleanVal,
      intVal,
    });

    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL("./zkworker.ts", import.meta.url));
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id]!.resolve(event.data.data);
      delete this.promises[event.data.id];
    };
  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}
