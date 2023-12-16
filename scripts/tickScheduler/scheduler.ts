import { system,world } from "@minecraft/server"


export class ChainReturner<ChainOut> {
    resolver: (value: ChainOut) => void;
    private resolved: boolean;
    constructor(resolver: (value: ChainOut) => void) {
        this.resolver = resolver;
        this.resolved = false;
    }

    breakAndReturn(value: ChainOut) {
        this.resolver(value);
        this.resolved = true;
        return value;
    }

    hasReturned() {
        return this.resolved;
    }

}

class TickChainEnd<In, ChainIn, ChainOut> {
    callback: (returner: ChainReturner<ChainOut>, arg: In) => Promise<ChainOut>
    chain: TickChain<ChainIn, ChainOut>

    constructor(callback: (returner: ChainReturner<ChainOut>, arg: In) => Promise<ChainOut>, chain: TickChain<ChainIn, ChainOut>) {
        this.callback = callback;
        this.chain = chain;
    }

    _run(resolve: (value: ChainOut) => void, reject: (reason: any) => void, arg: In, returner: ChainReturner<ChainOut>) {
        if (returner.hasReturned()) return;
        system.run(() => {
            let response = this.callback(returner, arg)
                .then(response => resolve(response));
        });
    }

    run(input: ChainIn): Promise<ChainOut> {
        return new Promise<ChainOut>(
            (resolve, reject) => {
                let returner = new ChainReturner<ChainOut>(resolve);
                this.chain._run(resolve, reject, input, returner);
            }
        );
    }
}

class TickChainLink<In, Out, ChainIn, ChainOut> {
    callback: (returner: ChainReturner<ChainOut>, arg: In) => Promise<Out>
    chain: TickChain<ChainIn, ChainOut>
    nextLink: TickChainLink<Out, any, ChainIn, ChainOut> | TickChainEnd<Out, ChainIn, ChainOut> | undefined
    constructor(callback: (returner: ChainReturner<ChainOut>, arg: In) => Promise<Out>, chain: TickChain<ChainIn, ChainOut>) {
        this.callback = callback;
        this.chain = chain;
    }

    next<Out2 = undefined>(callback: (returner: ChainReturner<ChainOut>, arg: Out) => Promise<Out2>) {
        this.nextLink = new TickChainLink(callback, this.chain);
        return this.nextLink;
    }

    finally(callback: (returner: ChainReturner<ChainOut>, arg: Out) => Promise<ChainOut>) {
        this.nextLink = new TickChainEnd(callback, this.chain);
        return this.nextLink;

    }


    _run(resolve: (value: ChainOut) => void, reject: (reason: any) => void, arg: In, returner: ChainReturner<ChainOut>) {
        if (returner.hasReturned()) return;
        system.run(() => {
            this.callback(returner, arg).then((response) => {
                if (this.nextLink) {
                    this.nextLink?._run(resolve, reject, response, returner);
                } else {
                    reject("Chain is broken!");
                }
            });
        });
    }
}


export class TickChain<ChainIn, ChainOut> {

    FirstLink: TickChainLink<ChainIn, any, ChainIn, ChainOut> | undefined
    first<Out>(callback: (returner: ChainReturner<ChainOut>, arg: ChainIn) => Promise<Out>): TickChainLink<ChainIn, Out, ChainIn, ChainOut> {
        this.FirstLink = new TickChainLink<ChainIn, Out, ChainIn, ChainOut>(callback, this);

        return this.FirstLink
    }

    _run(resolve: (value: ChainOut) => void, reject: (reason: any) => void, input: ChainIn, returner: ChainReturner<ChainOut>) {
        if (returner.hasReturned()) return;
        this.FirstLink!._run(resolve, reject, input, returner);
    }
}



export class SchedulerPerTick {

    tick = 0;
    callbacks: ((arg: any) => any)[]
    resolve: ((value: any) => any) | undefined
    constructor(callbacks: (() => void)[]) {
        this.callbacks = callbacks;
    }
    Run(arg: any) {
        let promise = new Promise<any>((resolve, reject) => {
            this.resolve = resolve;
        });
        system.run(() => this.runPerTick(arg));
        return promise;
    }


    private runPerTick(arg: any) {
        if (this.tick >= this.callbacks.length) {
            this.resolve!(arg);
            return;
        }
        let response = this.callbacks[this.tick](arg);
        this.tick++;
        system.run(() => this.runPerTick(response));
    }


}

/**
 * Represents a class that calls the processor on each element from an iterator in batches, each batch is done in a game tick.
 *
 * @template T - The type of elements to be processed.
 */
export class TickForeach<T> {
    /**
     * A function that processes an element of the iterator.
     */
    processor: (arg: T) => void
    /**
     * A function called at the start of each Batch.
     */
    onStartBatch:((tick:number)=>void)|undefined
    /**
     * A function called at the end of each Batch.
     */
    onEndBatch:((tick:number)=>void)|undefined
    /*
     * Maximum size of batches
    */
    batchSize: number
    private startTick:number
    private busy:boolean
    private cancelled:boolean
    /**
     * Creates an instance of TickForeach.
     * 
     * @param {(arg: T) => void} processor - A function that processes an element of the iterator.
     * @param {number} batchSize - Maximum size of batches.
     * @param {((tick: number) => void) | undefined} [onStartBatch] - A function called at the start of each Batch.
     * @param {((tick: number) => void) | undefined} [onEndBatch] - A function called at the end of each Batch.
     */
    constructor(
        processor: (arg: T) => void, 
        batchSize: number,
        onStartBatch?:(tick:number)=>void, 
        onEndBatch?:(tick:number)=>void
    ) {
        this.batchSize = batchSize;
        this.processor = processor;
        this.onStartBatch = onStartBatch;
        this.onEndBatch = onEndBatch;
        this.startTick = 0;
        this.busy=false;
        this.cancelled=false;
    }
    
    /**
     * Runs the processor on elements from the provided iterable in batches.
     * 
     * @param {Iterable<T>} iterable - The iterable containing elements to be processed.
     * @returns {Promise<void>} A promise that resolves when all elements have been processed.
     */
    async runOnIterable(iterable: Iterable<T>) {
        if (this.busy) {
            console.warn(this.busy);
            return new Promise<void>((_, reject)=>reject("busy"));
        }
        this.busy=true;
        this.cancelled=false;
        this.startTick=system.currentTick;
        return new Promise<void>(
            (resolve, reject) => this.nextBatch(iterable[Symbol.iterator](), resolve, reject)
        );
    }

    /**
     * Cancels the run it's currently processing
     */
    cancelRun() {
        this.cancelled=true;
    }

    private nextBatch(iterator: Iterator<T, any, undefined>, resolve: (value: void) => void, reject:(reason:any)=>void) {
        let iter = 0;
        let cursor = iterator.next();
        this.onStartBatch?.(system.currentTick-this.startTick)
        while (!cursor.done) {
            if (this.cancelled) {
                reject("cancelled");
                this.busy=false;
                return;
            }
            this.processor(cursor.value);
            if (iter >= this.batchSize) {                
                this.onEndBatch?.(system.currentTick-this.startTick)
                system.run(() => this.nextBatch(iterator, resolve,reject)); //Run remaining items on next tick
                return;
            }
            cursor = iterator.next();
            iter++;
        }
        this.onEndBatch?.(system.currentTick-this.startTick);
        resolve();
        this.busy=false;
    }
}


export class TickTimeForeach<T> {
    /**
     * A function that processes an element of the iterator.
     */
    processor: (arg: T) => void
    /**
     * A function called at the start of each Batch.
     */
    onStartBatch:((tick:number)=>void)|undefined
    /**
     * A function called at the end of each Batch.
     */
    onEndBatch:((tick:number)=>void)|undefined
    /*
     * Maximum length of an batch in ms
    */
    batchDuration: number
    private startTick:number
    private cancelled:boolean
    private busy:boolean
    /**
     * Creates an instance of TickForeach.
     * 
     * @param {(arg: T) => void} processor - A function that processes an element of the iterator.
     * @param {number} batchDuration - Maximum duration of a batch in ms.
     * @param {((tick: number) => void) | undefined} [onStartBatch] - A function called at the start of each Batch.
     * @param {((tick: number) => void) | undefined} [onEndBatch] - A function called at the end of each Batch.
     */
    constructor(
        processor: (arg: T) => void, 
        batchDuration: number,
        onStartBatch?:(tick:number)=>void, 
        onEndBatch?:(tick:number)=>void
    ) {
        this.batchDuration = batchDuration;
        this.processor = processor
        this.onStartBatch = onStartBatch
        this.onEndBatch = onEndBatch
        this.startTick = 0;
        this.cancelled=false;
        this.busy=false;
    }
    
    /**
     * Runs the processor on elements from the provided iterable in batches.
     * 
     * @param {Iterable<T>} iterable - The iterable containing elements to be processed.
     * @returns {Promise<void>} A promise that resolves when all elements have been processed. If the iteration is canceled, then it rejects
     */
    async runOnIterable(iterable: Iterable<T>) {
        if (this.busy) {
            return new Promise<void>((_,reject)=>reject("busy"));
        }

        this.cancelled=false;
        this.startTick=system.currentTick;
        this.busy=true;
        return new Promise<void>(
            (resolve, reject) => this.nextBatch(iterable[Symbol.iterator](), resolve,reject)
        );
    }

    /**
     * Cancels the run it's currently processing
     */
    cancelRun() {
        this.cancelled=true;
    }

    private nextBatch(iterator: Iterator<T, any, undefined>, resolve: (value: void) => void, reject:(reason:any)=>void) {
        const startTime = Date.now(); // Record the start time
        let cursor = iterator.next();
        this.onStartBatch?.(system.currentTick-this.startTick)
        while (!cursor.done) {
            if (this.cancelled) {
                this.onEndBatch?.(system.currentTick-this.startTick)
                reject("cancelled");
                this.busy=false;
                return;
            }
            this.processor(cursor.value);
            if (Date.now() - startTime >= this.batchDuration) {                
                this.onEndBatch?.(system.currentTick-this.startTick)
                system.run(() => this.nextBatch(iterator, resolve, reject)); //Run remaining items on next tick
                return;
            }
            cursor = iterator.next();
        }
        this.onEndBatch?.(system.currentTick-this.startTick);
        resolve();
        this.busy=false;
    }
}
